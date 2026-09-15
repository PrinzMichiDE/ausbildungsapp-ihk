import { createHmac, randomBytes } from 'node:crypto';
const RFC4648_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const DEFAULT_WINDOW = 30;
const DEFAULT_DIGITS = 6;
const DEFAULT_ALGORITHM = 'sha1';
function base32Encode(input) {
    let bits = 0;
    let value = 0;
    let output = '';
    for (const byte of input) {
        value = (value << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            output += RFC4648_ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) {
        output += RFC4648_ALPHABET[(value << (5 - bits)) & 31];
    }
    return output;
}
function base32Decode(input) {
    const normalized = input.replace(/[\s-]/g, '').toUpperCase();
    const bytes = [];
    let bits = 0;
    let value = 0;
    for (const char of normalized) {
        const index = RFC4648_ALPHABET.indexOf(char);
        if (index === -1) {
            throw new Error(`Invalid base32 character: ${char}`);
        }
        value = (value << 5) | index;
        bits += 5;
        if (bits >= 8) {
            bytes.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return Buffer.from(bytes);
}
export function generateTotpSecret(bytes = 20) {
    return base32Encode(randomBytes(bytes));
}
export function generateTotp(secret, time = new Date(), windowSeconds = DEFAULT_WINDOW, digits = DEFAULT_DIGITS) {
    const key = base32Decode(secret);
    const counter = Math.floor(time.getTime() / 1000 / windowSeconds);
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigUInt64BE(BigInt(counter));
    const hmac = createHmac(DEFAULT_ALGORITHM, key)
        .update(counterBuffer)
        .digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binary = ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff);
    const otp = binary % 10 ** digits;
    return otp.toString(10).padStart(digits, '0');
}
export function verifyTotp(secret, token, time = new Date(), windowSeconds = DEFAULT_WINDOW, allowedDrift = 1) {
    if (!secret || !token) {
        return false;
    }
    const normalizedToken = token.replace(/\s/g, '');
    if (!/^\d{6}$/.test(normalizedToken)) {
        return false;
    }
    for (let drift = -allowedDrift; drift <= allowedDrift; drift += 1) {
        const candidate = new Date(time.getTime() + drift * windowSeconds * 1000);
        const expected = generateTotp(secret, candidate, windowSeconds, 6);
        if (expected === normalizedToken) {
            return true;
        }
    }
    return false;
}
export function buildOtpauthUrl(opts) {
    const issuer = opts.issuer ?? 'NextGen';
    const label = `${encodeURIComponent(issuer)}:${encodeURIComponent(opts.account)}`;
    const params = [
        `secret=${opts.secret}`,
        `issuer=${encodeURIComponent(issuer)}`,
        'algorithm=SHA1',
        'digits=6',
        'period=30',
    ].join('&');
    return `otpauth://totp/${label}?${params}`;
}
//# sourceMappingURL=totp.js.map