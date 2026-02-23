import {prisma} from "../db/prisma.js";

export const userRepository = {
  findAll: () => prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  }),
  findById: (id) =>  prisma.user.findUnique({
      where: { id },
        select: {
      id: true,
      name: true,
      email: true,
  }  }),
  findByEmail: (email) => prisma.user.findUnique({
    where: { email },
  }),
  create: (user) => {
    return prisma.user.create({
      data: user,
          select: {
      id: true,
      name: true,
      email: true,
    },
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
          select: {
      id: true,
      name: true,
      email: true,
    },
    });
  },
};
