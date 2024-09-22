import express, { Request, Response, Application, NextFunction } from "express";
import path from "path";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import httpResponse from "./utils/httpResponse";
import HttpStatus from "./utils/httpCodes";
import ResponseMessage from "./constants/responseMessage";
import CreateHttpError from "./utils/httpErrors";
import { getApplicationHealth, getSystemHealth } from "./utils/quicker";
import helmet from "helmet";

const app: Application = express();

// Middlewares
app.use(helmet());
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

