import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import path from "path";
import ResponseMessage from "./constants/responseMessage";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { httpResponse, CreateHttpError, HttpStatus } from "./common";
import { getApplicationHealth, getSystemHealth } from "./utils/quicker";

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true
    })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get("/", (req: Request, res: Response, _next: NextFunction) => {
    httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
        user_id: 2
    });
});

// Health check
app.get(
    "/api/v1/health",
    (req: Request, res: Response, _next: NextFunction) => {
        const healthData = {
            application: getApplicationHealth(),
            system: getSystemHealth(),
            timeStamp: Date.now()
        };

        httpResponse(
            req,
            res,
            HttpStatus.OK,
            ResponseMessage.SUCCESS,
            healthData
        );
    }
);

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

