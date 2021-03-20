import { Response, Request, NextFunction, ErrorRequestHandler } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 400;
  const message = err.message;

  // console.log({ err });
  res.status(statusCode).json({
    status: 'Error',
    message,
    // stack: err.stack,
  });
  // next();
};

// 1. We want to provide custom message to user's so that client can read from.
// 2. We don't want to leak the stack trace details when in production, use console.error(), so we will not send stack detail if it is operational error.
// 3.
