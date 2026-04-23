import express from "express";
import path from "path";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { authenticate } from "./middleware/auth.js";
import { env } from "./config/env.js";

const app = express();
const uploadPath = path.join(process.cwd(), "src", "uploads");
const corsOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : undefined;

app.disable("x-powered-by");
app.use(cors(corsOrigins?.length ? { origin: corsOrigins } : undefined));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(uploadPath));

app.get("/", (req, res) => {
  res.status(200).json({ message: "User management backend is running" });
});

app.get("/about", (req, res) => {
  res.status(200).json({ message: "User management backend" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/users", authenticate, userRouter);
app.use("/", authRouter);
app.use("/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({ error: "Internal Server Error" });
});

export default app;
