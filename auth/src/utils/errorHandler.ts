import { Response, Request, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // todo handle all error seperately
  console.log("Recieved err");
  console.log(err);
  res.status(200).json({
    status: "Error",
    message: err.message,
  });
};
