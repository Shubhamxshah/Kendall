import { Request, Response, Router } from "express";
import { roomSchema } from "@repo/common/types.ts";
import { authMiddleware } from "../middleware";
import { prisma } from "@repo/database";

export const createRoom: Router = Router();

createRoom.post("/room",authMiddleware, async (req:Request, res: Response) => {
  const parsed = roomSchema.safeParse(req.body);
  if (!parsed.success){
    res.status(400).json({error: parsed.error.format()});
    return;
  }

  if (!req.userId || typeof req.userId !== "number"){
    res.status(401).json({message: "not authorized. Please login with valid credentials"})
    return;
  }

  try{
    const room = await prisma.room.create({
      data: {
        slug: parsed.data.name, 
        adminId: req.userId,
      }
    });
    
    res.status(200).json({
      roomId: room.id,
    })
    return;
  } catch (error) {
    res.status(401).json({
      message: "room already exists with this name",
    });
  }
});

createRoom.get("/chats/:roomId", authMiddleware, async (req: Request, res: Response) => {
  try{
    const roomId = Number(req.params.roomId); //typeof params is always string
    const messages = await prisma.chat.findMany({
      where: {
        roomId: roomId,
      }, 
      orderBy: {
        createdAt: "desc",
      }, 
      take: 1000,
    });

    res.status(200).json({messages});
    return;
  } catch (error) {
    res.json({
      messages: []
    })
  }
})

createRoom.get("/room/:slug", async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const room = await prisma.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    room,
  })
})
