// ./prisma/seed.ts
import db from "../src/lib/db.js";

async function main() {
  console.log("🌱 Start seeding data...");

  // -------------------------------------------------------------
  // 1. Seed Categories
  const categoriesData = [
    { name: "Chest" },
    { name: "Back" },
    { name: "Legs" },
    { name: "Shoulders" },
    { name: "Arms" },
    { name: "Core" },
  ];

  console.log("Creating categories...");
  for (const cat of categoriesData) {
    await db.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  // -------------------------------------------------------------
  // 2. Seed Tools
  const toolsData = [
    { name: "Barbell" },
    { name: "Dumbbell" },
    { name: "Cable Machine" },
    { name: "Smith Machine" },
  ];

  console.log("Creating tools...");
  for (const tool of toolsData) {
    await db.tool.upsert({
      where: { name: tool.name },
      update: {},
      create: tool,
    });
  }

  // -------------------------------------------------------------
  // 3. Fetch newly created parents to map their IDs correctly to Exercises
  const chest = await db.category.findUniqueOrThrow({
    where: { name: "Chest" },
  });
  const back = await db.category.findUniqueOrThrow({ where: { name: "Back" } });
  const arms = await db.category.findUniqueOrThrow({ where: { name: "Arms" } });

  const barbell = await db.tool.findUniqueOrThrow({
    where: { name: "Barbell" },
  });
  const dumbbell = await db.tool.findUniqueOrThrow({
    where: { name: "Dumbbell" },
  });

  // -------------------------------------------------------------
  // 4. Seed Exercises (Mapping the correct foreign key IDs sequentially)
  const exercisesData = [
    { name: "Bench Press", categoryId: chest.id, toolId: barbell.id },
    {
      name: "Incline Dumbbell Press",
      categoryId: chest.id,
      toolId: dumbbell.id,
    },
    { name: "Barbell Row", categoryId: back.id, toolId: barbell.id },
    { name: "Bicep Curl", categoryId: arms.id, toolId: dumbbell.id },
    { name: "Bodyweight Push-Up", categoryId: chest.id, toolId: null }, // Optional tool works perfectly!
  ];

  console.log("Creating exercises...");
  for (const ex of exercisesData) {
    await db.exercise.upsert({
      where: { name: ex.name },
      update: {
        categoryId: ex.categoryId,
        toolId: ex.toolId,
      },
      create: ex,
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

/*
// -------------------------------------------------------------
// NOTE: Step 1: To seed your database, 
// add a seed property to the migrations section in your Prisma config file.

Example

  // prisma.config.ts
  export default defineConfig({
    migrations: {
      seed: 'tsx ./prisma/seed.ts',
    },
    datasource: {
      url: '[your database URL]',
    },
  })

// -------------------------------------------------------------
// NOTE: Step 2: Trigger your seed script execution
// You can run one standard command in your terminal client:

npx prisma db seed

// NOTE: This single command locates your prisma/seed.ts configuration, 
// spins up the connection instance using your structural configuration layers, 
// executes the data mapping sequentially, 
// and drops clean updates in your MySQL tables without constraint errors!
*/
