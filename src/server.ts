import app from "./app";
import { createMessageBroker } from "./common/factories/brokerFactory";
import Config from "./config";
import initDb from "./config/db";
import logger from "./config/logger";
import { MessageBroker } from "./types/broker";

const startServer = async () => {
    const PORT = Config.PORT ?? 5501;
    let broker: MessageBroker | null = null;

    try {
        // Initialize database
        const connection = await initDb();
        logger.info("DATABASE_CONNECTION", {
            meta: {
                CONNECTION_NAME: connection.name
            }
        });
        broker = createMessageBroker();
        await broker.connectProducer();
        await broker.connectConsumer();
        await broker.consumeMessage(["product", "topping"], false);

        // Start Application
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
            if (broker) {
                await broker.disconnectProducer();
                await broker.disconnectConsumer();
            }
            logger.error(error);
            process.exit(1);
        }
    }
};

void startServer();
