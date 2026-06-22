import { FileText, Download } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import { downloadCoverLetterPdf } from '@/services/coverLetterPdf';

export function CoverLetterForm() {
  const selectedProfile = useResumeStore((s) => s.selectedProfile);
  const personalInfo = useResumeStore((s) => s.personalInfo);
  const coverLetterText = useResumeStore((s) => s.coverLetterText);

  const COVER_LETTER_PROFILES = ['allen', 'albert', 'david', 'hao', 'peter', 'chris', 'henry', 'alex', 'saurav', 'chrislin', 'beka', 'tanner', 'thomas', 'davidwu', 'degao', 'jakub','howard'];
  if (!COVER_LETTER_PROFILES.includes(selectedProfile)) return null;

  const handleDownload = () => {
    void downloadCoverLetterPdf(
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
          Cover letter text is loaded from the Cover Letter field in your JSON import. Use blank lines between paragraphs. Download a PDF when you are ready.
        </p>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!coverLetterText.trim()}
          title="Chromium: first save picks the file in Downloads; later saves overwrite it when the filename still matches."
          className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Download Cover Letter PDF
        </button>
      </div>
    </FormSection>
  );
}
