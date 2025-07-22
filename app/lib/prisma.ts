import { PrismaClient } from '@prisma/client'

// Define global var for PrismaClient to prevent multiple instances during hot reloading
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton PrismaClient instance
const prismaClientSingleton = () => {
  return new PrismaClient();
}

// Ensure we have only one instance in development (due to hot reloading)
const prismaClient = globalThis.prisma ?? prismaClientSingleton();

// Set the global var in development to avoid multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prismaClient;
}

export const prisma = prismaClient;

export default prisma;
