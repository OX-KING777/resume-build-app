import { jsPDF } from 'jspdf';
import { savePdfBlob } from '@/utils/savePdfBlob';

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_LEFT = 60;
const MARGIN_RIGHT = 60;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 60;
const CONTENT_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT;
const BOTTOM_LIMIT = PAGE_H - MARGIN_BOTTOM;

const BLK: [number, number, number] = [0, 0, 0];
const GREY: [number, number, number] = [100, 100, 100];

/** Normalize pasted / JSON-imported letter text for PDF output. */
function normalizeCoverLetterText(raw: string): string {
  let t = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Sometimes a string contains literal backslash-n instead of newlines (e.g. mis-copied JSON)
  if (!/\n/.test(t) && t.includes('\\n')) {
    t = t.replace(/\\n/g, '\n');
  }
  // Resume-style markdown from JSON — Helvetica cannot render ** as bold
  t = t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*\*/g, '');
  return t.trim();
}

/**
 * Generate a well-formatted cover letter PDF from plain text.
 * Paragraphs are separated by one or more blank lines in the input.
 */
export function generateCoverLetterBlob(
  fullName: string,
  email: string,
  phone: string,
  address: string,
  text: string,
  jobTitle?: string,
  website?: string,
): Blob {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
  const body = normalizeCoverLetterText(text);

  let y = MARGIN_TOP;

  // ---- Job title header (small, gray) ----
  if (jobTitle && jobTitle.trim()) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text(jobTitle.toUpperCase(), MARGIN_LEFT, y);
    y += 14;
  }

  // ---- Name header ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...BLK);
  const displayName = fullName.trim() || 'Applicant';
  doc.text(displayName, MARGIN_LEFT, y);
  y += 10;

  // ---- Contact info with labels ----
  const contactParts: string[] = [];
  if (phone) contactParts.push(`T: ${phone}`);
  if (website) contactParts.push(`W: ${website}`);
  if (email) contactParts.push(`E: ${email}`);

  if (contactParts.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...BLK);
    doc.text(contactParts.join('  //  '), MARGIN_LEFT, y);
    y += 20;
  }

  // ---- Body text ----
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...BLK);

  const lineHeight = 10.5 * 1.5; // font size * leading

  // Paragraphs: blank line(s) between blocks; also treat single \n inside a block as soft break → merge to spaces for wrap
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  for (let pi = 0; pi < paragraphs.length; pi++) {
    const para = paragraphs[pi];
    const isClosing = /^(sincerely|regards|best|thank|yours|warm)/im.test(para);

    if (isClosing) {
      const lines = para.split(/\n/).map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        y = checkPageBreak(doc, y, lineHeight);
        doc.text(line, MARGIN_LEFT, y);
        y += lineHeight;
      }
      y += 4;
    } else {
      const cleanText = para.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
      const wrapped: string[] = doc.splitTextToSize(cleanText, CONTENT_W);
      for (const line of wrapped) {
        y = checkPageBreak(doc, y, lineHeight);
        doc.text(line, MARGIN_LEFT, y);
        y += lineHeight;
      }
      y += 8;
    }
  }

  return doc.output('blob');

  function checkPageBreak(d: jsPDF, curY: number, needed: number): number {
    if (curY + needed > BOTTOM_LIMIT) {
      d.addPage();
      return MARGIN_TOP;
    }
    return curY;
  }
}

export async function downloadCoverLetterPdf(
  fullName: string,
  email: string,
  phone: string,
  address: string,
  text: string,
  jobTitle?: string,
  website?: string,
): Promise<void> {
  const blob = generateCoverLetterBlob(fullName, email, phone, address, text, jobTitle, website);
  const safeName = (fullName.trim() || 'Cover_Letter').replace(/[/\\?%*:|"<>]/g, '_');
  const suggestedName = `${safeName} - Cover Letter.pdf`;
  await savePdfBlob(blob, suggestedName, () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = suggestedName;
    link.click();
    URL.revokeObjectURL(link.href);
  }, { persistKey: 'cover-letter-pdf' });
}
