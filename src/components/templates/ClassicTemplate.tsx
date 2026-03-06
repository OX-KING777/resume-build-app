import type { TemplateProps } from './TemplateRenderer';
import { useResumeStore } from '@/store/useResumeStore';

const GREEN = '#16a34a';

/**
 * Strip all HTML tags except <b>, </b>, <strong>, </strong>.
 */
function sanitizeBulletHtml(html: string): string {
  // Remove all tags except b and strong
  return html.replace(/<\/?(?!b>|\/b>|strong>|\/strong>)[^>]*>/gi, '');
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '6px',
      }}
    >
      <span
        style={{
          fontFamily: 'Calibri, Carlito, sans-serif',
          fontSize: '14px',
          fontWeight: 700,
          color: GREEN,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}
      >
        {title}
      </span>
      <div
        style={{
          flex: 1,
          height: '2px',
          backgroundColor: GREEN,
        }}
      />
    </div>
  );
}

export function ClassicTemplate({
  personalInfo,
  workExperience,
  education,
  certifications,
  skills,
}: TemplateProps) {
  const mainTitle = useResumeStore((s) => s.mainTitle);

  // Build contact items for the single-line display
  const contactItems: string[] = [];
  if (personalInfo.phone) contactItems.push(personalInfo.phone);
  if (personalInfo.email) contactItems.push(personalInfo.email);
  if (personalInfo.address) contactItems.push(personalInfo.address);
  if (personalInfo.linkedin) contactItems.push(personalInfo.linkedin);
  if (personalInfo.website) contactItems.push(personalInfo.website);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        fontFamily: 'Calibri, Carlito, sans-serif',
        fontSize: '11pt',
        color: '#000000',
        padding: '36px 44px',
        boxSizing: 'border-box',
      }}
    >
      {/* Name */}
      {personalInfo.fullName && (
        <div
          style={{
            fontSize: '26px',
            fontWeight: 700,
            color: GREEN,
            marginBottom: mainTitle ? '2px' : '4px',
            lineHeight: 1.2,
          }}
        >
          {personalInfo.fullName}
        </div>
      )}

      {/* Main Title */}
      {mainTitle && (
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#000000',
            marginBottom: '4px',
            lineHeight: 1.3,
          }}
        >
          {mainTitle}
        </div>
      )}

      {/* Contact info - single line, gray, separated by bullet */}
      {contactItems.length > 0 && (
        <div
          style={{
            fontSize: '10.5px',
            color: '#6b7280',
            marginBottom: '14px',
            lineHeight: 1.4,
          }}
        >
          {contactItems.map((item, i) => (
            <span key={i}>
              {i > 0 && (
                <span style={{ margin: '0 6px', color: '#9ca3af' }}>{'\u2022'}</span>
              )}
              {item}
            </span>
          ))}
        </div>
      )}

      {/* SUMMARY Section */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '12px' }}>
          <SectionHeader title="Summary" />
          <p
            style={{
              fontSize: '11px',
              color: '#000000',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* SKILLS HIGHLIGHT Section */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <SectionHeader title="Skills Highlight" />
          <div style={{ paddingLeft: '4px' }}>
            {skills
              .filter((s) => s.category.trim() || s.items.trim())
              .map((skill) => (
                <div
                  key={skill.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px',
                    fontSize: '11px',
                    color: '#000000',
                    lineHeight: 1.5,
                    marginBottom: '2px',
                  }}
                >
                  <span
                    style={{
                      color: '#000000',
                      fontSize: '7px',
                      lineHeight: '18px',
                      flexShrink: 0,
                    }}
                  >
                    {'\u25CF'}
                  </span>
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

      {/* PROFESSIONAL EXPERIENCE Section */}
      {workExperience.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <SectionHeader title="Professional Experience" />
          <div>
            {workExperience.map((job, jobIndex) => (
              <div
                key={job.id}
                style={{
                  marginBottom: jobIndex < workExperience.length - 1 ? '10px' : '0',
                }}
              >
                {/* Company (green, bold, left) + Location (right) */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: GREEN,
                    }}
                  >
                    {job.company}
                  </span>
                  {job.location && (
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#000000',
                        whiteSpace: 'nowrap',
                        marginLeft: '12px',
                        flexShrink: 0,
                      }}
                    >
                      {job.location}
                    </span>
                  )}
                </div>

                {/* Position (bold, left) + Dates (bold, right) */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#000000',
                    }}
                  >
                    {job.position}
                  </span>
                  {(job.startDate || job.endDate || job.current) && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#000000',
                        whiteSpace: 'nowrap',
                        marginLeft: '12px',
                        flexShrink: 0,
                      }}
                    >
                      {job.startDate}
                      {(job.endDate || job.current) &&
                        ` \u2013 ${job.current ? 'Present' : job.endDate}`}
                    </span>
                  )}
                </div>

                {/* Description */}
                {job.description && (
                  <p
                    style={{
                      fontSize: '11px',
                      color: '#000000',
                      lineHeight: 1.5,
                      margin: '2px 0 0 0',
                    }}
                  >
                    {job.description}
                  </p>
                )}

                {/* Highlights as bullet list with bold HTML support */}
                {job.highlights.length > 0 && (
                  <div style={{ paddingLeft: '4px', marginTop: '2px' }}>
                    {job.highlights
                      .filter((h) => h.trim())
                      .map((highlight, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '6px',
                            fontSize: '11px',
                            color: '#000000',
                            lineHeight: 1.5,
                            marginBottom: '1px',
                          }}
                        >
                          <span
                            style={{
                              color: '#000000',
                              fontSize: '7px',
                              lineHeight: '18px',
                              flexShrink: 0,
                            }}
                          >
                            {'\u25CF'}
                          </span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: sanitizeBulletHtml(highlight),
                            }}
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDUCATION Section */}
      {education.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <SectionHeader title="Education" />
          <div>
            {education.map((edu, eduIndex) => (
              <div
                key={edu.id}
                style={{
                  marginBottom: eduIndex < education.length - 1 ? '6px' : '0',
                }}
              >
                {/* Institution (bold, left) + Dates (right) */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#000000',
                    }}
                  >
                    {edu.institution}
                  </span>
                  {(edu.startDate || edu.endDate) && (
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        whiteSpace: 'nowrap',
                        marginLeft: '12px',
                        flexShrink: 0,
                      }}
                    >
                      {edu.startDate}
                      {edu.endDate && ` - ${edu.endDate}`}
                    </span>
                  )}
                </div>

                {/* Degree, Field (left) */}
                {(edu.degree || edu.field) && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#000000',
                      }}
                    >
                      {edu.degree}
                      {edu.field && `, ${edu.field}`}
                    </span>
                  </div>
                )}

                {edu.gpa && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      marginTop: '1px',
                    }}
                  >
                    GPA: {edu.gpa}
                  </div>
                )}

                {edu.description && (
                  <p
                    style={{
                      fontSize: '11px',
                      color: '#000000',
                      lineHeight: 1.5,
                      margin: '2px 0 0 0',
                    }}
                  >
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATIONS Section */}
      {certifications.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <SectionHeader title="Certifications" />
          <div>
            {certifications.map((cert) => (
              <div
                key={cert.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '2px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#000000',
                    }}
                  >
                    {cert.name}
                  </span>
                  {cert.issuer && (
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#6b7280',
                      }}
                    >
                      {' '}
                      — {cert.issuer}
                    </span>
                  )}
                </div>
                {cert.date && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      whiteSpace: 'nowrap',
                      marginLeft: '12px',
                      flexShrink: 0,
                    }}
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
