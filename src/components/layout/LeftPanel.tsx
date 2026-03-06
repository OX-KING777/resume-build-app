import type { ReactNode } from 'react'

interface LeftPanelProps {
  children: ReactNode
}

export function LeftPanel({ children }: LeftPanelProps) {
  return (
    <aside className="h-full w-full overflow-y-auto border-r bg-white p-6 lg:w-[480px] lg:min-w-[480px]">
      {children}
    </aside>
  )
}
