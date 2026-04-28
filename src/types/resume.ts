export interface PersonalInfo {
  fullName: string;
  title: string;
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

export type TemplateName = 'classic' | 'executive' | 'sidebar' | 'minimal' | 'professional' | 'elegant' | 'bold' | 'accent' | 'creative' | 'modern' | 'clean' | 'impact' | 'warmth' | 'corporate';

export type ProfileName = 'allen' | 'chris' | 'henry' | 'alex' | 'saurav' | 'chrislin' | 'david' | 'beka' | 'tanner' | 'hao' | 'peter' | 'albert' | 'thomas' | 'davidwu' | 'degao';

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  selectedTemplate: TemplateName;
}
