import express from "express";
import { handleLogin, handleSignup } from "../controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/signup", handleSignup);
authRouter.post("/login", handleLogin);
