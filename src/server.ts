import app from "./app";
import Config from "./config";

const startServer = () => {
    const PORT = Config.PORT ?? 5501;

    try {
        app.listen(PORT, () => {
            console.info("Server started", {
                meta: {
                    PORT: PORT,
                    SERVER_URL: Config.SERVER_URL
                }
            });
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            process.exit(1);
        }
    }
};

void startServer();
