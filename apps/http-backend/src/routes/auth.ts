import { Router } from "express";
import { signupSchema } from "@repo/common/types.ts" 
import { prisma } from "@repo/database"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

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
    const token = jwt.sign({userId: user?.id}, jwt_secret, {expiresIn: "1d"})
    if (isPasswordValid){
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict"
      })
      res.status(200).json({message: `user login successful for ${user.username}`})
      return;
    } else {
      res.status(401).json({error: "incorrect password "})
      return;
    }
  } catch (error) {
    res.status(500).json({error: `${error}`})
  }
})
