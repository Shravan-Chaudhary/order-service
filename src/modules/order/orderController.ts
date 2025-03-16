import { NextFunction, Request, Response } from "express";

export class OrderController {
    create = async (_req: Request, res: Response, _next: NextFunction) => {
        await Promise.resolve();
        return res.json({ mess: "hello from order controller" });
    };
}
