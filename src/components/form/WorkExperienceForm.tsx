import { Briefcase, Plus, X } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import type { WorkExperience } from '@/types/resume';

function HighlightsList({
  highlights,
  onChange,
}: {
  highlights: string[];
  onChange: (highlights: string[]) => void;
}) {
  const addHighlight = () => {
    onChange([...highlights, '']);
  };

  const updateHighlight = (index: number, value: string) => {
    const updated = [...highlights];
    updated[index] = value;
    onChange(updated);
  };

  const removeHighlight = (index: number) => {
    onChange(highlights.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Key Highlights
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addHighlight}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Highlight
        </Button>
      </div>
      {highlights.map((highlight, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder={`Highlight ${index + 1}`}
            value={highlight}
            onChange={(e) => updateHighlight(index, e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeHighlight(index)}
            className="shrink-0 rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Remove highlight ${index + 1}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      {highlights.length === 0 && (
        <p className="text-sm text-gray-400">
          No highlights yet. Add key achievements or responsibilities.
        </p>
      )}
    </div>
  );
}

function WorkExperienceCard({ experience }: { experience: WorkExperience }) {
  const updateWorkExperience = useResumeStore(
    (state) => state.updateWorkExperience,
  );
  const removeWorkExperience = useResumeStore(
    (state) => state.removeWorkExperience,
  );

  const { id } = experience;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Company"
            placeholder="Company Name"
            value={experience.company}
            onChange={(e) =>
              updateWorkExperience(id, { company: e.target.value })
            }
          />
          <Input
            label="Location"
            placeholder="City, State or Remote"
            value={experience.location}
            onChange={(e) =>
              updateWorkExperience(id, { location: e.target.value })
            }
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
            type="month"
            value={experience.startDate}
            onChange={(e) =>
              updateWorkExperience(id, { startDate: e.target.value })
            }
          />
          <div>
            <Input
              label="End Date"
              type="month"
              value={experience.endDate}
              disabled={experience.current}
              onChange={(e) =>
                updateWorkExperience(id, { endDate: e.target.value })
              }
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={experience.current}
                onChange={(e) =>
                  updateWorkExperience(id, {
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : experience.endDate,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              I currently work here
            </label>
          </div>
        </div>

        <TextArea
          label="Description"
          rows={3}
          placeholder="Describe your role and responsibilities..."
          value={experience.description}
          onChange={(e) =>
            updateWorkExperience(id, { description: e.target.value })
          }
        />

        <HighlightsList
          highlights={experience.highlights}
          onChange={(highlights) => updateWorkExperience(id, { highlights })}
        />

        <div className="flex justify-end border-t border-gray-200 pt-3">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => removeWorkExperience(id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

export function WorkExperienceForm() {
  const workExperience = useResumeStore((state) => state.workExperience);
  const addWorkExperience = useResumeStore(
    (state) => state.addWorkExperience,
  );

  return (
    <FormSection
      title="Work Experience"
      icon={<Briefcase className="h-5 w-5" />}
      defaultOpen={false}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addWorkExperience}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Experience
          </Button>
        </div>

        {workExperience.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            No work experience added yet. Click &quot;Add Experience&quot; to
            get started.
          </p>
        )}

        {workExperience.map((exp) => (
          <WorkExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </FormSection>
  );
}
