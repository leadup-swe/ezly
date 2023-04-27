import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;
let boostedPrisma: PrismaClient;

export const getPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export const getBoostedPrisma = () => {
  if (!boostedPrisma) {
    boostedPrisma = new PrismaClient();
    boostedPrisma.$queryRaw`SET @@boost_cached_queries = true`;
  }
  return boostedPrisma;
};
