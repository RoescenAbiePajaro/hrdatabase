// src/lib/server/db/connection.ts
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';
import Database from 'better-sqlite3';

const sqlite = new Database('locals.db', { verbose: console.log });
export const db = drizzle(sqlite, { schema });