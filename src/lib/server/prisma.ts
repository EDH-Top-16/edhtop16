import { PrismaClient } from "@prisma/client";

type GlobalWithPrisma = typeof global & { prisma?: PrismaClient };

function getPrismaClient() {
  const globalWithPrisma = global as GlobalWithPrisma;
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }

  return globalWithPrisma.prisma;
}

export const prisma = getPrismaClient();
