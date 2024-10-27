import { NextFunction, Response, Request } from "express";
import { AuthRequest } from "../../types";
import { CreateHttpError } from "../http";

const canAccess = (roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const _req = req as unknown as AuthRequest;
        const roleFromToken = _req.auth.role;

        if (!roles.includes(roleFromToken)) {
            next(CreateHttpError.ForbiddenError());
        }
        next();
    };
};

export default canAccess;
