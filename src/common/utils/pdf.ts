function foldToAscii(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
    .replace(/[^\x20-\x7E]/g, '');
}

function escapePdf(text: string): string {
  return foldToAscii(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

const PAGE_TOP = 790;
const PAGE_BOTTOM = 50;
const TITLE_GAP = 28;
const LINE_HEIGHT = 16;
const FIRST_PAGE_LINES = Math.floor((PAGE_TOP - TITLE_GAP - PAGE_BOTTOM) / LINE_HEIGHT);
const FOLLOW_PAGE_LINES = Math.floor((PAGE_TOP - PAGE_BOTTOM) / LINE_HEIGHT);

function pageContent(lines: string[], title?: string): string {
  const parts: string[] = ['BT'];
  if (title !== undefined) {
    parts.push('/F1 16 Tf', `50 ${PAGE_TOP} Td`, `(${escapePdf(title)}) Tj`, '/F1 11 Tf', `0 -${TITLE_GAP} Td`);
  } else {
    parts.push('/F1 11 Tf', `50 ${PAGE_TOP} Td`);
  }
  for (const line of lines) {
    parts.push(`(${escapePdf(line)}) Tj`, `0 -${LINE_HEIGHT} Td`);
  }
  parts.push('ET');
  return parts.join('\n');
}

function paginate(lines: string[]): string[][] {
  const pages: string[][] = [lines.slice(0, FIRST_PAGE_LINES)];
  for (let i = FIRST_PAGE_LINES; i < lines.length; i += FOLLOW_PAGE_LINES) {
    pages.push(lines.slice(i, i + FOLLOW_PAGE_LINES));
  }
  return pages;
}

export function buildSimplePdf(title: string, bodyLines: string[]): Buffer {
  const wrapped = bodyLines.flatMap((line) => wrapLine(line, 95));
  const pages = paginate(wrapped);

  // Object layout: 1 catalog, 2 pages, 3 font, then (page, content) pairs.
  const objects: string[] = [];
  const pageIds = pages.map((_, i) => 4 + i * 2);
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`;
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  pages.forEach((lines, i) => {
    const pageId = pageIds[i];
    const content = pageContent(lines, i === 0 ? title : undefined);
    objects[pageId] =
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] ' +
      `/Resources << /Font << /F1 3 0 R >> >> /Contents ${pageId + 1} 0 R >>`;
    objects[pageId + 1] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });

  const objectCount = objects.length - 1;
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (let i = 1; i <= objectCount; i += 1) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objectCount + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objectCount; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, 'latin1');
}

function wrapLine(line: string, max: number): string[] {
  if (line.length <= max) {
    return [line];
  }
  const words = line.split(' ');
  const result: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > max) {
      if (current) {
        result.push(current);
      }
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) {
    result.push(current);
  }
  return result;
}
