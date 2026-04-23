import { prisma } from "../db/prisma.js";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  image: true,
};

export const userRepository = {
  findAll: () =>
    prisma.user.findMany({
      select: publicUserSelect,
    }),

  findById: (id) =>
    prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    }),

  findByEmail: (email) =>
    prisma.user.findUnique({
      where: { email },
    }),

  create: (user) =>
    prisma.user.create({
      data: user,
      select: publicUserSelect,
    }),

  delete: (id) =>
    prisma.user.delete({
      where: { id },
    }),

  update: (id, data) =>
    prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect,
    }),
};
