import { TopBar } from '@/components/layout/TopBar'
import { LeftPanel } from '@/components/layout/LeftPanel'
import { RightPanel } from '@/components/layout/RightPanel'
import { PersonalInfoForm } from '@/components/form/PersonalInfoForm'
import { WorkExperienceForm } from '@/components/form/WorkExperienceForm'
import { EducationForm } from '@/components/form/EducationForm'
import { SkillsForm } from '@/components/form/SkillsForm'
import { JsonImportForm } from '@/components/form/JsonImportForm'
import { CoverLetterForm } from '@/components/form/CoverLetterForm'
import { PdfPreview } from '@/components/preview/PdfPreview'

export default function App() {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />

      <div className="flex flex-1 flex-col overflow-hidden pt-16 lg:flex-row">
        <LeftPanel>
          <div className="space-y-4">
            <JsonImportForm />
            <PersonalInfoForm />
            <WorkExperienceForm />
            <SkillsForm />
            <EducationForm />
            <CoverLetterForm />
          </div>
        </LeftPanel>

        <RightPanel>
          <PdfPreview />
        </RightPanel>
      </div>
    </div>
  )
}
