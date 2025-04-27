import Config from "../../config";
import { KafkaBroker } from "../../config/kafka";
import { MessageBroker } from "../../types/broker";

let broker: MessageBroker | null = null;

export const createMessageBroker = (): MessageBroker => {
    if (!Config.KAFKA_CLIENT_ID) {
        throw new Error("KAFKA_CLIENT_ID is not defined");
    }
    // singleton
    if (!broker) {
        broker = new KafkaBroker(Config.KAFKA_CLIENT_ID, [
            Config.KAFKA_BROKERS!
        ]);
    }
    return broker;
};
