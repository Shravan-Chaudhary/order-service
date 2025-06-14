import express, { NextFunction, Request, Response } from "express";
import authenticate from "../../common/middlewares/authenticate";
import asyncHandler from "../../common/utils/asyncHandler";
import { OrderController } from "./orderController";
import { StripeGW } from "../payment/stripe";
import { createMessageBroker } from "../../common/factories/brokerFactory";
import logger from "../../config/logger";

const router = express.Router();
const paymentGW = new StripeGW();
const messageBroker = createMessageBroker();
const orderController = new OrderController(paymentGW, messageBroker, logger);

router.post(
    "/",
    authenticate,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await orderController.create(req, res, next);
    })
);

router.get(
    "/mine",
    authenticate,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await orderController.getMine(req, res, next);
    })
);

router.get(
    "/:orderId",
    authenticate,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await orderController.getSingle(req, res, next);
    })
);

// router.patch(
//     "/change-status/:orderId",
//     authenticate,
//     asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//         await orderController.changeStatus(req, res, next);
//     })
// );

export default router;
