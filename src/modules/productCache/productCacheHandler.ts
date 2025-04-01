import { ProductMessage } from "../../types";
import productCacheModel from "./productCacheModel";

export const handleProductUpdate = async (value: string) => {
    let product: ProductMessage;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        product = JSON.parse(value);
    } catch (_error) {
        const err = new Error("Parsing JSON error");
        throw err;
    }
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
};
