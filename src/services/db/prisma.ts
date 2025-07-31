import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Initialize Prisma Client
console.log("Prisma Client initialized");

export default prisma;
