import type {
  PersonalInfo,
  WorkExperience,
  Education,
  Certification,
  Skill,
  TemplateName,
} from '@/types/resume';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { SidebarTemplate } from './SidebarTemplate';

export interface TemplateProps {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
}

type TemplateComponent = React.ComponentType<TemplateProps>;

const templateMap: Record<TemplateName, TemplateComponent> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  sidebar: SidebarTemplate,
};

interface TemplateRendererProps extends TemplateProps {
  template: TemplateName;
}

export function TemplateRenderer({ template, ...props }: TemplateRendererProps) {
  const Component = templateMap[template];
  return <Component {...props} />;
}
