import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const DEFAULT_CATEGORIES = [
  { name: "ID Card", icon: "🪪" },
  { name: "Wallet", icon: "👛" },
  { name: "Phone", icon: "📱" },
  { name: "Keys", icon: "🔑" },
  { name: "Charger / Cable", icon: "🔌" },
  { name: "Laptop / Tablet", icon: "💻" },
  { name: "Bag / Backpack", icon: "🎒" },
  { name: "Clothing", icon: "👕" },
  { name: "Headphones / Earbuds", icon: "🎧" },
  { name: "Water Bottle", icon: "🧴" },
  { name: "Books / Notes", icon: "📚" },
  { name: "Glasses", icon: "👓" },
  { name: "Jewelry / Watch", icon: "⌚" },
  { name: "Umbrella", icon: "☂️" },
  { name: "Other", icon: "📦" },
];

async function main() {
  console.log("Seeding categories...");

  // Use DIRECT_URL for seeding (avoids pgbouncer transaction issues)
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

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
  await prisma.$disconnect();
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
