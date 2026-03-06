import { TopBar } from '@/components/layout/TopBar'
import { LeftPanel } from '@/components/layout/LeftPanel'
import { RightPanel } from '@/components/layout/RightPanel'
import { PersonalInfoForm } from '@/components/form/PersonalInfoForm'
import { WorkExperienceForm } from '@/components/form/WorkExperienceForm'
import { EducationForm } from '@/components/form/EducationForm'
import { SkillsForm } from '@/components/form/SkillsForm'
import { JobDescriptionForm } from '@/components/form/JobDescriptionForm'
import { ResumePreview } from '@/components/preview/ResumePreview'

export default function App() {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />

      <div className="flex flex-1 flex-col overflow-hidden pt-16 lg:flex-row">
        <LeftPanel>
          <div className="space-y-4">
            <JobDescriptionForm />
            <PersonalInfoForm />
            <SkillsForm />
            <WorkExperienceForm />
            <EducationForm />
          </div>
        </LeftPanel>

        <RightPanel>
          <ResumePreview />
        </RightPanel>
      </div>
    </div>
  )
}
