import { Request, Response, NextFunction } from "express";
import { CreateCouponRequest, VerifyCouponRequest } from "./types";
import { CreateHttpError, httpResponse, HttpStatus } from "../../common/http";
import ResponseMessage from "../../common/constants/responseMessage";
import CouponModel from "./coupon-model";

export class CouponController {
    constructor() {}

    public async create(req: Request, res: Response, _next: NextFunction) {
        const { title, code, discount, validUpto, tenantId } = (
            req as CreateCouponRequest
        ).body;
        const coupon = await CouponModel.create({
            title,
            code,
            discount,
            validUpto,
            tenantId
        });
        httpResponse(
            req,
            res,
            HttpStatus.CREATED,
            "Coupon created successfully",
            coupon
        );
    }

    public async verify(req: Request, res: Response, next: NextFunction) {
        const { code, tenantId } = (req as VerifyCouponRequest).body;

        const coupon = await CouponModel.findOne({
            code,
            tenantId
        });

        if (!coupon) {
            next(CreateHttpError.NotFoundError("Coupon not found"));
            return;
        }

        const currentDate = new Date();
        const couponDate = new Date(coupon.validUpto);

        if (currentDate <= couponDate) {
            return httpResponse(
                req,
                res,
                HttpStatus.OK,
                ResponseMessage.SUCCESS,
                {
                    valid: true,
                    discount: coupon.discount
                }
            );
        }
        return httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
            valid: false,
            discount: 0
        });
    }
}
