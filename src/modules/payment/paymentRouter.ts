import express from "express";
import { PaymentController } from "./paymentController";
import asyncHandler from "../../common/utils/asyncHandler";
import { StripeGW } from "./stripe";
import logger from "../../config/logger";
import { createMessageBroker } from "../../common/factories/brokerFactory";

const router = express.Router();

// TODO: Move this to factory pattern
const paymentGW = new StripeGW();
const messageBroker = createMessageBroker();
const paymentController = new PaymentController(
    paymentGW,
    messageBroker,
    logger
);

router.post(
    "/webhook",
    asyncHandler(async (req, res, next) => {
        await paymentController.handleWebhook(req, res, next);
    })
);

export default router;
