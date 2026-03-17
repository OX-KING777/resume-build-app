import { User } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';

export function PersonalInfoForm() {
  const personalInfo = useResumeStore((state) => state.personalInfo);
  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );

  return (
    <FormSection
      title="Personal Information"
      icon={<User className="h-5 w-5" />}
      defaultOpen={false}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            value={personalInfo.fullName}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="Email"
            type="email"
            value={personalInfo.email}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Phone"
            type="tel"
            value={personalInfo.phone}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="Address"
            value={personalInfo.address}
            disabled
            className="bg-gray-100"
          />
        </div>

        <TextArea
          label="Professional Summary"
          rows={4}
          placeholder="A brief summary of your professional background and career objectives..."
          value={personalInfo.summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
        />
      </div>
    </FormSection>
  );
}
