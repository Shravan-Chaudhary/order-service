import { Request, Response, NextFunction } from "express";
import ResponseMessage from "../../common/constants/responseMessage";
import { httpResponse, HttpStatus } from "../../common/http";
import { CustomerService } from "./customer-service";
import { AuthRequest } from "../../types";
import { AddAddressRequest } from "./types";

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

    public async addAddress(req: Request, res: Response, _next: NextFunction) {
        const { sub: userId } = (req as unknown as AuthRequest).auth;

        //TODO: validation
        const { address } = (req as AddAddressRequest).body;

        const customer = await this.customerService.addAddress(
            address,
            userId,
            req.params.id
        );

        if (!customer) {
            httpResponse(
                req,
                res,
                HttpStatus.NOT_FOUND,
                ResponseMessage.NOT_FOUND,
                null
            );
            return;
        }

        const updatedCustomer = await this.customerService.findOne(userId);

        httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
            updatedCustomer
        });
    }
}
