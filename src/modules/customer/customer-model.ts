import mongoose from "mongoose";
import { Address, Customer } from "./types";

const addressSchema = new mongoose.Schema<Address>(
    {
        text: {
            type: String,
            required: true
        },
        isDefault: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    { _id: false }
);

const customerSchema = new mongoose.Schema<Customer>(
    {
        userId: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        addresses: {
            type: [addressSchema]
        }
    },
    {
        timestamps: true
    }
);

const CustomerModel = mongoose.model<Customer>("Customer", customerSchema);
export default CustomerModel;
