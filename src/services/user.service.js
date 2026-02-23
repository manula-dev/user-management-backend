import { userRepository } from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";

export const userService = {
  getUsers: () => userRepository.findAll(),
  getUserById: (id) => userRepository.findById(id),
  createUser: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return userRepository.create({ ...userData, password: hashedPassword });
  },

  async updateUser(id, data) 
  {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return userRepository.update(id, data);
  },

  async deleteUser(id) {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      throw new Error("User not found");
    }

    return userRepository.delete(id);
  },
};

