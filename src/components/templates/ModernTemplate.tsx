import type { TemplateProps } from './TemplateRenderer';

export function ModernTemplate({
  personalInfo,
  workExperience,
  education,
  certifications,
  skills,
}: TemplateProps) {
  const contactParts: string[] = [];
  if (personalInfo.address) contactParts.push(personalInfo.address);
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.website) contactParts.push(personalInfo.website);

  return (
    <div
      className="w-full h-full bg-white"
      style={{
        fontFamily: 'Calibri, Carlito, sans-serif',
        fontSize: '11pt',
        padding: '40px 40px',
        boxSizing: 'border-box',
        color: '#000',
      }}
    >
      {/* Name */}
      <div className="mb-1">
        <h1 className="font-bold" style={{ fontSize: '26px', lineHeight: 1.1 }}>
          {personalInfo.fullName}
        </h1>
      </div>

      {/* Contact */}
      {contactParts.length > 0 && (
        <div className="mb-5">
          <p style={{ fontSize: '10.5px', color: '#555' }}>
            {contactParts.join('  |  ')}
          </p>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: '#000', marginBottom: '12px' }} />

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-4">
          <h2 className="font-bold uppercase mb-1" style={{ fontSize: '12px', letterSpacing: '1px' }}>
            Professional Summary
          </h2>
          <p className="leading-relaxed" style={{ fontSize: '10.5px', color: '#333' }}>
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase mb-1" style={{ fontSize: '12px', letterSpacing: '1px' }}>
            Skills
          </h2>
          <div className="space-y-0.5">
            {skills
              .filter((s) => s.category.trim() || s.items.trim())
              .map((skill) => (
                <div key={skill.id} style={{ fontSize: '10px', color: '#333' }}>
                  {skill.category && (
                    <span className="font-bold" style={{ color: '#000' }}>{skill.category}: </span>
                  )}
                  <span>{skill.items}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {workExperience.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase mb-2" style={{ fontSize: '12px', letterSpacing: '1px' }}>
            Experience
          </h2>
          <div className="space-y-3">
            {workExperience.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold" style={{ fontSize: '11.5px' }}>
                    {job.position}
                  </h3>
                  <span
                    className="whitespace-nowrap ml-3 shrink-0"
                    style={{ fontSize: '10px', color: '#555' }}
                  >
                    {job.startDate}
                    {(job.endDate || job.current) &&
                      ` - ${job.current ? 'Present' : job.endDate}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold" style={{ fontSize: '10.5px', color: '#333' }}>
                    {job.company}
                  </p>
                  {job.location && (
                    <span className="whitespace-nowrap ml-3 shrink-0" style={{ fontSize: '10px', color: '#555' }}>
                      {job.location}
                    </span>
                  )}
                </div>
                {job.description && (
                  <p style={{ fontSize: '10px', color: '#333', marginTop: '2px' }}>
                    {job.description}
                  </p>
                )}
                {job.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5 list-disc ml-4">
                    {job.highlights
                      .filter((h) => h.trim())
                      .map((highlight, i) => (
                        <li key={i} style={{ fontSize: '9.5px', color: '#333' }}>
                          {highlight}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase mb-1" style={{ fontSize: '12px', letterSpacing: '1px' }}>
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold" style={{ fontSize: '11px' }}>
                    {edu.degree}
                    {edu.field && `, ${edu.field}`}
                  </h3>
                  <span
                    className="whitespace-nowrap ml-3 shrink-0"
                    style={{ fontSize: '10px', color: '#555' }}
                  >
                    {edu.startDate}
                    {edu.endDate && ` - ${edu.endDate}`}
                  </span>
                </div>
                <p className="font-medium" style={{ fontSize: '10.5px', color: '#333' }}>
                  {edu.institution}
                </p>
                {edu.gpa && (
                  <p style={{ fontSize: '9.5px', color: '#555' }}>GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase mb-1" style={{ fontSize: '12px', letterSpacing: '1px' }}>
            Certifications
          </h2>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <p className="font-semibold" style={{ fontSize: '10.5px' }}>
                  {cert.name}
                  {cert.issuer && <span className="font-normal" style={{ color: '#555' }}> — {cert.issuer}</span>}
                </p>
                {cert.date && (
                  <span className="whitespace-nowrap ml-3 shrink-0" style={{ fontSize: '10px', color: '#555' }}>
                    {cert.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
