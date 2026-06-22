import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { useResumeStore } from '@/store/useResumeStore';
import { generatePdfBlob, exportToPdf } from '@/services/pdfService';
import { downloadCoverLetterPdf } from '@/services/coverLetterPdf';
import type { PdfInput } from '@/services/pdfService';

const BETWEEN_DOWNLOADS_MS = 450;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function PdfPreview() {
  const personalInfo = useResumeStore((s) => s.personalInfo);
  const workExperience = useResumeStore((s) => s.workExperience);
  const education = useResumeStore((s) => s.education);
  const certifications = useResumeStore((s) => s.certifications);
  const skills = useResumeStore((s) => s.skills);
  const selectedTemplate = useResumeStore((s) => s.selectedTemplate);
  const selectedProfile = useResumeStore((s) => s.selectedProfile);
  const companyName = useResumeStore((s) => s.companyName);
  const coverLetterText = useResumeStore((s) => s.coverLetterText);

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const prevUrlRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generatePreview = useCallback(() => {
    setLoading(true);
    try {
      const input: PdfInput = {
        personalInfo,
        workExperience,
        education,
        certifications,
        skills,
        selectedTemplate,
      };
      const blob = generatePdfBlob(input);
      const url = URL.createObjectURL(blob);

      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
      prevUrlRef.current = url;
      setBlobUrl(url);
    } finally {
      setLoading(false);
    }
  }, [personalInfo, workExperience, education, certifications, skills, selectedTemplate]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(generatePreview, 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [generatePreview]);

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  const buildInput = (): PdfInput => ({
    personalInfo,
    workExperience,
    education,
    certifications,
    skills,
    selectedTemplate,
  });

  const resumeBaseFileName = personalInfo.fullName
    ? personalInfo.fullName.replace(/\s+/g, '_') + '_Resume'
    : 'Resume';

  const handleDownloadResumeOnly = () => {
    void exportToPdf(buildInput(), resumeBaseFileName);
  };

  const handleDownloadBundle = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const input = buildInput();
      await exportToPdf(input, resumeBaseFileName);
      await delay(BETWEEN_DOWNLOADS_MS);

      await downloadCoverLetterPdf(
        personalInfo.fullName,
        personalInfo.email,
        personalInfo.phone,
        personalInfo.address,
        coverLetterText,
      );
      await delay(BETWEEN_DOWNLOADS_MS);

      const pdfBlob = generatePdfBlob(input);
      const pdfFileName = `${personalInfo.fullName} - Resume.pdf`;
      const company = companyName.trim().replace(/\s+/g, '_');
      const companySegment = company || 'files';
      const zipFileName = `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume_${companySegment}.zip`;

      const zip = new JSZip();
      zip.file(pdfFileName, pdfBlob);
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = zipFileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setDownloading(false);
    }
  };

  const hasJsonImport = ['allen', 'albert', 'david', 'hao', 'peter', 'chris', 'henry', 'alex', 'saurav', 'chrislin', 'beka', 'tanner', 'thomas', 'davidwu', 'degao', 'jakub','howard'].includes(selectedProfile);

  const bundleTitle =
    'Downloads resume PDF, cover letter PDF, and ZIP in sequence. If Company Name is set in JSON, it is used in the ZIP filename; otherwise the ZIP uses "files" in the name. Chromium may ask where to save each PDF the first time; the ZIP uses your default download folder.';

  return (
    <div className="relative h-full w-full max-w-[850px]">
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {hasJsonImport ? (
          <button
            type="button"
            onClick={() => void handleDownloadBundle()}
            disabled={downloading}
            title={bundleTitle}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? 'Downloading…' : 'Download'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDownloadResumeOnly}
            title="Chromium: the first save opens in Downloads—choose the file (new or replace). Later, same filename overwrites that file without opening the dialog again."
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        )}
      </div>

      {loading && !blobUrl && (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {blobUrl && (
        <iframe
          src={blobUrl}
          className="h-full w-full rounded-lg border border-gray-200 bg-white shadow-sm"
          title="Resume PDF Preview"
        />
      )}
    </div>
  );
}
