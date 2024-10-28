import { Request, Response, NextFunction } from "express";
import ResponseMessage from "../../common/constants/responseMessage";
import { httpResponse, HttpStatus } from "../../common/http";
import { CustomerService } from "./customer-service";

export class CustomerController {
    constructor(_customerService: CustomerService) {}

    public async create(req: Request, res: Response, _next: NextFunction) {
        await Promise.resolve();
        httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
            message: "Customer created successfully"
        });
    }
}
