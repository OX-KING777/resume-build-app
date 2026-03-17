import { jsPDF } from 'jspdf';
import type {
  PersonalInfo,
  WorkExperience,
  Education,
  Certification,
  Skill,
  TemplateName,
} from '@/types/resume';

export interface PdfInput {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  selectedTemplate: TemplateName;
}

// Color schemes per template (RGB tuples)
const COLORS: Record<TemplateName, { primary: [number, number, number]; text: [number, number, number]; muted: [number, number, number] }> = {
  classic: { primary: [22, 163, 74], text: [51, 51, 51], muted: [107, 114, 128] },
  modern: { primary: [30, 58, 95], text: [51, 51, 51], muted: [107, 114, 128] },
  minimal: { primary: [107, 114, 128], text: [51, 51, 51], muted: [156, 163, 175] },
  creative: { primary: [13, 148, 136], text: [51, 51, 51], muted: [107, 114, 128] },
  executive: { primary: [184, 134, 11], text: [45, 45, 45], muted: [138, 130, 117] },
  sidebar: { primary: [14, 165, 233], text: [51, 51, 51], muted: [107, 114, 128] },
  professional: { primary: [26, 54, 93], text: [51, 51, 51], muted: [107, 114, 128] },
  elegant: { primary: [114, 47, 55], text: [51, 51, 51], muted: [138, 130, 117] },
  bold: { primary: [4, 120, 87], text: [51, 51, 51], muted: [107, 114, 128] },
  accent: { primary: [231, 76, 60], text: [44, 62, 80], muted: [107, 114, 128] },
};

// Page constants (in points, 72pt = 1 inch)
const PAGE_W = 612; // 8.5"
const PAGE_H = 792; // 11"
const MARGIN_LEFT = 40;
const MARGIN_RIGHT = 40;
const MARGIN_TOP = 40;
const MARGIN_BOTTOM = 40;
const CONTENT_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT;
const RIGHT_EDGE = PAGE_W - MARGIN_RIGHT;
const BOTTOM_LIMIT = PAGE_H - MARGIN_BOTTOM;

// Font sizes matching reference PDF
const FONT = {
  name: 18,
  title: 10.5,
  contact: 10,
  sectionHeader: 11,
  companyName: 10.5,
  position: 10,
  body: 9.5,
  dateText: 9.5,
  pageNumber: 8,
};

const LINE_HEIGHT = 1.35;
const GREEN_BAR_HEIGHT = 6;

interface TextSegment {
  text: string;
  bold: boolean;
}

/** Parse <b>...</b> tags into segments */
function parseHtmlBold(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const regex = /<b>(.*?)<\/b>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), bold: false });
    }
    segments.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), bold: false });
  }

  if (segments.length === 0) {
    segments.push({ text, bold: false });
  }

  return segments;
}

/** Strip HTML tags for plain text fallback */
function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/** Check if we need a new page; if so, add one and return the reset Y */
function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > BOTTOM_LIMIT) {
    doc.addPage();
    return MARGIN_TOP;
  }
  return y;
}

/**
 * Draw text segments with word-wrap and bold support.
 * Returns the Y position after the last line.
 */
function drawWrappedText(
  doc: jsPDF,
  segments: TextSegment[],
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  color: [number, number, number],
  lineHeight: number = LINE_HEIGHT,
  pageBreakFn?: (doc: jsPDF, y: number, needed: number) => number,
): number {
  const leading = fontSize * lineHeight;
  let curX = x;
  let curY = y;
  const doPageBreak = pageBreakFn || checkPageBreak;

  for (const seg of segments) {
    const style = seg.bold ? 'bold' : 'normal';
    doc.setFont('helvetica', style);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);

    const words = seg.text.split(/(\s+)/);

    for (const word of words) {
      if (word === '') continue;
      const wordWidth = doc.getTextWidth(word);

      if (curX + wordWidth > x + maxWidth && curX > x) {
        curX = x;
        curY += leading;
        curY = doPageBreak(doc, curY, leading);
      }

      doc.text(word, curX, curY);
      curX += wordWidth;
    }
  }

  return curY + leading;
}

/** Draw a simple text line */
function drawText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  color: [number, number, number],
  style: string = 'normal',
): void {
  doc.setFont('helvetica', style);
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);
  doc.text(text, x, y);
}

/** Draw right-aligned text, return the x position where text starts */
function drawTextRight(
  doc: jsPDF,
  text: string,
  y: number,
  fontSize: number,
  color: [number, number, number],
  style: string = 'normal',
): number {
  doc.setFont('helvetica', style);
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);
  const w = doc.getTextWidth(text);
  const x = RIGHT_EDGE - w;
  doc.text(text, x, y);
  return x;
}

/** Add page numbers "Page X of Y" to all pages */
function addPageNumbers(doc: jsPDF, color: [number, number, number]) {
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONT.pageNumber);
    doc.setTextColor(...color);

    const text = `Page ${i} of ${totalPages}`;
    const w = doc.getTextWidth(text);
    doc.text(text, RIGHT_EDGE - w, PAGE_H - 20);
  }
}

// ===== Sidebar-layout PDF rendering =====

const SIDEBAR_W = 200;
const SIDEBAR_BG: [number, number, number] = [27, 40, 56]; // #1b2838
const SIDEBAR_ACCENT: [number, number, number] = [14, 165, 233]; // #0ea5e9
const WHITE: [number, number, number] = [255, 255, 255];

const SIDEBAR_LEFT = 16;
const SIDEBAR_RIGHT = SIDEBAR_W - 16;
const SIDEBAR_TEXT_W = SIDEBAR_RIGHT - SIDEBAR_LEFT;
const MAIN_LEFT = SIDEBAR_W + 16;
const MAIN_TEXT_W = PAGE_W - MAIN_LEFT - MARGIN_RIGHT;

function drawSidebarBackground(doc: jsPDF) {
  doc.setFillColor(...SIDEBAR_BG);
  doc.rect(0, 0, SIDEBAR_W, PAGE_H, 'F');
}

function checkSidebarPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > BOTTOM_LIMIT) {
    doc.addPage();
    drawSidebarBackground(doc);
    return MARGIN_TOP;
  }
  return y;
}

function drawSidebarWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  color: [number, number, number],
  style: string = 'normal',
): number {
  doc.setFont('helvetica', style);
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);
  const leading = fontSize * LINE_HEIGHT;
  const words = text.split(/(\s+)/);
  let curX = x;
  let curY = y;

  for (const word of words) {
    if (word === '') continue;
    const wordWidth = doc.getTextWidth(word);
    if (curX + wordWidth > x + maxWidth && curX > x) {
      curX = x;
      curY += leading;
    }
    doc.text(word, curX, curY);
    curX += wordWidth;
  }

  return curY + leading;
}

function renderSidebarPdf(
  doc: jsPDF,
  data: PdfInput,
  colors: { primary: [number, number, number]; text: [number, number, number]; muted: [number, number, number] },
) {
  const { personalInfo, workExperience, education, certifications, skills } = data;

  drawSidebarBackground(doc);

  let sy = MARGIN_TOP;

  // Name
  drawText(doc, personalInfo.fullName || 'Your Name', SIDEBAR_LEFT, sy, 18, WHITE, 'bold');
  sy += 28;

  // Contact section
  const contactValues: { icon: 'email' | 'phone' | 'address'; value: string }[] = [];
  if (personalInfo.email) contactValues.push({ icon: 'email', value: personalInfo.email });
  if (personalInfo.phone) contactValues.push({ icon: 'phone', value: personalInfo.phone });
  if (personalInfo.address) contactValues.push({ icon: 'address', value: personalInfo.address });

  if (contactValues.length > 0) {
    drawText(doc, 'CONTACT', SIDEBAR_LEFT, sy, 10, SIDEBAR_ACCENT, 'bold');
    sy += 8;
    doc.setDrawColor(...SIDEBAR_ACCENT);
    doc.setLineWidth(1.5);
    doc.line(SIDEBAR_LEFT, sy, SIDEBAR_LEFT + 30, sy);
    sy += 12;

    const ICON_SIZE = 8;
    const ICON_GAP = 8;
    const TEXT_X = SIDEBAR_LEFT + ICON_SIZE + ICON_GAP;
    const TEXT_W = SIDEBAR_TEXT_W - ICON_SIZE - ICON_GAP;

    for (const item of contactValues) {
      const iconCX = SIDEBAR_LEFT + ICON_SIZE / 2;
      const iconCY = sy - ICON_SIZE / 2 + 1;

      doc.setDrawColor(190, 190, 190);
      doc.setLineWidth(0.7);

      if (item.icon === 'email') {
        const ew = ICON_SIZE;
        const eh = ICON_SIZE * 0.65;
        const ex = SIDEBAR_LEFT;
        const ey = iconCY - eh / 2;
        doc.rect(ex, ey, ew, eh, 'S');
        doc.line(ex, ey, ex + ew / 2, ey + eh * 0.55);
        doc.line(ex + ew / 2, ey + eh * 0.55, ex + ew, ey);
      } else if (item.icon === 'phone') {
        const pw = ICON_SIZE * 0.55;
        const ph = ICON_SIZE;
        const px = iconCX - pw / 2;
        const py = iconCY - ph / 2;
        doc.roundedRect(px, py, pw, ph, 1.5, 1.5, 'S');
        doc.line(px + pw * 0.3, py + 1.5, px + pw * 0.7, py + 1.5);
        doc.circle(iconCX, py + ph - 2, 0.8, 'S');
      } else if (item.icon === 'address') {
        const pinR = 2.5;
        doc.circle(iconCX, iconCY - 1, pinR, 'S');
        doc.circle(iconCX, iconCY - 1, 0.8, 'F');
        doc.line(iconCX - pinR * 0.6, iconCY + 1, iconCX, iconCY + pinR + 2);
        doc.line(iconCX + pinR * 0.6, iconCY + 1, iconCX, iconCY + pinR + 2);
      }

      sy = drawSidebarWrappedText(doc, item.value, TEXT_X, sy, TEXT_W, 8.5, [230, 230, 230]);
      sy += 6;
    }
    sy += 8;
  }

  // Skills section
  if (skills.length > 0) {
    sy += 6;
    drawText(doc, 'SKILLS', SIDEBAR_LEFT, sy, 10, SIDEBAR_ACCENT, 'bold');
    sy += 8;
    doc.setDrawColor(...SIDEBAR_ACCENT);
    doc.setLineWidth(1.5);
    doc.line(SIDEBAR_LEFT, sy, SIDEBAR_LEFT + 30, sy);
    sy += 12;

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      if (!skill.category.trim() && !skill.items.trim()) continue;
      if (i > 0) sy += 4;
      if (skill.category) {
        drawText(doc, skill.category, SIDEBAR_LEFT, sy, 9, WHITE, 'bold');
        sy += 12;
      }
      if (skill.items) {
        sy = drawSidebarWrappedText(doc, skill.items, SIDEBAR_LEFT, sy, SIDEBAR_TEXT_W, 8, [200, 200, 200]);
        sy += 4;
      }
    }
    sy += 6;
  }

  // Certifications
  if (certifications.length > 0) {
    drawText(doc, 'CERTIFICATIONS', SIDEBAR_LEFT, sy, 10, SIDEBAR_ACCENT, 'bold');
    sy += 6;
    doc.setDrawColor(...SIDEBAR_ACCENT);
    doc.setLineWidth(1.5);
    doc.line(SIDEBAR_LEFT, sy, SIDEBAR_LEFT + 30, sy);
    sy += 8;

    for (const cert of certifications) {
      drawText(doc, cert.name, SIDEBAR_LEFT, sy, 9, WHITE, 'bold');
      sy += 11;
      if (cert.issuer) { drawText(doc, cert.issuer, SIDEBAR_LEFT, sy, 8, [180, 180, 180]); sy += 10; }
      if (cert.date) { drawText(doc, cert.date, SIDEBAR_LEFT, sy, 7.5, [150, 150, 150]); sy += 10; }
      sy += 2;
    }
  }

  // ---- MAIN COLUMN ----
  let y = MARGIN_TOP;
  const BULLET = '\u2022   ';
  const BULLET_INDENT = 16;

  function drawMainSectionHeader(title: string) {
    y = checkSidebarPageBreak(doc, y, 28);
    y += 6;
    const headerText = title.toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(FONT.sectionHeader);
    doc.setTextColor(...colors.primary);
    doc.text(headerText, MAIN_LEFT, y);

    const textWidth = doc.getTextWidth(headerText);
    const lineStart = MAIN_LEFT + textWidth + 8;
    const mainRightEdge = PAGE_W - MARGIN_RIGHT;
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(1.5);
    doc.line(lineStart, y - 3, mainRightEdge, y - 3);

    y += 12;
  }

  // Summary
  if (personalInfo.summary) {
    drawMainSectionHeader('Summary');
    y = checkSidebarPageBreak(doc, y, 14);
    const summarySegments = parseHtmlBold(personalInfo.summary);
    y = drawWrappedText(doc, summarySegments, MAIN_LEFT, y, MAIN_TEXT_W, FONT.body, colors.text, LINE_HEIGHT, checkSidebarPageBreak);
    y += 6;
  }

  // Experience
  if (workExperience.length > 0) {
    drawMainSectionHeader('Professional Experience');

    for (const job of workExperience) {
      y = checkSidebarPageBreak(doc, y, 40);
      y += 2;

      drawText(doc, job.company, MAIN_LEFT, y, FONT.companyName, colors.primary, 'bold');
      if (job.location) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(FONT.dateText);
        doc.setTextColor(...colors.text);
        const locW = doc.getTextWidth(job.location);
        doc.text(job.location, PAGE_W - MARGIN_RIGHT - locW, y);
      }
      y += FONT.companyName + 4;

      const dateStr = job.startDate ? `${job.startDate} \u2013 ${job.current ? 'Present' : job.endDate}` : '';
      drawText(doc, job.position, MAIN_LEFT, y, FONT.position, colors.text, 'bold');
      if (dateStr) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(FONT.dateText);
        doc.setTextColor(...colors.text);
        const dw = doc.getTextWidth(dateStr);
        doc.text(dateStr, PAGE_W - MARGIN_RIGHT - dw, y);
      }
      y += FONT.position + 6;

      if (job.description) {
        y = checkSidebarPageBreak(doc, y, 14);
        const descSegments = parseHtmlBold(job.description);
        y = drawWrappedText(doc, descSegments, MAIN_LEFT, y, MAIN_TEXT_W, FONT.body, colors.text, LINE_HEIGHT, checkSidebarPageBreak);
      }

      for (const highlight of job.highlights) {
        const clean = stripHtml(highlight).trim();
        if (!clean) continue;
        y = checkSidebarPageBreak(doc, y, 14);
        const parsed = parseHtmlBold(highlight);
        drawText(doc, BULLET, MAIN_LEFT, y, FONT.body, colors.text);
        y = drawWrappedText(doc, parsed, MAIN_LEFT + BULLET_INDENT, y, MAIN_TEXT_W - BULLET_INDENT, FONT.body, colors.text, LINE_HEIGHT, checkSidebarPageBreak);
      }
      y += 4;
    }
  }

  // Education
  if (education.length > 0) {
    drawMainSectionHeader('Education');

    for (const edu of education) {
      y = checkSidebarPageBreak(doc, y, 28);

      drawText(doc, edu.institution, MAIN_LEFT, y, FONT.companyName, colors.text, 'bold');
      const eduDateStr = edu.startDate || edu.endDate ? `${edu.startDate}${edu.endDate ? ' - ' + edu.endDate : ''}` : '';
      if (eduDateStr) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(FONT.dateText);
        doc.setTextColor(...colors.text);
        const dw = doc.getTextWidth(eduDateStr);
        doc.text(eduDateStr, PAGE_W - MARGIN_RIGHT - dw, y);
      }
      y += FONT.companyName + 4;

      if (edu.degree || edu.field) {
        const degreeStr = `${edu.degree}${edu.field ? ', ' + edu.field : ''}`;
        drawText(doc, degreeStr, MAIN_LEFT, y, FONT.body, colors.text);
        y += FONT.body + 4;
      }

      if (edu.gpa) {
        drawText(doc, `GPA: ${edu.gpa}`, MAIN_LEFT, y, FONT.body, colors.muted);
        y += FONT.body + 4;
      }

      if (edu.description) {
        y = checkSidebarPageBreak(doc, y, 14);
        y = drawWrappedText(doc, [{ text: edu.description, bold: false }], MAIN_LEFT, y, MAIN_TEXT_W, FONT.body, colors.text, LINE_HEIGHT, checkSidebarPageBreak);
      }

      y += 4;
    }
  }
}

// ===== Creative-layout PDF rendering =====

const CREATIVE_ACCENT: [number, number, number] = [13, 148, 136];

function renderCreativePdf(doc: jsPDF, data: PdfInput) {
  const { personalInfo, workExperience, education, certifications, skills } = data;
  const TEXT: [number, number, number] = [51, 51, 51];
  const GRAY: [number, number, number] = [107, 114, 128];
  const DARK: [number, number, number] = [31, 41, 55];

  let y = MARGIN_TOP;

  const nameParts = (personalInfo.fullName || 'Your Name').trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const restOfName = nameParts.slice(1).join(' ');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...CREATIVE_ACCENT);
  doc.text(firstName, MARGIN_LEFT, y);
  const fnWidth = doc.getTextWidth(firstName + ' ');
  if (restOfName) {
    doc.setTextColor(...DARK);
    doc.text(restOfName, MARGIN_LEFT + fnWidth, y);
  }
  y += 14;

  const contactParts: string[] = [];
  if (personalInfo.address) contactParts.push(personalInfo.address);
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.website) contactParts.push(personalInfo.website);

  if (contactParts.length > 0) {
    const contactStr = contactParts.join('  \u2022  ');
    drawText(doc, contactStr, MARGIN_LEFT, y, FONT.contact, GRAY);
    y += FONT.contact + 10;
  }

  function drawCreativeSectionHeader(title: string) {
    y = checkPageBreak(doc, y, 28);
    y += 4;
    doc.setFillColor(...CREATIVE_ACCENT);
    doc.rect(MARGIN_LEFT, y - 10, 3, 13, 'F');
    drawText(doc, title, MARGIN_LEFT + 12, y, 12, DARK, 'bold');
    y += 14;
  }

  if (personalInfo.summary) {
    drawCreativeSectionHeader('About Me');
    y = checkPageBreak(doc, y, 14);
    const summarySegments = parseHtmlBold(personalInfo.summary);
    y = drawWrappedText(doc, summarySegments, MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
    y += 4;
  }

  if (skills.length > 0) {
    drawCreativeSectionHeader('Skills');
    for (const skill of skills) {
      if (!skill.category.trim() && !skill.items.trim()) continue;
      y = checkPageBreak(doc, y, 14);
      doc.setFillColor(...CREATIVE_ACCENT);
      doc.circle(MARGIN_LEFT + 3, y - 3, 2.2, 'F');
      const segments: TextSegment[] = [];
      if (skill.category) segments.push({ text: `${skill.category}: `, bold: true });
      segments.push({ text: skill.items, bold: false });
      y = drawWrappedText(doc, segments, MARGIN_LEFT + 12, y, CONTENT_W - 12, FONT.body, TEXT);
    }
    y += 4;
  }

  if (workExperience.length > 0) {
    drawCreativeSectionHeader('Experience');

    for (const job of workExperience) {
      y = checkPageBreak(doc, y, 40);
      y += 2;

      drawText(doc, job.position, MARGIN_LEFT, y, 11, DARK, 'bold');
      const dateStr = job.startDate ? `${job.startDate} \u2013 ${job.current ? 'Present' : job.endDate}` : '';
      if (dateStr) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const dw = doc.getTextWidth(dateStr);
        doc.text(dateStr, RIGHT_EDGE - dw, y);
      }
      y += 13;

      drawText(doc, job.company, MARGIN_LEFT, y, 10, CREATIVE_ACCENT, 'bold');
      if (job.location) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const lw = doc.getTextWidth(job.location);
        doc.text(job.location, RIGHT_EDGE - lw, y);
      }
      y += 12;

      if (job.description) {
        y = checkPageBreak(doc, y, 14);
        const descSegments = parseHtmlBold(job.description);
        y = drawWrappedText(doc, descSegments, MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
      }

      for (const highlight of job.highlights) {
        const clean = stripHtml(highlight).trim();
        if (!clean) continue;
        y = checkPageBreak(doc, y, 14);
        doc.setFillColor(...CREATIVE_ACCENT);
        doc.circle(MARGIN_LEFT + 3, y - 3, 2.2, 'F');
        const parsed = parseHtmlBold(highlight);
        y = drawWrappedText(doc, parsed, MARGIN_LEFT + 12, y, CONTENT_W - 12, 9, TEXT);
      }
      y += 6;
    }
  }

  if (education.length > 0) {
    drawCreativeSectionHeader('Education');

    for (const edu of education) {
      y = checkPageBreak(doc, y, 28);
      const degreeStr = `${edu.degree}${edu.field ? ' in ' + edu.field : ''}`;
      drawText(doc, degreeStr, MARGIN_LEFT, y, 11, DARK, 'bold');
      const eduDateStr = edu.startDate || edu.endDate ? `${edu.startDate}${edu.endDate ? ' - ' + edu.endDate : ''}` : '';
      if (eduDateStr) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const dw = doc.getTextWidth(eduDateStr);
        doc.text(eduDateStr, RIGHT_EDGE - dw, y);
      }
      y += 13;
      drawText(doc, edu.institution, MARGIN_LEFT, y, 10, CREATIVE_ACCENT, 'bold');
      y += 12;
      if (edu.gpa) { drawText(doc, `GPA: ${edu.gpa}`, MARGIN_LEFT, y, 9, GRAY); y += 11; }
      if (edu.description) {
        y = checkPageBreak(doc, y, 14);
        y = drawWrappedText(doc, [{ text: edu.description, bold: false }], MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
      }
      y += 4;
    }
  }

  if (certifications.length > 0) {
    drawCreativeSectionHeader('Certifications');
    for (const cert of certifications) {
      y = checkPageBreak(doc, y, 16);
      let certText = cert.name;
      if (cert.issuer) certText += ` \u2014 ${cert.issuer}`;
      drawText(doc, certText, MARGIN_LEFT, y, FONT.body, TEXT, 'bold');
      if (cert.date) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const dw = doc.getTextWidth(cert.date);
        doc.text(cert.date, RIGHT_EDGE - dw, y);
      }
      y += FONT.body + 6;
    }
  }
}

// ===== Modern-layout PDF rendering =====

function renderModernPdf(doc: jsPDF, data: PdfInput) {
  const { personalInfo, workExperience, education, certifications, skills } = data;
  const BLACK: [number, number, number] = [0, 0, 0];
  const DARK: [number, number, number] = [51, 51, 51];
  const GRAY: [number, number, number] = [85, 85, 85];

  let y = MARGIN_TOP;

  drawText(doc, personalInfo.fullName || 'Your Name', MARGIN_LEFT, y, 20, BLACK, 'bold');
  y += 14;

  const contactParts: string[] = [];
  if (personalInfo.address) contactParts.push(personalInfo.address);
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.website) contactParts.push(personalInfo.website);

  if (contactParts.length > 0) {
    const contactStr = contactParts.join('  |  ');
    drawText(doc, contactStr, MARGIN_LEFT, y, FONT.contact, GRAY);
    y += FONT.contact + 8;
  }

  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.75);
  doc.line(MARGIN_LEFT, y, RIGHT_EDGE, y);
  y += 12;

  function drawModernSectionHeader(title: string) {
    y = checkPageBreak(doc, y, 24);
    y += 4;
    const headerText = title.toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(FONT.sectionHeader);
    doc.setTextColor(...BLACK);
    doc.setCharSpace(1.2);
    doc.text(headerText, MARGIN_LEFT, y);
    doc.setCharSpace(0);
    y += 12;
  }

  if (personalInfo.summary) {
    drawModernSectionHeader('Professional Summary');
    y = checkPageBreak(doc, y, 14);
    const summarySegments = parseHtmlBold(personalInfo.summary);
    y = drawWrappedText(doc, summarySegments, MARGIN_LEFT, y, CONTENT_W, FONT.body, DARK);
    y += 4;
  }

  if (skills.length > 0) {
    drawModernSectionHeader('Skills');
    for (const skill of skills) {
      if (!skill.category.trim() && !skill.items.trim()) continue;
      y = checkPageBreak(doc, y, 14);
      const segments: TextSegment[] = [];
      if (skill.category) segments.push({ text: `${skill.category}: `, bold: true });
      segments.push({ text: skill.items, bold: false });
      y = drawWrappedText(doc, segments, MARGIN_LEFT, y, CONTENT_W, FONT.body, DARK);
    }
    y += 4;
  }

  if (workExperience.length > 0) {
    drawModernSectionHeader('Experience');
    const BULLET = '\u2022   ';
    const BULLET_INDENT = 16;

    for (const job of workExperience) {
      y = checkPageBreak(doc, y, 40);
      y += 2;

      drawText(doc, job.position, MARGIN_LEFT, y, 11, BLACK, 'bold');
      const dateStr = job.startDate ? `${job.startDate} \u2013 ${job.current ? 'Present' : job.endDate}` : '';
      if (dateStr) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const dw = doc.getTextWidth(dateStr);
        doc.text(dateStr, RIGHT_EDGE - dw, y);
      }
      y += 13;

      drawText(doc, job.company, MARGIN_LEFT, y, 10, DARK, 'bold');
      if (job.location) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const lw = doc.getTextWidth(job.location);
        doc.text(job.location, RIGHT_EDGE - lw, y);
      }
      y += 12;

      if (job.description) {
        y = checkPageBreak(doc, y, 14);
        const descSegments = parseHtmlBold(job.description);
        y = drawWrappedText(doc, descSegments, MARGIN_LEFT, y, CONTENT_W, FONT.body, DARK);
      }

      for (const highlight of job.highlights) {
        const clean = stripHtml(highlight).trim();
        if (!clean) continue;
        y = checkPageBreak(doc, y, 14);
        drawText(doc, BULLET, MARGIN_LEFT, y, FONT.body, DARK);
        const parsed = parseHtmlBold(highlight);
        y = drawWrappedText(doc, parsed, MARGIN_LEFT + BULLET_INDENT, y, CONTENT_W - BULLET_INDENT, FONT.body, DARK);
      }
      y += 6;
    }
  }

  if (education.length > 0) {
    drawModernSectionHeader('Education');
    for (const edu of education) {
      y = checkPageBreak(doc, y, 28);
      const degreeStr = `${edu.degree}${edu.field ? ', ' + edu.field : ''}`;
      drawText(doc, degreeStr, MARGIN_LEFT, y, 11, BLACK, 'bold');
      const eduDateStr = edu.startDate || edu.endDate ? `${edu.startDate}${edu.endDate ? ' - ' + edu.endDate : ''}` : '';
      if (eduDateStr) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const dw = doc.getTextWidth(eduDateStr);
        doc.text(eduDateStr, RIGHT_EDGE - dw, y);
      }
      y += 13;
      drawText(doc, edu.institution, MARGIN_LEFT, y, 10, DARK, 'bold');
      y += 12;
      if (edu.gpa) { drawText(doc, `GPA: ${edu.gpa}`, MARGIN_LEFT, y, 9, GRAY); y += 11; }
      y += 4;
    }
  }

  if (certifications.length > 0) {
    drawModernSectionHeader('Certifications');
    for (const cert of certifications) {
      y = checkPageBreak(doc, y, 16);
      let certText = cert.name;
      if (cert.issuer) certText += ` \u2014 ${cert.issuer}`;
      drawText(doc, certText, MARGIN_LEFT, y, FONT.body, BLACK, 'bold');
      if (cert.date) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const dw = doc.getTextWidth(cert.date);
        doc.text(cert.date, RIGHT_EDGE - dw, y);
      }
      y += FONT.body + 6;
    }
  }
}

// ===== Executive-layout PDF rendering =====

function renderExecutivePdf(doc: jsPDF, data: PdfInput) {
  const { personalInfo, workExperience, education, certifications, skills } = data;
  const CHARCOAL: [number, number, number] = [45, 45, 45];
  const GOLD: [number, number, number] = [184, 134, 11];
  const TEXT: [number, number, number] = [74, 74, 74];
  const MUTED: [number, number, number] = [138, 130, 117];
  const DARK: [number, number, number] = [45, 45, 45];
  const LIGHT_BG: [number, number, number] = [248, 247, 244];
  const BORDER: [number, number, number] = [224, 220, 213];

  doc.setFillColor(...CHARCOAL);
  doc.rect(0, 0, PAGE_W, 52, 'F');
  doc.setFillColor(...GOLD);
  doc.rect(0, 52, PAGE_W, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...GOLD);
  doc.setCharSpace(2);
  const nameText = (personalInfo.fullName || 'Your Name').toUpperCase();
  const nameW = doc.getTextWidth(nameText);
  doc.text(nameText, (PAGE_W - nameW) / 2, 36);
  doc.setCharSpace(0);

  doc.setFillColor(...LIGHT_BG);
  doc.rect(0, 55, PAGE_W, 24, 'F');
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.5);
  doc.line(0, 79, PAGE_W, 79);

  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.address) contactParts.push(personalInfo.address);
  if (personalInfo.website) contactParts.push(personalInfo.website);

  if (contactParts.length > 0) {
    const contactStr = contactParts.join('    |    ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 99, 86);
    const cw = doc.getTextWidth(contactStr);
    doc.text(contactStr, (PAGE_W - cw) / 2, 70);
  }

  let y = 95;

  function drawExecSectionHeader(title: string) {
    y = checkPageBreak(doc, y, 28);
    y += 6;
    const headerText = title.toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.setCharSpace(3);
    doc.text(headerText, MARGIN_LEFT, y);
    doc.setCharSpace(0);
    y += 4;
    doc.setFillColor(...GOLD);
    doc.rect(MARGIN_LEFT, y, 40, 1, 'F');
    y += 12;
  }

  if (personalInfo.summary) {
    drawExecSectionHeader('Executive Summary');
    y = checkPageBreak(doc, y, 14);
    const summarySegments = parseHtmlBold(personalInfo.summary);
    y = drawWrappedText(doc, summarySegments, MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
    y += 6;
  }

  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.5);
  doc.line(MARGIN_LEFT, y, RIGHT_EDGE, y);
  y += 8;

  if (skills.length > 0) {
    drawExecSectionHeader('Core Competencies');
    const allSkills = skills
      .filter((s) => s.items.trim())
      .flatMap((s) => s.items.split(/,\s*/).map((i) => i.trim()).filter(Boolean))
      .join('  \u2022  ');
    if (allSkills) {
      y = drawWrappedText(doc, [{ text: allSkills, bold: false }], MARGIN_LEFT, y, CONTENT_W, FONT.body, [90, 90, 90]);
    }
    y += 6;
  }

  if (workExperience.length > 0) {
    drawExecSectionHeader('Professional Experience');

    for (const job of workExperience) {
      y = checkPageBreak(doc, y, 40);
      y += 2;

      drawText(doc, job.position, MARGIN_LEFT, y, 12, DARK, 'bold');
      const dateStr = job.startDate ? `${job.startDate} \u2013 ${job.current ? 'Present' : job.endDate}` : '';
      if (dateStr) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        const dw = doc.getTextWidth(dateStr);
        doc.text(dateStr, RIGHT_EDGE - dw, y);
      }
      y += 14;

      drawText(doc, job.company, MARGIN_LEFT, y, 10.5, GOLD, 'bold');
      if (job.location) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        const lw = doc.getTextWidth(job.location);
        doc.text(job.location, RIGHT_EDGE - lw, y);
      }
      y += 12;

      if (job.description) {
        y = checkPageBreak(doc, y, 14);
        const descSegments = parseHtmlBold(job.description);
        y = drawWrappedText(doc, descSegments, MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
      }

      for (const highlight of job.highlights) {
        const clean = stripHtml(highlight).trim();
        if (!clean) continue;
        y = checkPageBreak(doc, y, 14);
        doc.setFillColor(...GOLD);
        const bx = MARGIN_LEFT + 3;
        const by = y - 3;
        doc.triangle(bx, by - 2.5, bx + 2.5, by, bx, by + 2.5, 'F');
        doc.triangle(bx, by - 2.5, bx - 2.5, by, bx, by + 2.5, 'F');
        const parsed = parseHtmlBold(highlight);
        y = drawWrappedText(doc, parsed, MARGIN_LEFT + 12, y, CONTENT_W - 12, 9, [90, 90, 90]);
      }

      y += 8;
    }
  }

  if (education.length > 0) {
    drawExecSectionHeader('Education');

    for (const edu of education) {
      y = checkPageBreak(doc, y, 28);
      drawText(doc, edu.institution, MARGIN_LEFT, y, 11, DARK, 'bold');
      const eduDateStr = edu.startDate || edu.endDate ? `${edu.startDate}${edu.endDate ? ' \u2014 ' + edu.endDate : ''}` : '';
      if (eduDateStr) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        const dw = doc.getTextWidth(eduDateStr);
        doc.text(eduDateStr, RIGHT_EDGE - dw, y);
      }
      y += 13;
      if (edu.degree || edu.field) {
        const degreeStr = `${edu.degree}${edu.field ? ' in ' + edu.field : ''}`;
        drawText(doc, degreeStr, MARGIN_LEFT, y, 10, TEXT);
        y += 12;
      }
      if (edu.gpa) { drawText(doc, `GPA: ${edu.gpa}`, MARGIN_LEFT, y, 9, MUTED); y += 11; }
      y += 6;
    }
  }

  if (certifications.length > 0) {
    drawExecSectionHeader('Certifications & Credentials');
    for (const cert of certifications) {
      y = checkPageBreak(doc, y, 16);
      let certText = cert.name;
      if (cert.issuer) certText += ` \u2014 ${cert.issuer}`;
      drawText(doc, certText, MARGIN_LEFT, y, FONT.body, DARK, 'bold');
      if (cert.date) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        const dw = doc.getTextWidth(cert.date);
        doc.text(cert.date, RIGHT_EDGE - dw, y);
      }
      y += FONT.body + 6;
    }
  }
}

// ===== Professional-layout PDF rendering (Navy header band) =====

function renderProfessionalPdf(doc: jsPDF, data: PdfInput) {
  const { personalInfo, workExperience, education, skills } = data;
  const NAVY: [number, number, number] = [26, 54, 93];
  const TEXT: [number, number, number] = [51, 51, 51];
  const GRAY: [number, number, number] = [107, 114, 128];

  // Navy header band
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, 56, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  const nameText = personalInfo.fullName || 'Your Name';
  const nameW = doc.getTextWidth(nameText);
  doc.text(nameText, (PAGE_W - nameW) / 2, 36);

  // Contact below header
  let y = 72;
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.address) contactParts.push(personalInfo.address);

  if (contactParts.length > 0) {
    const contactStr = contactParts.join('  |  ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    const cw = doc.getTextWidth(contactStr);
    doc.text(contactStr, (PAGE_W - cw) / 2, y);
    y += 18;
  }

  function drawProfSectionHeader(title: string) {
    y = checkPageBreak(doc, y, 28);
    y += 6;
    const headerText = title.toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(FONT.sectionHeader);
    doc.setTextColor(...NAVY);
    doc.text(headerText, MARGIN_LEFT, y);
    y += 4;
    doc.setDrawColor(...NAVY);
    doc.setLineWidth(1);
    doc.line(MARGIN_LEFT, y, RIGHT_EDGE, y);
    y += 12;
  }

  if (personalInfo.summary) {
    drawProfSectionHeader('Summary');
    y = checkPageBreak(doc, y, 14);
    y = drawWrappedText(doc, parseHtmlBold(personalInfo.summary), MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
    y += 4;
  }

  if (skills.length > 0) {
    drawProfSectionHeader('Skills');
    for (const skill of skills) {
      if (!skill.category.trim() && !skill.items.trim()) continue;
      y = checkPageBreak(doc, y, 14);
      const segments: TextSegment[] = [];
      if (skill.category) segments.push({ text: `${skill.category}: `, bold: true });
      segments.push({ text: skill.items, bold: false });
      y = drawWrappedText(doc, segments, MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
    }
    y += 4;
  }

  if (workExperience.length > 0) {
    drawProfSectionHeader('Professional Experience');
    const BULLET = '\u2022   ';
    const BULLET_INDENT = 16;

    for (const job of workExperience) {
      y = checkPageBreak(doc, y, 40);
      y += 2;
      drawText(doc, job.company, MARGIN_LEFT, y, FONT.companyName, NAVY, 'bold');
      if (job.location) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(FONT.dateText);
        doc.setTextColor(...GRAY);
        const lw = doc.getTextWidth(job.location);
        doc.text(job.location, RIGHT_EDGE - lw, y);
      }
      y += FONT.companyName + 4;

      const dateStr = job.startDate ? `${job.startDate} \u2013 ${job.current ? 'Present' : job.endDate}` : '';
      drawText(doc, job.position, MARGIN_LEFT, y, FONT.position, TEXT, 'bold');
      if (dateStr) drawTextRight(doc, dateStr, y, FONT.dateText, GRAY);
      y += FONT.position + 6;

      for (const highlight of job.highlights) {
        const clean = stripHtml(highlight).trim();
        if (!clean) continue;
        y = checkPageBreak(doc, y, 14);
        drawText(doc, BULLET, MARGIN_LEFT, y, FONT.body, TEXT);
        y = drawWrappedText(doc, parseHtmlBold(highlight), MARGIN_LEFT + BULLET_INDENT, y, CONTENT_W - BULLET_INDENT, FONT.body, TEXT);
      }
      y += 4;
    }
  }

  if (education.length > 0) {
    drawProfSectionHeader('Education');
    for (const edu of education) {
      y = checkPageBreak(doc, y, 28);
      drawText(doc, edu.institution, MARGIN_LEFT, y, FONT.companyName, TEXT, 'bold');
      const eduDateStr = edu.startDate || edu.endDate ? `${edu.startDate}${edu.endDate ? ' - ' + edu.endDate : ''}` : '';
      if (eduDateStr) drawTextRight(doc, eduDateStr, y, FONT.dateText, GRAY);
      y += FONT.companyName + 4;
      if (edu.degree || edu.field) {
        drawText(doc, `${edu.degree}${edu.field ? ', ' + edu.field : ''}`, MARGIN_LEFT, y, FONT.body, TEXT);
        y += FONT.body + 4;
      }
      y += 4;
    }
  }
}

// ===== Elegant-layout PDF rendering (Burgundy accents) =====

function renderElegantPdf(doc: jsPDF, data: PdfInput) {
  const { personalInfo, workExperience, education, skills } = data;
  const BURG: [number, number, number] = [114, 47, 55];
  const TEXT: [number, number, number] = [51, 51, 51];
  const GRAY: [number, number, number] = [107, 114, 128];
  const DARK: [number, number, number] = [40, 40, 40];

  // Thin burgundy top border
  doc.setFillColor(...BURG);
  doc.rect(0, 0, PAGE_W, 3, 'F');

  let y = MARGIN_TOP + 8;

  // Name centered
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...DARK);
  const nameText = personalInfo.fullName || 'Your Name';
  const nameW = doc.getTextWidth(nameText);
  doc.text(nameText, (PAGE_W - nameW) / 2, y);
  y += 16;

  // Contact centered
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.address) contactParts.push(personalInfo.address);

  if (contactParts.length > 0) {
    const contactStr = contactParts.join('  \u2022  ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    const cw = doc.getTextWidth(contactStr);
    doc.text(contactStr, (PAGE_W - cw) / 2, y);
    y += 14;
  }

  // Decorative line
  doc.setDrawColor(...BURG);
  doc.setLineWidth(0.5);
  doc.line(MARGIN_LEFT + 80, y, RIGHT_EDGE - 80, y);
  y += 14;

  function drawElegantSectionHeader(title: string) {
    y = checkPageBreak(doc, y, 28);
    y += 6;
    const headerText = title.toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(FONT.sectionHeader);
    doc.setTextColor(...BURG);
    doc.setCharSpace(1.5);
    doc.text(headerText, MARGIN_LEFT, y);
    doc.setCharSpace(0);
    y += 4;
    // Thin decorative line
    doc.setDrawColor(...BURG);
    doc.setLineWidth(0.5);
    doc.line(MARGIN_LEFT, y, RIGHT_EDGE, y);
    y += 12;
  }

  if (personalInfo.summary) {
    drawElegantSectionHeader('Summary');
    y = checkPageBreak(doc, y, 14);
    y = drawWrappedText(doc, parseHtmlBold(personalInfo.summary), MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
    y += 4;
  }

  if (skills.length > 0) {
    drawElegantSectionHeader('Skills');
    for (const skill of skills) {
      if (!skill.category.trim() && !skill.items.trim()) continue;
      y = checkPageBreak(doc, y, 14);
      const segments: TextSegment[] = [];
      if (skill.category) segments.push({ text: `${skill.category}: `, bold: true });
      segments.push({ text: skill.items, bold: false });
      y = drawWrappedText(doc, segments, MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
    }
    y += 4;
  }

  if (workExperience.length > 0) {
    drawElegantSectionHeader('Experience');
    const BULLET = '\u2022   ';
    const BULLET_INDENT = 16;

    for (const job of workExperience) {
      y = checkPageBreak(doc, y, 40);
      y += 2;

      drawText(doc, job.position, MARGIN_LEFT, y, 11, DARK, 'bold');
      const dateStr = job.startDate ? `${job.startDate} \u2013 ${job.current ? 'Present' : job.endDate}` : '';
      if (dateStr) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const dw = doc.getTextWidth(dateStr);
        doc.text(dateStr, RIGHT_EDGE - dw, y);
      }
      y += 13;

      drawText(doc, job.company, MARGIN_LEFT, y, 10, BURG, 'bold');
      if (job.location) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const lw = doc.getTextWidth(job.location);
        doc.text(job.location, RIGHT_EDGE - lw, y);
      }
      y += 12;

      for (const highlight of job.highlights) {
        const clean = stripHtml(highlight).trim();
        if (!clean) continue;
        y = checkPageBreak(doc, y, 14);
        drawText(doc, BULLET, MARGIN_LEFT, y, FONT.body, TEXT);
        y = drawWrappedText(doc, parseHtmlBold(highlight), MARGIN_LEFT + BULLET_INDENT, y, CONTENT_W - BULLET_INDENT, FONT.body, TEXT);
      }
      y += 6;
    }
  }

  if (education.length > 0) {
    drawElegantSectionHeader('Education');
    for (const edu of education) {
      y = checkPageBreak(doc, y, 28);
      drawText(doc, edu.institution, MARGIN_LEFT, y, FONT.companyName, DARK, 'bold');
      const eduDateStr = edu.startDate || edu.endDate ? `${edu.startDate}${edu.endDate ? ' - ' + edu.endDate : ''}` : '';
      if (eduDateStr) drawTextRight(doc, eduDateStr, y, FONT.dateText, GRAY);
      y += FONT.companyName + 4;
      if (edu.degree || edu.field) {
        drawText(doc, `${edu.degree}${edu.field ? ', ' + edu.field : ''}`, MARGIN_LEFT, y, FONT.body, TEXT);
        y += FONT.body + 4;
      }
      y += 4;
    }
  }

  // Bottom border
  doc.setFillColor(...BURG);
  doc.rect(0, PAGE_H - 3, PAGE_W, 3, 'F');
}

// ===== Bold-layout PDF rendering (Dark header, emerald accents) =====

function renderBoldPdf(doc: jsPDF, data: PdfInput) {
  const { personalInfo, workExperience, education, skills } = data;
  const DARK_BG: [number, number, number] = [26, 26, 46];
  const EMERALD: [number, number, number] = [4, 120, 87];
  const TEXT: [number, number, number] = [51, 51, 51];
  const GRAY: [number, number, number] = [107, 114, 128];

  // Dark header block
  doc.setFillColor(...DARK_BG);
  doc.rect(0, 0, PAGE_W, 60, 'F');
  // Emerald accent line below
  doc.setFillColor(...EMERALD);
  doc.rect(0, 60, PAGE_W, 3, 'F');

  // Name in white
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(personalInfo.fullName || 'Your Name', MARGIN_LEFT, 40);

  let y = 80;

  // Contact
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.address) contactParts.push(personalInfo.address);

  if (contactParts.length > 0) {
    const contactStr = contactParts.join('  |  ');
    drawText(doc, contactStr, MARGIN_LEFT, y, FONT.contact, GRAY);
    y += FONT.contact + 10;
  }

  function drawBoldSectionHeader(title: string) {
    y = checkPageBreak(doc, y, 28);
    y += 6;
    const headerText = title.toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...EMERALD);
    doc.text(headerText, MARGIN_LEFT, y);
    y += 4;
    doc.setDrawColor(...EMERALD);
    doc.setLineWidth(1.5);
    doc.line(MARGIN_LEFT, y, MARGIN_LEFT + 50, y);
    y += 12;
  }

  if (personalInfo.summary) {
    drawBoldSectionHeader('Summary');
    y = checkPageBreak(doc, y, 14);
    y = drawWrappedText(doc, parseHtmlBold(personalInfo.summary), MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
    y += 4;
  }

  if (skills.length > 0) {
    drawBoldSectionHeader('Skills');
    for (const skill of skills) {
      if (!skill.category.trim() && !skill.items.trim()) continue;
      y = checkPageBreak(doc, y, 14);
      const segments: TextSegment[] = [];
      if (skill.category) segments.push({ text: `${skill.category}: `, bold: true });
      segments.push({ text: skill.items, bold: false });
      y = drawWrappedText(doc, segments, MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
    }
    y += 4;
  }

  if (workExperience.length > 0) {
    drawBoldSectionHeader('Experience');
    const BULLET = '\u2022   ';
    const BULLET_INDENT = 16;

    for (const job of workExperience) {
      y = checkPageBreak(doc, y, 40);
      y += 2;

      drawText(doc, job.company, MARGIN_LEFT, y, FONT.companyName, EMERALD, 'bold');
      if (job.location) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(FONT.dateText);
        doc.setTextColor(...GRAY);
        const lw = doc.getTextWidth(job.location);
        doc.text(job.location, RIGHT_EDGE - lw, y);
      }
      y += FONT.companyName + 4;

      const dateStr = job.startDate ? `${job.startDate} \u2013 ${job.current ? 'Present' : job.endDate}` : '';
      drawText(doc, job.position, MARGIN_LEFT, y, FONT.position, TEXT, 'bold');
      if (dateStr) drawTextRight(doc, dateStr, y, FONT.dateText, GRAY);
      y += FONT.position + 6;

      for (const highlight of job.highlights) {
        const clean = stripHtml(highlight).trim();
        if (!clean) continue;
        y = checkPageBreak(doc, y, 14);
        drawText(doc, BULLET, MARGIN_LEFT, y, FONT.body, TEXT);
        y = drawWrappedText(doc, parseHtmlBold(highlight), MARGIN_LEFT + BULLET_INDENT, y, CONTENT_W - BULLET_INDENT, FONT.body, TEXT);
      }
      y += 4;
    }
  }

  if (education.length > 0) {
    drawBoldSectionHeader('Education');
    for (const edu of education) {
      y = checkPageBreak(doc, y, 28);
      drawText(doc, edu.institution, MARGIN_LEFT, y, FONT.companyName, TEXT, 'bold');
      const eduDateStr = edu.startDate || edu.endDate ? `${edu.startDate}${edu.endDate ? ' - ' + edu.endDate : ''}` : '';
      if (eduDateStr) drawTextRight(doc, eduDateStr, y, FONT.dateText, GRAY);
      y += FONT.companyName + 4;
      if (edu.degree || edu.field) {
        drawText(doc, `${edu.degree}${edu.field ? ', ' + edu.field : ''}`, MARGIN_LEFT, y, FONT.body, TEXT);
        y += FONT.body + 4;
      }
      y += 4;
    }
  }
}

// ===== Accent-layout PDF rendering (Coral left accent bar) =====

function renderAccentPdf(doc: jsPDF, data: PdfInput) {
  const { personalInfo, workExperience, education, skills } = data;
  const CORAL: [number, number, number] = [231, 76, 60];
  const DARK_TEXT: [number, number, number] = [44, 62, 80];
  const GRAY: [number, number, number] = [107, 114, 128];

  // Thin coral vertical bar on left
  doc.setFillColor(...CORAL);
  doc.rect(0, 0, 6, PAGE_H, 'F');

  const leftOffset = MARGIN_LEFT + 6;
  const contentW = PAGE_W - leftOffset - MARGIN_RIGHT;

  let y = MARGIN_TOP;

  // Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...DARK_TEXT);
  doc.text(personalInfo.fullName || 'Your Name', leftOffset, y);
  y += 14;

  // Contact
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.address) contactParts.push(personalInfo.address);

  if (contactParts.length > 0) {
    const contactStr = contactParts.join('  |  ');
    drawText(doc, contactStr, leftOffset, y, FONT.contact, GRAY);
    y += FONT.contact + 10;
  }

  function drawAccentSectionHeader(title: string) {
    y = checkPageBreak(doc, y, 28);
    // Redraw accent bar on new pages
    doc.setFillColor(...CORAL);
    doc.rect(0, 0, 6, PAGE_H, 'F');
    y += 6;
    drawText(doc, title.toUpperCase(), leftOffset, y, FONT.sectionHeader, CORAL, 'bold');
    y += 12;
  }

  if (personalInfo.summary) {
    drawAccentSectionHeader('Summary');
    y = checkPageBreak(doc, y, 14);
    y = drawWrappedText(doc, parseHtmlBold(personalInfo.summary), leftOffset, y, contentW, FONT.body, DARK_TEXT);
    y += 4;
  }

  if (skills.length > 0) {
    drawAccentSectionHeader('Skills');
    for (const skill of skills) {
      if (!skill.category.trim() && !skill.items.trim()) continue;
      y = checkPageBreak(doc, y, 14);
      const segments: TextSegment[] = [];
      if (skill.category) segments.push({ text: `${skill.category}: `, bold: true });
      segments.push({ text: skill.items, bold: false });
      y = drawWrappedText(doc, segments, leftOffset, y, contentW, FONT.body, DARK_TEXT);
    }
    y += 4;
  }

  if (workExperience.length > 0) {
    drawAccentSectionHeader('Experience');
    const BULLET = '\u2022   ';
    const BULLET_INDENT = 16;

    for (const job of workExperience) {
      y = checkPageBreak(doc, y, 40);
      y += 2;

      drawText(doc, job.position, leftOffset, y, 11, DARK_TEXT, 'bold');
      const dateStr = job.startDate ? `${job.startDate} \u2013 ${job.current ? 'Present' : job.endDate}` : '';
      if (dateStr) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const dw = doc.getTextWidth(dateStr);
        doc.text(dateStr, RIGHT_EDGE - dw, y);
      }
      y += 13;

      drawText(doc, job.company, leftOffset, y, 10, CORAL, 'bold');
      if (job.location) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const lw = doc.getTextWidth(job.location);
        doc.text(job.location, RIGHT_EDGE - lw, y);
      }
      y += 12;

      for (const highlight of job.highlights) {
        const clean = stripHtml(highlight).trim();
        if (!clean) continue;
        y = checkPageBreak(doc, y, 14);
        drawText(doc, BULLET, leftOffset, y, FONT.body, DARK_TEXT);
        y = drawWrappedText(doc, parseHtmlBold(highlight), leftOffset + BULLET_INDENT, y, contentW - BULLET_INDENT, FONT.body, DARK_TEXT);
      }
      y += 6;
    }
  }

  if (education.length > 0) {
    drawAccentSectionHeader('Education');
    for (const edu of education) {
      y = checkPageBreak(doc, y, 28);
      drawText(doc, edu.institution, leftOffset, y, FONT.companyName, DARK_TEXT, 'bold');
      const eduDateStr = edu.startDate || edu.endDate ? `${edu.startDate}${edu.endDate ? ' - ' + edu.endDate : ''}` : '';
      if (eduDateStr) drawTextRight(doc, eduDateStr, y, FONT.dateText, GRAY);
      y += FONT.companyName + 4;
      if (edu.degree || edu.field) {
        drawText(doc, `${edu.degree}${edu.field ? ', ' + edu.field : ''}`, leftOffset, y, FONT.body, DARK_TEXT);
        y += FONT.body + 4;
      }
      y += 4;
    }
  }
}

// ===== Minimal-layout PDF rendering =====

function renderMinimalPdf(doc: jsPDF, data: PdfInput) {
  const { personalInfo, workExperience, education, skills } = data;
  const TEXT: [number, number, number] = [51, 51, 51];
  const GRAY: [number, number, number] = [156, 163, 175];
  const DARK: [number, number, number] = [75, 85, 99];

  let y = MARGIN_TOP;

  // Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...TEXT);
  doc.text(personalInfo.fullName || 'Your Name', MARGIN_LEFT, y);
  y += 16;

  // Contact
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.address) contactParts.push(personalInfo.address);

  if (contactParts.length > 0) {
    const contactStr = contactParts.join('  \u2022  ');
    drawText(doc, contactStr, MARGIN_LEFT, y, 9, GRAY);
    y += 14;
  }

  // Thin divider
  doc.setDrawColor(...GRAY);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_LEFT, y, RIGHT_EDGE, y);
  y += 14;

  function drawMinimalSectionHeader(title: string) {
    y = checkPageBreak(doc, y, 24);
    y += 8;
    drawText(doc, title.toUpperCase(), MARGIN_LEFT, y, 10, DARK, 'bold');
    y += 4;
    doc.setDrawColor(...GRAY);
    doc.setLineWidth(0.3);
    doc.line(MARGIN_LEFT, y, RIGHT_EDGE, y);
    y += 12;
  }

  if (personalInfo.summary) {
    drawMinimalSectionHeader('Summary');
    y = checkPageBreak(doc, y, 14);
    y = drawWrappedText(doc, parseHtmlBold(personalInfo.summary), MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
    y += 4;
  }

  if (skills.length > 0) {
    drawMinimalSectionHeader('Skills');
    for (const skill of skills) {
      if (!skill.category.trim() && !skill.items.trim()) continue;
      y = checkPageBreak(doc, y, 14);
      const segments: TextSegment[] = [];
      if (skill.category) segments.push({ text: `${skill.category}: `, bold: true });
      segments.push({ text: skill.items, bold: false });
      y = drawWrappedText(doc, segments, MARGIN_LEFT, y, CONTENT_W, FONT.body, TEXT);
    }
    y += 4;
  }

  if (workExperience.length > 0) {
    drawMinimalSectionHeader('Experience');
    const BULLET = '\u2022   ';
    const BULLET_INDENT = 16;

    for (const job of workExperience) {
      y = checkPageBreak(doc, y, 40);
      y += 2;

      drawText(doc, job.position, MARGIN_LEFT, y, 11, TEXT, 'bold');
      const dateStr = job.startDate ? `${job.startDate} \u2013 ${job.current ? 'Present' : job.endDate}` : '';
      if (dateStr) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const dw = doc.getTextWidth(dateStr);
        doc.text(dateStr, RIGHT_EDGE - dw, y);
      }
      y += 13;

      drawText(doc, job.company, MARGIN_LEFT, y, 10, DARK);
      if (job.location) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const lw = doc.getTextWidth(job.location);
        doc.text(job.location, RIGHT_EDGE - lw, y);
      }
      y += 12;

      for (const highlight of job.highlights) {
        const clean = stripHtml(highlight).trim();
        if (!clean) continue;
        y = checkPageBreak(doc, y, 14);
        drawText(doc, BULLET, MARGIN_LEFT, y, FONT.body, DARK);
        y = drawWrappedText(doc, parseHtmlBold(highlight), MARGIN_LEFT + BULLET_INDENT, y, CONTENT_W - BULLET_INDENT, FONT.body, TEXT);
      }
      y += 6;
    }
  }

  if (education.length > 0) {
    drawMinimalSectionHeader('Education');
    for (const edu of education) {
      y = checkPageBreak(doc, y, 28);
      drawText(doc, edu.institution, MARGIN_LEFT, y, FONT.companyName, TEXT, 'bold');
      const eduDateStr = edu.startDate || edu.endDate ? `${edu.startDate}${edu.endDate ? ' - ' + edu.endDate : ''}` : '';
      if (eduDateStr) drawTextRight(doc, eduDateStr, y, FONT.dateText, GRAY);
      y += FONT.companyName + 4;
      if (edu.degree || edu.field) {
        drawText(doc, `${edu.degree}${edu.field ? ', ' + edu.field : ''}`, MARGIN_LEFT, y, FONT.body, DARK);
        y += FONT.body + 4;
      }
      y += 4;
    }
  }
}

// ===== Main rendering dispatcher =====

function createPdfDoc(data: PdfInput): jsPDF {
  const { selectedTemplate } = data;
  const colors = COLORS[selectedTemplate];

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  switch (selectedTemplate) {
    case 'sidebar':
      renderSidebarPdf(doc, data, colors);
      addPageNumbers(doc, colors.muted);
      return doc;
    case 'creative':
      renderCreativePdf(doc, data);
      addPageNumbers(doc, [107, 114, 128]);
      return doc;
    case 'modern':
      renderModernPdf(doc, data);
      addPageNumbers(doc, [107, 114, 128]);
      return doc;
    case 'executive':
      renderExecutivePdf(doc, data);
      addPageNumbers(doc, [138, 130, 117]);
      return doc;
    case 'professional':
      renderProfessionalPdf(doc, data);
      addPageNumbers(doc, colors.muted);
      return doc;
    case 'elegant':
      renderElegantPdf(doc, data);
      addPageNumbers(doc, colors.muted);
      return doc;
    case 'bold':
      renderBoldPdf(doc, data);
      addPageNumbers(doc, colors.muted);
      return doc;
    case 'accent':
      renderAccentPdf(doc, data);
      addPageNumbers(doc, colors.muted);
      return doc;
    case 'minimal':
      renderMinimalPdf(doc, data);
      addPageNumbers(doc, [156, 163, 175]);
      return doc;
    default: {
      // Classic template (green top bar)
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, PAGE_W, GREEN_BAR_HEIGHT, 'F');

      let y = GREEN_BAR_HEIGHT + MARGIN_TOP;
      const { personalInfo, workExperience, education, certifications, skills } = data;

      const name = personalInfo.fullName || 'Your Name';
      drawText(doc, name, MARGIN_LEFT, y, FONT.name, colors.text, 'bold');
      y += FONT.name + 6;

      const contactParts: string[] = [];
      if (personalInfo.address) contactParts.push(personalInfo.address);
      if (personalInfo.email) contactParts.push(personalInfo.email);
      if (personalInfo.phone) contactParts.push(personalInfo.phone);
      if (personalInfo.website) contactParts.push(personalInfo.website);

      if (contactParts.length > 0) {
        const contactStr = contactParts.join(' \u2022 ');
        drawText(doc, contactStr, MARGIN_LEFT, y, FONT.contact, colors.muted);
        y += FONT.contact + 8;
      }

      function drawSectionHeader(title: string): void {
        y = checkPageBreak(doc, y, 28);
        y += 6;
        const headerText = title.toUpperCase();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(FONT.sectionHeader);
        doc.setTextColor(...colors.primary);
        doc.text(headerText, MARGIN_LEFT, y);
        const textWidth = doc.getTextWidth(headerText);
        const lineStart = MARGIN_LEFT + textWidth + 8;
        doc.setDrawColor(...colors.primary);
        doc.setLineWidth(1.5);
        doc.line(lineStart, y - 3, RIGHT_EDGE, y - 3);
        y += 12;
      }

      const BULLET = '\u2022   ';
      const BULLET_INDENT = 16;

      if (personalInfo.summary) {
        drawSectionHeader('Summary');
        y = checkPageBreak(doc, y, 14);
        const summarySegments = parseHtmlBold(personalInfo.summary);
        y = drawWrappedText(doc, summarySegments, MARGIN_LEFT, y, CONTENT_W, FONT.body, colors.text);
        y += 2;
      }

      if (skills.length > 0) {
        drawSectionHeader('Skills Highlight');
        for (const skill of skills) {
          if (!skill.category.trim() && !skill.items.trim()) continue;
          y = checkPageBreak(doc, y, 14);
          const segments: TextSegment[] = [];
          if (skill.category) segments.push({ text: `${skill.category}: `, bold: true });
          segments.push({ text: skill.items, bold: false });
          drawText(doc, BULLET, MARGIN_LEFT, y, FONT.body, colors.text);
          y = drawWrappedText(doc, segments, MARGIN_LEFT + BULLET_INDENT, y, CONTENT_W - BULLET_INDENT, FONT.body, colors.text);
        }
        y += 2;
      }

      if (workExperience.length > 0) {
        drawSectionHeader('Professional Experience');
        for (const job of workExperience) {
          y = checkPageBreak(doc, y, 40);
          y += 2;
          drawText(doc, job.company, MARGIN_LEFT, y, FONT.companyName, colors.primary, 'bold');
          if (job.location) drawTextRight(doc, job.location, y, FONT.dateText, colors.text);
          y += FONT.companyName + 4;
          const dateStr = job.startDate ? `${job.startDate} \u2013 ${job.current ? 'Present' : job.endDate}` : '';
          drawText(doc, job.position, MARGIN_LEFT, y, FONT.position, colors.text, 'bold');
          if (dateStr) drawTextRight(doc, dateStr, y, FONT.dateText, colors.text, 'bold');
          y += FONT.position + 6;
          if (job.description) {
            y = checkPageBreak(doc, y, 14);
            y = drawWrappedText(doc, parseHtmlBold(job.description), MARGIN_LEFT, y, CONTENT_W, FONT.body, colors.text);
          }
          for (const highlight of job.highlights) {
            const clean = stripHtml(highlight).trim();
            if (!clean) continue;
            y = checkPageBreak(doc, y, 14);
            drawText(doc, BULLET, MARGIN_LEFT, y, FONT.body, colors.text);
            y = drawWrappedText(doc, parseHtmlBold(highlight), MARGIN_LEFT + BULLET_INDENT, y, CONTENT_W - BULLET_INDENT, FONT.body, colors.text);
          }
          y += 4;
        }
      }

      if (education.length > 0) {
        drawSectionHeader('Education');
        for (const edu of education) {
          y = checkPageBreak(doc, y, 28);
          drawText(doc, edu.institution, MARGIN_LEFT, y, FONT.companyName, colors.text, 'bold');
          const eduDateStr = edu.startDate || edu.endDate ? `${edu.startDate}${edu.endDate ? ' - ' + edu.endDate : ''}` : '';
          if (eduDateStr) drawTextRight(doc, eduDateStr, y, FONT.dateText, colors.text, 'bold');
          y += FONT.companyName + 4;
          if (edu.degree || edu.field) {
            drawText(doc, `${edu.degree}${edu.field ? ', ' + edu.field : ''}`, MARGIN_LEFT, y, FONT.body, colors.text);
            y += FONT.body + 4;
          }
          if (edu.gpa) {
            drawText(doc, `GPA: ${edu.gpa}`, MARGIN_LEFT, y, FONT.body, colors.muted);
            y += FONT.body + 4;
          }
          if (edu.description) {
            y = checkPageBreak(doc, y, 14);
            y = drawWrappedText(doc, [{ text: edu.description, bold: false }], MARGIN_LEFT, y, CONTENT_W, FONT.body, colors.text);
          }
          y += 4;
        }
      }

      if (certifications.length > 0) {
        drawSectionHeader('Certifications');
        for (const cert of certifications) {
          y = checkPageBreak(doc, y, 16);
          let certText = cert.name;
          if (cert.issuer) certText += ` \u2014 ${cert.issuer}`;
          drawText(doc, certText, MARGIN_LEFT, y, FONT.body, colors.text, 'bold');
          if (cert.date) drawTextRight(doc, cert.date, y, FONT.dateText, colors.muted);
          y += FONT.body + 6;
        }
      }

      addPageNumbers(doc, colors.muted);
      return doc;
    }
  }
}

/** Generate PDF as a Blob for preview */
export function generatePdfBlob(data: PdfInput): Blob {
  const doc = createPdfDoc(data);
  return doc.output('blob');
}

/** Export PDF as a file download */
export async function exportToPdf(data: PdfInput, fileName: string): Promise<void> {
  const doc = createPdfDoc(data);
  doc.save(`${fileName}.pdf`);
}
