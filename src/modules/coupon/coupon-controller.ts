import { Request, Response, NextFunction } from "express";
import { CreateCouponRequest } from "./types";
import { httpResponse, HttpStatus } from "../../common/http";
import ResponseMessage from "../../common/constants/responseMessage";

export class CouponController {
    constructor() {}

    public async create(req: Request, res: Response, _next: NextFunction) {
        const { title, code, discount, validUpto, tenantId } = (
            req as CreateCouponRequest
        ).body;
        const mockPromise = await new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve("done");
            }, 1000);
        });

        httpResponse(req, res, HttpStatus.CREATED, ResponseMessage.SUCCESS, {
            title,
            code,
            discount,
            validUpto,
            tenantId,
            mockPromise
        });
    }
}
