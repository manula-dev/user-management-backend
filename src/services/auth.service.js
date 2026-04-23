import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";
import { env } from "../config/env.js";

export const authService = {
  async signup(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    let role = "user";
    if (data.adminSecret && env.ADMIN_SECRET && data.adminSecret === env.ADMIN_SECRET) {
      role = "admin";
    }

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  },

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, role: user.role };
  },
};
