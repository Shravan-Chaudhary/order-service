export const ONE_HOUR_IN_SEC = 3600;

export enum WidgetType {
    SWITCH = "switch",
    RADIO = "radio"
}

export enum PriceType {
    BASE = "base",
    ADDITIONAL = "additional"
}

export enum PaymentMode {
    CARD = "card",
    CASH = "cash"
}

export enum OrderStatus {
    RECEIVED = "received",
    CONFIRMED = "confirmed",
    PREPARING = "preparing",
    READY_FOR_DELIVERY = "ready_for_delivery",
    OUT_FOR_DELIVERY = "out_for_delivery",
    CANCELLED = "cancelled",
    DELIVERED = "delivered"
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}
