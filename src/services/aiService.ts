import OpenAI from 'openai';
import type { GeneratedResume } from '@/types/resume';

const ALLEN_PROFILE = `
CANDIDATE PROFILE — Allen Wang
Location: Brookline, MA 02446
Phone: (484) 521-9645
Email: allenwang4117@gmail.com

EDUCATION:
- UC Irvine, Bachelor's Degree in Computer Science (2012–2016)

CAREER HISTORY:

1. Intuit, Remote (Aug 2024 – Present)

2. Intuit, Remote (Aug 2022 – Aug 2024)

3. Tai Software, Huntington Beach, CA (Jun 2018 – Aug 2022)

4. Tai Software, Huntington Beach, CA (Jun 2016 – Jun 2018)
`;

const RESUME_RULES = `
RESUME GENERATION RULES:
1. Generate 6 - 7 skill categories with relevant items. Each category should be a concise label. Items are comma-separated keywords/phrases. Number of total skills would be around 25 - 35.
2. For work experience bullets (highlights):
   - 1st role (most recent / current): 9 bullets
   - 2nd role: 9 bullets
   - 3rd role: 7 bullets
   - 4th role (earliest / intern): 7 bullets
3. Each bullet must be at least 140 characters long.
4. Bold 2-4 key technical terms or concepts per bullet using <b> tags. Example: "Diagnosed critical issues in <b>MySQL</b> and <b>MongoDB</b> databases, ensuring <b>99.9% uptime</b> across production systems."
5. Use period-appropriate technologies — do not mention tech that didn't exist during that role's time period.
6. Make the resume ATS-friendly: use standard section names, avoid tables/columns, include keywords from the job description naturally.
7. The professional summary should be 2-3 sentences tailored to the specific job description.
8. Generate a short resume title (the job title Allen is applying for, based on the JD).
9. Do NOT fabricate experience, certifications, or skills Allen doesn't have. Only reframe and highlight existing experience to match the JD.
11. For each work experience position title, generate a tailored title that aligns with the target job description while staying truthful to Allen's actual responsibilities and scope at that company.
10. Each bullet should start with a strong action verb and quantify impact where possible.
11. Education should always be: UC Irvine, Bachelor's Degree, Computer Science, 2012-2016.
`;

const CLEARANCE_ONSITE_CHECK = `
IMPORTANT — FLAG DETECTION:
Before generating the resume, analyze the job description for these red flags:
1. SECURITY CLEARANCE: If the JD requires any security clearance (Secret, Top Secret, TS/SCI, Public Trust, etc.), set "hasRedFlags" to true and add a warning with type "clearance".
2. STRICT ONSITE: If the JD strictly requires onsite/in-office work in a location that is NOT in the Boston/Brookline, MA area (and does NOT offer remote/hybrid), set "hasRedFlags" to true and add a warning with type "onsite".

If red flags are detected, return warnings but still generate the resume content.
`;

export async function generateResume(jobDescription: string): Promise<GeneratedResume> {
  const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const systemPrompt = `You are an expert resume writer specializing in tailoring resumes to specific job descriptions. You have Allen Wang's complete career profile and must generate a fully tailored resume based on the provided job description.

${ALLEN_PROFILE}

${RESUME_RULES}

${CLEARANCE_ONSITE_CHECK}

Return a JSON object with this exact structure:
{
  "title": "string — the job title Allen is applying for",
  "summary": "string — 2-3 sentence tailored professional summary",
  "skills": [{ "category": "string", "items": "string (comma-separated)" }],
  "workExperience": [
    {
      "company": "string",
      "location": "string — e.g. 'Remote', 'Huntington Beach, CA'",
      "position": "string — a tailored job title that aligns with the target JD while staying truthful to Allen's actual role scope at that company",
      "startDate": "string (YYYY-MM format)",
      "endDate": "string (YYYY-MM format or empty if current)",
      "current": boolean,
      "highlights": ["string with <b> tags for bold keywords"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ],
  "warnings": [{ "type": "clearance | onsite", "message": "string" }]
}

Always include all 4 work experience entries in chronological order (most recent first).
Always include 1 education entry (UC Irvine).
warnings should be an empty array if no red flags detected.`;

  const userPrompt = `Generate a tailored resume for the following job description:\n\n${jobDescription}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content received from OpenAI');
    }

    const parsed = JSON.parse(content) as GeneratedResume;
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Resume generation failed: ${error.message}`);
    }
    throw new Error('Resume generation failed: An unknown error occurred');
  }
}
