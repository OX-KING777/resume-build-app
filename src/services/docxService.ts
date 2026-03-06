import {
  Document,
  Paragraph,
  TextRun,
  Packer,
  TabStopType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';
import type {
  PersonalInfo,
  WorkExperience,
  Education,
  Certification,
  Skill,
  TemplateName,
} from '@/types/resume';

export interface DocxInput {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  selectedTemplate: TemplateName;
}

// Color schemes per template
const COLORS: Record<TemplateName, { primary: string; text: string; muted: string }> = {
  classic: { primary: '16A34A', text: '333333', muted: '6B7280' },
  modern: { primary: '1E3A5F', text: '333333', muted: '6B7280' },
  minimal: { primary: '6B7280', text: '333333', muted: '9CA3AF' },
  creative: { primary: '0D9488', text: '333333', muted: '6B7280' },
  executive: { primary: 'B8860B', text: '2D2D2D', muted: '8A8275' },
  sidebar: { primary: '0EA5E9', text: '333333', muted: '6B7280' },
};

function sectionHeader(title: string, color: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: color,
        space: 2,
      },
    },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: 24,
        font: 'Calibri',
        color: color,
      }),
    ],
  });
}

function bulletPoint(text: string, textColor: string): Paragraph {
  return new Paragraph({
    spacing: { after: 40 },
    bullet: { level: 0 },
    children: [
      new TextRun({
        text,
        size: 22,
        font: 'Calibri',
        color: textColor,
      }),
    ],
  });
}

export async function exportToDocx(
  data: DocxInput,
  fileName: string
): Promise<void> {
  const {
    personalInfo,
    workExperience,
    education,
    certifications,
    skills,
    selectedTemplate,
  } = data;

  const colors = COLORS[selectedTemplate];
  const children: Paragraph[] = [];

  // Right-align tab stop at page edge (Letter 8.5" - 1" margins = 6.5" = 9360 twips)
  const rightTabStop = 9360;

  // === NAME ===
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: personalInfo.fullName || 'Your Name',
          bold: true,
          size: 48,
          font: 'Calibri',
          color: colors.primary,
        }),
      ],
    })
  );

  // === CONTACT INFO (single line, bullet-separated) ===
  const contactParts: string[] = [];
  if (personalInfo.address) contactParts.push(personalInfo.address);
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo.website) contactParts.push(personalInfo.website);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: contactParts.join(' \u2022 '),
            size: 20,
            font: 'Calibri',
            color: colors.muted,
          }),
        ],
      })
    );
  }

  // === SUMMARY ===
  if (personalInfo.summary) {
    children.push(sectionHeader('Summary', colors.primary));
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: personalInfo.summary,
            size: 22,
            font: 'Calibri',
            color: colors.text,
          }),
        ],
      })
    );
  }

  // === SKILLS HIGHLIGHT ===
  if (skills.length > 0) {
    children.push(sectionHeader('Skills Highlight', colors.primary));
    for (const skill of skills) {
      if (!skill.category.trim() && !skill.items.trim()) continue;
      children.push(
        new Paragraph({
          spacing: { after: 30 },
          bullet: { level: 0 },
          children: [
            ...(skill.category
              ? [
                  new TextRun({
                    text: `${skill.category}: `,
                    bold: true,
                    size: 22,
                    font: 'Calibri',
                    color: colors.text,
                  }),
                ]
              : []),
            new TextRun({
              text: skill.items,
              size: 22,
              font: 'Calibri',
              color: colors.text,
            }),
          ],
        })
      );
    }
  }

  // === PROFESSIONAL EXPERIENCE ===
  if (workExperience.length > 0) {
    children.push(sectionHeader('Professional Experience', colors.primary));

    for (const job of workExperience) {
      // Company name (left, colored) + right-aligned location
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 0 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: rightTabStop,
            },
          ],
          children: [
            new TextRun({
              text: job.company,
              bold: true,
              size: 23,
              font: 'Calibri',
              color: colors.primary,
            }),
            ...(job.location
              ? [
                  new TextRun({
                    text: `\t${job.location}`,
                    size: 22,
                    font: 'Calibri',
                    color: colors.text,
                  }),
                ]
              : []),
          ],
        })
      );

      // Position (bold) + dates (right-aligned)
      const dateStr = job.startDate
        ? `${job.startDate} \u2013 ${job.current ? 'Present' : job.endDate}`
        : '';
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: rightTabStop,
            },
          ],
          children: [
            new TextRun({
              text: job.position,
              bold: true,
              size: 22,
              font: 'Calibri',
              color: colors.text,
            }),
            new TextRun({
              text: `\t${dateStr}`,
              size: 22,
              font: 'Calibri',
              color: colors.muted,
            }),
          ],
        })
      );

      // Description
      if (job.description) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: job.description,
                size: 22,
                font: 'Calibri',
                color: colors.text,
              }),
            ],
          })
        );
      }

      // Highlights as bullets
      for (const highlight of job.highlights) {
        if (highlight.trim()) {
          children.push(bulletPoint(highlight, colors.text));
        }
      }
    }
  }

  // === EDUCATION ===
  if (education.length > 0) {
    children.push(sectionHeader('Education', colors.primary));

    for (const edu of education) {
      // Institution + dates right-aligned
      const eduDateStr =
        edu.startDate || edu.endDate
          ? `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}`
          : '';
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 0 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: rightTabStop,
            },
          ],
          children: [
            new TextRun({
              text: edu.institution,
              bold: true,
              size: 23,
              font: 'Calibri',
              color: colors.text,
            }),
            new TextRun({
              text: `\t${eduDateStr}`,
              size: 22,
              font: 'Calibri',
              color: colors.muted,
            }),
          ],
        })
      );

      // Degree + field
      if (edu.degree || edu.field) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: `${edu.degree}${edu.field ? `, ${edu.field}` : ''}`,
                size: 22,
                font: 'Calibri',
                color: colors.text,
              }),
            ],
          })
        );
      }

      if (edu.gpa) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: `GPA: ${edu.gpa}`,
                size: 20,
                font: 'Calibri',
                color: colors.muted,
              }),
            ],
          })
        );
      }

      if (edu.description) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: edu.description,
                size: 22,
                font: 'Calibri',
                color: colors.text,
              }),
            ],
          })
        );
      }
    }
  }

  // === CERTIFICATIONS ===
  if (certifications.length > 0) {
    children.push(sectionHeader('Certifications', colors.primary));

    for (const cert of certifications) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: rightTabStop,
            },
          ],
          children: [
            new TextRun({
              text: cert.name,
              bold: true,
              size: 22,
              font: 'Calibri',
              color: colors.text,
            }),
            ...(cert.issuer
              ? [
                  new TextRun({
                    text: ` \u2014 ${cert.issuer}`,
                    size: 22,
                    font: 'Calibri',
                    color: colors.muted,
                  }),
                ]
              : []),
            ...(cert.date
              ? [
                  new TextRun({
                    text: `\t${cert.date}`,
                    size: 22,
                    font: 'Calibri',
                    color: colors.muted,
                  }),
                ]
              : []),
          ],
        })
      );
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 12240,
              height: 15840,
            },
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileName}.docx`);
}
