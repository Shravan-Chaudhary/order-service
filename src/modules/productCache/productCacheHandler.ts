import { ProductMessage } from "../../types";
import productCacheModel from "./productCacheModel";

export const handleProductUpdate = async (value: string) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const product: ProductMessage = JSON.parse(value);
        return await productCacheModel.updateOne(
            {
                productId: product.id
            },
            {
                $set: {
                    priceConfiguration: product.priceConfiguration
                }
            },
            // if record not found, create new one. if found, update it
            { upsert: true }
        );
    } catch (_error) {
        const err = new Error("Parsing JSON error");
        throw err;
    }
};
