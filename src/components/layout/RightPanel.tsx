import type { ReactNode } from 'react'

interface RightPanelProps {
  children: ReactNode
}

export function RightPanel({ children }: RightPanelProps) {
  return (
    <main className="flex w-full flex-1 items-start justify-center overflow-auto bg-gray-100 p-8">
      {children}
    </main>
  )
}
