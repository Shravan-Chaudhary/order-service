import { ToppingMessage } from "../../types";
import toppingCacheModel from "./toppingCacheModel";

export const handleToppingUpdate = async (value: string) => {
    let topping: ToppingMessage;
    try {
        topping = JSON.parse(value) as ToppingMessage;
    } catch (_error) {
        throw new Error("Invalid JSON format");
    }

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
        { upsert: true }
    );
};
