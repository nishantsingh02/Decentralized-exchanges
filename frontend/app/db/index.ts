import { PrismaClient } from "@/lib/generated/prisma";

// this is problomatic in case of next.Js
// export const prismaClient = new PrismaClient();
// during development, the app can hot-reload many times.
// Every reload creates a new PrismaClient instance

//singleton Function
const prismaClientSingleton = () => {
    return new PrismaClient();
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

//this is a javaScript class or gloabal scop like window in browser or global in Node.js
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton(); 

export default prisma;

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
