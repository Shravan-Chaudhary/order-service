import app from "./app";
import Config from "./config";
import logger from "./config/logger";

const startServer = () => {
    const PORT = Config.PORT ?? 5501;

    try {
        app.listen(PORT, () => {
            logger.info("Server started", {
                meta: {
                    PORT: PORT,
                    SERVER_URL: Config.SERVER_URL
                }
            });
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error);
            process.exit(1);
        }
    }
};

startServer();
