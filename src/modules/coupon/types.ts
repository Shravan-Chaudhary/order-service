import { Request } from "express";

export interface coupon {
    title: string;
    code: string;
    discount: number;
    validUpto: Date;
    tenantId: number;
}

export interface CreateCouponRequest extends Request {
    body: {
        title: string;
        code: string;
        discount: number;
        validUpto: Date;
        tenantId: number;
    };
}
