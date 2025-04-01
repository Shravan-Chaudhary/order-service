import mongoose from "mongoose";
import { PriceType } from "../constants";

export interface AuthCookie {
    accessToken: string;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string; // for refresh token only (it's record id from db)
        firstName: string;
        lastName: string;
        email: string;
    };
}
// export interface OrderRequest extends Request {
//     body: {
//         cart: CartItem[];
//     };
// }
export enum ToppingEvents {
    TOPPING_CREATE = "TOPPING_CREATE",
    TOPPING_UPDATE = "TOPPING_UPDATE",
    TOPPING_DELETE = "TOPPING_DELETE"
}
export interface ToppingMessage {
    event_type: ToppingEvents;
    data: {
        id: string;
        price: number;
        tenantId: string;
    };
}
export interface ToppingPriceCache {
    _id: mongoose.Types.ObjectId;
    toppingId: string;
    price: number;
    tenantId: string;
}

export interface PriceConfiguration {
    priceType: "base" | "additional";
    availableOptions: {
        [key: string]: number;
    };
}
export interface ProductPricingCache {
    productId: string;
    priceConfiguration: PriceConfiguration;
}

export enum ProductEvents {
    PRODUCT_CREATE = "PRODUCT_CREATE",
    PRODUCT_UPDATE = "PRODUCT_UPDATE",
    PRODUCT_DELETE = "PRODUCT_DELETE"
}
export interface ProductMessage {
    event_type: ProductEvents;
    data: {
        _id: string;
        priceConfiguration: PriceConfiguration;
    };
}

export interface ProductPriceConfiguration {
    [key: string]: {
        priceType: PriceType.BASE | PriceType.ADDITIONAL;
        availableOptions: {
            [key: string]: number;
        };
    };
}

export type Topping = {
    _id: string;
    name: string;
    image: string;
    price: number;
    isAvailable: boolean;
};

export type Product = {
    _id: string;
    name: string;
    description: string;
    image: string;
    priceConfiguration: ProductPriceConfiguration;
};

export interface CartItem
    extends Pick<Product, "_id" | "name" | "image" | "priceConfiguration"> {
    selectedConfig: {
        selectedPriceConfig: {
            [key: string]: string;
        };
        selectedToppings: Topping[];
    };
    qty: number;
    hash?: string;
}
