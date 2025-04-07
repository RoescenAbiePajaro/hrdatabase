// src/routes/api/summary/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { Ollama } from 'ollama';
import { db } from '$lib/server/db';
import { employee } from '$lib/server/db/schema';
import { inArray } from 'drizzle-orm';

interface SummaryRequest {
  employeeIds: number[];
  prompt?: string;
}

interface EmployeeData {
  name: string;
  middlename: string | null;
  lastname: string | null;
  gender: string | null;
  contactnumber: string | null;
  address: string | null;
  job: string | null;
  department: string | null;
  status: 'active' | 'inactive';
  age: number | null;
  email: string;
}

interface SummaryResponse {
  summary: string;
  stats: {
    totalEmployees: number;
    withAgeData: number;
    averageAge: number | null;
    ageRange: { min: number; max: number } | null;
    domains: Array<{ domain: string; count: number }>;
    inactiveEmployees: Array<{
      name: string;
      department: string;
      job: string;
    }>;
  };
}

const ollama = new Ollama({ host: 'http://localhost:11434/' });

export const POST: RequestHandler = async ({ request }) => {
  try {
    const rawBody = await request.text();
    console.log('Received raw body:', rawBody);
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return json({ error: 'Invalid JSON format', details: String(parseError) }, { status: 400 });
    }

    const { employeeIds, prompt } = body as SummaryRequest;

    if (!Array.isArray(employeeIds)) {
      return json({ error: 'employeeIds must be an array' }, { status: 400 });
    }

    // Fetch selected employees from database
    const selectedEmployees = employeeIds.length > 0
      ? await db.select().from(employee).where(inArray(employee.id, employeeIds))
      : await db.select().from(employee);

    if (selectedEmployees.length === 0) {
      return json({ error: 'No employees found' }, { status: 400 });
    }

    // Check if Ollama is running
    try {
      await ollama.chat({
        model: 'deepseek-r1:1.5b',
        messages: [{ role: 'user', content: 'test' }]
      });
    } catch (ollamaError) {
      console.error('Ollama connection error:', ollamaError);
      return json({ error: 'AI service is not available. Please try again later.' }, { status: 503 });
    }

    // Prepare data for analysis
    const employeeData = selectedEmployees.map(employee => ({
      name: employee.firstname,
      middlename: employee.middlename,
      lastname: employee.lastname,
      gender: employee.gender,
      contactnumber: employee.contactnumber,
      address: employee.address,
      job: employee.job,
      department: employee.department,
      status: employee.status,
      age: employee.age,
      email: employee.email,
    })) as EmployeeData[];

    // Generate system prompt
    const systemPrompt = `
      You are a data analyst assistant. Analyze the following employee data and provide:

      1. Key Statistics:
      - Total number of employees
      - Number of active vs inactive employees
      - Age distribution (minimum, maximum, average)
      - Department-wise distribution
      - Job role distribution

      2. Patterns and Observations:
      - Age distribution across different departments
      - Common job roles within departments
      - Gender distribution by department
      - Email domain patterns (company vs personal)

      3. ${prompt ? 'Specific insights based on: ' + prompt : 'General insights about the employee base'}

      4. Inactive Employee Analysis:
      - For each inactive employee:
        * Current age
        * Department and job role
        * Time since inactivity
        * Recommendations:
          - Keep in current role with modifications
          - Transfer to different department
          - Terminate employment
          - Other specific recommendations

      Format your response in clear, concise markdown with these sections:
      1. Key Statistics (with bullet points and numbers)
      2. Patterns and Observations (with bullet points)
      3. Specific/General Insights
      4. Inactive Employee Analysis (with individual employee sections)

      For inactive employees, provide specific recommendations based on:
      - Age and experience level
      - Current department needs
      - Job role relevance
      - Company policies
    `;

    // Get AI summary
    const response = await ollama.chat({
      model: 'deepseek-r1:1.5b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(employeeData, null, 2) }
      ],
      options: { temperature: 0.5 }
    });

    // Calculate basic stats
    const ages = employeeData.filter(u => u.age).map(u => u.age!);
    const inactiveEmployees = employeeData.filter(u => u.status === 'inactive').map(u => ({
      name: `${u.name} ${u.lastname}`,
      department: u.department || 'Unknown',
      job: u.job || 'Unknown'
    }));

    const stats = {
      totalEmployees: employeeData.length,
      withAgeData: ages.length,
      averageAge: ages.length ? (ages.reduce((a, b) => a + b, 0) / ages.length) : null,
      ageRange: ages.length ? { min: Math.min(...ages), max: Math.max(...ages) } : null,
      domains: countEmailDomains(employeeData),
      inactiveEmployees
    };

    const result: SummaryResponse = {
      summary: response.message?.content || 'No summary generated',
      stats
    };

    return json(result);

  } catch (err) {
    console.error('Summary generation error:', err);
    return json(
      { error: 'Failed to generate summary', details: String(err) },
      { status: 500 }
    );
  }
};

function countEmailDomains(employees: EmployeeData[]): Array<{ domain: string; count: number }> {
  const domains: Record<string, number> = {};
  employees.forEach(employee => {
    const domain = employee.email.split('@')[1];
    if (domain) domains[domain] = (domains[domain] || 0) + 1;
  });
  return Object.entries(domains).map(([domain, count]) => ({ domain, count }));
}