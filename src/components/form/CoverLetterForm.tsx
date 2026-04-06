import { FileText, Download } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import TextArea from '@/components/ui/TextArea';
import { downloadCoverLetterPdf } from '@/services/coverLetterPdf';

export function CoverLetterForm() {
  const selectedProfile = useResumeStore((s) => s.selectedProfile);
  const personalInfo = useResumeStore((s) => s.personalInfo);
  const coverLetterText = useResumeStore((s) => s.coverLetterText);
  const setCoverLetterText = useResumeStore((s) => s.setCoverLetterText);

  const COVER_LETTER_PROFILES = ['allen', 'albert', 'david', 'hao', 'peter', 'chris', 'henry', 'alex', 'saurav', 'chrislin', 'beka', 'tanner'];
  if (!COVER_LETTER_PROFILES.includes(selectedProfile)) return null;

  const handleDownload = () => {
    downloadCoverLetterPdf(
      personalInfo.fullName,
      personalInfo.email,
      personalInfo.phone,
      personalInfo.address,
      coverLetterText,
    );
  };

  return (
    <FormSection
      title="Cover Letter"
      icon={<FileText className="h-5 w-5" />}
      defaultOpen={false}
    >
      <div className="space-y-3">
        <p className="text-xs text-gray-500">
          Paste your cover letter text. Separate paragraphs with blank lines.
        </p>
        <TextArea
          label="Cover Letter"
          rows={14}
          placeholder={"Dear Hiring Manager,\n\nI am writing to express my interest in...\n\nSincerely,\nAlbert Kong"}
          value={coverLetterText}
          onChange={(e) => setCoverLetterText(e.target.value)}
        />
        <button
          type="button"
          onClick={handleDownload}
          disabled={!coverLetterText.trim()}
          className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Download Cover Letter PDF
        </button>
      </div>
    </FormSection>
  );
}
