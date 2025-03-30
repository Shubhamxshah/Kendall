import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken"
import  { prisma } from "@repo/database"
import url from "url";

const wss = new WebSocketServer({port: 8081});

const jwt_secret = process.env.jwt_secret || "shubhamsecret";

interface User {
  userId: number, 
  ws: WebSocket 
  rooms: number[]
}

const users: User[] = [];

const checkUser = (token: string) => {
  if (typeof token !== "string") {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, jwt_secret);
    if (!decoded || typeof decoded == "string" || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    return null;
  }

} 

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url){
    return null;
  }

  const token = url.split("=")[1];

  if (!token || typeof token !== "string") {
    return null;
  }

  const userId = checkUser(token);

  if (!userId || typeof userId == "string") {
    ws.close();
    return null;
  }

  users.push({
    userId, 
    ws, 
    rooms: []
  })

  ws.on("message", async (data) => {
    let parsedData;

    try {
      if (typeof data == "string") {
        parsedData = JSON.parse(data);
      } else {
        parsedData = JSON.parse(data.toString());
      }
    } catch (error) {
      ws.send("incorrect data type of message sent");
      return; 
    }
    
    try {
      if (parsedData.type == "join_room") {
        const user = users.find(x => x.ws === ws); // user is a reference to the object inside the users array 
        user?.rooms.push(parsedData.roomId); // modifying user.rooms mutates the original object in the users array.
      }
  
      if (parsedData.type == "leave_room") {
        const user = users.find(x => x.ws === ws);
        if (!user) {
          return null;
        }
        user?.rooms.filter(x => x !== parsedData.roomId)
      }

      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        await prisma.chat.create({
          data: {
            message, 
            roomId, 
            userId
          }
        })

        users.forEach(user => {
          if (user.ws !== ws && user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
              type: "chat", 
              message, 
              roomId
            }))
          }
        })
      }

    } catch (error) {
      ws.send("data sent is incorrect")   
    } 
  })

  ws.on("close", () => {
    const index = users.findIndex((user) => user.ws === ws);
    if (index !== -1) {
      users.splice(index, 1) 
    }
  })


})
