import { GraduationCap } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import Input from '@/components/ui/Input';
import type { Education } from '@/types/resume';

function EducationCard({ education }: { education: Education }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Institution"
            value={education.institution}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="Degree"
            value={education.degree}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Field of Study"
            value={education.field}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="GPA"
            value={education.gpa}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Start Date"
            value={education.startDate}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="End Date"
            value={education.endDate}
            disabled
            className="bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}

export function EducationForm() {
  const education = useResumeStore((state) => state.education);

  return (
    <FormSection
      title="Education"
      icon={<GraduationCap className="h-5 w-5" />}
      defaultOpen={false}
    >
      <div className="space-y-4">
        {education.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            No education for this profile.
          </p>
        )}

        {education.map((edu) => (
          <EducationCard key={edu.id} education={edu} />
        ))}
      </div>
    </FormSection>
  );
}
