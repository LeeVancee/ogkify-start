import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from '@prisma/adapter-pg'
// Prisma Client singleton


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// Re-export drizzle for Better Auth
export { drizzleDb as db } from "./auth-db";

