import express, { NextFunction, Request, Response } from "express";
import { signup } from "../controller/authController";

const router = express.Router();

router.post("/api/users/signup", signup);

export default router;
