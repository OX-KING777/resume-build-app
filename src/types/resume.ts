export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  location: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Skill {
  id: string;
  category: string;
  items: string;
}

export type TemplateName = 'classic' | 'modern' | 'minimal' | 'creative' | 'executive' | 'sidebar';

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  jobDescription: string;
  selectedTemplate: TemplateName;
}

export interface AiSuggestions {
  summary?: string;
  workExperience?: Array<{
    id: string;
    description?: string;
    highlights?: string[];
  }>;
  skills?: string[];
}

export interface AiWarning {
  type: 'clearance' | 'onsite';
  message: string;
}

export interface GeneratedResume {
  title: string;
  summary: string;
  skills: Array<{ category: string; items: string }>;
  workExperience: Array<{
    company: string;
    location: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  warnings: AiWarning[];
}
