import { prisma } from "../src/lib/prisma";
import { DEFAULT_CATEGORIES } from "../src/lib/constants";

async function main() {
  console.log("Seeding categories...");

  for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
    const cat = DEFAULT_CATEGORIES[i];
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { icon: cat.icon, sortOrder: i },
      create: {
        name: cat.name,
        icon: cat.icon,
        sortOrder: i,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${DEFAULT_CATEGORIES.length} categories.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
