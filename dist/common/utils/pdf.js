function foldToAscii(input) {
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
function escapePdf(text) {
    return foldToAscii(text)
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
}
export function buildSimplePdf(title, bodyLines) {
    const contentParts = [
        'BT',
        '/F1 16 Tf',
        '50 790 Td',
        `(${escapePdf(title)}) Tj`,
        '/F1 11 Tf',
        '0 -28 Td',
    ];
    for (const line of bodyLines) {
        const wrapped = wrapLine(line, 95);
        for (const wrappedLine of wrapped) {
            contentParts.push(`(${escapePdf(wrappedLine)}) Tj`);
            contentParts.push('0 -16 Td');
        }
    }
    contentParts.push('ET');
    const content = contentParts.join('\n');
    const objects = [];
    objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objects[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
    objects[3] =
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] ' +
            '/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>';
    objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
    objects[5] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    for (let i = 1; i <= 5; i += 1) {
        offsets[i] = pdf.length;
        pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
    }
    const xrefStart = pdf.length;
    pdf += 'xref\n0 6\n0000000000 65535 f \n';
    for (let i = 1; i <= 5; i += 1) {
        pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
    return Buffer.from(pdf, 'latin1');
}
function wrapLine(line, max) {
    if (line.length <= max) {
        return [line];
    }
    const words = line.split(' ');
    const result = [];
    let current = '';
    for (const word of words) {
        if ((current + ' ' + word).trim().length > max) {
            if (current) {
                result.push(current);
            }
            current = word;
        }
        else {
            current = (current + ' ' + word).trim();
        }
    }
    if (current) {
        result.push(current);
    }
    return result;
}
//# sourceMappingURL=pdf.js.map