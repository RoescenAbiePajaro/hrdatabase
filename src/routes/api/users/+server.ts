// src/routes/api/user/+server.ts
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';   
import type { RequestHandler } from './$types';

interface User {
  id?: number;
  name: string;
  email: string;
  age?: number;
  firstname: string;
  middlename: string | null;
  lastname: string | null;
  gender: string | null;
  contactnumber: string | null;
  address: string | null;
  job: string | null;
  department: string | null;
  status: 'active' | 'inactive';
}

export const GET: RequestHandler = async () => {
  try {
    const results = await db.select().from(user);
    return json(results);
  } catch (err) {
    console.error('Error fetching employee:', err);
    return json({ error: 'Failed to fetch employees', details: String(err) }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { firstname, middlename, lastname, gender, contactnumber, address, job, department, status, email, age } = body as User;

    if (!firstname || !lastname || !email) {
      return json({ error: 'First name, last name, and email are required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: 'Invalid email format' }, { status: 400 });
    }

    const [newUser] = await db.insert(user).values({
      firstname,
      middlename,
      lastname,
      gender,
      contactnumber,
      address,
      job,
      department,
      status,
      email,
      age: age || null,
    }).returning();

    return json(newUser, { status: 201 });
  } catch (err: any) {
    console.error('Error creating employee:', err);
    if (err.message?.includes('UNIQUE constraint failed')) {
      return json({ error: 'Email already exists' }, { status: 409 });
    }
    return json({ error: 'Failed to create employee', details: String(err) }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id, firstname, middlename, lastname, gender, contactnumber, address, job, department, status, email, age } = await request.json() as User;

  if (!id || !firstname || !lastname || !email) {
    throw error(400, 'ID, first name, last name, and email are required');
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw error(400, 'Invalid email format');
  }

  try {
    // First check if user exists
    const existingUser = await db.select().from(user).where(eq(user.id, id)).limit(1);
    if (!existingUser.length) {
      throw error(404, 'User not found');
    }

    const [updatedUser] = await db.update(user)
      .set({ 
        firstname,
        middlename,
        lastname,
        gender,
        contactnumber,
        address,
        job,
        department,
        status,
        email,
        age: age || null 
      })
      .where(eq(user.id, id))
      .returning();

    return json(updatedUser);
  } catch (err: any) {
    console.error('Error updating employee:', err);
    if (err.message?.includes('UNIQUE constraint failed')) {
      throw error(409, 'Email already exists');
    }
    if (err.message?.includes('Employee not found')) {
      throw error(404, 'Employee not found');
    }
    throw error(500, 'Failed to update employee');
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  const { id } = await request.json() as { id: number };

  if (!id) {
    throw error(400, 'Employee ID is required');
  }

  try {
    await db.delete(user).where(eq(user.id, id));
    return json({ success: true });
  } catch (err: any) {
    console.error('Error deleting employee:', err);
    throw error(500, 'Failed to delete employee');
  }
};