import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth';
import { createRoom } from './routes/room';

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-type', 'Authorization']
  })
);
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get('/', (_: Request, res: Response) => {
  res.json({ message: 'hello shubham from server' });
});

app.use('/api/auth', authRouter);
app.use('/api', createRoom);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
