import express from "express";
import authenticate from "../../common/middlewares/authenticate";
import asyncHandler from "../../common/utils/asyncHandler";
import { OrderController } from "./orderController";

const router = express.Router();
const orderController = new OrderController();

router.post(
    "/",
    authenticate,
    asyncHandler(async (req, res, next) => {
        await orderController.create(req, res, next);
    })
);

export default router;
