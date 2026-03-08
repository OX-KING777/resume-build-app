import type { TemplateProps } from './TemplateRenderer';

const SIDEBAR_BG = '#1b2838';
const ACCENT = '#0ea5e9';

export function SidebarTemplate({
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
          width: '33%',
          backgroundColor: SIDEBAR_BG,
          padding: '36px 20px',
          boxSizing: 'border-box',
        }}
      >
        {/* Name */}
        <div className="mb-1">
          <h1
            className="font-bold text-white leading-tight"
            style={{ fontSize: '22px' }}
          >
            {personalInfo.fullName}
          </h1>
        </div>

        {/* Main Title placeholder - uses summary first line or empty */}
        <div className="mb-6">
          <p style={{ fontSize: '11px', color: ACCENT }}>
            {personalInfo.summary?.split('.')[0]}
          </p>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2
            className="font-semibold uppercase tracking-wider mb-3"
            style={{ fontSize: '11px', color: ACCENT }}
          >
            Contact
          </h2>
          <div
            className="w-8 mb-3"
            style={{ height: '2px', backgroundColor: ACCENT }}
          />
          <div className="space-y-2" style={{ fontSize: '10px' }}>
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13L2 4" />
                </svg>
                <span className="opacity-90 break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span className="opacity-90">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.address && (
              <div className="flex items-center gap-2">
                <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="opacity-90">{personalInfo.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h2
              className="font-semibold uppercase tracking-wider mb-3"
              style={{ fontSize: '11px', color: ACCENT }}
            >
              Skills
            </h2>
            <div
              className="w-8 mb-3"
              style={{ height: '2px', backgroundColor: ACCENT }}
            />
            <div className="space-y-3">
              {skills
                .filter((s) => s.category.trim() || s.items.trim())
                .map((skill, idx) => (
                  <div key={skill.id}>
                    {idx > 0 && (
                      <div
                        className="mb-2"
                        style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}
                      />
                    )}
                    {skill.category && (
                      <p
                        className="font-bold text-white"
                        style={{ fontSize: '10px' }}
                      >
                        {skill.category}
                      </p>
                    )}
                    <p className="opacity-75" style={{ fontSize: '9.5px' }}>
                      {skill.items}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2
              className="font-semibold uppercase tracking-wider mb-2"
              style={{ fontSize: '11px', color: ACCENT }}
            >
              Certifications
            </h2>
            <div
              className="w-8 mb-2"
              style={{ height: '2px', backgroundColor: ACCENT }}
            />
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <p
                    className="font-semibold text-white leading-snug"
                    style={{ fontSize: '10px' }}
                  >
                    {cert.name}
                  </p>
                  {cert.issuer && (
                    <p className="opacity-70" style={{ fontSize: '9px' }}>
                      {cert.issuer}
                    </p>
                  )}
                  {cert.date && (
                    <p className="opacity-50" style={{ fontSize: '9px' }}>
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
        style={{ padding: '36px 28px', boxSizing: 'border-box' }}
      >
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-5">
            <h2
              className="font-bold uppercase tracking-wider mb-2"
              style={{ fontSize: '13px', color: ACCENT }}
            >
              Summary
            </h2>
            <div
              className="w-8 mb-2"
              style={{ height: '2px', backgroundColor: ACCENT }}
            />
            <p className="text-gray-600 leading-relaxed" style={{ fontSize: '10.5px' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <div className="mb-5">
            <h2
              className="font-bold uppercase tracking-wider mb-2"
              style={{ fontSize: '13px', color: ACCENT }}
            >
              Professional Experience
            </h2>
            <div
              className="w-8 mb-3"
              style={{ height: '2px', backgroundColor: ACCENT }}
            />
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id}>
                  <p
                    className="font-medium"
                    style={{ fontSize: '11px', color: ACCENT }}
                  >
                    {job.company}
                    {job.location && <span className="text-gray-400"> — {job.location}</span>}
                  </p>
                  <div className="flex justify-between items-baseline">
                    <h3
                      className="font-bold text-gray-900"
                      style={{ fontSize: '12px' }}
                    >
                      {job.position}
                    </h3>
                    <span
                      className="font-bold text-gray-500 whitespace-nowrap ml-3 shrink-0"
                      style={{ fontSize: '10px' }}
                    >
                      {job.startDate}
                      {(job.endDate || job.current) &&
                        ` - ${job.current ? 'Present' : job.endDate}`}
                    </span>
                  </div>
                  {job.description && (
                    <p className="text-gray-600 mt-0.5" style={{ fontSize: '10px' }}>
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
                            style={{ fontSize: '9.5px' }}
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
              className="font-bold uppercase tracking-wider mb-2"
              style={{ fontSize: '13px', color: ACCENT }}
            >
              Education
            </h2>
            <div
              className="w-8 mb-3"
              style={{ height: '2px', backgroundColor: ACCENT }}
            />
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3
                      className="font-bold text-gray-900"
                      style={{ fontSize: '11.5px' }}
                    >
                      {edu.institution}
                    </h3>
                    <span
                      className="text-gray-400 whitespace-nowrap ml-3 shrink-0"
                      style={{ fontSize: '10px' }}
                    >
                      {edu.startDate}
                      {edu.endDate && ` - ${edu.endDate}`}
                    </span>
                  </div>
                  <p className="text-gray-600" style={{ fontSize: '10.5px' }}>
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </p>
                  {edu.gpa && (
                    <p className="text-gray-400" style={{ fontSize: '9.5px' }}>
                      GPA: {edu.gpa}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-gray-500 mt-0.5" style={{ fontSize: '9.5px' }}>
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
