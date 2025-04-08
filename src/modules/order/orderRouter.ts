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

export default router;
