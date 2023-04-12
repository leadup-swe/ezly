import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export const boostedPrisma = new PrismaClient();
boostedPrisma.$queryRaw`SET @@boost_cached_queries = true`;
