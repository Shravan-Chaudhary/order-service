import express, { Request, Response, Application, NextFunction } from "express";
import path from "path";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import httpResponse from "./utils/httpResponse";
import HttpStatus from "./utils/httpCodes";
import ResponseMessage from "./constants/responseMessage";

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get("/", (req: Request, res: Response, _next: NextFunction) => {
    httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
        user_id: 2
    });
});

// 404 handler
// app.use((req: Request, _: Response, next: NextFunction) => {
//     try {

//     } catch (error) {

//     }
// })

// Global error handler
app.use(globalErrorHandler);

export default app;

