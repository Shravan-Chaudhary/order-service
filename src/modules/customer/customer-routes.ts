import express from "express";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../common/utils/asyncHandler";
import { CustomerController } from "./customer-controller";
import { CustomerService } from "./customer-service";
import authenticate from "../../common/middlewares/authenticate";

const router = express();

const customerService = new CustomerService();
const customerController = new CustomerController(customerService);

router.get(
    "/",
    authenticate,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await customerController.findOne(req, res, next);
    })
);

export default router;
