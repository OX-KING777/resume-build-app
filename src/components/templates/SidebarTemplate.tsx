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
        <div className="mb-6">
          <h2
            className="font-semibold uppercase tracking-wider mb-2"
            style={{ fontSize: '11px', color: ACCENT }}
          >
            Contact
          </h2>
          <div
            className="w-8 mb-2"
            style={{ height: '2px', backgroundColor: ACCENT }}
          />
          <div className="space-y-2" style={{ fontSize: '10px' }}>
            {personalInfo.email && (
              <div>
                <span className="block opacity-60 uppercase" style={{ fontSize: '8px' }}>
                  Email
                </span>
                <span className="opacity-90 break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <span className="block opacity-60 uppercase" style={{ fontSize: '8px' }}>
                  Phone
                </span>
                <span className="opacity-90">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.address && (
              <div>
                <span className="block opacity-60 uppercase" style={{ fontSize: '8px' }}>
                  Address
                </span>
                <span className="opacity-90">{personalInfo.address}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div>
                <span className="block opacity-60 uppercase" style={{ fontSize: '8px' }}>
                  LinkedIn
                </span>
                <span className="opacity-90 break-all">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.website && (
              <div>
                <span className="block opacity-60 uppercase" style={{ fontSize: '8px' }}>
                  Website
                </span>
                <span className="opacity-90 break-all">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2
              className="font-semibold uppercase tracking-wider mb-2"
              style={{ fontSize: '11px', color: ACCENT }}
            >
              Skills
            </h2>
            <div
              className="w-8 mb-2"
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
