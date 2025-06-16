// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hashPassword("admin123");

  await prisma.user.upsert({
    where: { email: "admin@eventsphere.in" },
    update: {},
    create: {
      email: "admin@eventsphere.in",
      username: "admin",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
    },
  });

  console.log("Database seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
