import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, FolderArchive, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { useResumeStore } from '@/store/useResumeStore';
import { generatePdfBlob, exportToPdf } from '@/services/pdfService';
import type { PdfInput } from '@/services/pdfService';

export function PdfPreview() {
  const personalInfo = useResumeStore((s) => s.personalInfo);
  const workExperience = useResumeStore((s) => s.workExperience);
  const education = useResumeStore((s) => s.education);
  const certifications = useResumeStore((s) => s.certifications);
  const skills = useResumeStore((s) => s.skills);
  const selectedTemplate = useResumeStore((s) => s.selectedTemplate);
  const selectedProfile = useResumeStore((s) => s.selectedProfile);
  const companyName = useResumeStore((s) => s.companyName);

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

      // Revoke previous URL
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
      prevUrlRef.current = url;
      setBlobUrl(url);
    } finally {
      setLoading(false);
    }
  }, [personalInfo, workExperience, education, certifications, skills, selectedTemplate]);

  // Debounced PDF generation
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(generatePreview, 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [generatePreview]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  const handleDownload = () => {
    const input: PdfInput = {
      personalInfo,
      workExperience,
      education,
      certifications,
      skills,
      selectedTemplate,
    };
    const fileName = personalInfo.fullName
      ? personalInfo.fullName.replace(/\s+/g, '_') + '_Resume'
      : 'Resume';
    exportToPdf(input, fileName);
  };

  const handleDownloadZip = async () => {
    const input: PdfInput = {
      personalInfo,
      workExperience,
      education,
      certifications,
      skills,
      selectedTemplate,
    };
    const pdfBlob = generatePdfBlob(input);
    const pdfFileName = `${personalInfo.fullName} - Resume.pdf`;
    const company = companyName.trim().replace(/\s+/g, '_');
    const zipFileName = `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume_${company}.zip`;

    const zip = new JSZip();
    zip.file(pdfFileName, pdfBlob);
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = zipFileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const hasJsonImport = ['allen', 'albert', 'david', 'hao', 'peter', 'chris', 'henry', 'alex', 'saurav', 'chrislin', 'beka', 'tanner', 'thomas', 'davidwu'].includes(selectedProfile);
  const hasCompany = companyName.trim().length > 0;

  return (
    <div className="relative h-full w-full max-w-[850px]">
      {/* Download buttons overlay */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {hasJsonImport && (
          <button
            onClick={handleDownloadZip}
            disabled={!hasCompany}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            title={hasCompany ? `Download as ZIP for ${companyName}` : 'Enter a Company Name first'}
          >
            <FolderArchive className="h-4 w-4" />
            Download ZIP
          </button>
        )}
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>

      {/* Loading spinner */}
      {loading && !blobUrl && (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* PDF iframe */}
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
