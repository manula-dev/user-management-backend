import express from "express";
import { upload } from "../middleware/upload.js";
import {
  createUser,
  deleteUser,
  getMe,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

export const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/", createUser);
userRouter.get("/me", getMe);
userRouter.get("/:id", getUserById);
userRouter.put("/update", upload.single("image"), updateUser);
userRouter.delete("/:id", deleteUser);
