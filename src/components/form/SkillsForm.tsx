import { Wrench, Plus } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import type { Skill } from '@/types/resume';

function SkillCard({ skill }: { skill: Skill }) {
  const updateSkill = useResumeStore((state) => state.updateSkill);
  const removeSkill = useResumeStore((state) => state.removeSkill);

  const { id } = skill;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="space-y-4">
        <Input
          label="Category"
          placeholder="e.g. Frontend & Web"
          value={skill.category}
          onChange={(e) => updateSkill(id, { category: e.target.value })}
        />

        <TextArea
          label="Items"
          placeholder="e.g. React, HTML, CSS, JavaScript"
          rows={2}
          value={skill.items}
          onChange={(e) => updateSkill(id, { items: e.target.value })}
        />

        <div className="flex justify-end border-t border-gray-200 pt-3">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => removeSkill(id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SkillsForm() {
  const skills = useResumeStore((state) => state.skills);
  const addSkill = useResumeStore((state) => state.addSkill);

  return (
    <FormSection
      title="Skills Highlight"
      icon={<Wrench className="h-5 w-5" />}
      defaultOpen={false}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addSkill}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Skill
          </Button>
        </div>

        {skills.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            No skills added yet. Click &quot;Add Skill&quot; to get started.
          </p>
        )}

        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </FormSection>
  );
}
