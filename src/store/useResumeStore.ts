import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PersonalInfo,
  WorkExperience,
  Education,
  Certification,
  Skill,
  TemplateName,
  AiWarning,
} from '@/types/resume';
import { generateResume } from '@/services/aiService';
import type { ProfileName } from '@/services/aiService';

interface ResumeState {
  selectedProfile: ProfileName;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  jobDescription: string;
  selectedTemplate: TemplateName;
  mainTitle: string;
  generationStatus: 'idle' | 'generating' | 'success' | 'error';
  generationError: string | null;
  aiWarnings: AiWarning[];

  // Profile
  setProfile: (profile: ProfileName) => void;

  // Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;

  // Work Experience
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, data: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  // Skills
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  // Job Description
  setJobDescription: (desc: string) => void;

  // Template
  setTemplate: (template: TemplateName) => void;

  // AI Generation
  generateFromJobDescription: (jd: string) => Promise<void>;
  clearGeneration: () => void;

  // Reset
  resetToDefaults: () => void;
}

const createId = () => crypto.randomUUID();

const defaultPersonalInfo: PersonalInfo = {
  fullName: 'Allen Wang',
  email: 'allenwang4117@gmail.com',
  phone: '(484) 521-9645',
  address: 'Brookline, MA 02446',
  linkedin: '',
  website: '',
  summary: '',
};

const createDefaultWorkExperience = (): WorkExperience[] => [
  {
    id: createId(),
    company: 'Intuit',
    location: 'Remote',
    position: '',
    startDate: '2024-08',
    endDate: '',
    current: true,
    description: '',
    highlights: [
      'Led end-to-end application support for multiple internal SaaS platforms, triaging Tier-2 incidents and ensuring timely resolution while collaborating closely with engineering teams to resolve complex production issues.',
      'Developed comprehensive documentation and knowledge base articles for common and recurring issues, reducing internal ticket resolution time by 40% and improving support efficiency.',
      'Diagnosed, analyzed, and resolved critical backend issues impacting MySQL, MongoDB, and Redis databases, ensuring uninterrupted application performance across global operations.',
      'Implemented proactive monitoring scripts to detect anomalies in RabbitMQ message queues and backend services, preventing potential outages before they impacted users.',
      'Managed release deployment support, validating configuration, database schema changes, and new feature rollouts while coordinating with developers to mitigate risks.',
      'Collaborated with internal teams to train end users on system functionality and usage, providing Tier-1 support guidance and improving adoption of new features.',
      'Conducted root cause analysis for recurring production issues, producing actionable insights that informed engineering improvements and enhanced system reliability.',
      'Assisted with evaluation and configuration of new releases, ensuring compliance with configuration management standards and internal support workflows.',
      'Analyzed support metrics and ticket trends to identify opportunities for process improvement, streamlining escalation paths, and reducing average resolution time.',
    ],
  },
  {
    id: createId(),
    company: 'Intuit',
    location: 'Remote',
    position: '',
    startDate: '2022-08',
    endDate: '2024-08',
    current: false,
    description: '',
    highlights: [
      'Provided daily Tier-2 application support across internal FinTech platforms, triaging issues in Ruby on Rails, Java, and React applications to maintain seamless operations for global teams.',
      'Tracked, categorized, and escalated incidents using JIRA, ensuring developers had clear reproduction steps and actionable information to resolve bugs efficiently.',
      'Performed database analysis and schema modifications for MySQL and MongoDB during system upgrades, ensuring consistent data integrity across multiple applications.',
      'Validated backend services and message queues using RabbitMQ, identifying bottlenecks and ensuring high system availability for mission-critical workflows.',
      'Collaborated with engineering to address gaps in error handling and support processes, contributing to internal tooling improvements and streamlined troubleshooting.',
      'Developed test scripts for regression and integration testing, verifying that fixes and new releases met operational requirements before deployment.',
      'Created detailed documentation for support procedures, internal troubleshooting guides, and training materials for onboarding new support engineers.',
      'Assisted internal teams with operational support for critical payment workflows, ensuring timely resolution of system errors affecting user transactions.',
      'Proactively identified areas for support process improvement, including ticket categorization, workflow automation, and knowledge base updates to improve response times.',
    ],
  },
  {
    id: createId(),
    company: 'Tai Software',
    location: 'Huntington Beach, CA',
    position: '',
    startDate: '2018-06',
    endDate: '2022-08',
    current: false,
    description: '',
    highlights: [
      'Executed application support and QA testing for SaaS and web-based platforms, ensuring system stability and resolving production issues in collaboration with engineering and product teams.',
      'Maintained structured test cases, fixtures, and regression scripts to validate frontend functionality in React and backend services in Ruby and Java applications.',
      'Monitored and analyzed database performance in MySQL and MongoDB, identifying bottlenecks and assisting with schema updates during application releases.',
      'Collaborated cross-functionally to diagnose complex system failures, document reproducible steps, and provide actionable feedback for resolution in a timely manner.',
      'Developed scripts and automated tasks to assist in recurring support functions, reducing manual workload and improving overall system reliability.',
      'Assisted with deployment verification, validating configuration management standards, testing new releases, and ensuring seamless application updates across environments.',
      'Provided user support and internal staff training, enhancing knowledge of applications and promoting faster resolution of common issues for the operations team.',
    ],
  },
  {
    id: createId(),
    company: 'Tai Software',
    location: 'Huntington Beach, CA',
    position: '',
    startDate: '2016-06',
    endDate: '2018-06',
    current: false,
    description: '',
    highlights: [
      'Assisted senior engineers with application support tasks, monitoring logs, analyzing backend errors, and triaging user-reported issues in a multi-tier SaaS environment.',
      'Performed functional and regression testing of Ruby, Java, and React-based applications, helping ensure features met specifications and were free of critical defects.',
      'Documented recurring issues and contributed to knowledge base articles for internal staff, improving troubleshooting efficiency and onboarding speed.',
      'Assisted with database verification and minor schema modifications in MySQL and MongoDB during release cycles, ensuring data consistency.',
      'Supported debugging of RabbitMQ message queues and backend services, identifying potential system failures and escalating complex issues to senior engineers.',
      'Collaborated with cross-functional teams to reproduce and analyze user-reported issues, providing actionable insights for resolution in production systems.',
      'Participated in deployment validation and configuration verification, helping maintain system stability during new release rollouts.',
    ],
  },
];

const createDefaultEducation = (): Education[] => [
  {
    id: createId(),
    institution: 'UC Irvine',
    degree: "Bachelor's Degree",
    field: 'Computer Science',
    startDate: '2012',
    endDate: '2016',
    gpa: '',
    description: '',
  },
];

const createDefaultSkills = (): Skill[] => [
  {
    id: createId(),
    category: 'Application Support & Troubleshooting',
    items: 'Tier-1/Tier-2 Issue Resolution, Incident Management, Root Cause Analysis, Production Issue Triage, Release & Patch Support, Knowledge Transfer',
  },
  {
    id: createId(),
    category: 'Backend & Databases',
    items: 'Ruby on Rails, Java, MySQL, MongoDB, Redis, RabbitMQ, SQL, NoSQL, Database Schema Changes, Data Migration, Performance Tuning',
  },
  {
    id: createId(),
    category: 'Frontend & Web',
    items: 'React, HTML, CSS, JavaScript, Frontend Debugging, Browser/Platform Testing, SPA Troubleshooting',
  },
  {
    id: createId(),
    category: 'Monitoring & Deployment Tools',
    items: 'CI/CD Pipelines, Version Control (Git), Deployment Automation, Application Configuration, System Logs Analysis',
  },
  {
    id: createId(),
    category: 'Collaboration & Communication',
    items: 'Cross-Functional Team Collaboration, Documentation, Ticketing System Optimization (JIRA), Process Improvement, User Training',
  },
  {
    id: createId(),
    category: 'Analytical & Problem-Solving',
    items: 'System Diagnostics, Workflow Optimization, Escalation Handling, Error Categorization, Metrics & Reporting',
  },
];

// ─── ALBERT KONG DEFAULTS ───────────────────────────────────────────────────

const albertPersonalInfo: PersonalInfo = {
  fullName: 'Albert Kong',
  email: 'albertkong211@gmail.com',
  phone: '(929) 309-1138',
  address: 'Austin, TX 78701',
  linkedin: '',
  website: '',
  summary: '',
};

const createAlbertWorkExperience = (): WorkExperience[] => [
  {
    id: createId(),
    company: 'Google',
    location: 'Austin, TX',
    position: '',
    startDate: 'May 2024',
    endDate: '',
    current: true,
    description: '',
    highlights: [],
  },
  {
    id: createId(),
    company: 'Ladder',
    location: 'Remote',
    position: '',
    startDate: 'Aug 2022',
    endDate: 'May 2024',
    current: false,
    description: '',
    highlights: [],
  },
  {
    id: createId(),
    company: 'Roblox',
    location: 'San Mateo, CA',
    position: '',
    startDate: 'Aug 2019',
    endDate: 'Aug 2022',
    current: false,
    description: '',
    highlights: [],
  },
  {
    id: createId(),
    company: 'HackIllinois',
    location: 'Champaign, IL',
    position: '',
    startDate: 'Jun 2018',
    endDate: 'Aug 2019',
    current: false,
    description: '',
    highlights: [],
  },
];

const createAlbertEducation = (): Education[] => [
  {
    id: createId(),
    institution: 'University of Illinois Urbana-Champaign',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2014',
    endDate: '2018',
    gpa: '',
    description: '',
  },
];

const createAlbertSkills = (): Skill[] => [
  {
    id: createId(),
    category: 'Languages',
    items: 'Java, Go, C++, Python, TypeScript, JavaScript, Lua, SQL',
  },
  {
    id: createId(),
    category: 'Cloud & Infrastructure',
    items: 'Google Cloud Platform, BigQuery, Spanner, GKE, Kubernetes, Docker, Cloud Functions, Pub/Sub',
  },
  {
    id: createId(),
    category: 'Frontend & Web',
    items: 'React, TypeScript, Angular, GraphQL, REST APIs, HTML, CSS',
  },
  {
    id: createId(),
    category: 'Backend & Data',
    items: 'Node.js, gRPC, Protocol Buffers, PostgreSQL, Redis, Kafka, Data Pipelines',
  },
  {
    id: createId(),
    category: 'Tools & Practices',
    items: 'Git, CI/CD, Agile/Scrum, Code Review, Unit Testing, Integration Testing',
  },
  {
    id: createId(),
    category: 'Systems & Architecture',
    items: 'Distributed Systems, Microservices, Real-Time Systems, Performance Optimization, System Design',
  },
];

// ─── TANNER BARTON DEFAULTS ─────────────────────────────────────────────────

const tannerPersonalInfo: PersonalInfo = {
  fullName: 'Tanner Barton',
  email: 'tannerbarton011@gmail.com',
  phone: '(929) 338-6310',
  address: 'Austin, TX 78738',
  linkedin: '',
  website: '',
  summary: '',
};

const createTannerWorkExperience = (): WorkExperience[] => [
  {
    id: createId(),
    company: 'Google',
    location: 'Austin, TX',
    position: '',
    startDate: 'May 2024',
    endDate: '',
    current: true,
    description: '',
    highlights: [],
  },
  {
    id: createId(),
    company: 'Amazon',
    location: 'Seattle, WA',
    position: '',
    startDate: 'Aug 2020',
    endDate: 'May 2024',
    current: false,
    description: '',
    highlights: [],
  },
  {
    id: createId(),
    company: 'HackIllinois',
    location: 'Champaign, IL',
    position: '',
    startDate: 'Jun 2018',
    endDate: 'Aug 2020',
    current: false,
    description: '',
    highlights: [],
  },
];

const createTannerEducation = (): Education[] => [
  {
    id: createId(),
    institution: 'Brigham Young University',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2014',
    endDate: '2018',
    gpa: '',
    description: '',
  },
];

const createTannerSkills = (): Skill[] => [
  {
    id: createId(),
    category: 'Languages',
    items: 'Java, Go, Python, C++, TypeScript, JavaScript, SQL',
  },
  {
    id: createId(),
    category: 'Cloud & Infrastructure',
    items: 'AWS, GCP, EC2, S3, Lambda, DynamoDB, Kubernetes, Docker, CloudFormation',
  },
  {
    id: createId(),
    category: 'Frontend & Web',
    items: 'React, TypeScript, Angular, HTML, CSS, REST APIs, GraphQL',
  },
  {
    id: createId(),
    category: 'Backend & Data',
    items: 'Node.js, gRPC, Kinesis, SQS, SNS, PostgreSQL, Redis, Kafka',
  },
  {
    id: createId(),
    category: 'Tools & Practices',
    items: 'Git, CI/CD, CDK, Terraform, Agile/Scrum, Code Review, Testing',
  },
  {
    id: createId(),
    category: 'Systems & Architecture',
    items: 'Distributed Systems, Microservices, System Design, Performance Optimization, Scalability',
  },
];

// ─── HAO NGUYEN DEFAULTS ────────────────────────────────────────────────────

const haoPersonalInfo: PersonalInfo = {
  fullName: 'Hao Nguyen',
  email: 'nyugenhao2206@gmail.com',
  phone: '(929) 309-1284',
  address: 'Forney, TX 75126',
  linkedin: '',
  website: '',
  summary: '',
};

const createHaoWorkExperience = (): WorkExperience[] => [
  {
    id: createId(),
    company: 'Fiserv',
    location: 'Remote',
    position: '',
    startDate: 'Jan 2024',
    endDate: '',
    current: true,
    description: '',
    highlights: [],
  },
  {
    id: createId(),
    company: 'Aperia Solutions, Inc.',
    location: 'Remote',
    position: '',
    startDate: 'Aug 2021',
    endDate: 'Jan 2024',
    current: false,
    description: '',
    highlights: [],
  },
  {
    id: createId(),
    company: 'Cognizant',
    location: 'Dallas, TX',
    position: '',
    startDate: 'Apr 2017',
    endDate: 'Aug 2021',
    current: false,
    description: '',
    highlights: [],
  },
  {
    id: createId(),
    company: 'Tutor Doctor',
    location: 'Dallas, TX',
    position: '',
    startDate: 'Feb 2016',
    endDate: 'Mar 2017',
    current: false,
    description: '',
    highlights: [],
  },
];

const createHaoEducation = (): Education[] => [
  {
    id: createId(),
    institution: 'Texas Tech University',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2017',
    endDate: '2019',
    gpa: '',
    description: '',
  },
  {
    id: createId(),
    institution: 'Lone Star College',
    degree: 'Associate of Science',
    field: 'Computer Science',
    startDate: '2014',
    endDate: '2017',
    gpa: '',
    description: '',
  },
];

const createHaoSkills = (): Skill[] => [
  {
    id: createId(),
    category: 'Languages',
    items: 'Java, Python, JavaScript, TypeScript, C#, SQL',
  },
  {
    id: createId(),
    category: 'Cloud & Infrastructure',
    items: 'AWS, Azure, Docker, Kubernetes, CI/CD, CloudFormation, Terraform',
  },
  {
    id: createId(),
    category: 'Frontend & Web',
    items: 'React, Angular, HTML, CSS, REST APIs, GraphQL',
  },
  {
    id: createId(),
    category: 'Backend & Data',
    items: 'Spring Boot, Node.js, .NET, Kafka, PostgreSQL, Oracle, SQL Server, Redis',
  },
  {
    id: createId(),
    category: 'Tools & Practices',
    items: 'Git, JIRA, Agile/Scrum, Code Review, Unit Testing, Integration Testing',
  },
  {
    id: createId(),
    category: 'Domain & Architecture',
    items: 'Microservices, Payment Processing, Financial Services, System Design, PCI Compliance',
  },
];

// ─── CHRIS (SONGPEI) YANG DEFAULTS ─────────────────────────────────────────

const chrisPersonalInfo: PersonalInfo = {
  fullName: 'Chris (Songpei) Yang',
  email: 'rt3537573@gmail.com',
  phone: '(814) 313-3170',
  address: 'Mckinney, TX 75071',
  linkedin: '',
  website: '',
  summary: '',
};

const createChrisWorkExperience = (): WorkExperience[] => [
  {
    id: createId(),
    company: 'ServiceNow',
    location: 'Remote',
    position: '',
    startDate: 'Jan 2022',
    endDate: '',
    current: true,
    description: '',
    highlights: [],
  },
  {
    id: createId(),
    company: 'J.P. Morgan',
    location: 'Remote',
    position: '',
    startDate: 'Sep 2021',
    endDate: 'Jan 2022',
    current: false,
    description: '',
    highlights: [],
  },
  {
    id: createId(),
    company: 'Bank of America',
    location: 'Remote',
    position: '',
    startDate: 'Oct 2017',
    endDate: 'Aug 2021',
    current: false,
    description: '',
    highlights: [],
  },
];

const createChrisEducation = (): Education[] => [
  {
    id: createId(),
    institution: 'The University of Georgia',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2013',
    endDate: '2017',
    gpa: '',
    description: '',
  },
];

const createChrisSkills = (): Skill[] => [
  {
    id: createId(),
    category: '',
    items: 'Java  •  JavaScript  •  TypeScript  •  Python  •  C#  •  SQL  •  Spring Boot  •  Node.js  •  .NET  •  React  •  Angular  •  REST APIs  •  GraphQL  •  ServiceNow Platform  •  Flow Designer  •  IntegrationHub  •  CMDB  •  ITSM  •  Glide API  •  AWS  •  Azure  •  Docker  •  Kubernetes  •  Kafka  •  Oracle  •  PostgreSQL  •  SQL Server  •  Redis  •  CI/CD  •  Jenkins  •  Terraform  •  Git  •  JIRA  •  Agile/Scrum',
  },
];

// ─── PROFILE DEFAULTS ───────────────────────────────────────────────────────

const getProfileDefaults = (profile: ProfileName) => {
  if (profile === 'albert') {
    return {
      personalInfo: { ...albertPersonalInfo },
      workExperience: createAlbertWorkExperience(),
      education: createAlbertEducation(),
      certifications: [] as Certification[],
      skills: createAlbertSkills(),
    };
  }
  if (profile === 'tanner') {
    return {
      personalInfo: { ...tannerPersonalInfo },
      workExperience: createTannerWorkExperience(),
      education: createTannerEducation(),
      certifications: [] as Certification[],
      skills: createTannerSkills(),
    };
  }
  if (profile === 'hao') {
    return {
      personalInfo: { ...haoPersonalInfo },
      workExperience: createHaoWorkExperience(),
      education: createHaoEducation(),
      certifications: [] as Certification[],
      skills: createHaoSkills(),
    };
  }
  if (profile === 'chris') {
    return {
      personalInfo: { ...chrisPersonalInfo },
      workExperience: createChrisWorkExperience(),
      education: createChrisEducation(),
      certifications: [] as Certification[],
      skills: createChrisSkills(),
    };
  }
  return {
    personalInfo: { ...defaultPersonalInfo },
    workExperience: createDefaultWorkExperience(),
    education: createDefaultEducation(),
    certifications: [] as Certification[],
    skills: createDefaultSkills(),
  };
};

const PROFILE_TEMPLATE: Record<ProfileName, TemplateName> = {
  allen: 'classic',
  albert: 'sidebar',
  tanner: 'creative',
  hao: 'modern',
  chris: 'executive',
};

const getDefaultState = (profile: ProfileName = 'allen') => ({
  selectedProfile: profile,
  ...getProfileDefaults(profile),
  jobDescription: '',
  selectedTemplate: PROFILE_TEMPLATE[profile],
  mainTitle: '',
  generationStatus: 'idle' as const,
  generationError: null as string | null,
  aiWarnings: [] as AiWarning[],
});

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      ...getDefaultState(),

      setProfile: (profile) => {
        const defaults = getDefaultState(profile);
        set(defaults);
      },

      updatePersonalInfo: (info) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...info },
        })),

      addWorkExperience: () =>
        set((state) => ({
          workExperience: [
            ...state.workExperience,
            {
              id: createId(),
              company: '',
              location: '',
              position: '',
              startDate: '',
              endDate: '',
              current: false,
              description: '',
              highlights: [],
            },
          ],
        })),

      updateWorkExperience: (id, data) =>
        set((state) => ({
          workExperience: state.workExperience.map((w) =>
            w.id === id ? { ...w, ...data } : w
          ),
        })),

      removeWorkExperience: (id) =>
        set((state) => ({
          workExperience: state.workExperience.filter((w) => w.id !== id),
        })),

      addEducation: () =>
        set((state) => ({
          education: [
            ...state.education,
            {
              id: createId(),
              institution: '',
              degree: '',
              field: '',
              startDate: '',
              endDate: '',
              gpa: '',
              description: '',
            },
          ],
        })),

      updateEducation: (id, data) =>
        set((state) => ({
          education: state.education.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        })),

      removeEducation: (id) =>
        set((state) => ({
          education: state.education.filter((e) => e.id !== id),
        })),

      addCertification: () =>
        set((state) => ({
          certifications: [
            ...state.certifications,
            {
              id: createId(),
              name: '',
              issuer: '',
              date: '',
              url: '',
            },
          ],
        })),

      updateCertification: (id, data) =>
        set((state) => ({
          certifications: state.certifications.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      removeCertification: (id) =>
        set((state) => ({
          certifications: state.certifications.filter((c) => c.id !== id),
        })),

      addSkill: () =>
        set((state) => ({
          skills: [
            ...state.skills,
            {
              id: createId(),
              category: '',
              items: '',
            },
          ],
        })),

      updateSkill: (id, data) =>
        set((state) => ({
          skills: state.skills.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),

      removeSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),

      setJobDescription: (desc) => set({ jobDescription: desc }),

      setTemplate: (template) => set({ selectedTemplate: template }),

      generateFromJobDescription: async (jd: string) => {
        set({ generationStatus: 'generating', generationError: null, aiWarnings: [] });
        try {
          const result = await generateResume(jd, get().selectedProfile);

          // Map warnings
          const warnings = result.warnings || [];

          // Map work experience
          const workExperience: WorkExperience[] = result.workExperience.map((we) => ({
            id: createId(),
            company: we.company,
            location: we.location,
            position: we.position,
            startDate: we.startDate,
            endDate: we.endDate,
            current: we.current,
            description: '',
            highlights: we.highlights,
          }));

          // Map skills
          const skills: Skill[] = result.skills.map((s) => ({
            id: createId(),
            category: s.category,
            items: s.items,
          }));

          // Map education
          const education: Education[] = result.education.map((e) => ({
            id: createId(),
            institution: e.institution,
            degree: e.degree,
            field: e.field,
            startDate: e.startDate,
            endDate: e.endDate,
            gpa: '',
            description: '',
          }));

          set((state) => ({
            personalInfo: { ...state.personalInfo, summary: result.summary },
            workExperience,
            skills,
            education,
            mainTitle: result.title,
            aiWarnings: warnings,
            generationStatus: 'success',
            generationError: null,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ generationStatus: 'error', generationError: message });
        }
      },

      clearGeneration: () => {
        const profile = get().selectedProfile;
        const defaults = getProfileDefaults(profile);
        set({
          ...defaults,
          mainTitle: '',
          generationStatus: 'idle',
          generationError: null,
          aiWarnings: [],
        });
      },

      resetToDefaults: () => {
        const profile = get().selectedProfile;
        set(getDefaultState(profile));
      },
    }),
    {
      name: 'resume-builder-storage-v3',
      partialize: (state) => ({
        selectedProfile: state.selectedProfile,
        personalInfo: state.personalInfo,
        workExperience: state.workExperience,
        education: state.education,
        certifications: state.certifications,
        skills: state.skills,
        jobDescription: state.jobDescription,
        selectedTemplate: state.selectedTemplate,
        mainTitle: state.mainTitle,
      }),
    }
  )
);
