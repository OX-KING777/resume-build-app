import { FileText } from 'lucide-react'
import clsx from 'clsx'
import { useResumeStore } from '@/store/useResumeStore'
import ExportMenu from '@/components/export/ExportMenu'

const templates = [
  { key: 'classic', label: 'Classic' },
  { key: 'modern', label: 'Modern' },
  { key: 'minimal', label: 'Minimal' },
  { key: 'creative', label: 'Creative' },
  { key: 'executive', label: 'Executive' },
  { key: 'sidebar', label: 'Sidebar' },
] as const

export function TopBar() {
  const selectedTemplate = useResumeStore((s) => s.selectedTemplate)
  const setTemplate = useResumeStore((s) => s.setTemplate)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900">Allen's Resume Builder</h1>
      </div>

      <nav className="flex items-center gap-1">
        {templates.map((t) => (
          <button
            key={t.key}
            onClick={() => setTemplate(t.key)}
            className={clsx(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              selectedTemplate === t.key
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div>
        <ExportMenu />
      </div>
    </header>
  )
}
