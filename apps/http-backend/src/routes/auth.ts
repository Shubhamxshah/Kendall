import { Router } from "express";
import { signupSchema } from "@repo/common/types.ts" 
import { prisma } from "@repo/database"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const authRouter:Router = Router();
const jwt_secret = process.env.jwt_secret || "shubhamsecret"

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

    const token = jwt.sign({userId: user?.id}, jwt_secret, {expiresIn: "1d"})

    res.cookie("token", token, {
      httpOnly: true, // prevents client side javascript from reading the cookie 
      secure: process.env.NODE_ENV === "production", // ensures the cookie is sent over https
      sameSite: "strict" // makes sure cross site requests are forbidden
    })

    res.status(200).json({message: `user created ${user.username}`})
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
