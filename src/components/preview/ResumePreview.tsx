import { useRef, useState, useEffect, useCallback } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

// US Letter: 8.5" x 11" at 96dpi
const LETTER_WIDTH_PX = 816;
const LETTER_HEIGHT_PX = 1056;

export function ResumePreview() {
  const personalInfo = useResumeStore((s) => s.personalInfo);
  const workExperience = useResumeStore((s) => s.workExperience);
  const education = useResumeStore((s) => s.education);
  const certifications = useResumeStore((s) => s.certifications);
  const skills = useResumeStore((s) => s.skills);
  const selectedTemplate = useResumeStore((s) => s.selectedTemplate);

  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const scaleX = (containerWidth - 32) / LETTER_WIDTH_PX;
    const scaleY = (containerHeight - 32) / LETTER_HEIGHT_PX;
    const newScale = Math.min(scaleX, scaleY, 1);
    setScale(newScale);
  }, []);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [updateScale]);

  const isEmpty =
    !personalInfo.fullName &&
    !personalInfo.email &&
    !personalInfo.phone &&
    !personalInfo.address &&
    !personalInfo.linkedin &&
    !personalInfo.website &&
    !personalInfo.summary &&
    workExperience.length === 0 &&
    education.length === 0 &&
    certifications.length === 0 &&
    skills.length === 0;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-start justify-center overflow-auto bg-gray-100 p-4"
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <div
          id="resume-preview"
          ref={previewRef}
          className="bg-white shadow-lg"
          style={{
            width: `${LETTER_WIDTH_PX}px`,
            minHeight: `${LETTER_HEIGHT_PX}px`,
            overflow: 'hidden',
          }}
        >
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[1056px] text-gray-400">
              <svg
                className="w-16 h-16 mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm font-medium">Fill in your details to see a preview</p>
            </div>
          ) : (
            <TemplateRenderer
              template={selectedTemplate}
              personalInfo={personalInfo}
              workExperience={workExperience}
              education={education}
              certifications={certifications}
              skills={skills}
            />
          )}
        </div>
      </div>
    </div>
  );
}
