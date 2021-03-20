import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

interface UserPayload {
  id: string;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
// A middleware to protect routes.It Require cookie to access the routes
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if the the jwt token exist in cookie
    // const token = req.cookies.jwt;

    const token = req.signedCookies.jwt || req.cookies.jwt;
    if (!token) {
      return next(new AppError('You are not authorised', 401));
    }

    // 2. Verify if the token is correct
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as UserPayload;

    // 3. Send token
    req.user = decoded;
    // res.locals.user =
  } catch (err) {
    return next(err);
  }
  next();
};
