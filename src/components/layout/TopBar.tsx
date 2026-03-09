import { FileText } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import ExportMenu from '@/components/export/ExportMenu'
import type { ProfileName } from '@/services/aiService'

const profiles = [
  { key: 'allen' as ProfileName, label: 'Allen Wang' },
  { key: 'albert' as ProfileName, label: 'Albert Kong' },
  { key: 'tanner' as ProfileName, label: 'Tanner Barton' },
  { key: 'hao' as ProfileName, label: 'Hao Nguyen' },
  { key: 'chris' as ProfileName, label: 'Chris Yang' },
]

export function TopBar() {
  const selectedProfile = useResumeStore((s) => s.selectedProfile)
  const setProfile = useResumeStore((s) => s.setProfile)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
        </div>
        <select
          value={selectedProfile}
          onChange={(e) => setProfile(e.target.value as ProfileName)}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {profiles.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <ExportMenu />
      </div>
    </header>
  )
}
