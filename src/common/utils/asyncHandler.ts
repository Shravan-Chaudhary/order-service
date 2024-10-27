import { Request, Response, NextFunction, RequestHandler } from "express";
import { CreateHttpError } from "../../common/http";
import createHttpError from "http-errors";

const asyncHandler = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(CreateHttpError.InternalServerError());
        });
    };
};

export default asyncHandler;
