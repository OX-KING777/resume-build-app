import { jsPDF } from 'jspdf';

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

/**
 * Generate a well-formatted cover letter PDF from plain text.
 * Paragraphs are separated by blank lines in the input.
 */
export function generateCoverLetterBlob(
  fullName: string,
  email: string,
  phone: string,
  address: string,
  text: string,
): Blob {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });

  let y = MARGIN_TOP;

  // ---- Name header ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...BLK);
  doc.text(fullName, MARGIN_LEFT, y);
  y += 8;

  // Thin line under name
  doc.setDrawColor(...BLK);
  doc.setLineWidth(1.5);
  doc.line(MARGIN_LEFT, y, PAGE_W - MARGIN_RIGHT, y);
  y += 14;

  // ---- Contact info ----
  const contactParts: string[] = [];
  if (email) contactParts.push(email);
  if (phone) contactParts.push(phone);
  if (address) contactParts.push(address);

  if (contactParts.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text(contactParts.join('  |  '), MARGIN_LEFT, y);
    y += 24;
  }

  // ---- Body text ----
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...BLK);

  const lineHeight = 10.5 * 1.5; // font size * leading

  // Split input into paragraphs by blank lines
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());

  for (let pi = 0; pi < paragraphs.length; pi++) {
    const para = paragraphs[pi].trim();

    // Check if this looks like a greeting/closing (short single line)
    const isSingleLine = !para.includes('\n') && para.length < 80;
    const isClosing = /^(sincerely|regards|best|thank|yours|warm)/i.test(para);

    if (isSingleLine && !isClosing) {
      // Render as a single line (e.g., "Dear Hiring Manager,")
      y = checkPageBreak(doc, y, lineHeight);
      doc.text(para, MARGIN_LEFT, y);
      y += lineHeight + 4;
    } else if (isClosing) {
      // Closing block — render each line separately
      const lines = para.split('\n').map((l) => l.trim());
      for (const line of lines) {
        y = checkPageBreak(doc, y, lineHeight);
        doc.text(line, MARGIN_LEFT, y);
        y += lineHeight;
      }
      y += 4;
    } else {
      // Regular paragraph — word wrap
      const cleanText = para.replace(/\n/g, ' ').replace(/\s+/g, ' ');
      const wrapped: string[] = doc.splitTextToSize(cleanText, CONTENT_W);

      for (const line of wrapped) {
        y = checkPageBreak(doc, y, lineHeight);
        doc.text(line, MARGIN_LEFT, y);
        y += lineHeight;
      }
      y += 8; // paragraph spacing
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

export function downloadCoverLetterPdf(
  fullName: string,
  email: string,
  phone: string,
  address: string,
  text: string,
): void {
  const blob = generateCoverLetterBlob(fullName, email, phone, address, text);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fullName} - Cover Letter.pdf`;
  link.click();
  URL.revokeObjectURL(link.href);
}
