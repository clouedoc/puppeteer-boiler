import { PrismaClient } from "@prisma/client";

/**
 * Create a single Prisma connection for the application.
 */
export const db: PrismaClient = new PrismaClient();
