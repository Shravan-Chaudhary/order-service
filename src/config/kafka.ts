import {
    Consumer,
    EachMessagePayload,
    Kafka,
    KafkaConfig,
    Producer
} from "kafkajs";
import { MessageBroker } from "../types/broker";
import { handleProductUpdate } from "../modules/productCache/productCacheHandler";
import Config from ".";
import logger from "./logger";

export class KafkaBroker implements MessageBroker {
    private consumer: Consumer;
    private producer: Producer;

    constructor(clientId: string, brokers: string[]) {
        let kafkaConfig: KafkaConfig = { clientId, brokers };
        if (process.env.NODE_ENV === "production") {
            kafkaConfig = {
                ...kafkaConfig,
                ssl: true,
                connectionTimeout: 45000,
                sasl: {
                    mechanism: "plain",
                    username: Config.SASL_USERNAME!,
                    password: Config.SASL_PASSWORD!
                }
            };
        }
        const kafka = new Kafka(kafkaConfig);
        this.consumer = kafka.consumer({ groupId: clientId });
        this.producer = kafka.producer();
    }
    async connectConsumer() {
        await this.consumer.connect();
    }

    async connectProducer() {
        await this.producer.connect();
    }

    async disconnectConsumer() {
        await this.consumer.disconnect();
    }

    async disconnectProducer() {
        if (this.producer) await this.producer.disconnect();
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

                logger.info("Kafka message consumed", {
                    meta: {
                        topic,
                        partition,
                        message: message.value?.toString()
                    }
                });
            }
        });
    }
    /**
     * @param topic -- The topic to send message to
     * @param message -- The message to send
     * @throws {Error}
     */
    async sendMessage(topic: string, message: string) {
        await this.producer.send({
            topic,
            messages: [{ value: message }]
        });
    }
}
