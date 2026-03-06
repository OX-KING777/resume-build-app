import { Award, Plus } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { FormSection } from '@/components/form/FormSection';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Certification } from '@/types/resume';

function CertificationCard({
  certification,
}: {
  certification: Certification;
}) {
  const updateCertification = useResumeStore(
    (state) => state.updateCertification,
  );
  const removeCertification = useResumeStore(
    (state) => state.removeCertification,
  );

  const { id } = certification;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Certification Name"
            placeholder="AWS Solutions Architect"
            value={certification.name}
            onChange={(e) =>
              updateCertification(id, { name: e.target.value })
            }
          />
          <Input
            label="Issuing Organization"
            placeholder="Amazon Web Services"
            value={certification.issuer}
            onChange={(e) =>
              updateCertification(id, { issuer: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Date"
            type="month"
            value={certification.date}
            onChange={(e) =>
              updateCertification(id, { date: e.target.value })
            }
          />
          <Input
            label="URL"
            type="url"
            placeholder="https://credential.example.com/verify/..."
            value={certification.url}
            onChange={(e) => updateCertification(id, { url: e.target.value })}
          />
        </div>

        <div className="flex justify-end border-t border-gray-200 pt-3">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => removeCertification(id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CertificationsForm() {
  const certifications = useResumeStore((state) => state.certifications);
  const addCertification = useResumeStore((state) => state.addCertification);

  return (
    <FormSection
      title="Certifications"
      icon={<Award className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addCertification}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Certification
          </Button>
        </div>

        {certifications.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            No certifications added yet. Click &quot;Add Certification&quot; to
            get started.
          </p>
        )}

        {certifications.map((cert) => (
          <CertificationCard key={cert.id} certification={cert} />
        ))}
      </div>
    </FormSection>
  );
}
