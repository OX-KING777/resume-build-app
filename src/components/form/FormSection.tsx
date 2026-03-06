import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface FormSectionProps {
  title: string
  icon: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}

export function FormSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="rounded-lg border bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
      >
        <span className="text-gray-500">{icon}</span>
        <span className="flex-1 text-sm font-semibold text-gray-900">
          {title}
        </span>
        <ChevronDown
          className={clsx(
            'h-4 w-4 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <div
        className={clsx(
          'grid transition-[grid-template-rows] duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t px-4 py-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
