import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Disable Prisma logging to reduce console noise
    log: [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
