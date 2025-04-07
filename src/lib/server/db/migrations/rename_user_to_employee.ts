import { sql } from 'drizzle-orm';

export async function up(db: any) {
  // Rename the table from 'user' to 'employee'
  await db.execute(sql`ALTER TABLE user RENAME TO employee`);
}

export async function down(db: any) {
  // Rename the table back from 'employee' to 'user'
  await db.execute(sql`ALTER TABLE employee RENAME TO user`);
}
