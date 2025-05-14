import mongoose from "mongoose";
import { CartItem } from "../../types";
import { PaymentMode, PaymentStatus } from "../../constants";

export enum OrderEvents {
    ORDER_CREATE = "ORDER_CREATE",
    PAYMENT_STATUS_UPDATE = "PAYMENT_STATUS_UPDATE",
    ORDER_STATUS_UPDATE = "ORDER_STATUS_UPDATE"
}

export enum OrderStatus {
    RECEIVED = "received",
    CONFIRMED = "confirmed",
    PREPAIRED = "prepared",
    OUT_FOR_DELIVERY = "out_for_delivery",
    // CANCELLED = "cancelled",
    DELIVERED = "delivered"
}

export interface Order {
    cart: CartItem[];
    customerId: mongoose.Types.ObjectId;
    total: number;
    discount: number;
    taxes: number;
    deliveryCharges: number;
    address: string;
    tenantId: string;
    comment?: string;
    paymentMode: PaymentMode;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentId?: string;
}
