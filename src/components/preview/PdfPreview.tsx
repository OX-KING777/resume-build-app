import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
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

  return (
    <div className="relative h-full w-full max-w-[850px]">
      {/* Download button overlay */}
      <button
        onClick={handleDownload}
        className="absolute top-3 right-3 z-10 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
      >
        <Download className="h-4 w-4" />
        Download PDF
      </button>

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
