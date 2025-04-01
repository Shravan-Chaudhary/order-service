import { Request, Response } from "express";
import {
    CartItem,
    OrderRequest,
    ProductPricingCache,
    Topping,
    ToppingPriceCache
} from "../../types";
import productCacheModel from "../productCache/productCacheModel";
import toppingCacheModel from "../toppingCache/toppingCacheModel";
import CouponModel from "../coupon/coupon-model";
import { httpResponse, HttpStatus } from "../../common/http";
import ResponseMessage from "../../common/constants/responseMessage";

export class OrderController {
    create = async (req: Request, res: Response) => {
        const { cart } = req.body as unknown as { cart: CartItem[] };

        const totalPrice = await this.calculateTotal(cart);
        let discountPercentage: number = 0;
        const couponCode = (req.body as OrderRequest).couponCode;
        const tenantId = (req.body as OrderRequest).tenantId;
        if (couponCode) {
            discountPercentage = await this.getDiscountPercentage(
                couponCode,
                tenantId
            );
        }

        const discountAmount = Math.round(
            (totalPrice * discountPercentage) / 100
        );

        const priceAfterDiscount = totalPrice - discountAmount;
        const TAXES_PERCENTAGE = 18;
        const taxes = Math.round((priceAfterDiscount * TAXES_PERCENTAGE) / 100);
        const DELIVERY_CHARGES = 60;
        const finalPrice = priceAfterDiscount + taxes + DELIVERY_CHARGES;
        httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
            totalPrice: finalPrice
        });
    };

    private calculateTotal = async (cart: CartItem[]) => {
        const productIds = cart.map((item) => item._id);

        // TODO: error handling
        const productPricings = await productCacheModel.find({
            productId: { $in: productIds }
        });

        // If product or topping doest not exists in cache, then:
        // 1. Fetch product from inventory service
        // 2. Use from cart (not good)

        const cartToppingsIds = cart.reduce<string[]>((acc, item) => {
            return [
                ...acc,
                ...item.selectedConfig.selectedToppings.map(
                    (topping) => topping._id
                )
            ];
        }, []);

        const toppingsPricings = await toppingCacheModel.find({
            toppingId: { $in: cartToppingsIds }
        });

        const totalPrice = cart.reduce((acc, curr) => {
            const cachedProductPrice = productPricings.find(
                (product) => product.productId === curr._id
            );

            if (!cachedProductPrice) {
                throw new Error(
                    `Product pricing not found for product ID: ${curr._id}`
                );
            }

            return (
                acc +
                curr.qty *
                    this.getItemTotal(
                        curr,
                        cachedProductPrice,
                        toppingsPricings
                    )
            );
        }, 0);

        return totalPrice;
    };

    private getItemTotal = (
        item: CartItem,
        cachedProductPrice: ProductPricingCache,
        toppingsPricings: ToppingPriceCache[]
    ) => {
        const toppingsTotal = item.selectedConfig.selectedToppings.reduce(
            (acc, curr) => {
                return (
                    acc + this.getCurrentToppingPrice(curr, toppingsPricings)
                );
            },
            0
        );

        const productTotal = Object.entries(
            item.selectedConfig.selectedPriceConfig
        ).reduce((acc, [key, value]) => {
            const priceConfig =
                cachedProductPrice.priceConfiguration as unknown as Record<
                    string,
                    {
                        priceType: "base" | "additional";
                        availableOptions: Record<string, number>;
                    }
                >;

            const price = priceConfig[key]?.availableOptions[value] ?? 0;
            return acc + price;
        }, 0);

        return productTotal + toppingsTotal;
    };

    private getCurrentToppingPrice = (
        topping: Topping,
        toppingsPricings: ToppingPriceCache[]
    ) => {
        const currentTopping = toppingsPricings.find((curr) => {
            return topping._id === curr.toppingId;
        });

        if (!currentTopping) {
            return topping.price;
        }
        return currentTopping.price;
    };

    private getDiscountPercentage = async (
        couponCode: string,
        tenantId: string
    ) => {
        const code = await CouponModel.findOne({ code: couponCode, tenantId });
        if (!code) {
            return 0;
        }

        const currentDate = new Date();
        const couponDate = new Date(code.validUpto);

        if (currentDate <= couponDate) {
            return code.discount;
        }

        return 0;
    };
}
