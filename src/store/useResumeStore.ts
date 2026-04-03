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
  companyName: string;

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
  setCompanyName: (name: string) => void;
  resetToDefaults: () => void;
  importFromJson: (jsonStr: string) => void;
}

const createId = () => crypto.randomUUID();

// ─── ALLEN WANG DEFAULTS ──────────────────────────────────────────────────

const allenPersonalInfo: PersonalInfo = {
  fullName: 'Allen Wang',
  title: '',
  email: 'allenwang4117@gmail.com',
  phone: '(484) 521-9645',
  address: 'Brookline, MA 02446',
  linkedin: '',
  website: '',
  summary: '',
};

const createAllenWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Intuit', location: 'Remote', position: '', startDate: 'Aug 2024', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Intuit', location: 'Remote', position: '', startDate: 'Aug 2022', endDate: 'Aug 2024', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Tai Software', location: 'Huntington Beach, CA', position: '', startDate: 'Jun 2018', endDate: 'Aug 2022', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Tai Software', location: 'Huntington Beach, CA', position: '', startDate: 'Jun 2016', endDate: 'Jun 2018', current: false, description: '', highlights: [] },
];

const createAllenEducation = (): Education[] => [
  {
    id: createId(),
    institution: 'UC Irvine',
    degree: "Bachelor's Degree",
    field: 'Computer Science',
    startDate: '2014',
    endDate: '2018',
    gpa: '',
    description: '',
  },
];

const createAllenSkills = (): Skill[] => [];

// ─── CHRIS YANG DEFAULTS ──────────────────────────────────────────────────

const chrisPersonalInfo: PersonalInfo = {
  fullName: 'Chris (Songpei) Yang',
  title: '',
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

const createChrisSkills = (): Skill[] => [];

// ─── HENRY YANG DEFAULTS ──────────────────────────────────────────────────

const henryPersonalInfo: PersonalInfo = {
  fullName: 'Henry Yang',
  title: '',
  email: 'henryyang661@gmail.com',
  phone: '(484) 476-0278',
  address: 'San Jose, CA 95110',
  linkedin: '',
  website: '',
  summary: '',
};

const createHenryWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Capgemini', location: 'Remote', position: '', startDate: 'Feb 2024', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'IBM', location: 'San Jose, CA', position: '', startDate: 'Jun 2021', endDate: 'Dec 2023', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Exabeam', location: 'Foster City, CA', position: '', startDate: 'Feb 2019', endDate: 'May 2021', current: false, description: '', highlights: [] },
  { id: createId(), company: 'AWS', location: 'San Diego, CA', position: '', startDate: 'Jun 2017', endDate: 'Dec 2018', current: false, description: '', highlights: [] },
];

const createHenryEducation = (): Education[] => [
  { id: createId(), institution: 'University of Pittsburgh', degree: 'Master of Science', field: 'Information Science', startDate: '2015', endDate: '2017', gpa: '', description: '' },
  { id: createId(), institution: 'Wuhan University', degree: 'Bachelor of Engineering', field: 'Information Security', startDate: '2011', endDate: '2015', gpa: '', description: '' },
];

const createHenrySkills = (): Skill[] => [];

// ─── ALEX LIN DEFAULTS ────────────────────────────────────────────────────

const alexPersonalInfo: PersonalInfo = {
  fullName: 'Alex Lin',
  title: '',
  email: 'futailin397@gmail.com',
  phone: '(929) 233-9976',
  address: 'Northridge, CA 91324',
  linkedin: 'https://www.linkedin.com/in/alex-futai-lin-47388b3a8/',
  website: '',
  summary: '',
};

const createAlexWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Intuit', location: '', position: 'Senior AI & ML Engineer | Data Scientist', startDate: 'Oct 2022', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'BlackLine', location: '', position: 'Senior Data Scientist | AI Engineer', startDate: 'Jan 2019', endDate: 'Oct 2022', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Facebook', location: '', position: 'Machine Learning Engineer', startDate: 'Dec 2017', endDate: 'Dec 2018', current: false, description: '', highlights: [] },
];

const createAlexEducation = (): Education[] => [
  { id: createId(), institution: 'Northeastern University', degree: "Master's Degree", field: 'Computer Science', startDate: '2016', endDate: '2017', gpa: '', description: '' },
  { id: createId(), institution: 'Dalian Jiaotong University', degree: "Bachelor's Degree", field: 'Computer Science', startDate: '2010', endDate: '2015', gpa: '', description: '' },
];

const createAlexSkills = (): Skill[] => [];

// ─── SAURAV KUMAR DEFAULTS ────────────────────────────────────────────────

const sauravPersonalInfo: PersonalInfo = {
  fullName: 'Saurav Kumar',
  title: '',
  email: 'kumarsaurav0991@gmail.com',
  phone: '(610) 244-1557',
  address: 'Houston, TX 77042',
  linkedin: 'https://www.linkedin.com/in/sauravkantkumar/',
  website: '',
  summary: '',
};

const createSauravWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'NVIDIA', location: 'Remote', position: '', startDate: 'Mar 2024', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'McKesson', location: 'Irving, TX', position: '', startDate: 'Jan 2021', endDate: 'Feb 2024', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Microsoft', location: 'Bengaluru, India', position: '', startDate: 'Dec 2018', endDate: 'Dec 2020', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Infosys', location: 'Bengaluru, India', position: '', startDate: 'Feb 2015', endDate: 'Oct 2018', current: false, description: '', highlights: [] },
];

const createSauravEducation = (): Education[] => [
  { id: createId(), institution: 'Illinois Institute of Technology', degree: "Master's Degree", field: 'Artificial Intelligence', startDate: 'Jan 2021', endDate: 'Dec 2022', gpa: '', description: '' },
  { id: createId(), institution: 'Assam University', degree: 'Bachelor of Technology', field: 'Information Technology', startDate: 'Mar 2010', endDate: 'Jul 2014', gpa: '', description: '' },
];

const createSauravSkills = (): Skill[] => [];

// ─── CHRIS LIN DEFAULTS ──────────────────────────────────────────────────

const chrislinPersonalInfo: PersonalInfo = {
  fullName: 'Chris Lin',
  title: '',
  email: 'yuxinglin3419@gmail.com',
  phone: '(484) 476-0096',
  address: 'Dublin, CA 94568',
  linkedin: 'https://www.linkedin.com/in/yuxing-lin-chris24/',
  website: '',
  summary: '',
};

const createChrislinWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Roblox', location: 'San Mateo, CA', position: '', startDate: 'Oct 2024', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Circle', location: 'San Francisco, CA', position: '', startDate: 'Nov 2021', endDate: 'Sep 2024', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Facebook', location: 'Menlo Park, CA', position: '', startDate: 'May 2017', endDate: 'Nov 2021', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Wells Fargo', location: 'San Francisco, CA', position: '', startDate: 'Nov 2015', endDate: 'Feb 2017', current: false, description: '', highlights: [] },
];

const createChrislinEducation = (): Education[] => [
  { id: createId(), institution: 'The University of New Mexico', degree: "Master's Degree", field: 'Computer Engineering', startDate: '2013', endDate: '2015', gpa: '', description: '' },
  { id: createId(), institution: 'Jiangnan University', degree: "Bachelor's Degree", field: 'Electronic and Communications Engineering Technologies', startDate: '2009', endDate: '2013', gpa: '', description: '' },
];

const createChrislinSkills = (): Skill[] => [];

// ─── DAVID PALOMINO DEFAULTS ──────────────────────────────────────────────

const davidPersonalInfo: PersonalInfo = {
  fullName: 'David Palomino',
  title: '',
  email: 'david.palomino2734@gmail.com',
  phone: '+31 686289639',
  address: 'Epe, Gelderland, Netherlands',
  linkedin: 'https://www.linkedin.com/in/davidpalomino2734/',
  website: '',
  summary: '',
};

const createDavidWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Software Mind', location: '', position: '', startDate: 'Nov 2023', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Parser', location: '', position: '', startDate: 'Sep 2020', endDate: 'Aug 2023', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Sintad', location: '', position: '', startDate: 'Nov 2017', endDate: 'Jul 2020', current: false, description: '', highlights: [] },
  { id: createId(), company: 'Sintad', location: '', position: '', startDate: 'Nov 2016', endDate: 'Oct 2017', current: false, description: '', highlights: [] },
];

const createDavidEducation = (): Education[] => [
  { id: createId(), institution: 'César Vallejo University', degree: "Bachelor's Degree", field: 'Computer Science', startDate: '2012', endDate: '2016', gpa: '', description: '' },
];

const createDavidSkills = (): Skill[] => [];

// ─── BEKA LATSABIDZE DEFAULTS ─────────────────────────────────────────────

const bekaPersonalInfo: PersonalInfo = {
  fullName: 'Beka Latsabidze',
  title: '',
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

const createBekaSkills = (): Skill[] => [];

// ─── TANNER BARTON DEFAULTS ───────────────────────────────────────────────

const tannerPersonalInfo: PersonalInfo = {
  fullName: 'Tanner Barton',
  title: '',
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

const createTannerSkills = (): Skill[] => [];

// ─── HAO NGUYEN DEFAULTS ──────────────────────────────────────────────────

const haoPersonalInfo: PersonalInfo = {
  fullName: 'Hao Nguyen',
  title: '',
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

const createHaoSkills = (): Skill[] => [];

// ─── PETER ADDO DEFAULTS ─────────────────────────────────────────────────

const peterPersonalInfo: PersonalInfo = {
  fullName: 'Peter Addo',
  title: '',
  email: 'peteraddo009@gmail.com',
  phone: '+372 5368 6335',
  address: 'Tallinn, Estonia',
  linkedin: 'https://www.linkedin.com/in/peter-addo-084440383/',
  website: '',
  summary: '',
};

const createPeterWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'UNHCR', location: '', position: '', startDate: 'Jan 2024', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'EMURGO', location: '', position: '', startDate: 'Jun 2022', endDate: 'Dec 2023', current: false, description: '', highlights: [] },
  { id: createId(), company: 'CLOUD NINE', location: '', position: '', startDate: 'May 2019', endDate: 'May 2022', current: false, description: '', highlights: [] },
  { id: createId(), company: 'DATAFOREST', location: '', position: '', startDate: 'Jul 2016', endDate: 'Jan 2019', current: false, description: '', highlights: [] },
];

const createPeterEducation = (): Education[] => [
  { id: createId(), institution: 'Estonian Entrepreneurship University of Applied Sciences', degree: 'Master of Science', field: 'Computer Science', startDate: '2013', endDate: '2015', gpa: '', description: '' },
  { id: createId(), institution: 'Estonian Entrepreneurship University of Applied Sciences', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2008', endDate: '2013', gpa: '', description: '' },
];

const createPeterSkills = (): Skill[] => [];

// ─── ALBERT KONG DEFAULTS ────────────────────────────────────────────────

const albertPersonalInfo: PersonalInfo = {
  fullName: 'Albert Kong',
  title: '',
  email: 'albertkong211@gmail.com',
  phone: '(929) 309-1138',
  address: 'Austin, TX 78701',
  linkedin: '',
  website: '',
  summary: '',
};

const createAlbertWorkExperience = (): WorkExperience[] => [
  { id: createId(), company: 'Capgemini', location: 'Remote', position: '', startDate: 'Apr 2024', endDate: '', current: true, description: '', highlights: [] },
  { id: createId(), company: 'Cognizant', location: 'Remote', position: '', startDate: 'May 2022', endDate: 'Mar 2024', current: false, description: '', highlights: [] },
  { id: createId(), company: 'AWS', location: 'Austin, TX', position: '', startDate: 'Sep 2021', endDate: 'Mar 2022', current: false, description: '', highlights: [] },
  { id: createId(), company: 'HackIllinois', location: 'Urbana, IL', position: '', startDate: 'Aug 2018', endDate: 'Sep 2021', current: false, description: '', highlights: [] },
];

const createAlbertEducation = (): Education[] => [
  { id: createId(), institution: 'University of Illinois Urbana-Champaign', degree: "Bachelor's of Science", field: 'Computer Engineering', startDate: '2018', endDate: '2021', gpa: '', description: '' },
  { id: createId(), institution: 'Wuhan University', degree: "Bachelor's Degree", field: 'Information Science', startDate: '2014', endDate: '2018', gpa: '', description: '' },
];

const createAlbertSkills = (): Skill[] => [];

// ─── PROFILE DEFAULTS ─────────────────────────────────────────────────────

const PROFILE_TEMPLATE: Record<ProfileName, TemplateName> = {
  allen: 'classic',
  chris: 'executive',
  henry: 'sidebar',
  alex: 'minimal',
  saurav: 'professional',
  chrislin: 'elegant',
  david: 'classic',
  beka: 'accent',
  tanner: 'clean',
  hao: 'modern',
  peter: 'clean',
  albert: 'impact',
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
    case 'peter':
      return { personalInfo: { ...peterPersonalInfo }, workExperience: createPeterWorkExperience(), education: createPeterEducation(), certifications: [] as Certification[], skills: createPeterSkills() };
    case 'albert':
      return { personalInfo: { ...albertPersonalInfo }, workExperience: createAlbertWorkExperience(), education: createAlbertEducation(), certifications: [] as Certification[], skills: createAlbertSkills() };
  }
};

const getDefaultState = (profile: ProfileName = 'allen') => ({
  selectedProfile: profile,
  ...getProfileDefaults(profile),
  selectedTemplate: PROFILE_TEMPLATE[profile],
  companyName: '',
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

      setCompanyName: (name) => set({ companyName: name }),

      resetToDefaults: () => {
        const profile = get().selectedProfile;
        set(getDefaultState(profile));
      },

      importFromJson: (jsonStr: string) => {
        const data = JSON.parse(jsonStr);
        const state = get();

        // Update Title & Summary
        if (data.Title || data.Summary) {
          set((s) => ({
            personalInfo: {
              ...s.personalInfo,
              ...(data.Title !== undefined && { title: data.Title }),
              ...(data.Summary !== undefined && { summary: data.Summary }),
            },
          }));
        }

        // Update Technical Skills
        if (data['Technical Skills']) {
          // Remove all existing skills
          for (const s of state.skills) {
            state.removeSkill(s.id);
          }
          // Add new ones from JSON
          const techSkills = data['Technical Skills'];
          for (const [category, items] of Object.entries(techSkills)) {
            const store = useResumeStore.getState();
            store.addSkill();
            const newSkills = useResumeStore.getState().skills;
            const lastSkill = newSkills[newSkills.length - 1];
            store.updateSkill(lastSkill.id, {
              category,
              items: Array.isArray(items) ? (items as string[]).join(', ') : String(items),
            });
          }
        }

        // Update Experience — match by company order (Company 1, Company 2, etc.)
        if (data.Experience) {
          const currentWork = useResumeStore.getState().workExperience;
          const experienceEntries = Object.keys(data.Experience)
            .sort() // Company 1, Company 2, Company 3, Company 4
            .map((key) => data.Experience[key]);

          for (let i = 0; i < Math.min(experienceEntries.length, currentWork.length); i++) {
            const entry = experienceEntries[i];
            const updates: Partial<WorkExperience> = {};
            if (entry['Role Title']) updates.position = entry['Role Title'];
            if (entry['Experience Content']) {
              updates.highlights = Array.isArray(entry['Experience Content'])
                ? entry['Experience Content']
                : [entry['Experience Content']];
            }
            useResumeStore.getState().updateWorkExperience(currentWork[i].id, updates);
          }
        }

      },
    }),
    {
      name: 'resume-builder-storage-v16',
      partialize: (state) => ({
        selectedProfile: state.selectedProfile,
        personalInfo: state.personalInfo,
        workExperience: state.workExperience,
        education: state.education,
        certifications: state.certifications,
        skills: state.skills,
        selectedTemplate: state.selectedTemplate,
        companyName: state.companyName,
      }),
    }
  )
);
