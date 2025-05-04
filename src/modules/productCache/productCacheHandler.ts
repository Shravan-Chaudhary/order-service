import { ProductMessage } from "../../types";
import productCacheModel from "./productCacheModel";
import logger from "../../config/logger";

export const handleProductUpdate = async (value: string) => {
    let product: ProductMessage;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        product = JSON.parse(value);

        // Log the parsed message for debugging
        logger.info("Parsed product message", {
            eventType: product.event_type,
            productId: product.data?._id
        });

        // Validate the message structure
        if (!product || !product.data || !product.data._id) {
            logger.error("Invalid product message structure", {
                message: value.substring(0, 200) // Log a portion of the message
            });
            throw new Error("Invalid product message structure");
        }

        // Process the valid message
        logger.info("Updating product cache", {
            productId: product.data._id,
            eventType: product.event_type
        });

        // For debugging, log the price configuration structure
        logger.debug("Price configuration", {
            priceConfig: JSON.stringify(product.data.priceConfiguration)
        });

        return await productCacheModel.updateOne(
            {
                productId: product.data._id
            },
            {
                $set: {
                    priceConfiguration: product.data.priceConfiguration
                }
            },
            // if record not found, create new one. if found, update it
            { upsert: true }
        );
    } catch (error) {
        logger.error("Error processing product message", {
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
            messageValue: value.substring(0, 200) // Log a portion of the message
        });
        throw error;
    }
};
