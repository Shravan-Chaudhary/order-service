import { Request, Response, NextFunction } from "express";
import { PaymentGW } from "./paymentTypes";
import orderModel from "../order/orderModel";
import { PaymentStatus } from "../../constants";
import { MessageBroker } from "../../types/broker";
import { CreateHttpError } from "../../common/http";
import { Logger } from "winston";
import { OrderEvents } from "../order/orderTypes";
import mongoose from "mongoose";

export class PaymentController {
    constructor(
        private paymentGW: PaymentGW,
        private broker: MessageBroker,
        private logger: Logger
    ) {}
    handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const webhookBody = req.body;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (webhookBody.type === "checkout.session.completed") {
            const VerifiedSession = await this.paymentGW.getSession(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                webhookBody.data.object.id as string
            );
            const isPaymentSuccess = VerifiedSession.paymentStatus === "paid";
            const updatedOrder = await orderModel.findOneAndUpdate(
                { _id: VerifiedSession.metadata.orderId },
                {
                    paymentStatus: isPaymentSuccess
                        ? PaymentStatus.PAID
                        : PaymentStatus.FAILED
                },
                { new: true }
            );
            try {
                // Safely stringify the order data
                const brokerMessage = {
                    event_type: OrderEvents.ORDER_STATUS_UPDATE,
                    data: updatedOrder
                };
                await this.broker.sendMessage(
                    "order",
                    JSON.stringify(brokerMessage),
                    (
                        updatedOrder?._id as { _id: mongoose.Types.ObjectId }
                    )._id.toString()
                );
            } catch (error) {
                if (error instanceof Error) {
                    this.logger.error(
                        "Error sending message to broker: ",
                        error.message
                    );
                    return next(
                        CreateHttpError.InternalServerError(error.message)
                    );
                }
            }
        }
        return res.json({ status: "success" });
    };
}
