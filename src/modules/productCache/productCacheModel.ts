import mongoose from "mongoose";
import { ProductPricingCache } from "../../types";

const PriceSchema = new mongoose.Schema({
    priceType: {
        type: String,
        enum: ["base", "additional"]
    },
    availableOptions: {
        type: Object,
        of: Number
    }
});

const productCacheSchema = new mongoose.Schema<ProductPricingCache>({
    productId: {
        type: String,
        required: true
    },
    priceConfiguration: {
        type: Object,
        of: PriceSchema
    }
});

export default mongoose.model<ProductPricingCache>(
    "ProductPricingCache",
    productCacheSchema,
    "productCache"
);
