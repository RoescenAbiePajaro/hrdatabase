// src/lib/server/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const employee = sqliteTable('employee', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstname: text('firstname').notNull(),
  middlename: text('middlename'),
  lastname: text('lastname'),
  gender: text('gender'),
  contactnumber: text('contactnumber'),
  address: text('address'),
  job: text('job'),
  department: text('department'),
  status: text('status', { enum: ['active', 'inactive'] }).default('active'),
  age: integer('age'),
  email: text('email').notNull().unique(),
});
