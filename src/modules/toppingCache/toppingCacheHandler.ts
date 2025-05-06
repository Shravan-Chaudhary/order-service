import { ToppingMessage } from "../../types";
import toppingCacheModel from "./toppingCacheModel";
import logger from "../../config/logger";

export const handleToppingUpdate = async (value: string) => {
    let topping: ToppingMessage;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        topping = JSON.parse(value);

        // Log the parsed message for debugging
        logger.info("Parsed topping message", {
            eventType: topping.event_type,
            toppingId: topping.data?.id
        });

        // Validate the message structure
        if (
            !topping ||
            !topping.event_type ||
            !topping.data ||
            !topping.data.id
        ) {
            logger.error("Invalid topping message structure", {
                message: value.substring(0, 200) // Log a portion of the message
            });
            throw new Error("Invalid topping message structure");
        }

        // Process the valid message
        logger.info("Updating topping cache", {
            toppingId: topping.data.id,
            eventType: topping.event_type
        });

        // For debugging, log the topping details
        logger.debug("Topping details", {
            price: topping.data.price,
            tenantId: topping.data.tenantId
        });

        return await toppingCacheModel.updateOne(
            {
                toppingId: topping.data.id
            },
            {
                $set: {
                    price: topping.data.price,
                    tenantId: topping.data.tenantId
                }
            },
            // if record not found, create new one. if found, update it
            { upsert: true }
        );
    } catch (error) {
        logger.error("Error processing topping message", {
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
            messageValue: value.substring(0, 200) // Log a portion of the message
        });
        throw error;
    }
};
