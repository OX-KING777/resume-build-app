import { useState } from 'react';
import { User } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PersonalInfoForm() {
  const personalInfo = useResumeStore((state) => state.personalInfo);
  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );

  const [emailTouched, setEmailTouched] = useState(false);

  const emailError =
    emailTouched && personalInfo.email && !EMAIL_REGEX.test(personalInfo.email)
      ? 'Please enter a valid email address'
      : undefined;

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
            required
            placeholder="John Doe"
            value={personalInfo.fullName}
            onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            placeholder="john@example.com"
            value={personalInfo.email}
            error={emailError}
            onBlur={() => setEmailTouched(true)}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
          />
          <Input
            label="Address"
            placeholder="City, State"
            value={personalInfo.address}
            onChange={(e) => updatePersonalInfo({ address: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="LinkedIn URL"
            type="url"
            placeholder="https://linkedin.com/in/johndoe"
            value={personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
          />
          <Input
            label="Website URL"
            type="url"
            placeholder="https://johndoe.com"
            value={personalInfo.website}
            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
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
