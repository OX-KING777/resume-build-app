import { useState, useEffect } from 'react';
import { Target, Sparkles, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';

const PROGRESS_MESSAGES = [
  'Analyzing job description...',
  'Matching skills to requirements...',
  'Tailoring work experience bullets...',
  'Optimizing for ATS compatibility...',
  'Generating professional summary...',
  'Finalizing resume content...',
];

export function JobDescriptionForm() {
  const jobDescription = useResumeStore((state) => state.jobDescription);
  const setJobDescription = useResumeStore((state) => state.setJobDescription);
  const generationStatus = useResumeStore((state) => state.generationStatus);
  const generationError = useResumeStore((state) => state.generationError);
  const aiWarnings = useResumeStore((state) => state.aiWarnings);
  const generateFromJobDescription = useResumeStore(
    (state) => state.generateFromJobDescription,
  );
  const clearGeneration = useResumeStore((state) => state.clearGeneration);

  const [progressIndex, setProgressIndex] = useState(0);

  useEffect(() => {
    if (generationStatus !== 'generating') {
      setProgressIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setProgressIndex((prev) =>
        prev < PROGRESS_MESSAGES.length - 1 ? prev + 1 : prev,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [generationStatus]);

  // Auto-dismiss success after 3 seconds
  useEffect(() => {
    if (generationStatus !== 'success') return;
    const timeout = setTimeout(() => {
      useResumeStore.setState({ generationStatus: 'idle' });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [generationStatus]);

  const handleGenerate = async () => {
    setProgressIndex(0);
    await generateFromJobDescription(jobDescription);
  };

  const isGenerating = generationStatus === 'generating';

  return (
    <FormSection
      title="Job Description"
      icon={<Target className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <TextArea
          label="Paste the job description here"
          rows={12}
          placeholder="Paste the full job description here. The AI will generate a complete tailored resume based on Allen's profile..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            type="button"
            disabled={!jobDescription.trim() || isGenerating}
            onClick={handleGenerate}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {PROGRESS_MESSAGES[progressIndex]}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Resume
              </>
            )}
          </button>

          {generationStatus === 'success' && (
            <Button
              type="button"
              variant="ghost"
              onClick={clearGeneration}
              title="Reset to defaults"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Warnings */}
        {aiWarnings.length > 0 && (
          <div className="space-y-2">
            {aiWarnings.map((warning, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-lg border-2 p-3 ${
                  warning.type === 'clearance'
                    ? 'border-red-300 bg-red-50'
                    : 'border-orange-300 bg-orange-50'
                }`}
              >
                <AlertTriangle
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    warning.type === 'clearance'
                      ? 'text-red-600'
                      : 'text-orange-600'
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      warning.type === 'clearance'
                        ? 'text-red-800'
                        : 'text-orange-800'
                    }`}
                  >
                    {warning.type === 'clearance'
                      ? 'Security Clearance Required'
                      : 'Onsite Location Mismatch'}
                  </p>
                  <p
                    className={`mt-1 text-sm ${
                      warning.type === 'clearance'
                        ? 'text-red-700'
                        : 'text-orange-700'
                    }`}
                  >
                    {warning.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Success feedback */}
        {generationStatus === 'success' && aiWarnings.length === 0 && (
          <div className="flex items-center gap-2 rounded-lg border-2 border-green-300 bg-green-50 p-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              Resume generated successfully! Check the preview.
            </p>
          </div>
        )}

        {/* Error feedback */}
        {generationStatus === 'error' && generationError && (
          <div className="flex items-start gap-3 rounded-lg border-2 border-red-300 bg-red-50 p-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Generation Failed
              </p>
              <p className="mt-1 text-sm text-red-700">{generationError}</p>
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
}
