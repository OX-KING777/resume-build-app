import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PersonalInfo,
  WorkExperience,
  Education,
  Certification,
  Skill,
  TemplateName,
  ProfileName,
} from '@/types/resume';

interface ResumeState {
  selectedProfile: ProfileName;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  selectedTemplate: TemplateName;

  setProfile: (profile: ProfileName) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, data: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  setTemplate: (template: TemplateName) => void;
  resetToDefaults: () => void;
}

const createId = () => crypto.randomUUID();

// ─── ALLEN WANG DEFAULTS ──────────────────────────────────────────────────

const allenPersonalInfo: PersonalInfo = {
  fullName: 'Allen Wang',
  email: 'allenwang4117@gmail.com',
  phone: '(484) 521-9645',
  address: 'Brookline, MA 02446',
  linkedin: '',
  website: '',
  summary: '',
};

const createAllenWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Intuit', location: 'Remote', position: '', startDate: '2024-08', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Intuit', location: 'Remote', position: '', startDate: '2022-08', endDate: '2024-08', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Tai Software', location: 'Huntington Beach, CA', position: '', startDate: '2018-06', endDate: '2022-08', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Tai Software', location: 'Huntington Beach, CA', position: '', startDate: '2016-06', endDate: '2018-06', current: false, description: '', highlights: [] },
];

const createAllenEducation = (): Education[] => [
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

const createAllenSkills = (): Skill[] => [];

// ─── CHRIS YANG DEFAULTS ──────────────────────────────────────────────────

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
  { id: createId(), company: 'ServiceNow', location: 'Remote', position: '', startDate: 'Jan 2022', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'J.P. Morgan', location: 'Remote', position: '', startDate: 'Sep 2021', endDate: 'Jan 2022', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Bank of America', location: 'Remote', position: '', startDate: 'Oct 2017', endDate: 'Aug 2021', current: false, description: '', highlights: [] },
];

const createChrisEducation = (): Education[] => [
  { id: createId(), institution: 'The University of Georgia', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2013', endDate: '2017', gpa: '', description: '' },
];

const createChrisSkills = (): Skill[] => [
  { id: createId(), category: '', items: 'Java  •  JavaScript  •  TypeScript  •  Python  •  C#  •  SQL  •  Spring Boot  •  Node.js  •  .NET  •  React  •  Angular  •  REST APIs  •  GraphQL  •  ServiceNow Platform  •  Flow Designer  •  IntegrationHub  •  CMDB  •  ITSM  •  Glide API  •  AWS  •  Azure  •  Docker  •  Kubernetes  •  Kafka  •  Oracle  •  PostgreSQL  •  SQL Server  •  Redis  •  CI/CD  •  Jenkins  •  Terraform  •  Git  •  JIRA  •  Agile/Scrum' },
];

// ─── HENRY YANG DEFAULTS ──────────────────────────────────────────────────

const henryPersonalInfo: PersonalInfo = {
  fullName: 'Henry Yang',
  email: 'henryyang@gmail.com',
  phone: '(929) 555-0142',
  address: 'San Francisco, CA 94102',
  linkedin: '',
  website: '',
  summary: '',
};

const createHenryWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Meta', location: 'Menlo Park, CA', position: '', startDate: 'Jun 2023', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Stripe', location: 'San Francisco, CA', position: '', startDate: 'Mar 2021', endDate: 'Jun 2023', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Palantir', location: 'Palo Alto, CA', position: '', startDate: 'Aug 2018', endDate: 'Mar 2021', current: false, description: '', highlights: [] },
];

const createHenryEducation = (): Education[] => [
  { id: createId(), institution: 'Stanford University', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2014', endDate: '2018', gpa: '', description: '' },
];

const createHenrySkills = (): Skill[] => [
  { id: createId(), category: 'Languages', items: 'Python, Java, C++, Go, TypeScript, SQL' },
  { id: createId(), category: 'Cloud & Infrastructure', items: 'AWS, GCP, Docker, Kubernetes, Terraform, CI/CD' },
  { id: createId(), category: 'Frontend & Web', items: 'React, TypeScript, GraphQL, REST APIs, HTML, CSS' },
  { id: createId(), category: 'Backend & Data', items: 'Node.js, Django, PostgreSQL, Redis, Kafka, gRPC' },
  { id: createId(), category: 'Tools & Practices', items: 'Git, Agile/Scrum, Code Review, System Design, Testing' },
];

// ─── ALEX LIN DEFAULTS ────────────────────────────────────────────────────

const alexPersonalInfo: PersonalInfo = {
  fullName: 'Alex Lin',
  email: 'alexlin@gmail.com',
  phone: '(929) 555-0198',
  address: 'Seattle, WA 98101',
  linkedin: '',
  website: '',
  summary: '',
};

const createAlexWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Microsoft', location: 'Redmond, WA', position: '', startDate: 'Aug 2022', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Tableau', location: 'Seattle, WA', position: '', startDate: 'Jan 2020', endDate: 'Aug 2022', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Zillow', location: 'Seattle, WA', position: '', startDate: 'Jun 2017', endDate: 'Jan 2020', current: false, description: '', highlights: [] },
];

const createAlexEducation = (): Education[] => [
  { id: createId(), institution: 'University of Washington', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2013', endDate: '2017', gpa: '', description: '' },
];

const createAlexSkills = (): Skill[] => [
  { id: createId(), category: 'Languages', items: 'C#, TypeScript, Python, Java, SQL' },
  { id: createId(), category: 'Cloud & Infrastructure', items: 'Azure, AWS, Docker, Kubernetes, CI/CD, Terraform' },
  { id: createId(), category: 'Frontend & Web', items: 'React, Angular, TypeScript, HTML, CSS, REST APIs' },
  { id: createId(), category: 'Backend & Data', items: '.NET, Node.js, PostgreSQL, SQL Server, Redis, Cosmos DB' },
  { id: createId(), category: 'Tools & Practices', items: 'Git, Azure DevOps, Agile/Scrum, Code Review, Testing' },
];

// ─── SAURAV KUMAR DEFAULTS ────────────────────────────────────────────────

const sauravPersonalInfo: PersonalInfo = {
  fullName: 'Saurav Kumar',
  email: 'sauravkumar@gmail.com',
  phone: '(929) 555-0256',
  address: 'Chicago, IL 60601',
  linkedin: '',
  website: '',
  summary: '',
};

const createSauravWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Salesforce', location: 'Chicago, IL', position: '', startDate: 'Apr 2023', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Deloitte', location: 'Chicago, IL', position: '', startDate: 'Jul 2020', endDate: 'Apr 2023', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Accenture', location: 'Chicago, IL', position: '', startDate: 'Jan 2018', endDate: 'Jul 2020', current: false, description: '', highlights: [] },
];

const createSauravEducation = (): Education[] => [
  { id: createId(), institution: 'University of Illinois at Chicago', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2014', endDate: '2018', gpa: '', description: '' },
];

const createSauravSkills = (): Skill[] => [
  { id: createId(), category: 'Languages', items: 'Java, Python, JavaScript, TypeScript, SQL' },
  { id: createId(), category: 'Cloud & Infrastructure', items: 'AWS, Salesforce Cloud, Docker, Kubernetes, CI/CD' },
  { id: createId(), category: 'Frontend & Web', items: 'React, Angular, Lightning Web Components, HTML, CSS' },
  { id: createId(), category: 'Backend & Data', items: 'Spring Boot, Node.js, PostgreSQL, DynamoDB, Redis, Kafka' },
  { id: createId(), category: 'Tools & Practices', items: 'Git, JIRA, Agile/Scrum, Apex, SOQL, Integration Testing' },
];

// ─── CHRIS LIN DEFAULTS ──────────────────────────────────────────────────

const chrislinPersonalInfo: PersonalInfo = {
  fullName: 'Chris Lin',
  email: 'chrislin@gmail.com',
  phone: '(929) 555-0312',
  address: 'New York, NY 10001',
  linkedin: '',
  website: '',
  summary: '',
};

const createChrislinWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Bloomberg', location: 'New York, NY', position: '', startDate: 'Sep 2022', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Goldman Sachs', location: 'New York, NY', position: '', startDate: 'Jun 2019', endDate: 'Sep 2022', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Capital One', location: 'McLean, VA', position: '', startDate: 'Aug 2016', endDate: 'Jun 2019', current: false, description: '', highlights: [] },
];

const createChrislinEducation = (): Education[] => [
  { id: createId(), institution: 'Columbia University', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2012', endDate: '2016', gpa: '', description: '' },
];

const createChrislinSkills = (): Skill[] => [
  { id: createId(), category: 'Languages', items: 'Java, Python, C++, JavaScript, TypeScript, SQL' },
  { id: createId(), category: 'Cloud & Infrastructure', items: 'AWS, Docker, Kubernetes, Terraform, Jenkins, CI/CD' },
  { id: createId(), category: 'Frontend & Web', items: 'React, TypeScript, Angular, GraphQL, REST APIs' },
  { id: createId(), category: 'Backend & Data', items: 'Spring Boot, Node.js, PostgreSQL, Oracle, Redis, Kafka' },
  { id: createId(), category: 'Domain', items: 'Financial Services, Market Data Systems, Low-Latency Trading, Bloomberg Terminal' },
];

// ─── DAVID PALOMINO DEFAULTS ──────────────────────────────────────────────

const davidPersonalInfo: PersonalInfo = {
  fullName: 'David Palomino',
  email: 'davidpalomino@gmail.com',
  phone: '(929) 555-0478',
  address: 'Denver, CO 80202',
  linkedin: '',
  website: '',
  summary: '',
};

const createDavidWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Lockheed Martin', location: 'Denver, CO', position: '', startDate: 'Mar 2023', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Raytheon', location: 'Aurora, CO', position: '', startDate: 'Jul 2020', endDate: 'Mar 2023', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Northrop Grumman', location: 'Colorado Springs, CO', position: '', startDate: 'Jan 2018', endDate: 'Jul 2020', current: false, description: '', highlights: [] },
];

const createDavidEducation = (): Education[] => [
  { id: createId(), institution: 'University of Colorado Boulder', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2014', endDate: '2018', gpa: '', description: '' },
];

const createDavidSkills = (): Skill[] => [
  { id: createId(), category: 'Languages', items: 'C++, Python, Java, Rust, SQL' },
  { id: createId(), category: 'Cloud & Infrastructure', items: 'AWS GovCloud, Docker, Kubernetes, Terraform, CI/CD' },
  { id: createId(), category: 'Systems', items: 'Embedded Systems, Real-Time Processing, Linux, RTOS' },
  { id: createId(), category: 'Backend & Data', items: 'PostgreSQL, Redis, Kafka, gRPC, Protocol Buffers' },
  { id: createId(), category: 'Tools & Practices', items: 'Git, JIRA, Agile/Scrum, Security Clearance, System Design' },
];

// ─── BEKA LATSABIDZE DEFAULTS ─────────────────────────────────────────────

const bekaPersonalInfo: PersonalInfo = {
  fullName: 'Beka Latsabidze',
  email: 'bekalatsabidze@gmail.com',
  phone: '(929) 555-0534',
  address: 'Portland, OR 97201',
  linkedin: '',
  website: '',
  summary: '',
};

const createBekaWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Intel', location: 'Hillsboro, OR', position: '', startDate: 'May 2023', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Nike', location: 'Beaverton, OR', position: '', startDate: 'Aug 2020', endDate: 'May 2023', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Puppet', location: 'Portland, OR', position: '', startDate: 'Jun 2018', endDate: 'Aug 2020', current: false, description: '', highlights: [] },
];

const createBekaEducation = (): Education[] => [
  { id: createId(), institution: 'Oregon State University', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2014', endDate: '2018', gpa: '', description: '' },
];

const createBekaSkills = (): Skill[] => [
  { id: createId(), category: 'Languages', items: 'Python, JavaScript, TypeScript, Go, Ruby, SQL' },
  { id: createId(), category: 'Cloud & Infrastructure', items: 'AWS, Azure, Docker, Kubernetes, Terraform, Ansible' },
  { id: createId(), category: 'Frontend & Web', items: 'React, Vue.js, TypeScript, HTML, CSS, REST APIs' },
  { id: createId(), category: 'Backend & Data', items: 'Node.js, Django, PostgreSQL, MongoDB, Redis, RabbitMQ' },
  { id: createId(), category: 'Tools & Practices', items: 'Git, CI/CD, DevOps, Puppet, Configuration Management, Testing' },
];

// ─── TANNER BARTON DEFAULTS ───────────────────────────────────────────────

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
  { id: createId(), company: 'Google', location: 'Austin, TX', position: '', startDate: 'May 2024', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Amazon', location: 'Seattle, WA', position: '', startDate: 'Aug 2020', endDate: 'May 2024', current: false, description: '', highlights: [] },
  { id: createId(), company: 'HackIllinois', location: 'Champaign, IL', position: '', startDate: 'Jun 2018', endDate: 'Aug 2020', current: false, description: '', highlights: [] },
];

const createTannerEducation = (): Education[] => [
  { id: createId(), institution: 'Brigham Young University', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2014', endDate: '2018', gpa: '', description: '' },
];

const createTannerSkills = (): Skill[] => [
  { id: createId(), category: 'Languages', items: 'Java, Go, Python, C++, TypeScript, JavaScript, SQL' },
  { id: createId(), category: 'Cloud & Infrastructure', items: 'AWS, GCP, EC2, S3, Lambda, DynamoDB, Kubernetes, Docker, CloudFormation' },
  { id: createId(), category: 'Frontend & Web', items: 'React, TypeScript, Angular, HTML, CSS, REST APIs, GraphQL' },
  { id: createId(), category: 'Backend & Data', items: 'Node.js, gRPC, Kinesis, SQS, SNS, PostgreSQL, Redis, Kafka' },
  { id: createId(), category: 'Tools & Practices', items: 'Git, CI/CD, CDK, Terraform, Agile/Scrum, Code Review, Testing' },
  { id: createId(), category: 'Systems & Architecture', items: 'Distributed Systems, Microservices, System Design, Performance Optimization, Scalability' },
];

// ─── HAO NGUYEN DEFAULTS ──────────────────────────────────────────────────

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
  { id: createId(), company: 'Fiserv', location: 'Remote', position: '', startDate: 'Jan 2024', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Aperia Solutions, Inc.', location: 'Remote', position: '', startDate: 'Aug 2021', endDate: 'Jan 2024', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Cognizant', location: 'Dallas, TX', position: '', startDate: 'Apr 2017', endDate: 'Aug 2021', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Tutor Doctor', location: 'Dallas, TX', position: '', startDate: 'Feb 2016', endDate: 'Mar 2017', current: false, description: '', highlights: [] },
];

const createHaoEducation = (): Education[] => [
  { id: createId(), institution: 'Texas Tech University', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2017', endDate: '2019', gpa: '', description: '' },
  { id: createId(), institution: 'Lone Star College', degree: 'Associate of Science', field: 'Computer Science', startDate: '2014', endDate: '2017', gpa: '', description: '' },
];

const createHaoSkills = (): Skill[] => [
  { id: createId(), category: 'Languages', items: 'Java, Python, JavaScript, TypeScript, C#, SQL' },
  { id: createId(), category: 'Cloud & Infrastructure', items: 'AWS, Azure, Docker, Kubernetes, CI/CD, CloudFormation, Terraform' },
  { id: createId(), category: 'Frontend & Web', items: 'React, Angular, HTML, CSS, REST APIs, GraphQL' },
  { id: createId(), category: 'Backend & Data', items: 'Spring Boot, Node.js, .NET, Kafka, PostgreSQL, Oracle, SQL Server, Redis' },
  { id: createId(), category: 'Tools & Practices', items: 'Git, JIRA, Agile/Scrum, Code Review, Unit Testing, Integration Testing' },
  { id: createId(), category: 'Domain & Architecture', items: 'Microservices, Payment Processing, Financial Services, System Design, PCI Compliance' },
];

// ─── PROFILE DEFAULTS ─────────────────────────────────────────────────────

const PROFILE_TEMPLATE: Record<ProfileName, TemplateName> = {
  allen: 'classic',
  chris: 'executive',
  henry: 'sidebar',
  alex: 'minimal',
  saurav: 'professional',
  chrislin: 'elegant',
  david: 'bold',
  beka: 'accent',
  tanner: 'creative',
  hao: 'modern',
};

const getProfileDefaults = (profile: ProfileName) => {
  switch (profile) {
    case 'allen':
      return { personalInfo: { ...allenPersonalInfo }, workExperience: createAllenWorkExperience(), education: createAllenEducation(), certifications: [] as Certification[], skills: createAllenSkills() };
    case 'chris':
      return { personalInfo: { ...chrisPersonalInfo }, workExperience: createChrisWorkExperience(), education: createChrisEducation(), certifications: [] as Certification[], skills: createChrisSkills() };
    case 'henry':
      return { personalInfo: { ...henryPersonalInfo }, workExperience: createHenryWorkExperience(), education: createHenryEducation(), certifications: [] as Certification[], skills: createHenrySkills() };
    case 'alex':
      return { personalInfo: { ...alexPersonalInfo }, workExperience: createAlexWorkExperience(), education: createAlexEducation(), certifications: [] as Certification[], skills: createAlexSkills() };
    case 'saurav':
      return { personalInfo: { ...sauravPersonalInfo }, workExperience: createSauravWorkExperience(), education: createSauravEducation(), certifications: [] as Certification[], skills: createSauravSkills() };
    case 'chrislin':
      return { personalInfo: { ...chrislinPersonalInfo }, workExperience: createChrislinWorkExperience(), education: createChrislinEducation(), certifications: [] as Certification[], skills: createChrislinSkills() };
    case 'david':
      return { personalInfo: { ...davidPersonalInfo }, workExperience: createDavidWorkExperience(), education: createDavidEducation(), certifications: [] as Certification[], skills: createDavidSkills() };
    case 'beka':
      return { personalInfo: { ...bekaPersonalInfo }, workExperience: createBekaWorkExperience(), education: createBekaEducation(), certifications: [] as Certification[], skills: createBekaSkills() };
    case 'tanner':
      return { personalInfo: { ...tannerPersonalInfo }, workExperience: createTannerWorkExperience(), education: createTannerEducation(), certifications: [] as Certification[], skills: createTannerSkills() };
    case 'hao':
      return { personalInfo: { ...haoPersonalInfo }, workExperience: createHaoWorkExperience(), education: createHaoEducation(), certifications: [] as Certification[], skills: createHaoSkills() };
  }
};

const getDefaultState = (profile: ProfileName = 'allen') => ({
  selectedProfile: profile,
  ...getProfileDefaults(profile),
  selectedTemplate: PROFILE_TEMPLATE[profile],
});

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      ...getDefaultState(),

      setProfile: (profile) => {
        set(getDefaultState(profile));
      },

      updatePersonalInfo: (info) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...info },
        })),

      addWorkExperience: () =>
        set((state) => ({
          workExperience: [
            ...state.workExperience,
            { id: createId(), company: '', location: '', position: '', startDate: '', endDate: '', current: false, description: '', highlights: [] },
          ],
        })),

      updateWorkExperience: (id, data) =>
        set((state) => ({
          workExperience: state.workExperience.map((w) => w.id === id ? { ...w, ...data } : w),
        })),

      removeWorkExperience: (id) =>
        set((state) => ({
          workExperience: state.workExperience.filter((w) => w.id !== id),
        })),

      addEducation: () =>
        set((state) => ({
          education: [
            ...state.education,
            { id: createId(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' },
          ],
        })),

      updateEducation: (id, data) =>
        set((state) => ({
          education: state.education.map((e) => e.id === id ? { ...e, ...data } : e),
        })),

      removeEducation: (id) =>
        set((state) => ({
          education: state.education.filter((e) => e.id !== id),
        })),

      addCertification: () =>
        set((state) => ({
          certifications: [
            ...state.certifications,
            { id: createId(), name: '', issuer: '', date: '', url: '' },
          ],
        })),

      updateCertification: (id, data) =>
        set((state) => ({
          certifications: state.certifications.map((c) => c.id === id ? { ...c, ...data } : c),
        })),

      removeCertification: (id) =>
        set((state) => ({
          certifications: state.certifications.filter((c) => c.id !== id),
        })),

      addSkill: () =>
        set((state) => ({
          skills: [
            ...state.skills,
            { id: createId(), category: '', items: '' },
          ],
        })),

      updateSkill: (id, data) =>
        set((state) => ({
          skills: state.skills.map((s) => s.id === id ? { ...s, ...data } : s),
        })),

      removeSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),

      setTemplate: (template) => set({ selectedTemplate: template }),

      resetToDefaults: () => {
        const profile = get().selectedProfile;
        set(getDefaultState(profile));
      },
    }),
    {
      name: 'resume-builder-storage-v4',
      partialize: (state) => ({
        selectedProfile: state.selectedProfile,
        personalInfo: state.personalInfo,
        workExperience: state.workExperience,
        education: state.education,
        certifications: state.certifications,
        skills: state.skills,
        selectedTemplate: state.selectedTemplate,
      }),
    }
  )
);
