import { Wrench } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import TextArea from '@/components/ui/TextArea';

export function SkillsForm() {
  const skills = useResumeStore((state) => state.skills);
  const updateSkill = useResumeStore((state) => state.updateSkill);
  const addSkill = useResumeStore((state) => state.addSkill);

  // Combine all skills into one text block: "Category: items" per line
  const skillsText = skills
    .map((s) => (s.category ? `${s.category}: ${s.items}` : s.items))
    .join('\n');

  const handleChange = (value: string) => {
    const lines = value.split('\n');

    // Remove all existing skills first, then rebuild
    // We need to work with the store directly — clear and re-add
    const store = useResumeStore.getState();

    // Remove all existing
    for (const s of store.skills) {
      store.removeSkill(s.id);
    }

    // Add new ones from lines
    for (const line of lines) {
      store.addSkill();
      const newSkills = useResumeStore.getState().skills;
      const lastSkill = newSkills[newSkills.length - 1];

      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        store.updateSkill(lastSkill.id, {
          category: line.slice(0, colonIdx).trim(),
          items: line.slice(colonIdx + 1).trim(),
        });
      } else {
        store.updateSkill(lastSkill.id, { category: '', items: line });
      }
    }
  };

  return (
    <FormSection
      title="Skills"
      icon={<Wrench className="h-5 w-5" />}
      defaultOpen={false}
    >
      <TextArea
        label="Skills (one category per line, e.g. 'Languages: Java, Python')"
        rows={8}
        placeholder={"Languages: Java, Python, TypeScript\nCloud: AWS, Docker, Kubernetes\nTools: Git, CI/CD, JIRA"}
        value={skillsText}
        onChange={(e) => handleChange(e.target.value)}
      />
    </FormSection>
  );
}
