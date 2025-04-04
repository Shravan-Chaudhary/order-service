import express, { NextFunction, Request, Response } from "express";
import authenticate from "../../common/middlewares/authenticate";
import asyncHandler from "../../common/utils/asyncHandler";
import { OrderController } from "./orderController";
import { StripeGW } from "../payment/stripe";

const router = express.Router();
const paymentGW = new StripeGW();
const orderController = new OrderController(paymentGW);

router.post(
    "/",
    authenticate,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await orderController.create(req, res, next);
    })
);

export default router;
