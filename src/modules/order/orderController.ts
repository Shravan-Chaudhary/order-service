import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Logger } from "winston";
import ResponseMessage from "../../common/constants/responseMessage";
import { CreateHttpError, httpResponse, HttpStatus } from "../../common/http";
import { OrderStatus, PaymentMode, PaymentStatus } from "../../constants";
import {
    CartItem,
    OrderRequest,
    ProductPricingCache,
    Topping,
    ToppingPriceCache
} from "../../types";
import { MessageBroker } from "../../types/broker";
import CouponModel from "../coupon/coupon-model";
import CustomerModel from "../customer/customer-model";
import idempotencyModel from "../idempotency/idempotencyModel";
import { PaymentGW } from "../payment/paymentTypes";
import productCacheModel from "../productCache/productCacheModel";
import toppingCacheModel from "../toppingCache/toppingCacheModel";
import orderModel from "./orderModel";

export class OrderController {
    constructor(
        private paymentGW: PaymentGW,
        private broker: MessageBroker,
        private logger: Logger
    ) {}
    create = async (req: Request, res: Response, next: NextFunction) => {
        const { cart } = req.body as unknown as { cart: CartItem[] };
        const { couponCode, tenantId, paymentMode, address, customerId } =
            req.body as OrderRequest;
        this.logger.info("Processing order request", {
            tenantId,
            customerId,
            paymentMode,
            cartItemCount: cart?.length
        });
        // Validate required fields
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            this.logger.error("Cart items are required");
            return next(
                CreateHttpError.BadRequestError("Cart items are required")
            );
        }

        if (!tenantId || !address || !customerId || !paymentMode) {
            this.logger.error("Missing required fields");
            return next(
                CreateHttpError.BadRequestError("Missing required fields")
            );
        }

        const totalPrice = await this.calculateTotal(cart);
        this.logger.info("Total price calculated", {
            totalPrice
        });
        let discountPercentage: number = 0;
        if (couponCode) {
            try {
                discountPercentage = await this.getDiscountPercentage(
                    couponCode,
                    tenantId
                );
                this.logger.info("Discount percentage fetched");
            } catch (_error) {
                this.logger.error(
                    "Error fetching coupon code discount percentage"
                );
                return next(
                    CreateHttpError.InternalServerError(
                        "Error fetching coupon code discount percentage"
                    )
                );
            }
        }

        const discountAmount = Math.round(
            (totalPrice * discountPercentage) / 100
        );

        const priceAfterDiscount = totalPrice - discountAmount;
        const TAXES_PERCENTAGE = 18;
        const taxes = Math.round((priceAfterDiscount * TAXES_PERCENTAGE) / 100);
        const DELIVERY_CHARGES = 60;
        const finalPrice = priceAfterDiscount + taxes + DELIVERY_CHARGES;
        this.logger.info("Final price calculated", finalPrice);

        // Create order
        try {
            const idempotencyKey = req.headers["idempotency-key"] as string;
            if (!idempotencyKey) {
                this.logger.error("Idempotency key is required");
                return next(
                    CreateHttpError.BadRequestError(
                        "Idempotency key is required"
                    )
                );
            }
            let idempotency;
            try {
                idempotency = await idempotencyModel.findOne({
                    key: idempotencyKey
                });
                this.logger.info("Idempotency key fetched");
            } catch (_error) {
                this.logger.error("Error fetching idempotency key");
                return next(
                    CreateHttpError.InternalServerError(
                        "Error fetching idempotency key"
                    )
                );
            }
            let newOrder = idempotency ? [idempotency.response] : [];
            if (!idempotency) {
                const session = await mongoose.startSession();
                session.startTransaction();

                try {
                    newOrder = await orderModel.create(
                        [
                            {
                                cart,
                                address,
                                customerId,
                                deliveryCharges: DELIVERY_CHARGES,
                                discount: discountAmount,
                                paymentMode,
                                orderStatus: OrderStatus.RECEIVED,
                                paymentStatus: PaymentStatus.PENDING,
                                taxes,
                                tenantId,
                                total: finalPrice
                            }
                        ],
                        { session }
                    );
                    this.logger.info("Order created", newOrder);

                    await idempotencyModel.create(
                        [{ key: idempotencyKey, response: newOrder[0] }],
                        { session }
                    );
                    this.logger.info("Idempotency key created database");

                    await session.commitTransaction();
                } catch (error) {
                    if (error instanceof Error) {
                        await session.abortTransaction();
                        await session.endSession();
                        return next(
                            CreateHttpError.DatabaseError(
                                "Error creating order or idempotency in database"
                            )
                        );
                    }
                } finally {
                    await session.endSession();
                }
            }
            // payment processing
            if (paymentMode === PaymentMode.CARD) {
                const session = await this.paymentGW.createSession({
                    amount: finalPrice,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    orderId: newOrder[0]._id.toString(),
                    tenantId,
                    currency: "inr",
                    idempotencyKey: idempotencyKey
                });
                this.logger.info("Payment session created", session);
                // Send message to broker
                try {
                    // Safely stringify the order data
                    const orderPayload = JSON.stringify(newOrder);
                    await this.broker.sendMessage("order", orderPayload);
                    this.logger.info("Message sent to broker");
                } catch (error) {
                    if (error instanceof Error) {
                        this.logger.error(
                            "Error sending message to broker: ",
                            error.message
                        );
                        return next(
                            CreateHttpError.InternalServerError(error.message)
                        );
                    }
                }

                return httpResponse(
                    req,
                    res,
                    HttpStatus.OK,
                    ResponseMessage.SUCCESS,
                    {
                        paymentUrl: session.paymentUrl
                    }
                );
            }

            httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
                paymentUrl: null
            });
        } catch (error) {
            if (error instanceof Error) {
                // Catch any unexpected errors
                this.logger.error("Unhandled error in order creation", {
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                    stack: error instanceof Error ? error.stack : undefined
                });
                return next(CreateHttpError.DatabaseError(error.message));
            }
        }
    };

    getMine = async (req: Request, res: Response, next: NextFunction) => {
        const { auth } = req as unknown as {
            auth: {
                sub: string;
            };
        };
        const userId = auth.sub;

        if (!userId) {
            return next(CreateHttpError.NotFoundError("No UserId found"));
        }

        const customer = await CustomerModel.findOne({
            userId
        });

        if (!customer) {
            return next(CreateHttpError.NotFoundError("No Customer found"));
        }

        const orders = await orderModel.find(
            { customerId: customer._id },
            { cart: 0 }
        );

        return httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
            orders
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
