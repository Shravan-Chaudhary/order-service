import express from "express";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../common/utils/asyncHandler";
import { CustomerController } from "./customerController";
import { CustomerService } from "./customerService";

const router = express();

const customerService = new CustomerService();
const customerController = new CustomerController(customerService);

router.post(
    "/",
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await customerController.create(req, res, next);
    })
);

export default router;
