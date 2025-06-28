import { PrismaClient } from "@prisma/client";

let prisma = globalThis.__prisma;
if (!prisma) {
  prisma = new PrismaClient();
  if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;
}

export default prisma;
