export const ONE_HOUR_IN_SEC = 3600;

export enum WidgetType {
    SWITCH = "switch",
    RADIO = "radio"
}

export enum Roles {
    ADMIN = "admin",
    MANAGER = "manager",
    CUSTOMER = "customer"
}

export enum PriceType {
    BASE = "base",
    ADDITIONAL = "additional"
}

export enum PaymentMode {
    CARD = "card",
    CASH = "cash"
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}
