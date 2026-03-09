import type { TemplateProps } from './TemplateRenderer';

export function ExecutiveTemplate({
  personalInfo,
  workExperience,
  education,
  certifications,
  skills,
}: TemplateProps) {
  const goldColor = '#b8860b';
  const charcoal = '#2d2d2d';

  return (
    <div
      className="w-full h-full bg-white"
      style={{
        fontFamily: 'Calibri, Carlito, sans-serif',
        fontSize: '11pt',
      }}
    >
      {/* Dark Header Bar */}
      <div
        className="text-white"
        style={{
          backgroundColor: charcoal,
          padding: '32px 48px 28px',
          boxSizing: 'border-box',
          borderBottom: `3px solid ${goldColor}`,
        }}
      >
        <h1
          className="text-center mb-1"
          style={{
            fontSize: '30px',
            fontWeight: 600,
            color: goldColor,
            letterSpacing: '2px',
          }}
        >
          {personalInfo.fullName}
        </h1>
      </div>

      {/* Contact Info - Two Column Under Header */}
      <div
        style={{
          padding: '14px 48px',
          backgroundColor: '#f8f7f4',
          borderBottom: `1px solid #e8e4dd`,
          boxSizing: 'border-box',
        }}
      >
        <div
          className="flex flex-wrap justify-center gap-x-6 gap-y-1"
          style={{ fontSize: '10px', color: '#6b6356' }}
        >
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Main Content - Single Column */}
      <div style={{ padding: '28px 48px 40px', boxSizing: 'border-box' }}>
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2
              className="text-center mb-3"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: charcoal,
                letterSpacing: '3px',
                fontVariant: 'small-caps',
                textTransform: 'uppercase',
              }}
            >
              Executive Summary
            </h2>
            <div
              className="mx-auto mb-3"
              style={{ width: '40px', height: '1px', backgroundColor: goldColor }}
            />
            <p
              className="text-center leading-relaxed"
              style={{ fontSize: '11px', color: '#4a4a4a' }}
            >
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Decorative separator */}
        <div
          className="mx-auto mb-6"
          style={{
            width: '100%',
            height: '0.5px',
            backgroundColor: '#e0dcd5',
          }}
        />

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2
              className="mb-3"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: charcoal,
                letterSpacing: '3px',
                fontVariant: 'small-caps',
                textTransform: 'uppercase',
              }}
            >
              Core Competencies
            </h2>
            <div
              className="mb-4"
              style={{ width: '40px', height: '1px', backgroundColor: goldColor }}
            />
            <p style={{ fontSize: '10.5px', color: '#5a5a5a', lineHeight: 1.6 }}>
              {skills
                .filter((s) => s.items.trim())
                .flatMap((s) => s.items.split(/,\s*/).map((i) => i.trim()).filter(Boolean))
                .join('  \u2022  ')}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div className="mb-6">
            <h2
              className="mb-3"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: charcoal,
                letterSpacing: '3px',
                fontVariant: 'small-caps',
                textTransform: 'uppercase',
              }}
            >
              Professional Experience
            </h2>
            <div
              className="mb-4"
              style={{ width: '40px', height: '1px', backgroundColor: goldColor }}
            />
            <div className="space-y-5">
              {workExperience.map((job) => (
                <div
                  key={job.id}
                  style={{}}
                >
                  <div className="flex justify-between items-baseline">
                    <h3
                      className="text-gray-900"
                      style={{ fontSize: '13px', fontWeight: 700 }}
                    >
                      {job.position}
                    </h3>
                    <span
                      className="whitespace-nowrap ml-4 shrink-0"
                      style={{ fontSize: '10px', color: '#8a8275' }}
                    >
                      {job.startDate}
                      {(job.endDate || job.current) &&
                        ` — ${job.current ? 'Present' : job.endDate}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <p
                      style={{ fontSize: '11.5px', color: goldColor, fontWeight: 600 }}
                    >
                      {job.company}
                    </p>
                    {job.location && (
                      <span
                        className="whitespace-nowrap ml-4 shrink-0"
                        style={{ fontSize: '10px', color: '#8a8275' }}
                      >
                        {job.location}
                      </span>
                    )}
                  </div>
                  {job.description && (
                    <p style={{ fontSize: '10.5px', color: '#4a4a4a' }}>
                      {job.description}
                    </p>
                  )}
                  {job.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5 list-none">
                      {job.highlights
                        .filter((h) => h.trim())
                        .map((highlight, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2"
                            style={{ fontSize: '10px', color: '#5a5a5a' }}
                          >
                            <span
                              className="shrink-0"
                              style={{ color: goldColor, marginTop: '1px' }}
                            >
                              ◆
                            </span>
                            <span>{highlight}</span>
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
          <div className="mb-6">
            <h2
              className="mb-3"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: charcoal,
                letterSpacing: '3px',
                fontVariant: 'small-caps',
                textTransform: 'uppercase',
              }}
            >
              Education
            </h2>
            <div
              className="mb-4"
              style={{ width: '40px', height: '1px', backgroundColor: goldColor }}
            />
            <div className="space-y-3">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  style={{}}
                >
                  <div className="flex justify-between items-baseline">
                    <h3
                      className="text-gray-900"
                      style={{ fontSize: '12px', fontWeight: 700 }}
                    >
                      {edu.institution}
                    </h3>
                    <span
                      className="whitespace-nowrap ml-4 shrink-0"
                      style={{ fontSize: '10px', color: '#8a8275' }}
                    >
                      {edu.startDate}
                      {edu.endDate && ` — ${edu.endDate}`}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#4a4a4a' }}>
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </p>
                  {edu.gpa && (
                    <p style={{ fontSize: '10px', color: '#8a8275' }}>GPA: {edu.gpa}</p>
                  )}
                  {edu.description && (
                    <p className="mt-0.5" style={{ fontSize: '10px', color: '#5a5a5a' }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-6">
            <h2
              className="mb-3"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: charcoal,
                letterSpacing: '3px',
                fontVariant: 'small-caps',
                textTransform: 'uppercase',
              }}
            >
              Certifications &amp; Credentials
            </h2>
            <div
              className="mb-4"
              style={{ width: '40px', height: '1px', backgroundColor: goldColor }}
            />
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex justify-between items-baseline"
                  style={{}}
                >
                  <div>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#2d2d2d' }}>
                      {cert.name}
                    </span>
                    {cert.issuer && (
                      <span style={{ fontSize: '10.5px', color: '#6b6356' }}>
                        {' '}
                        — {cert.issuer}
                      </span>
                    )}
                  </div>
                  {cert.date && (
                    <span
                      className="whitespace-nowrap ml-4 shrink-0"
                      style={{ fontSize: '10px', color: '#8a8275' }}
                    >
                      {cert.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
