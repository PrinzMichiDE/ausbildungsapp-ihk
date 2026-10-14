import { describe, expect, it } from 'vitest';
import { buildSimplePdf } from './pdf.js';

const pageCount = (pdf: Buffer): number =>
  (pdf.toString('latin1').match(/\/Type \/Page\b(?!s)/g) ?? []).length;

describe('buildSimplePdf', () => {
  it('produces a single page for short content', () => {
    const pdf = buildSimplePdf('Titel', ['a', 'b']);
    expect(pdf.toString('latin1').startsWith('%PDF-1.4')).toBe(true);
    expect(pageCount(pdf)).toBe(1);
  });

  it('continues on further pages instead of cutting off long content', () => {
    const lines = Array.from({ length: 120 }, (_, i) => `Zeile ${i + 1}`);
    const pdf = buildSimplePdf('Titel', lines);
    const text = pdf.toString('latin1');
    expect(pageCount(pdf)).toBeGreaterThan(1);
    expect(text).toContain('(Zeile 1) Tj');
    expect(text).toContain('(Zeile 120) Tj');
  });

  it('writes a valid xref table with one entry per object', () => {
    const pdf = buildSimplePdf('Titel', Array.from({ length: 120 }, () => 'x')).toString('latin1');
    const size = Number(/\/Size (\d+)/.exec(pdf)?.[1]);
    const xrefEntries = (pdf.split('xref\n')[1].match(/ n \n/g) ?? []).length;
    expect(xrefEntries).toBe(size - 1);
  });
});
