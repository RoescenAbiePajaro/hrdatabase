// src/routes/api/summ/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { Ollama } from 'ollama';
import { db } from '$lib/server/db';
import { employeess } from '$lib/server/db/schema';
import { inArray } from 'drizzle-orm';

interface SummaryRequest {
	employeessIds: number[];
	prompt?: string;
}

interface EmployeeData {
	firstname: string;
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
	summ: string;
	stats: {
		totalEmployees: number;
		withAgeData: number;
		averageAge: number | null;
		ageRange: { min: number; max: number } | null;
		domains: Array<{ domain: string; count: number }>;
		inactiveEmployees: Array<{
			firstname: string;
			lastname: string;
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

		const { employeessIds, prompt } = body as SummaryRequest;

		if (!Array.isArray(employeessIds)) {
			return json({ error: 'employeessIds must be an array' }, { status: 400 });
		}

		// Fetch selected users from database
		const selectedEmployees =
			employeessIds.length > 0
				? await db.select().from(employeess).where(inArray(employeess.id, employeessIds))
				: await db.select().from(employeess);

		if (selectedEmployees.length === 0) {
			return json({ error: 'No employees found' }, { status: 400 });
		}

		// Prepare data for analysis
		const employeessData = selectedEmployees.map((employeess) => ({
			firstname: employeess.firstname,
			middlename: employeess.middlename,
			lastname: employeess.lastname,
			gender: employeess.gender,
			contactnumber: employeess.contactnumber,
			address: employeess.address,
			job: employeess.job,
			department: employeess.department,
			status: employeess.status,
			age: employeess.age,
			email: employeess.email
		})) as EmployeeData[];

		// Generate system prompt
		const systemPrompt = `
    You are a data analyst assistant. Analyze the following employee data and provide insights based on the user query: "${prompt || 'No specific query provided'}".
    1. Provide key statistics such as average age, age distribution, and any notable trends.
    2. Identify interesting patterns or observations related to the query.
    3. For any inactive employees, provide specific recommendations about whether they should be removed from their department or job role, considering their age, job, and department.
    
    Respond in clear, concise markdown format with bullet points. For inactive employee recommendations, use a separate section titled '### Inactive Employee Recommendations'.
  `;

		// Get AI summary
		const response = await ollama.chat({
			model: 'deepseek-r1:1.5b',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: JSON.stringify(employeessData, null, 2) }
			],
			options: { temperature: 0.5 }
		});

		// Ensure the response is based on the provided data
		if (!response.message?.content) {
			return json(
				{
					error: 'Failed to generate a meaningful summary',
					details: 'No content returned from AI.'
				},
				{ status: 500 }
			);
		}

		// Calculate basic stats
		const ages = employeessData.filter((u) => u.age !== null).map((u) => u.age!);
		const inactiveEmployees = employeessData
			.filter((u) => u.status === 'inactive' && u.lastname !== null)
			.map((u) => ({
				firstname: u.firstname,
				lastname: u.lastname!,
				department: u.department || 'Unknown',
				job: u.job || 'Unknown'
			}));

		const stats = {
			totalEmployees: employeessData.length,
			withAgeData: ages.length,
			averageAge: ages.length ? ages.reduce((a, b) => a + b, 0) / ages.length : null,
			ageRange: ages.length ? { min: Math.min(...ages), max: Math.max(...ages) } : null,
			domains: countEmailDomains(employeessData),
			inactiveEmployees
		};

		const result: SummaryResponse = {
			summ: response.message.content,
			stats
		};

		return json(result);
	} catch (err) {
		console.error('Summary generation error:', err);
		return json({ error: 'Failed to generate summary', details: String(err) }, { status: 500 });
	}
};

function countEmailDomains(employees: EmployeeData[]): Array<{ domain: string; count: number }> {
	const domains: Record<string, number> = {};
	employees.forEach((employeess) => {
		const domain = employeess.email.split('@')[1];
		if (domain) domains[domain] = (domains[domain] || 0) + 1;
	});
	return Object.entries(domains).map(([domain, count]) => ({ domain, count }));
}
