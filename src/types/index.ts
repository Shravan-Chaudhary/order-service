export interface AuthCookie {
    accessToken: string;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string; // for refresh token only (it's record id from db)
        firstName: string;
        lastName: string;
        email: string;
    };
}
