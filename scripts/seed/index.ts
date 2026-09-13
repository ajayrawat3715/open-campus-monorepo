import { connectDB, disconnectDB } from "@cms/models";
import { seedCore } from "./core.seed.js";

/**
 * =========================================================================================
 * MONOREPO MASTER SEED ORCHESTRATOR
 * =========================================================================================
 *
 * This master script coordinates database seeding for all 13 teams.
 *
 * HOW OTHER TEAMS ADD THEIR FEATURE SEED:
 * 1. Create your seed file: `scripts/seed/<feature>.seed.ts` (e.g., `attendance.seed.ts`)
 * 2. Export an async function: `export async function seedAttendance(): Promise<void> { ... }`
 * 3. Import and append your function to the `seeders` pipeline array below:
 *
 *    import { seedAttendance } from "./attendance.seed.js";
 *
 *    const seeders = [
 *      { name: "Core Foundation (Team 01)", fn: seedCore },
 *      { name: "Attendance (Team 05)", fn: seedAttendance }, // ← Add here!
 *    ];
 * =========================================================================================
 */

interface SeederTask {
  name: string;
  fn: () => Promise<void>;
}

// Ordered pipeline of seed execution
const seeders: SeederTask[] = [
  { name: "Core Platform Foundation", fn: seedCore },
  // Feature teams append their seed tasks here
];

async function runMasterSeed() {
  const startTime = Date.now();
  console.log("\n🌱 Starting database seed...");

  try {
    // 1. Establish database connection using serverless-safe connection manager
    await connectDB();
    console.log("✓ Connected to MongoDB database");

    // 2. Execute each seeder sequentially
    for (const seeder of seeders) {
      console.log(`\n▶ Executing: ${seeder.name}`);
      await seeder.fn();
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✓ Database seeded successfully in ${elapsed}s! 🚀\n`);
  } catch (error) {
    console.error("\n❌ Database seeding failed with error:", error);
    process.exit(1);
  } finally {
    // 3. Gracefully disconnect
    await disconnectDB();
    console.log("✓ Disconnected cleanly from database\n");
  }
}

// Execute orchestrator
runMasterSeed();
