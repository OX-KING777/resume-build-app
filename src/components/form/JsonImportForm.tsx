import { useState } from 'react';
import { FileJson } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';

const PLACEHOLDER = `{
  "Title": "Senior Software Engineer",
  "Summary": "8+ years of experience...",
  "Technical Skills": {
    "Languages": ["Java", "Python", "TypeScript"],
    "Cloud": ["AWS", "Docker", "Kubernetes"]
  },
  "Experience": {
    "Company 1": {
      "Name": "Intuit",
      "Period": "2024.8 – Present",
      "Role Title": "Senior Software Engineer",
      "Experience Content": [
        "Led migration of microservices...",
        "Reduced API latency by 40%..."
      ]
    }
  }
}`;

export function JsonImportForm() {
  const selectedProfile = useResumeStore((state) => state.selectedProfile);
  const importFromJson = useResumeStore((state) => state.importFromJson);
  const companyName = useResumeStore((state) => state.companyName);
  const setCompanyName = useResumeStore((state) => state.setCompanyName);
  const [jsonText, setJsonText] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const JSON_IMPORT_PROFILES = ['allen', 'albert', 'david'];
  if (!JSON_IMPORT_PROFILES.includes(selectedProfile)) return null;

  const handleImport = () => {
    if (!jsonText.trim()) {
      setStatus({ type: 'error', message: 'Please paste JSON content first.' });
      return;
    }
    try {
      importFromJson(jsonText);
      setStatus({ type: 'success', message: 'Resume data imported successfully!' });
    } catch (e) {
      setStatus({ type: 'error', message: `Invalid JSON: ${(e as Error).message}` });
    }
  };

  const handleClear = () => {
    setJsonText('');
    setStatus(null);
  };

  return (
    <FormSection
      title="JSON Import"
      icon={<FileJson className="h-5 w-5" />}
      defaultOpen={true}
    >
      <div className="space-y-3">
        <Input
          label="Company Name (for ZIP download)"
          placeholder="e.g. Google, Amazon, Meta"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Paste a full JSON with Title, Summary, Technical Skills, Experience, and Education to populate all fields at once.
        </p>
        <TextArea
          label="JSON Data"
          rows={12}
          placeholder={PLACEHOLDER}
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setStatus(null);
          }}
        />
        {status && (
          <p className={`text-xs ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {status.message}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleImport}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Import
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>
    </FormSection>
  );
}
