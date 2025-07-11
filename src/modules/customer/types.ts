import { Request } from "express";

export interface Address {
    text: string;
    isDefault: boolean;
}

export interface Customer {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    addresses: Address[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCustomerData {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    addresses: Address[];
}

export interface AddAddressRequest extends Request {
    body: {
        address: string;
    };
}
