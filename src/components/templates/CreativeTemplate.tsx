import type { TemplateProps } from './TemplateRenderer';

export function CreativeTemplate({
  personalInfo,
  workExperience,
  education,
  certifications,
  skills,
}: TemplateProps) {
  const accentColor = '#0d9488';

  // Split full name to color the first name differently
  const nameParts = personalInfo.fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const restOfName = nameParts.slice(1).join(' ');

  // Contact line
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
      }}
    >
      {/* Name */}
      <div className="mb-1">
        <h1 style={{ fontSize: '34px', fontWeight: 800, lineHeight: 1.1 }}>
          <span style={{ color: accentColor }}>{firstName}</span>
          {restOfName && (
            <span className="text-gray-800"> {restOfName}</span>
          )}
        </h1>
      </div>

      {/* Contact line */}
      {contactParts.length > 0 && (
        <div className="mb-5">
          <p className="text-gray-500" style={{ fontSize: '10.5px' }}>
            {contactParts.join('  \u2022  ')}
          </p>
        </div>
      )}

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <h2
            className="font-bold text-gray-800 mb-2"
            style={{
              fontSize: '14px',
              paddingLeft: '12px',
              borderLeft: `3px solid ${accentColor}`,
            }}
          >
            About Me
          </h2>
          <p className="text-gray-600 leading-relaxed" style={{ fontSize: '11px' }}>
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2
            className="font-bold text-gray-800 mb-2"
            style={{
              fontSize: '14px',
              paddingLeft: '12px',
              borderLeft: `3px solid ${accentColor}`,
            }}
          >
            Skills
          </h2>
          <div className="space-y-1">
            {skills
              .filter((s) => s.category.trim() || s.items.trim())
              .map((skill) => (
                <div
                  key={skill.id}
                  className="text-gray-600 flex items-start gap-2"
                  style={{ fontSize: '10.5px' }}
                >
                  <span
                    className="shrink-0 mt-1.5"
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: accentColor,
                      display: 'inline-block',
                    }}
                  />
                  <span>
                    {skill.category && (
                      <span style={{ fontWeight: 700 }}>{skill.category}: </span>
                    )}
                    {skill.items}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="mb-5">
          <h2
            className="font-bold text-gray-800 mb-3"
            style={{
              fontSize: '14px',
              paddingLeft: '12px',
              borderLeft: `3px solid ${accentColor}`,
            }}
          >
            Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3
                    className="font-bold text-gray-900"
                    style={{ fontSize: '12.5px' }}
                  >
                    {job.position}
                  </h3>
                  <span
                    className="text-gray-400 whitespace-nowrap ml-3 shrink-0"
                    style={{ fontSize: '10px' }}
                  >
                    {job.startDate}
                    {(job.endDate || job.current) &&
                      ` - ${job.current ? 'Present' : job.endDate}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <p style={{ fontSize: '11px', color: accentColor, fontWeight: 600 }}>
                    {job.company}
                  </p>
                  {job.location && (
                    <span className="text-gray-400 whitespace-nowrap ml-3 shrink-0" style={{ fontSize: '10px' }}>
                      {job.location}
                    </span>
                  )}
                </div>
                {job.description && (
                  <p className="text-gray-600 mt-1" style={{ fontSize: '10.5px' }}>
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
                          className="text-gray-600 flex items-start gap-2"
                          style={{ fontSize: '10px' }}
                        >
                          <span
                            className="shrink-0 mt-1.5"
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: accentColor,
                              display: 'inline-block',
                            }}
                          />
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
        <div className="mb-5">
          <h2
            className="font-bold text-gray-800 mb-3"
            style={{
              fontSize: '14px',
              paddingLeft: '12px',
              borderLeft: `3px solid ${accentColor}`,
            }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3
                    className="font-bold text-gray-900"
                    style={{ fontSize: '12px' }}
                  >
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </h3>
                  <span
                    className="text-gray-400 whitespace-nowrap ml-3 shrink-0"
                    style={{ fontSize: '10px' }}
                  >
                    {edu.startDate}
                    {edu.endDate && ` - ${edu.endDate}`}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: accentColor, fontWeight: 600 }}>
                  {edu.institution}
                </p>
                {edu.gpa && (
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: '10px' }}>
                    GPA: {edu.gpa}
                  </p>
                )}
                {edu.description && (
                  <p className="text-gray-600 mt-0.5" style={{ fontSize: '10px' }}>
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
        <div className="mb-5">
          <h2
            className="font-bold text-gray-800 mb-3"
            style={{
              fontSize: '14px',
              paddingLeft: '12px',
              borderLeft: `3px solid ${accentColor}`,
            }}
          >
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-gray-900" style={{ fontSize: '11px' }}>
                    {cert.name}
                    {cert.issuer && <span className="text-gray-500 font-normal"> — {cert.issuer}</span>}
                  </p>
                  {cert.date && (
                    <span className="text-gray-400 whitespace-nowrap ml-3 shrink-0" style={{ fontSize: '10px' }}>
                      {cert.date}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
