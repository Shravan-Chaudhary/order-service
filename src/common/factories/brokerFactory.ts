import { KafkaBroker } from "../../config/kafka";
import { MessageBroker } from "../../types/broker";

let broker: MessageBroker | null = null;

export const createMessageBroker = (): MessageBroker => {
    // singleton
    if (!broker) {
        // TODO: switch to env vars
        broker = new KafkaBroker("order-service", ["localhost:9092"]);
    }
    return broker;
};
