import express, { Request, Response, Application } from "express";

const app: Application = express();

app.get("/", (_req: Request, res: Response) => {
    res.send("Hello world");
});

export default app;

