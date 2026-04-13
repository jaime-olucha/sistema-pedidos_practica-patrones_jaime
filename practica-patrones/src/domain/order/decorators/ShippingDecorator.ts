import { ORDER_CONFIG } from "../constants/orderConfig";
import { ORDER_BREAKDOWN_KINDS } from "../constants/orderBreakdownKinds";
import { ORDER_ERROR_MESSAGES } from "../constants/orderErrorMessages";
import type { IOrder } from "../interfaces/IOrder";
import type { IOrderBreakdownLine } from "../interfaces/IOrderBreakdownLine";
import { OrderDecorator } from "./OrderDecorator";

export class ShippingDecorator extends OrderDecorator {
    private readonly shippingValue: number;

    constructor(order: IOrder, shippingValue: number) {
        super(order);

        if (shippingValue < ORDER_CONFIG.MINIMUM_VALUE) {
            throw new Error(ORDER_ERROR_MESSAGES.INVALID_SHIPPING_PRICE);
        }

        this.shippingValue = shippingValue;
    }

    public override getTotal(): number {
        const currentTotal = this.order.getTotal();
        const shippingAmount = this.calculateShippingAmount();

        return currentTotal + shippingAmount;
    }

    public override getBreakdown(): ReadonlyArray<IOrderBreakdownLine> {
        const shippingAmount = this.calculateShippingAmount();

        return [
            ...this.order.getBreakdown(),
            {
                kind: ORDER_BREAKDOWN_KINDS.SHIPPING,
                amount: shippingAmount,
            },
        ];
    }

    private calculateShippingAmount(): number {
        return this.shippingValue;
    }
}
