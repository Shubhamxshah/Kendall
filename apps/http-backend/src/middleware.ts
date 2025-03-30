import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.headers?.cookie
      ?.split('; ')
      .find((c) => c.startsWith('token='))
      ?.split('=')[1] || '';

  const jwt_secret = process.env.jwt_secret || 'shubhamsecret';

  try {
    const decoded = jwt.verify(token, jwt_secret!) as JwtPayload;
    if (decoded && typeof decoded == 'object' && 'userId' in decoded) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(403).json({ error: 'unauthorized' });
    }
  } catch (error) {
    res.status(401).json({ error: 'unauthorized' });
  }
};
