import OpenAI from 'openai';
import type { GeneratedResume } from '@/types/resume';

export type ProfileName = 'allen' | 'albert' | 'tanner' | 'hao' | 'chris';

// ─── ALLEN WANG ─────────────────────────────────────────────────────────────

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

const ALLEN_RULES = `
RESUME GENERATION RULES:
1. Generate 6 - 7 skill categories with relevant items. Each category should be a concise label. Items are comma-separated keywords/phrases. Each category MUST have at least 5 items. The total number of individual skills across ALL categories MUST be between 30 and 35 — never fewer than 30.
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
8. Generate a short, simple resume title — use common market job titles (e.g. "Senior Software Engineer", "Full Stack Developer", "Frontend Engineer"). Do NOT copy long or overly specific titles from the JD.
9. Do NOT fabricate experience, certifications, or skills Allen doesn't have. Only reframe and highlight existing experience to match the JD.
10. For each work experience position title, use simple, widely recognized job titles (e.g. "Software Engineer", "Senior Software Engineer", "Software Developer"). Keep them short (2-4 words max). Do NOT use niche, compound, or JD-specific titles.
11. Each bullet should start with a strong action verb and quantify impact where possible.
12. Education should always be: UC Irvine, Bachelor's Degree, Computer Science, 2012-2016.
13. CRITICAL — BULLET STRUCTURE: Every bullet MUST blend business context with technical detail. Follow this pattern: "What business problem or product goal → what you built/did (with tech) → what measurable impact." Do NOT write pure technical bullets. Explain the WHY and the business outcome alongside the technical work. Specifically:
   - Intuit (both roles): Reference fintech/tax/accounting industry context (TurboTax, QuickBooks, Mint, payroll processing, tax filing, financial data, customer-facing platforms, compliance, etc.).
   - Tai Software (both roles): Reference the company's industry and product context (SaaS platforms, client-facing web applications, business process automation, etc.).
14. CRITICAL — COMPANY-AUTHENTIC TECHNOLOGIES: Each role's bullets MUST reflect the actual tech stack commonly used at that company. Do NOT use generic filler. Specifically:
   - Intuit: Use Intuit-ecosystem tech (Java, React, Ruby on Rails, MySQL, MongoDB, Redis, RabbitMQ, AWS, JIRA, CI/CD, microservices, etc.).
   - Tai Software: Use web/SaaS tech appropriate for that era (Ruby, Java, React, MySQL, MongoDB, Git, etc.).
`;

const ALLEN_ONSITE_CHECK = `
IMPORTANT — FLAG DETECTION:
Before generating the resume, analyze the job description for these red flags:
1. SECURITY CLEARANCE: If the JD requires any security clearance (Secret, Top Secret, TS/SCI, Public Trust, etc.), set "hasRedFlags" to true and add a warning with type "clearance".
2. STRICT ONSITE: If the JD strictly requires onsite/in-office work in a location that is NOT in the Boston/Brookline, MA area (and does NOT offer remote/hybrid), set "hasRedFlags" to true and add a warning with type "onsite".

If red flags are detected, return warnings but still generate the resume content.
`;

// ─── ALBERT KONG ────────────────────────────────────────────────────────────

const ALBERT_PROFILE = `
CANDIDATE PROFILE — Albert Kong
Location: Austin, TX 78701
Phone: (929) 309-1138
Email: albertkong211@gmail.com

EDUCATION:
- University of Illinois Urbana-Champaign, Bachelor of Science in Computer Science (2014–2018)

CAREER HISTORY:

1. Google, Austin, TX (May 2024 – Present)

2. Ladder, Remote (Aug 2022 – May 2024)

3. Roblox, San Mateo, CA (Aug 2019 – Aug 2022)

4. HackIllinois, Champaign, IL (Jun 2018 – Aug 2019)
`;

const ALBERT_RULES = `
RESUME GENERATION RULES:
1. Generate 6 - 7 skill categories with relevant items. Each category should be a concise label. Items are comma-separated keywords/phrases. Each category MUST have at least 5 items. The total number of individual skills across ALL categories MUST be between 30 and 35 — never fewer than 30.
2. For work experience bullets (highlights):
   - Google (most recent / current): 9 bullets
   - Ladder: 7 bullets
   - Roblox: 6 bullets
   - HackIllinois (earliest / internship): 4 bullets
3. Each bullet must be at least 140 characters long.
4. Bold 2-4 key technical terms or concepts per bullet using <b> tags. Example: "Architected distributed data pipelines using <b>Google Cloud Dataflow</b> and <b>BigQuery</b>, processing over <b>2 billion events daily</b> with sub-second latency."
5. Use period-appropriate technologies — do not mention tech that didn't exist during that role's time period.
6. CRITICAL — COMPANY-AUTHENTIC TECHNOLOGIES: Each role's bullets MUST reflect the actual tech stack and industry of that company. Do NOT use generic filler. Specifically:
   - Google: Use Google-ecosystem tech (GCP, BigQuery, Spanner, Kubernetes/GKE, Borg, gRPC, Protocol Buffers, TensorFlow, Go, Java, C++, Angular, Pub/Sub, Cloud Functions, etc.). Do NOT mention AWS or Azure as primary tools.
   - Ladder: Ladder is a life insurance technology company. Use fintech/insurtech-relevant tech (React, TypeScript, Node.js, Python, PostgreSQL, Redis, GraphQL, REST APIs, underwriting engines, policy management, data pipelines, etc.).
   - Roblox: Roblox is a gaming/metaverse platform. Use gaming-platform tech (Lua, C++, React, TypeScript, distributed systems, real-time multiplayer infrastructure, content delivery, analytics pipelines, game engine internals, etc.).
   - HackIllinois: IT services / early career internship. Use general web/software development tech appropriate for 2018-2019 (JavaScript, Python, React, Node.js, SQL, REST APIs, Git, etc.).
7. Make the resume ATS-friendly: use standard section names, include keywords from the job description naturally. BUT the content must read like genuine work experience at each company — not generic ATS-stuffed bullets. Write as if a real engineer at that company described their work.
8. The professional summary should be 2-3 sentences tailored to the specific job description.
9. Generate a short, simple resume title — use common market job titles (e.g. "Senior Software Engineer", "Full Stack Developer", "Frontend Engineer"). Do NOT copy long or overly specific titles from the JD.
10. Do NOT fabricate experience, certifications, or skills Albert doesn't have. Only reframe and highlight existing experience to match the JD.
11. For each work experience position title, use simple, widely recognized job titles (e.g. "Software Engineer", "Senior Software Engineer", "Software Engineering Intern"). Keep them short (2-4 words max). Do NOT use niche, compound, or JD-specific titles.
12. Each bullet should start with a strong action verb and quantify impact where possible.
13. Education should always be: University of Illinois Urbana-Champaign, Bachelor of Science, Computer Science, 2014-2018.
14. CRITICAL — BULLET STRUCTURE: Every bullet MUST blend business context with technical detail. Follow this pattern: "What business problem or product goal → what you built/did (with tech) → what measurable impact." Do NOT write pure technical bullets like "Built microservices using gRPC on GKE." Instead write bullets that explain the WHY and the business outcome, e.g.:
   - Google: reference real Google-scale products/features (Search, Ads, Cloud, Maps, YouTube, etc.), describe what user or business problem was solved
   - Ladder: reference insurance industry context (policy quoting, underwriting, customer onboarding, claims, compliance)
   - Roblox: reference gaming platform context (creator tools, player experience, marketplace, content moderation, game performance)
   - HackIllinois: reference client projects, internal tools, team deliverables
   A good bullet reads like: "Redesigned the policy quoting engine to support real-time multi-carrier comparison, reducing average quote time from 45s to under 3s using <b>GraphQL</b>, <b>Redis</b> caching, and <b>PostgreSQL</b> query optimization."
15. Write bullets that sound human-written — like a real engineer describing their actual work. Avoid generic phrasing, buzzword stuffing, or overly polished corporate language. Vary sentence structure and be specific about what was built, why, and the real impact.
`;

const ALBERT_ONSITE_CHECK = `
IMPORTANT — FLAG DETECTION:
Before generating the resume, analyze the job description for these red flags:
1. SECURITY CLEARANCE: If the JD requires any security clearance (Secret, Top Secret, TS/SCI, Public Trust, etc.), set "hasRedFlags" to true and add a warning with type "clearance".
2. STRICT ONSITE: If the JD strictly requires onsite/in-office work in a location that is NOT in the Austin, TX area (and does NOT offer remote/hybrid), set "hasRedFlags" to true and add a warning with type "onsite".

If red flags are detected, return warnings but still generate the resume content.
`;

// ─── TANNER BARTON ──────────────────────────────────────────────────────────

const TANNER_PROFILE = `
CANDIDATE PROFILE — Tanner Barton
Location: Austin, TX 78738
Phone: (929) 338-6310
Email: tannerbarton011@gmail.com

EDUCATION:
- Brigham Young University, Bachelor of Science in Computer Science (2014–2018)

CAREER HISTORY:

1. Google, Austin, TX (May 2024 – Present)

2. Amazon, Seattle, WA (Aug 2020 – May 2024)

3. HackIllinois, Champaign, IL (Jun 2018 – Aug 2020)
`;

const TANNER_RULES = `
RESUME GENERATION RULES:
1. Generate 6 - 7 skill categories with relevant items. Each category should be a concise label. Items are comma-separated keywords/phrases. Each category MUST have at least 5 items. The total number of individual skills across ALL categories MUST be between 30 and 35 — never fewer than 30.
2. For work experience bullets (highlights):
   - Google (most recent / current): 8 bullets
   - Amazon: 10 bullets
   - HackIllinois (earliest): 5 bullets
3. Each bullet must be at least 140 characters long.
4. Bold 2-4 key technical terms or concepts per bullet using <b> tags. Example: "Architected distributed data pipelines using <b>Google Cloud Dataflow</b> and <b>BigQuery</b>, processing over <b>2 billion events daily</b> with sub-second latency."
5. Use period-appropriate technologies — do not mention tech that didn't exist during that role's time period.
6. CRITICAL — COMPANY-AUTHENTIC TECHNOLOGIES: Each role's bullets MUST reflect the actual tech stack and industry of that company. Do NOT use generic filler. Specifically:
   - Google: Use Google-ecosystem tech (GCP, BigQuery, Spanner, Kubernetes/GKE, Borg, gRPC, Protocol Buffers, TensorFlow, Go, Java, C++, Angular, Pub/Sub, Cloud Functions, etc.). Do NOT mention AWS or Azure as primary tools.
   - Amazon: Use Amazon-ecosystem tech (AWS, DynamoDB, S3, Lambda, EC2, ECS, CloudFormation, CDK, Kinesis, SQS, SNS, Step Functions, Java, Python, TypeScript, React, internal tooling, etc.). Do NOT mention GCP or Azure as primary tools.
   - HackIllinois: IT services / early career role. Use general web/software development tech appropriate for 2018-2020 (JavaScript, Python, React, Node.js, SQL, REST APIs, Git, Docker, etc.).
7. Make the resume ATS-friendly: use standard section names, include keywords from the job description naturally. BUT the content must read like genuine work experience at each company — not generic ATS-stuffed bullets. Write as if a real engineer at that company described their work.
8. The professional summary should be 2-3 sentences tailored to the specific job description. Tanner has 8 years of professional experience (Jun 2018 – present) — mention this in the summary.
9. Generate a short, simple resume title — use common market job titles (e.g. "Senior Software Engineer", "Full Stack Developer", "Frontend Engineer"). Do NOT copy long or overly specific titles from the JD.
10. Do NOT fabricate experience, certifications, or skills Tanner doesn't have. Only reframe and highlight existing experience to match the JD.
11. For each work experience position title, use simple, widely recognized job titles (e.g. "Software Engineer", "Senior Software Engineer", "Software Engineering Intern"). Keep them short (2-4 words max). Do NOT use niche, compound, or JD-specific titles.
12. Each bullet should start with a strong action verb and quantify impact where possible.
13. Education should always be: Brigham Young University, Bachelor of Science, Computer Science, 2014-2018.
14. CRITICAL — BULLET STRUCTURE: Every bullet MUST blend business context with technical detail. Follow this pattern: "What business problem or product goal → what you built/did (with tech) → what measurable impact." Do NOT write pure technical bullets like "Built microservices using gRPC on GKE." Instead write bullets that explain the WHY and the business outcome, e.g.:
   - Google: reference real Google-scale products/features (Search, Ads, Cloud, Maps, YouTube, etc.), describe what user or business problem was solved
   - Amazon: reference real Amazon products/services (retail, Prime, Alexa, AWS services, fulfillment, logistics, advertising, etc.), describe what customer or operational problem was solved
   - HackIllinois: reference client projects, internal tools, team deliverables
15. Write bullets that sound human-written — like a real engineer describing their actual work. Avoid generic phrasing, buzzword stuffing, or overly polished corporate language. Vary sentence structure and be specific about what was built, why, and the real impact.
`;

const TANNER_ONSITE_CHECK = `
IMPORTANT — FLAG DETECTION:
Before generating the resume, analyze the job description for these red flags:
1. SECURITY CLEARANCE: If the JD requires any security clearance (Secret, Top Secret, TS/SCI, Public Trust, etc.), set "hasRedFlags" to true and add a warning with type "clearance".
2. STRICT ONSITE: If the JD strictly requires onsite/in-office work in a location that is NOT in the Austin, TX area (and does NOT offer remote/hybrid), set "hasRedFlags" to true and add a warning with type "onsite".

If red flags are detected, return warnings but still generate the resume content.
`;

// ─── HAO NGUYEN ─────────────────────────────────────────────────────────────

const HAO_PROFILE = `
CANDIDATE PROFILE — Hao Nguyen
Location: Forney, TX 75126
Phone: (929) 338-6310
Email: haonguyen01@gmail.com

EDUCATION:
- Texas Tech University, Bachelor of Science in Computer Science (2017–2019)
- Lone Star College, Associate of Science in Computer Science (2014–2017)

CAREER HISTORY:

1. Fiserv, Remote (Jan 2024 – Present)

2. Aperia Solutions, Inc., Remote (Aug 2021 – Jan 2024)

3. Cognizant, Dallas, TX (Apr 2017 – Aug 2021)

4. Tutor Doctor, Dallas, TX (Feb 2016 – Mar 2017)
`;

const HAO_RULES = `
RESUME GENERATION RULES:
1. Generate 6 - 7 skill categories with relevant items. Each category should be a concise label. Items are comma-separated keywords/phrases. Each category MUST have at least 5 items. The total number of individual skills across ALL categories MUST be between 30 and 35 — never fewer than 30.
2. For work experience bullets (highlights):
   - Fiserv (most recent / current): 9 bullets
   - Aperia Solutions: 9 bullets
   - Cognizant: 8 bullets
   - Tutor Doctor (earliest): 4 bullets
3. Each bullet must be at least 140 characters long.
4. Bold 2-4 key technical terms or concepts per bullet using <b> tags. Example: "Architected payment gateway integration using <b>Java</b> and <b>Spring Boot</b>, processing over <b>500K daily transactions</b> with 99.99% uptime."
5. Use period-appropriate technologies — do not mention tech that didn't exist during that role's time period.
6. CRITICAL — COMPANY-AUTHENTIC TECHNOLOGIES: Each role's bullets MUST reflect the actual tech stack and industry of that company. Do NOT use generic filler. Specifically:
   - Fiserv: Fiserv is a financial services technology company (payments, banking, merchant processing). Use fintech-relevant tech (Java, Spring Boot, Kafka, Kubernetes, AWS, Microservices, REST APIs, Oracle/PostgreSQL, React, Angular, payment processing, PCI compliance, etc.).
   - Aperia Solutions: Aperia is an IT consulting/solutions company. Use enterprise consulting tech (Java, .NET, Python, React, Angular, AWS/Azure, SQL Server, PostgreSQL, Docker, CI/CD, Agile delivery, client-facing solutions, etc.).
   - Cognizant: Cognizant is a global IT services/consulting company. Use enterprise IT tech (Java, .NET, Python, Angular, React, AWS/Azure, SQL Server, Oracle, JIRA, Agile/Scrum, enterprise application development, client delivery, etc.).
   - Tutor Doctor: Education/tutoring company, early career role. Use general web/software development tech appropriate for 2016-2017 (JavaScript, Python, HTML/CSS, PHP, MySQL, WordPress, basic web development, etc.).
7. Make the resume ATS-friendly: use standard section names, include keywords from the job description naturally. BUT the content must read like genuine work experience at each company — not generic ATS-stuffed bullets. Write as if a real engineer at that company described their work.
8. The professional summary should be 2-3 sentences tailored to the specific job description. Hao has approximately 9 years of professional experience (Feb 2016 – present) — mention this in the summary.
9. Generate a short, simple resume title — use common market job titles (e.g. "Senior Software Engineer", "Full Stack Developer", "Frontend Engineer"). Do NOT copy long or overly specific titles from the JD.
10. Do NOT fabricate experience, certifications, or skills Hao doesn't have. Only reframe and highlight existing experience to match the JD.
11. For each work experience position title, use simple, widely recognized job titles (e.g. "Software Engineer", "Senior Software Engineer", "Software Developer"). Keep them short (2-4 words max). Do NOT use niche, compound, or JD-specific titles.
12. Each bullet should start with a strong action verb and quantify impact where possible.
13. Education: Always include BOTH entries — Texas Tech University (Bachelor of Science, Computer Science, 2017-2019) AND Lone Star College (Associate of Science, Computer Science, 2014-2017).
14. CRITICAL — BULLET STRUCTURE: Every bullet MUST blend business context with technical detail. Follow this pattern: "What business problem or product goal → what you built/did (with tech) → what measurable impact." Do NOT write pure technical bullets. Specifically:
   - Fiserv: reference financial services context (payment processing, merchant services, banking platforms, transaction processing, fraud detection, compliance)
   - Aperia Solutions: reference IT consulting context (client engagements, enterprise solutions, digital transformation, system integration)
   - Cognizant: reference IT services context (client delivery, enterprise applications, system modernization, business process automation)
   - Tutor Doctor: reference education/tutoring platform context (student management, scheduling, web presence)
15. Write bullets that sound human-written — like a real engineer describing their actual work. Avoid generic phrasing, buzzword stuffing, or overly polished corporate language. Vary sentence structure and be specific about what was built, why, and the real impact.
`;

const HAO_ONSITE_CHECK = `
IMPORTANT — FLAG DETECTION:
Before generating the resume, analyze the job description for these red flags:
1. SECURITY CLEARANCE: If the JD requires any security clearance (Secret, Top Secret, TS/SCI, Public Trust, etc.), set "hasRedFlags" to true and add a warning with type "clearance".
2. STRICT ONSITE: If the JD strictly requires onsite/in-office work in a location that is NOT in the Dallas/Forney, TX area (and does NOT offer remote/hybrid), set "hasRedFlags" to true and add a warning with type "onsite".

If red flags are detected, return warnings but still generate the resume content.
`;

// ─── CHRIS (SONGPEI) YANG ──────────────────────────────────────────────────

const CHRIS_PROFILE = `
CANDIDATE PROFILE — Chris (Songpei) Yang
Location: Mckinney, TX 75071
Phone: (814) 313-3170
Email: rt3537573@gmail.com

EDUCATION:
- The University of Georgia, Bachelor of Science in Computer Science (2013–2017)

CAREER HISTORY:

1. ServiceNow, Remote (Jan 2022 – Present)

2. J.P. Morgan, Remote (Sep 2021 – Jan 2022)

3. Bank of America, Remote (Oct 2017 – Aug 2021)
`;

const CHRIS_RULES = `
RESUME GENERATION RULES:
1. Generate a FLAT list of 30-35 individual skills (no categories). Return as a single skill entry with an empty category and all skills as comma-separated items. The total count MUST be between 30 and 35 — never fewer than 30. Mix technical skills, tools, frameworks, and domain knowledge relevant to the JD.
2. For work experience bullets (highlights):
   - ServiceNow (most recent / current): 9 bullets
   - J.P. Morgan: 4 bullets
   - Bank of America: 7 bullets
3. Each bullet must be at least 140 characters long.
4. Bold 2-4 key technical terms or concepts per bullet using <b> tags. Example: "Designed automated incident routing workflows on the <b>ServiceNow Platform</b> using <b>Flow Designer</b> and <b>IntegrationHub</b>, reducing mean time to resolution by 35% for P1 incidents."
5. Use period-appropriate technologies — do not mention tech that didn't exist during that role's time period.
6. CRITICAL — COMPANY-AUTHENTIC TECHNOLOGIES: Each role's bullets MUST reflect the actual tech stack and industry of that company. Do NOT use generic filler. Specifically:
   - ServiceNow: ServiceNow is an enterprise cloud platform company. Use ServiceNow-ecosystem tech (ServiceNow Platform, Flow Designer, IntegrationHub, CMDB, ITSM, ITOM, JavaScript, Glide API, Service Portal, Angular, REST/SOAP APIs, Now Platform, ATF, Update Sets, Scripted REST APIs, Business Rules, Client Scripts, UI Policies, Performance Analytics, etc.). Do NOT primarily reference AWS/Azure/GCP — ServiceNow runs its own cloud platform.
   - J.P. Morgan: J.P. Morgan is a global investment bank and financial services company. Use banking/fintech tech (Java, Spring Boot, Kafka, AWS, Kubernetes, React, Angular, Python, Oracle, PostgreSQL, microservices, REST APIs, CI/CD, securities trading, risk management, regulatory compliance, payment processing, etc.). Do NOT mention ServiceNow platform tech.
   - Bank of America: Bank of America is one of the largest US banks. Use enterprise banking tech (Java, Spring, .NET/C#, Angular, React, Python, Oracle, SQL Server, AWS, Azure, Kafka, MQ, microservices, REST APIs, CI/CD, Jenkins, Git, Agile/Scrum, regulatory compliance, digital banking, fraud detection, etc.). Do NOT mention ServiceNow platform tech or GCP.
7. Make the resume ATS-friendly: use standard section names, include keywords from the job description naturally. BUT the content must read like genuine work experience at each company — not generic ATS-stuffed bullets. Write as if a real engineer at that company described their work.
8. The professional summary should be 2-3 sentences tailored to the specific job description. Chris has approximately 8 years of professional experience (Oct 2017 – present) — mention this in the summary.
9. Generate a short, simple resume title — use common market job titles (e.g. "Senior Software Engineer", "Full Stack Developer", "Platform Engineer"). Do NOT copy long or overly specific titles from the JD.
10. Do NOT fabricate experience, certifications, or skills Chris doesn't have. Only reframe and highlight existing experience to match the JD.
11. For each work experience position title, use simple, widely recognized job titles (e.g. "Software Engineer", "Senior Software Engineer", "Platform Engineer", "Software Developer"). Keep them short (2-4 words max). Do NOT use niche, compound, or JD-specific titles.
12. Each bullet should start with a strong action verb and quantify impact where possible.
13. Education should always be: The University of Georgia, Bachelor of Science, Computer Science, 2013-2017.
14. CRITICAL — BULLET STRUCTURE: Every bullet MUST blend business context with technical detail. Follow this pattern: "What business problem or product goal → what you built/did (with tech) → what measurable impact." Do NOT write pure technical bullets. Specifically:
   - ServiceNow: reference enterprise IT service management context (incident management, change management, service catalog, CMDB, IT operations, workflow automation, employee self-service, platform customization, customer implementations)
   - J.P. Morgan: reference investment banking / financial services context (trading platforms, risk analytics, regulatory reporting, payment systems, securities processing, client onboarding, compliance workflows)
   - Bank of America: reference retail/commercial banking context (digital banking, online/mobile banking, customer account management, fraud detection, loan processing, payment systems, regulatory compliance, internal tools)
15. Write bullets that sound human-written — like a real engineer describing their actual work. Avoid generic phrasing, buzzword stuffing, or overly polished corporate language. Vary sentence structure and be specific about what was built, why, and the real impact.
`;

const CHRIS_ONSITE_CHECK = `
IMPORTANT — FLAG DETECTION:
Before generating the resume, analyze the job description for these red flags:
1. SECURITY CLEARANCE: If the JD requires any security clearance (Secret, Top Secret, TS/SCI, Public Trust, etc.), set "hasRedFlags" to true and add a warning with type "clearance".
2. STRICT ONSITE: If the JD strictly requires onsite/in-office work in a location that is NOT in the Dallas/McKinney, TX area (and does NOT offer remote/hybrid), set "hasRedFlags" to true and add a warning with type "onsite".

If red flags are detected, return warnings but still generate the resume content.
`;

// ─── PROFILE CONFIG ─────────────────────────────────────────────────────────

const PROFILES: Record<ProfileName, { profile: string; rules: string; onsiteCheck: string; name: string; education: string; workCount: number }> = {
  allen: {
    profile: ALLEN_PROFILE,
    rules: ALLEN_RULES,
    onsiteCheck: ALLEN_ONSITE_CHECK,
    name: 'Allen Wang',
    education: 'UC Irvine',
    workCount: 4,
  },
  albert: {
    profile: ALBERT_PROFILE,
    rules: ALBERT_RULES,
    onsiteCheck: ALBERT_ONSITE_CHECK,
    name: 'Albert Kong',
    education: 'University of Illinois Urbana-Champaign',
    workCount: 4,
  },
  tanner: {
    profile: TANNER_PROFILE,
    rules: TANNER_RULES,
    onsiteCheck: TANNER_ONSITE_CHECK,
    name: 'Tanner Barton',
    education: 'Brigham Young University',
    workCount: 3,
  },
  hao: {
    profile: HAO_PROFILE,
    rules: HAO_RULES,
    onsiteCheck: HAO_ONSITE_CHECK,
    name: 'Hao Nguyen',
    education: 'Texas Tech University and Lone Star College',
    workCount: 4,
  },
  chris: {
    profile: CHRIS_PROFILE,
    rules: CHRIS_RULES,
    onsiteCheck: CHRIS_ONSITE_CHECK,
    name: 'Chris (Songpei) Yang',
    education: 'The University of Georgia',
    workCount: 3,
  },
};

// ─── GENERATE RESUME ────────────────────────────────────────────────────────

export async function generateResume(jobDescription: string, profileName: ProfileName = 'allen'): Promise<GeneratedResume> {
  const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const config = PROFILES[profileName];

  const systemPrompt = `You are an expert resume writer specializing in tailoring resumes to specific job descriptions. You have ${config.name}'s complete career profile and must generate a fully tailored resume based on the provided job description.

${config.profile}

${config.rules}

${config.onsiteCheck}

Return a JSON object with this exact structure:
{
  "title": "string — the job title ${config.name} is applying for",
  "summary": "string — 2-3 sentence tailored professional summary",
  "skills": [{ "category": "string", "items": "string (comma-separated)" }],
  "workExperience": [
    {
      "company": "string",
      "location": "string — e.g. 'Remote', 'Austin, TX'",
      "position": "string — a tailored job title that aligns with the target JD while staying truthful to ${config.name}'s actual role scope at that company",
      "startDate": "string (Mon YYYY format, e.g. 'Aug 2024')",
      "endDate": "string (Mon YYYY format, e.g. 'Aug 2022') or 'Present' if current",
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

Always include all ${config.workCount} work experience entries in chronological order (most recent first).
Always include 1 education entry (${config.education}).
warnings should be an empty array if no red flags detected.`;

  const userPrompt = `Generate a tailored resume for the following job description:\n\n${jobDescription}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4.1',
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
