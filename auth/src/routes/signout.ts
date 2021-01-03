import express from "express";
import { signout } from "../controller/authController";

const router = express.Router();

router.get("/api/users/signout", signout);

export default router;
