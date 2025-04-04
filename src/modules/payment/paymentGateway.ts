export interface PaymentOptions {
    currency?: "inr";
    amount: number;
    orderId: string;
    tenantId: string;
    idempotencyKey?: string;
}
interface PaymentSession {
    id: string;
    paymentUrl: string;
    paymentStatus: GatewayPaymentStatus;
}
interface CustomMetadata {
    orderId: string;
}

export type GatewayPaymentStatus = "no_payment_required" | "paid" | "unpaid";

interface VerifiedSession {
    id: string;
    metadata: CustomMetadata;
    paymentStatus: GatewayPaymentStatus;
}

export interface PaymentGW {
    createSession: (options: PaymentOptions) => Promise<PaymentSession>;
    getSession: (id: string) => Promise<VerifiedSession>;
}
