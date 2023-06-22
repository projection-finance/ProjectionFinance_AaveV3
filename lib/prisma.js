import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Ajouter le hook beforeExit pour fermer les connexions Prisma
prisma.$on("beforeExit", async () => {
  console.log("Closing Prisma connections...");
  await prisma.$disconnect();
  console.log("Prisma connections closed!");
});

export default prisma;
