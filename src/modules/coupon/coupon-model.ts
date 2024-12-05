import mongoose from "mongoose";
import { coupon } from "./types";

const couponSchema = new mongoose.Schema<coupon>(
    {
        title: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        validUpto: {
            type: Date,
            required: true
        },
        tenantId: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

couponSchema.index({ tenantId: 1, code: 1 }, { unique: true });

const CouponModel = mongoose.model<coupon>("Coupon", couponSchema);
export default CouponModel;
