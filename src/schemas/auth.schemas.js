import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  adminSecret: z.string().optional(), // 🔐 hidden admin control
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
