import { NextFunction, Request, Response } from "express";
import { expressjwt, GetVerificationKey } from "express-jwt";
import jwsksClient from "jwks-rsa";
import { AuthCookie } from "../../types";
import Config from "../../config";
import { CreateHttpError } from "../http";

const jwtMiddleware = expressjwt({
    secret: jwsksClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI!,
        cache: true,
        rateLimit: true
    }) as GetVerificationKey,

    algorithms: ["RS256"],

    getToken(req: Request) {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.split(" ")[1] !== "undefined") {
            const token = authHeader.split(" ")[1];
            if (token) {
                return token;
            }
        }

        const { accessToken } = req.cookies as AuthCookie;
        return accessToken;
    }
});
export default async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    await jwtMiddleware(req, res, (err) => {
        if (err && err instanceof Error) {
            // Convert JWT errors to your application's error format
            return next(CreateHttpError.UnauthorizedError(err.message));
        }
        next();
    });
}
