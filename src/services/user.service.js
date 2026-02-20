import { userRepository } from "../repositories/user.repository.js";

export const userService = {
  getUsers: () => userRepository.findAll(),
  getUserById: (id) => userRepository.findById(id),
  createUser: (userData) => userRepository.create(userData),

  async updateUser(id, data) {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      throw new Error("User not found");
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

