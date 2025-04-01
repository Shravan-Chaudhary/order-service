import mongoose from "mongoose";
import { CartItem } from "../../types";
import { OrderStatus, PaymentMode, PaymentStatus } from "../../constants";

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
