// // src/routes/api/summ/+server.ts
// import { json, type RequestHandler } from '@sveltejs/kit';
// import { Ollama } from 'ollama';
// import { db } from '$lib/server/db';
// import { employeess } from '$lib/server/db/schema';
// import { inArray } from 'drizzle-orm';

// // interface SummaryRequest {
// //     userIds: number[];
// //     prompt?: string;
// //   }

// interface SummaryRequest {
//   employeessIds: number[];
//   prompt?: string;
// }

// // interface UserData {
// interface EmployeeData {
//   firstname: string;
//   middlename: string | null;
//   lastname: string | null;
//   gender: string | null;
//   contactnumber: string | null;
//   address: string | null;
//   job: string | null;
//   department: string | null;
//   status: 'active' | 'inactive';
//   age: number | null;
//   email: string;
// }

// interface SummaryResponse {
//   summ: string;
//   stats: {
//     totalEmployees: number;
//     withAgeData: number;
//     averageAge: number | null;
//     ageRange: { min: number; max: number } | null;
//     domains: Array<{ domain: string; count: number }>;
//     inactiveEmployees: Array<{
//       firstname: string;
//       lastname: string;
//       department: string;
//       job: string;
//     }>;
//   };
// }

// const ollama = new Ollama({ host: 'http://localhost:11434/' });

// export const POST: RequestHandler = async ({ request }) => {
//   try {
//     const rawBody = await request.text();
//     console.log('Received raw body:', rawBody);
    
//     let body;
//     try {
//       body = JSON.parse(rawBody);
//     } catch (parseError) {
//       console.error('JSON parse error:', parseError);
//       return json({ error: 'Invalid JSON format', details: String(parseError) }, { status: 400 });
//     }

//     const { employeessIds, prompt } = body as SummaryRequest;

//     if (!Array.isArray(employeessIds)) {
//       return json({ error: 'employeessIds must be an array' }, { status: 400 });
//     }

//     // Fetch selected users from database
//     const selectedEmployees = employeessIds.length > 0
//       ? await db.select().from(employeess).where(inArray(employeess.id, employeessIds))
//       : await db.select().from(employeess);

//     if (selectedEmployees.length === 0) {
//       return json({ error: 'No employees found' }, { status: 400 });
//     }

//     // Check if Ollama is running
//     try {
//       await ollama.chat({
//         model: 'deepseek-r1:1.5b',
//         messages: [{ role: 'employeess', content: 'test' }]
//       });
//     } catch (ollamaError) {
//       console.error('Ollama connection error:', ollamaError);
//       return json({ error: 'AI service is not available. Please try again later.' }, { status: 503 });
//     }

//     // Prepare data for analysis
//     const employeessData = selectedEmployees.map(employeess=> ({
//       firstname: employeess.firstname,
//       middlename: employeess.middlename,
//       lastname: employeess.lastname,
//       gender: employeess.gender,
//       contactnumber: employeess.contactnumber,
//       address: employeess.address,
//       job: employeess.job,
//       department: employeess.department,
//       status: employeess.status,
//       age: employeess.age,
//       email: employeess.email,
//     })) as EmployeeData[];

//     // Generate system prompt
//     const systemPrompt = `
//       You are a data analyst assistant. Analyze the following user data and provide:
//       1. Key statistics (average age, age distribution, etc.)
//       2. Interesting patterns or observations
//       3. ${prompt ? 'Specific insights based on: ' + prompt : 'General insights about the user base'}
//       4. For any inactive users, provide specific recommendations about whether they should be removed from their department or job role. Consider their age, job, and department when making these suggestions.
      
//       Respond in clear, concise markdown format with bullet points. For inactive user recommendations, use a separate section titled '### Inactive User Recommendations'.
//     `;

//     // Get AI summary
//     const response = await ollama.chat({
//       model: 'deepseek-r1:1.5b',
//       messages: [
//         { role: 'system', content: systemPrompt },
//         { role: 'employeess', content: JSON.stringify(employeessData, null, 2) }
//       ],
//       options: { temperature: 0.5 }
//     });

//     // Calculate basic stats
//     const ages = employeessData.filter(u => u.age).map(u => u.age!);
//     const inactiveEmployees = employeessData
//       .filter(u => u.status === 'inactive' && u.lastname !== null)
//       .map(u => ({
//         firstname: u.firstname,
//         lastname: u.lastname!,
//         department: u.department || 'Unknown',
//         job: u.job || 'Unknown',
//       }));

//     const stats = {
//       totalEmployees: employeessData.length,
//       withAgeData: ages.length,
//       averageAge: ages.length ? (ages.reduce((a, b) => a + b, 0) / ages.length) : null,
//       ageRange: ages.length ? { min: Math.min(...ages), max: Math.max(...ages) } : null,
//       domains: countEmailDomains(employeessData),
//       inactiveEmployees
//     };

//     const result: SummaryResponse = {
//       summ: response.message?.content || 'No summary generated',
//       stats,
//     };

//     return json(result);

//   } catch (err) {
//     console.error('Summary generation error:', err);
//     return json(
//       { error: 'Failed to generate summary', details: String(err) },
//       { status: 500 }
//     );
//   }
// };

// function countEmailDomains(employees: EmployeeData[]): Array<{ domain: string; count: number }> {
//   const domains: Record<string, number> = {};
//   employees.forEach(employeess => {
//     const domain = employeess.email.split('@')[1];
//     if (domain) domains[domain] = (domains[domain] || 0) + 1;
//   });
//   return Object.entries(domains).map(([domain, count]) => ({ domain, count }));
// }