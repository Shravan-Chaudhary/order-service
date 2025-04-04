import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { MessageBroker } from "../types/broker";
import { handleProductUpdate } from "../modules/productCache/productCacheHandler";

export class KafkaBroker implements MessageBroker {
    private consumer: Consumer;

    constructor(clientId: string, brokers: string[]) {
        const kafka = new Kafka({
            clientId,
            brokers
        });
        this.consumer = kafka.consumer({ groupId: clientId });
    }
    async connectConsumer() {
        await this.consumer.connect();
    }
    async disconnectConsumer() {
        await this.consumer.disconnect();
    }
    async consumeMessage(topics: string[], fromBeginning: boolean = false) {
        await this.consumer.subscribe({ topics, fromBeginning });
        await this.consumer.run({
            eachMessage: async ({
                topic,
                partition,
                message
            }: EachMessagePayload) => {
                switch (topic) {
                    case "product":
                        if (message.value) {
                            await handleProductUpdate(message.value.toString());
                        }
                        return;
                    default:
                        // eslint-disable-next-line no-console
                        console.log("Unknown topic", topic);
                }
                // eslint-disable-next-line no-console
                console.log({
                    value: message.value?.toString(),
                    topic,
                    partition
                });
            }
        });
    }
}
