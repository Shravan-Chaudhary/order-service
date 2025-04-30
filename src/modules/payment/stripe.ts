import Config from "../../config";
import {
    CustomMetadata,
    PaymentGW,
    PaymentOptions,
    VerifiedSession
} from "./paymentTypes";
import Stripe from "stripe";

export class StripeGW implements PaymentGW {
    private stripe: Stripe;
    constructor() {
        this.stripe = new Stripe(Config.STRIPE_SECRET_KEY as string);
    }

    async createSession(options: PaymentOptions) {
        const session = await this.stripe.checkout.sessions.create(
            {
                metadata: {
                    orderId: options.orderId,
                    restaurantId: options.tenantId
                },
                billing_address_collection: "required",
                line_items: [
                    {
                        price_data: {
                            unit_amount: options.amount * 100,
                            product_data: {
                                name: "Online Pizza Order",
                                description: "Total amount for your order"
                            },
                            currency: options.currency || "inr"
                        },
                        quantity: 1
                    }
                ],
                mode: "payment",
                success_url: `${Config.CLIENT_URL}/payment?success=true&orderId=${options.orderId}&restaurantId=${options.tenantId}`,
                cancel_url: `${Config.CLIENT_URL}/payment?success=false&orderId=${options.orderId}&restaurantId=${options.tenantId}`
            },
            { idempotencyKey: options.idempotencyKey }
        );
        return {
            id: session.id,
            paymentUrl: session.url || "",
            paymentStatus: session.payment_status
        };
    }
    async getSession(id: string) {
        const session = await this.stripe.checkout.sessions.retrieve(id);
        const VerifiedSession: VerifiedSession = {
            id: session.id,
            metadata: session.metadata as unknown as CustomMetadata,
            paymentStatus: session.payment_status
        };
        return VerifiedSession;
    }
}
