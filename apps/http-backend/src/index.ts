import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth";

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (_, res) => {
  res.send("hello shubham from server");
})

app.use("/api/auth", authRouter)

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})
