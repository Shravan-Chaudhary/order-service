import { Request, Response, NextFunction } from "express";
import { PaymentGW } from "./paymentTypes";
import orderModel from "../order/orderModel";
import { PaymentStatus } from "../../constants";

export class PaymentController {
    constructor(private paymentGW: PaymentGW) {}
    handleWebhook = async (
        req: Request,
        res: Response,
        _next: NextFunction
    ) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const webhookBody = req.body;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (webhookBody.type === "checkout.session.completed") {
            const VerifiedSession = await this.paymentGW.getSession(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                webhookBody.data.object.id as string
            );
            const isPaymentSuccess = VerifiedSession.paymentStatus === "paid";
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const updatedOrder = await orderModel.updateOne(
                { _id: VerifiedSession.metadata.orderId },
                {
                    paymentStatus: isPaymentSuccess
                        ? PaymentStatus.PAID
                        : PaymentStatus.FAILED
                },
                { new: true }
            );
        }
        return res.json({ status: "success" });
    };
}
