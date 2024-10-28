import CustomerModel from "./customer-model";
import { CreateCustomerData } from "./types";

export class CustomerService {
    constructor() {}

    public async create({
        userId,
        firstName,
        lastName,
        email
    }: CreateCustomerData) {
        const customer = await CustomerModel.create({
            userId,
            firstName,
            lastName,
            email
        });

        return customer;
    }

    public async findOne(userId: string) {
        const customer = await CustomerModel.findOne({
            userId
        });

        if (!customer) {
            return null;
        }
        return customer;
    }
}
