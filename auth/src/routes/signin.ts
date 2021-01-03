import express from "express";
import { signin } from "../controller/authController";

const router = express.Router();

router.post("/api/users/signin", signin);

export default router;
