import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("request header is" , req.headers.authorization)
  console.log("all request headers are", req.headers)

  if (!req.headers.authorization) {
    res.status(403).json({error: 'accessToken not present in header'})
    return;
  }
  const token =
    req.headers["authorization"]
      ?.split(' ')[1] || "";

  console.log(token);

  const jwt_secret = process.env.ACCESS_TOKEN_SECRET || 'access_token_secret';

  try {
    const decoded = jwt.verify(token, jwt_secret) as JwtPayload;
    console.log(1)
    if (decoded && typeof decoded == 'object' && 'userId' in decoded) {
      req.userId = decoded.userId;
      console.log(2)
      next();
    } else {
      res.status(402).json({ error: 'Invalid token payload' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }

};
