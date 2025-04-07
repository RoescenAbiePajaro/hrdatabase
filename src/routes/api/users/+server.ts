// src/routes/api/users/+server.ts
import { db } from '$lib/server/db';
import { employee } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';   
import type { RequestHandler } from './$types';

interface Employee {
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
    const results = await db.select().from(employee);
    return json(results);
  } catch (err) {
    console.error('Error fetching employees:', err);
    return json({ error: 'Failed to fetch employees', details: String(err) }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { firstname, middlename, lastname, gender, contactnumber, address, job, department, status, email, age } = body as Employee;

    if (!firstname || !lastname || !email) {
      return json({ error: 'First name, last name, and email are required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: 'Invalid email format' }, { status: 400 });
    }

    const [newEmployee] = await db.insert(employee).values({
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

    return json(newEmployee, { status: 201 });
  } catch (err: any) {
    console.error('Error creating employee:', err);
    if (err.message?.includes('UNIQUE constraint failed')) {
      return json({ error: 'Email already exists' }, { status: 409 });
    }
    return json({ error: 'Failed to create employee', details: String(err) }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id, firstname, middlename, lastname, gender, contactnumber, address, job, department, status, email, age } = await request.json() as Employee;

  if (!id || !firstname || !lastname || !email) {
    throw error(400, 'ID, first name, last name, and email are required');
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw error(400, 'Invalid email format');
  }

  try {
    // First check if employee exists
    const existingEmployee = await db.select().from(employee).where(eq(employee.id, id)).limit(1);
    if (!existingEmployee.length) {
      throw error(404, 'Employee not found');
    }

    const [updatedEmployee] = await db.update(employee)
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
      .where(eq(employee.id, id))
      .returning();

    return json(updatedEmployee);
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
    await db.delete(employee).where(eq(employee.id, id));
    return json({ success: true });
  } catch (err: any) {
    console.error('Error deleting employee:', err);
    throw error(500, 'Failed to delete employee');
  }
};