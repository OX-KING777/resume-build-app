import { TopBar } from '@/components/layout/TopBar'
import { LeftPanel } from '@/components/layout/LeftPanel'
import { RightPanel } from '@/components/layout/RightPanel'
import { JsonImportForm } from '@/components/form/JsonImportForm'
import { PdfPreview } from '@/components/preview/PdfPreview'

export default function App() {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />

      <div className="flex flex-1 flex-col overflow-hidden pt-16 lg:flex-row">
        <LeftPanel>
          <div className="space-y-4">
            <JsonImportForm />
          </div>
        </LeftPanel>

        <RightPanel>
          <PdfPreview />
        </RightPanel>
      </div>
    </div>
  )
}
