import express, { Request, Response, NextFunction } from "express";
import authenticate from "../../common/middlewares/authenticate";
import asyncHandler from "../../common/utils/asyncHandler";
import { CouponController } from "./coupon-controller";

const router = express();
const couponController = new CouponController();

//  Admin and
// Manger only access (only for their restaurant)
// validation
// Create
// Update
// Get
// Delete

router.post(
    "/",
    authenticate,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await couponController.create(req, res, next);
    })
);

export default router;
