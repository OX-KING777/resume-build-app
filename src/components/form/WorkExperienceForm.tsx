import { Briefcase } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import type { WorkExperience } from '@/types/resume';

function WorkExperienceCard({ experience }: { experience: WorkExperience }) {
  const updateWorkExperience = useResumeStore(
    (state) => state.updateWorkExperience,
  );

  const { id } = experience;

  // Join highlights into one newline-separated string for the textarea
  const highlightsText = experience.highlights.join('\n');

  const handleHighlightsChange = (value: string) => {
    // Split by newlines — each line becomes one bullet point
    const highlights = value.split('\n');
    updateWorkExperience(id, { highlights });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Company"
            value={experience.company}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="Location"
            value={experience.location}
            disabled
            className="bg-gray-100"
          />
        </div>

        <Input
          label="Position"
          placeholder="Job Title"
          value={experience.position}
          onChange={(e) =>
            updateWorkExperience(id, { position: e.target.value })
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Start Date"
            value={experience.startDate}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="End Date"
            value={experience.current ? 'Present' : experience.endDate}
            disabled
            className="bg-gray-100"
          />
        </div>

        <TextArea
          label="Highlights (one per line)"
          rows={6}
          placeholder="Enter bullet points, one per line..."
          value={highlightsText}
          onChange={(e) => handleHighlightsChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export function WorkExperienceForm() {
  const workExperience = useResumeStore((state) => state.workExperience);

  return (
    <FormSection
      title="Work Experience"
      icon={<Briefcase className="h-5 w-5" />}
      defaultOpen={false}
    >
      <div className="space-y-4">
        {workExperience.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            No work experience for this profile.
          </p>
        )}

        {workExperience.map((exp) => (
          <WorkExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </FormSection>
  );
}
