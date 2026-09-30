import dotenv from 'dotenv';
import { initDatabase, saveDatabase } from './db';

dotenv.config();

async function runSeed() {
  console.log('--- Starting Al Mushtaq Building Material Store DB Seeding ---');
  await initDatabase();
  saveDatabase();
  console.log('--- Seeding completed successfully! ---');
  process.exit(0);
}

runSeed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
