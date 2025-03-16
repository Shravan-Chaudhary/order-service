import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import path from "path";
import ResponseMessage from "./common/constants/responseMessage";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import { httpResponse, CreateHttpError, HttpStatus } from "./common/http";
import { getApplicationHealth, getSystemHealth } from "./common/utils/quicker";
import Config from "./config";
import cookieParser from "cookie-parser";
import customerRouter from "./modules/customer/customer-routes";
import couponRouter from "./modules/coupon/coupon-routes";
import orderRouter from "./modules/order/orderRouter";

const app: Application = express();
const ALLOWED_DOMAINS = [
    Config.CORS_CLIENT_URL as string,
    Config.CORS_ADMIN_URL as string
];

// Middlewares
app.use(helmet());
app.use(
    cors({
        origin: ALLOWED_DOMAINS,
        credentials: true
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get("/", (req: Request, res: Response) => {
    httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
        user_id: 2
    });
});

app.use(`${Config.BASE_URL}/customers`, customerRouter);
app.use(`${Config.BASE_URL}/coupons`, couponRouter);
app.use(`${Config.BASE_URL}/orders`, orderRouter);

// Health check
app.get("/api/v1/health", (req: Request, res: Response) => {
    const healthData = {
        application: getApplicationHealth(),
        system: getSystemHealth(),
        timeStamp: Date.now()
    };

    httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, healthData);
});

// 404 handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
    try {
        const error = CreateHttpError.NotFoundError("Route not found");
        throw error;
    } catch (error) {
        next(error);
    }
});

// Global error handler
app.use(globalErrorHandler);

export default app;
