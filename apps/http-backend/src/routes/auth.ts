import { Router } from "express";
import { signupSchema } from "@repo/common/types.ts" 
import { prisma } from "@repo/database"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { authMiddleware } from "../middleware";

export const authRouter:Router = Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_token_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRY });

  return { accessToken, refreshToken };
}; 

authRouter.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success){
    res.status(400).json({errors: parsed.error.format()}); 
    return;
  }

  try {
    const hashedpw = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        username: parsed.data.username,
        password: hashedpw
      }
    })

    const { accessToken, refreshToken } = generateTokens(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken, 
        userId: user.id, 
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // prevents client side javascript from reading the cookie 
      secure: process.env.NODE_ENV === "production", // ensures the cookie is sent over https
      sameSite: "strict", // makes sure cross site requests are forbidden
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({message: `user created ${user.username}`, accessToken});
  } catch (error) {
    res.status(400).json({error: `${error}`}) 
  }
})

authRouter.post("/signin", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success){
    res.status(400).json({errors: parsed.error.format() });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: parsed.data.username
      }
    });

    if (!user?.username) {
      res.status(400).json("username doesnt exist");
      return;
    }

    const isPasswordValid = await bcrypt.compare(parsed.data.password, user.password);
  
    if (!isPasswordValid) {
      res.status(401).json({error: "Incorrect password"});
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    await prisma.refreshToken.deleteMany({
      where: {
        userId: user.id
      }
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken, 
        userId: user.id, 
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    }); 

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      message: `User login successful for ${user.username}`, 
      accessToken
    })

  } catch (error) {
    res.status(500).json({error: `${error}`})
  }
})

authRouter.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ error: "Refresh token required" });
  }

  try {
  const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {userId: number};

  const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken, 
        userId: decoded.userId
      } 
    }); 

  if (!storedToken) {
      res.status(403).json({ error: "Invaid refresh token"}); 
    }

  const accessToken = jwt.sign({userId: decoded.userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
});

authRouter.get("/user/profile", authMiddleware, async (req, res) => {
  const userId = Number(req.userId); 

  if (!userId) {
    res.status(400).json({message: "unauthorized, userId not present from middleware"})
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    res.status(300).json({message: "user doesnt exist"})
  }
  
  res.status(200).json({user : user?.username})
})

authRouter.post("/logout", authMiddleware, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; 

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: {
          token: refreshToken 
        }
      })
    }

    res.clearCookie("refreshToken"); 
    res.status(200).json({message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({error: `${error}`})
  }
}) 
