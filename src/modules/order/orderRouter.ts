import express, { NextFunction, Request, Response } from "express";
import authenticate from "../../common/middlewares/authenticate";
import asyncHandler from "../../common/utils/asyncHandler";
import { OrderController } from "./orderController";

const router = express.Router();
const orderController = new OrderController();

router.post(
    "/",
    authenticate,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await orderController.create(req, res, next);
    })
);

export default router;
