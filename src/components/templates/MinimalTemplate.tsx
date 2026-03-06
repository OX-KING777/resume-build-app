import type { TemplateProps } from './TemplateRenderer';

export function MinimalTemplate({
  personalInfo,
  workExperience,
  education,
  certifications,
  skills,
}: TemplateProps) {
  return (
    <div
      className="w-full h-full bg-white text-gray-800"
      style={{
        fontFamily: 'Calibri, Carlito, sans-serif',
        fontSize: '11pt',
        padding: '48px 52px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header - Name left, Contact right */}
      <div className="flex justify-between items-start mb-6">
        <h1
          className="text-gray-900"
          style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-0.5px' }}
        >
          {personalInfo.fullName}
        </h1>
        <div className="text-right" style={{ fontSize: '10px' }}>
          <div className="space-y-0.5 text-gray-400">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.address && <p>{personalInfo.address}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>
      </div>

      {/* Thin Separator */}
      <div className="mb-6" style={{ height: '0.5px', backgroundColor: '#e5e7eb' }} />

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-7">
          <h2
            className="text-gray-400 uppercase mb-3"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '2px',
            }}
          >
            Summary
          </h2>
          <p className="text-gray-600 leading-relaxed" style={{ fontSize: '11px' }}>
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-7">
          <h2
            className="text-gray-400 uppercase mb-3"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '2px',
            }}
          >
            Skills
          </h2>
          <div className="space-y-1.5">
            {skills
              .filter((s) => s.category.trim() || s.items.trim())
              .map((skill) => (
                <div key={skill.id} style={{ fontSize: '11px' }}>
                  {skill.category && (
                    <span className="text-gray-900" style={{ fontWeight: 500 }}>
                      {skill.category}:{' '}
                    </span>
                  )}
                  <span className="text-gray-500">{skill.items}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="mb-7">
          <h2
            className="text-gray-400 uppercase mb-4"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '2px',
            }}
          >
            Experience
          </h2>
          <div className="space-y-5">
            {workExperience.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <span
                      className="text-gray-900"
                      style={{ fontSize: '13px', fontWeight: 500 }}
                    >
                      {job.position}
                    </span>
                    {job.company && (
                      <span className="text-gray-400 ml-2" style={{ fontSize: '11.5px' }}>
                        {job.company}
                        {job.location && ` \u2022 ${job.location}`}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-gray-300 whitespace-nowrap ml-4 shrink-0"
                    style={{ fontSize: '10px' }}
                  >
                    {job.startDate}
                    {(job.endDate || job.current) &&
                      ` — ${job.current ? 'Present' : job.endDate}`}
                  </span>
                </div>
                {job.description && (
                  <p className="text-gray-500 mt-1" style={{ fontSize: '10.5px' }}>
                    {job.description}
                  </p>
                )}
                {job.highlights.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {job.highlights
                      .filter((h) => h.trim())
                      .map((highlight, i) => (
                        <li
                          key={i}
                          className="text-gray-500 flex items-start gap-2"
                          style={{ fontSize: '10px' }}
                        >
                          <span
                            className="text-gray-300 shrink-0 mt-1"
                            style={{ fontSize: '4px' }}
                          >
                            ●
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
        <div className="mb-7">
          <h2
            className="text-gray-400 uppercase mb-4"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '2px',
            }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span
                      className="text-gray-900"
                      style={{ fontSize: '12px', fontWeight: 500 }}
                    >
                      {edu.degree}
                      {edu.field && `, ${edu.field}`}
                    </span>
                    {edu.institution && (
                      <span className="text-gray-400 ml-2" style={{ fontSize: '11px' }}>
                        {edu.institution}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-gray-300 whitespace-nowrap ml-4 shrink-0"
                    style={{ fontSize: '10px' }}
                  >
                    {edu.startDate}
                    {edu.endDate && ` — ${edu.endDate}`}
                  </span>
                </div>
                {edu.gpa && (
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: '9.5px' }}>
                    GPA: {edu.gpa}
                  </p>
                )}
                {edu.description && (
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: '10px' }}>
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
        <div className="mb-7">
          <h2
            className="text-gray-400 uppercase mb-4"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '2px',
            }}
          >
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <div>
                  <span
                    className="text-gray-900"
                    style={{ fontSize: '11.5px', fontWeight: 500 }}
                  >
                    {cert.name}
                  </span>
                  {cert.issuer && (
                    <span className="text-gray-400 ml-2" style={{ fontSize: '10.5px' }}>
                      {cert.issuer}
                    </span>
                  )}
                </div>
                {cert.date && (
                  <span
                    className="text-gray-300 whitespace-nowrap ml-4 shrink-0"
                    style={{ fontSize: '10px' }}
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
  );
}
