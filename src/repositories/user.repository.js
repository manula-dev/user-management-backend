import {prisma} from "../db/prisma.js";

export const userRepository = {
  findAll: () => prisma.user.findMany(),
  findById: (id) =>  prisma.user.findUnique({
      where: { id },
  }),
  create: (user) => {
    return prisma.user.create({
      data: user,
    });
  },
  delete: (id) => {
    return prisma.user.delete({
      where: { id },
    });
  },
  update: (id, data) => {
    return prisma.user.update({
      where: { id },
      data,
    });
  },
};
