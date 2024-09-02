import express, { Request, Response, Application } from "express";
import path from "path";

const app: Application = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (_req: Request, res: Response) => {
    res.send("Hello world");
});

export default app;

