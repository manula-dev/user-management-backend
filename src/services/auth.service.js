import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const ADMIN_SECRET = process.env.ADMIN_SECRET;

export const authService = {
  // ✅ SIGNUP (NEW)
  async signup(data) {
    const hashed = await bcrypt.hash(data.password, 10);

    let role = "user";

    // 🔐 secure admin elevation
    if (
      data.adminSecret &&
      data.adminSecret === ADMIN_SECRET
    ) {
      role = "admin";
    }

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role,
    });

    return user;
  },

  // ✅ LOGIN (FIXED)
  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // ⭐ CRITICAL — include role
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token };
  },
};
