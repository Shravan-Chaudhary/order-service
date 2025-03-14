import { Request, Response } from "express";
import { THttpResponse } from "./httpTypes";
import Config from "../../config";
import { EApplicationEnvoirnment } from "../constants/application";
import logger from "../../config/logger";

const httpResponse = (
    req: Request,
    res: Response,
    responseStatusCode: number,
    responseMessage: string,
    data: unknown = null
): void => {
    const response: THttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req.ip ?? null,
            method: req.method,
            url: req.originalUrl
        },
        message: responseMessage,
        data: data
    };

    //TODO: Log response
    logger.info("Controller_response", {
        meta: response
    });

    // Remove IP if in production
    if (Config.ENV === EApplicationEnvoirnment.PRODUCTION) {
        delete response.request.ip;
    }

    res.status(responseStatusCode).json(response);
};

export default httpResponse;

