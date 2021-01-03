import express from "express";
import { currentUser } from "../controller/authController";
const router = express.Router();

router.get("/api/users/currentuser", currentUser);

export default router;
