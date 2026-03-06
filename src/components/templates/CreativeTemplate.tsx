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

  return (
    <div
      className="w-full h-full bg-white flex"
      style={{
        fontFamily: 'Calibri, Carlito, sans-serif',
        fontSize: '11pt',
      }}
    >
      {/* Main Content - Left */}
      <div
        className="flex-1"
        style={{ padding: '40px 32px 40px 40px', boxSizing: 'border-box' }}
      >
        {/* Name */}
        <div className="mb-5">
          <h1 style={{ fontSize: '34px', fontWeight: 800, lineHeight: 1.1 }}>
            <span style={{ color: accentColor }}>{firstName}</span>
            {restOfName && (
              <span className="text-gray-800"> {restOfName}</span>
            )}
          </h1>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
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
          <div className="mb-6">
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
          <div className="mb-6">
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
          <div className="mb-6">
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
      </div>

      {/* Sidebar - Right */}
      <div
        className="shrink-0 text-white"
        style={{
          width: '33%',
          backgroundColor: accentColor,
          padding: '40px 24px',
          boxSizing: 'border-box',
          borderRadius: '0 0 0 40px',
        }}
      >
        {/* Contact Info */}
        <div className="mb-5">
          <h2
            className="font-bold text-white uppercase tracking-wider mb-4"
            style={{ fontSize: '11px' }}
          >
            Contact
          </h2>
          <div className="space-y-3" style={{ fontSize: '10.5px' }}>
            {personalInfo.email && (
              <div>
                <p className="opacity-60 uppercase" style={{ fontSize: '8px', letterSpacing: '1px' }}>
                  Email
                </p>
                <p className="opacity-90 break-all">{personalInfo.email}</p>
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <p className="opacity-60 uppercase" style={{ fontSize: '8px', letterSpacing: '1px' }}>
                  Phone
                </p>
                <p className="opacity-90">{personalInfo.phone}</p>
              </div>
            )}
            {personalInfo.address && (
              <div>
                <p className="opacity-60 uppercase" style={{ fontSize: '8px', letterSpacing: '1px' }}>
                  Location
                </p>
                <p className="opacity-90">{personalInfo.address}</p>
              </div>
            )}
            {personalInfo.linkedin && (
              <div>
                <p className="opacity-60 uppercase" style={{ fontSize: '8px', letterSpacing: '1px' }}>
                  LinkedIn
                </p>
                <p className="opacity-90 break-all">{personalInfo.linkedin}</p>
              </div>
            )}
            {personalInfo.website && (
              <div>
                <p className="opacity-60 uppercase" style={{ fontSize: '8px', letterSpacing: '1px' }}>
                  Website
                </p>
                <p className="opacity-90 break-all">{personalInfo.website}</p>
              </div>
            )}
          </div>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2
              className="font-bold text-white uppercase tracking-wider mb-4"
              style={{ fontSize: '11px' }}
            >
              Certifications
            </h2>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white/10 p-2.5"
                  style={{ borderRadius: '6px' }}
                >
                  <p
                    className="font-semibold text-white"
                    style={{ fontSize: '10.5px' }}
                  >
                    {cert.name}
                  </p>
                  {cert.issuer && (
                    <p className="opacity-75" style={{ fontSize: '9.5px' }}>
                      {cert.issuer}
                    </p>
                  )}
                  {cert.date && (
                    <p className="opacity-60" style={{ fontSize: '9px' }}>
                      {cert.date}
                    </p>
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
