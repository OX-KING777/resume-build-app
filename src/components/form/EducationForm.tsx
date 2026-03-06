import { GraduationCap, Plus } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import type { Education } from '@/types/resume';

function EducationCard({ education }: { education: Education }) {
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const removeEducation = useResumeStore((state) => state.removeEducation);

  const { id } = education;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Institution"
            placeholder="University Name"
            value={education.institution}
            onChange={(e) =>
              updateEducation(id, { institution: e.target.value })
            }
          />
          <Input
            label="Degree"
            placeholder="Bachelor of Science"
            value={education.degree}
            onChange={(e) => updateEducation(id, { degree: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Field of Study"
            placeholder="Computer Science"
            value={education.field}
            onChange={(e) => updateEducation(id, { field: e.target.value })}
          />
          <Input
            label="GPA"
            placeholder="3.8 / 4.0"
            value={education.gpa}
            onChange={(e) => updateEducation(id, { gpa: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Start Date"
            type="month"
            value={education.startDate}
            onChange={(e) =>
              updateEducation(id, { startDate: e.target.value })
            }
          />
          <Input
            label="End Date"
            type="month"
            value={education.endDate}
            onChange={(e) => updateEducation(id, { endDate: e.target.value })}
          />
        </div>

        <TextArea
          label="Description"
          rows={3}
          placeholder="Relevant coursework, honors, activities..."
          value={education.description}
          onChange={(e) =>
            updateEducation(id, { description: e.target.value })
          }
        />

        <div className="flex justify-end border-t border-gray-200 pt-3">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => removeEducation(id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EducationForm() {
  const education = useResumeStore((state) => state.education);
  const addEducation = useResumeStore((state) => state.addEducation);

  return (
    <FormSection
      title="Education"
      icon={<GraduationCap className="h-5 w-5" />}
      defaultOpen={false}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addEducation}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Education
          </Button>
        </div>

        {education.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            No education added yet. Click &quot;Add Education&quot; to get
            started.
          </p>
        )}

        {education.map((edu) => (
          <EducationCard key={edu.id} education={edu} />
        ))}
      </div>
    </FormSection>
  );
}
