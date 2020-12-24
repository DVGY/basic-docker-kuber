import express, { Request, Response } from "express";
import User from "../model/userModel";
import { IUser } from "../model/userModel";

const router = express.Router();

router.post("/api/users/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userdoc = await User.create({ email, password });
  console.log(userdoc);
  res.send("Inised signup");
});

export default router;
