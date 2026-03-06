import type { TemplateProps } from './TemplateRenderer';

export function ModernTemplate({
  personalInfo,
  workExperience,
  education,
  certifications,
  skills,
}: TemplateProps) {
  return (
    <div
      className="w-full h-full bg-white flex"
      style={{ fontFamily: 'Calibri, Carlito, sans-serif', fontSize: '11pt' }}
    >
      {/* Sidebar */}
      <div
        className="text-white shrink-0"
        style={{
          width: '35%',
          backgroundColor: '#1e3a5f',
          padding: '36px 24px',
          boxSizing: 'border-box',
        }}
      >
        {/* Name */}
        <div className="mb-6">
          <h1
            className="font-bold text-white leading-tight"
            style={{ fontSize: '24px' }}
          >
            {personalInfo.fullName}
          </h1>
        </div>

        {/* Contact Info */}
        <div className="mb-6">
          <h2
            className="font-semibold text-white uppercase tracking-wider mb-3"
            style={{ fontSize: '11px' }}
          >
            Contact
          </h2>
          <div
            className="w-8 mb-3"
            style={{ height: '2px', backgroundColor: '#5b9bd5' }}
          />
          <div className="space-y-2" style={{ fontSize: '10.5px' }}>
            {personalInfo.email && (
              <div className="flex items-start gap-2">
                <span className="opacity-70 shrink-0" style={{ fontSize: '10px' }}>
                  EMAIL
                </span>
                <span className="break-all opacity-90">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-start gap-2">
                <span className="opacity-70 shrink-0" style={{ fontSize: '10px' }}>
                  PHONE
                </span>
                <span className="opacity-90">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.address && (
              <div className="flex items-start gap-2">
                <span className="opacity-70 shrink-0" style={{ fontSize: '10px' }}>
                  ADDR
                </span>
                <span className="opacity-90">{personalInfo.address}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-start gap-2">
                <span className="opacity-70 shrink-0" style={{ fontSize: '10px' }}>
                  IN
                </span>
                <span className="break-all opacity-90">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-start gap-2">
                <span className="opacity-70 shrink-0" style={{ fontSize: '10px' }}>
                  WEB
                </span>
                <span className="break-all opacity-90">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills in Sidebar */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2
              className="font-semibold text-white uppercase tracking-wider mb-3"
              style={{ fontSize: '11px' }}
            >
              Skills
            </h2>
            <div
              className="w-8 mb-3"
              style={{ height: '2px', backgroundColor: '#5b9bd5' }}
            />
            <div className="space-y-2">
              {skills
                .filter((s) => s.category.trim() || s.items.trim())
                .map((skill) => (
                  <div key={skill.id}>
                    {skill.category && (
                      <p
                        className="font-semibold text-white"
                        style={{ fontSize: '10.5px' }}
                      >
                        {skill.category}
                      </p>
                    )}
                    <p className="opacity-80" style={{ fontSize: '10px' }}>
                      {skill.items}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Certifications in Sidebar */}
        {certifications.length > 0 && (
          <div>
            <h2
              className="font-semibold text-white uppercase tracking-wider mb-3"
              style={{ fontSize: '11px' }}
            >
              Certifications
            </h2>
            <div
              className="w-8 mb-3"
              style={{ height: '2px', backgroundColor: '#5b9bd5' }}
            />
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <p
                    className="font-semibold text-white leading-snug"
                    style={{ fontSize: '11px' }}
                  >
                    {cert.name}
                  </p>
                  {cert.issuer && (
                    <p className="opacity-75" style={{ fontSize: '10px' }}>
                      {cert.issuer}
                    </p>
                  )}
                  {cert.date && (
                    <p className="opacity-60" style={{ fontSize: '9.5px' }}>
                      {cert.date}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className="flex-1"
        style={{ padding: '36px 32px', boxSizing: 'border-box' }}
      >
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-5">
            <h2
              className="font-bold text-gray-800 uppercase tracking-wider mb-2"
              style={{ fontSize: '13px' }}
            >
              Professional Summary
            </h2>
            <div
              className="w-8 mb-2"
              style={{ height: '2px', backgroundColor: '#1e3a5f' }}
            />
            <p className="text-gray-600 leading-relaxed" style={{ fontSize: '11px' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div className="mb-5">
            <h2
              className="font-bold text-gray-800 uppercase tracking-wider mb-2"
              style={{ fontSize: '13px' }}
            >
              Experience
            </h2>
            <div
              className="w-8 mb-3"
              style={{ height: '2px', backgroundColor: '#1e3a5f' }}
            />
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
                  <div className="flex justify-between items-baseline mb-1">
                    <p
                      className="font-medium"
                      style={{ fontSize: '11px', color: '#1e3a5f' }}
                    >
                      {job.company}
                    </p>
                    {job.location && (
                      <span
                        className="text-gray-400 whitespace-nowrap ml-3 shrink-0"
                        style={{ fontSize: '10px' }}
                      >
                        {job.location}
                      </span>
                    )}
                  </div>
                  {job.description && (
                    <p className="text-gray-600" style={{ fontSize: '10.5px' }}>
                      {job.description}
                    </p>
                  )}
                  {job.highlights.length > 0 && (
                    <ul className="mt-1 space-y-0.5 list-disc ml-4">
                      {job.highlights
                        .filter((h) => h.trim())
                        .map((highlight, i) => (
                          <li
                            key={i}
                            className="text-gray-600"
                            style={{ fontSize: '10px' }}
                          >
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
          <div className="mb-5">
            <h2
              className="font-bold text-gray-800 uppercase tracking-wider mb-2"
              style={{ fontSize: '13px' }}
            >
              Education
            </h2>
            <div
              className="w-8 mb-3"
              style={{ height: '2px', backgroundColor: '#1e3a5f' }}
            />
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
                  <p
                    className="font-medium"
                    style={{ fontSize: '11px', color: '#1e3a5f' }}
                  >
                    {edu.institution}
                  </p>
                  {edu.gpa && (
                    <p className="text-gray-500" style={{ fontSize: '10px' }}>
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
    </div>
  );
}
