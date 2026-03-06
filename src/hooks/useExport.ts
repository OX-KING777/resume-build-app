import { useState } from 'react';
import { exportToPdf } from '@/services/pdfService';
import { exportToDocx } from '@/services/docxService';
import { useResumeStore } from '@/store/useResumeStore';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  const personalInfo = useResumeStore((state) => state.personalInfo);
  const workExperience = useResumeStore((state) => state.workExperience);
  const education = useResumeStore((state) => state.education);
  const certifications = useResumeStore((state) => state.certifications);
  const skills = useResumeStore((state) => state.skills);
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate);
  const mainTitle = useResumeStore((state) => state.mainTitle);

  const getFileName = (): string => {
    const name = personalInfo.fullName.trim();
    if (name) {
      return `${name.replace(/\s+/g, '_')}_Resume`;
    }
    return 'Resume';
  };

  const exportPdf = async (): Promise<void> => {
    setIsExporting(true);
    try {
      await exportToPdf(
        {
          personalInfo,
          workExperience,
          education,
          certifications,
          skills,
          selectedTemplate,
          mainTitle,
        },
        getFileName()
      );
    } catch (error) {
      console.error('PDF export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const exportDocx = async (): Promise<void> => {
    setIsExporting(true);
    try {
      await exportToDocx(
        {
          personalInfo,
          workExperience,
          education,
          certifications,
          skills,
          selectedTemplate,
        },
        getFileName()
      );
    } catch (error) {
      console.error('DOCX export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportPdf, exportDocx, isExporting };
}
