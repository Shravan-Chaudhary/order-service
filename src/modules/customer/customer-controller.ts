import { Request, Response, NextFunction } from "express";
import ResponseMessage from "../../common/constants/responseMessage";
import { httpResponse, HttpStatus } from "../../common/http";
import { CustomerService } from "./customer-service";
import { AuthRequest } from "../../types";

export class CustomerController {
    constructor(readonly customerService: CustomerService) {}

    public async findOne(req: Request, res: Response, _next: NextFunction) {
        const {
            sub: userId,
            firstName,
            lastName,
            email
        } = (req as unknown as AuthRequest).auth;

        const customer = await this.customerService.findOne(userId);

        if (!customer) {
            const customer = await this.customerService.create({
                userId,
                firstName,
                lastName,
                email
            });
            httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
                customer
            });
            return;
        }
        httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
            customer
        });
    }
}
