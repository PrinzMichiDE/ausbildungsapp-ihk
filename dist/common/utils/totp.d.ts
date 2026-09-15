export declare function generateTotpSecret(bytes?: number): string;
export declare function generateTotp(secret: string, time?: Date, windowSeconds?: number, digits?: number): string;
export declare function verifyTotp(secret: string, token: string, time?: Date, windowSeconds?: number, allowedDrift?: number): boolean;
export declare function buildOtpauthUrl(opts: {
    secret: string;
    account: string;
    issuer?: string;
}): string;
