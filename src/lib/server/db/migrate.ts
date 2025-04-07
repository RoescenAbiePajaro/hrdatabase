import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';

const sqlite = new Database('locals.db');
const db = drizzle(sqlite, { schema });

// Run migrations
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import Database from 'better-sqlite3';

async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations(); 