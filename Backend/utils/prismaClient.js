import pkg from '@prisma/client';
const { PrismaClient } = pkg;

let prismaInstance = null;

function getPrismaInstance() {
    if (!prismaInstance) {
        prismaInstance = new PrismaClient();
    }
    return prismaInstance;
}

export default getPrismaInstance;
