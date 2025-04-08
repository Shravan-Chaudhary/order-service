export interface MessageBroker {
    connectConsumer: () => Promise<void>;
    connectProducer: () => Promise<void>;
    disconnectProducer: () => Promise<void>;
    disconnectConsumer: () => Promise<void>;
    consumeMessage: (topic: string[], fromBeginning: boolean) => Promise<void>;
    sendMessage: (topic: string, message: string) => Promise<void>;
}
