import mongoose, { Schema } from "mongoose";
import { Order } from "./orderTypes";
import { CartItem } from "../../types";
import { OrderStatus, PaymentMode, PaymentStatus } from "../../constants";

const toppingSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema<CartItem>({
    name: String,
    image: String,
    qty: Number,
    priceConfiguration: {
        type: Map,
        of: {
            priceType: {
                type: String,
                enum: ["base", "additional"],
                required: true
            },
            availableOptions: {
                type: Map,
                of: Number,
                required: true
            }
        }
    },
    selectedConfig: {
        selectedPriceConfig: {
            type: Map,
            of: String,
            required: true
        },
        selectedToppings: [
            {
                type: [toppingSchema],
                required: true
            }
        ]
    }
});

const orderSchema = new mongoose.Schema<Order>(
    {
        cart: {
            type: [cartSchema],
            required: true
        },
        address: {
            type: String,
            required: true
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        deliveryCharges: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        taxes: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        tenantId: {
            type: String,
            required: true
        },
        orderStatus: {
            type: String,
            enum: OrderStatus
        },
        paymentId: {
            type: String,
            required: false,
            default: null
        },
        paymentMode: {
            type: String,
            enum: PaymentMode,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: PaymentStatus
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Order", orderSchema);
