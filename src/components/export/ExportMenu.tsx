import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileDown } from 'lucide-react';
import { useExport } from '@/hooks/useExport';

export default function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { exportPdf, exportDocx, isExporting } = useExport();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExportPdf = async () => {
    try {
      setIsOpen(false);
      await exportPdf();
    } catch (err) {
      alert('PDF export failed. Check console for details.');
      console.error(err);
    }
  };

  const handleExportDocx = async () => {
    try {
      setIsOpen(false);
      await exportDocx();
    } catch (err) {
      alert('DOCX export failed. Check console for details.');
      console.error(err);
    }
  };

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isExporting}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          <Download className="h-4 w-4" />
        )}
        {isExporting ? 'Exporting...' : 'Export'}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            onClick={handleExportPdf}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
          >
            <FileText className="h-4 w-4 text-red-500" />
            Export as PDF
          </button>
          <button
            onClick={handleExportDocx}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
          >
            <FileDown className="h-4 w-4 text-blue-500" />
            Export as DOCX
          </button>
        </div>
      )}
    </div>
  );
}
