export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RefreshDto {
    refreshToken: string;
}
export declare class MfaVerifyDto {
    pendingToken: string;
    code: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
        abteilungIds: string[];
    };
}
export declare class MfaPendingResponseDto {
    mfaRequired: boolean;
    pendingToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    } | null;
}
