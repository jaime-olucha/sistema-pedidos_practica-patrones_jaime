import { ORDER_CONFIG } from "../constants/orderConfig";
import { ORDER_BREAKDOWN_KINDS } from "../constants/orderBreakdownKinds";
import { ORDER_ERROR_MESSAGES } from "../constants/orderErrorMessages";
import type { IOrder } from "../interfaces/IOrder";
import type { IOrderBreakdownLine } from "../interfaces/IOrderBreakdownLine";
import { OrderDecorator } from "./OrderDecorator";

export class DiscountDecorator extends OrderDecorator {
    private readonly discountPercentage: number;

    constructor(order: IOrder, discountPercentage: number) {
        super(order);

        if (
            discountPercentage < ORDER_CONFIG.MINIMUM_PERCENTAGE ||
            discountPercentage > ORDER_CONFIG.MAXIMUM_PERCENTAGE
        ) {
            throw new Error(ORDER_ERROR_MESSAGES.INVALID_DISCOUNT_PERCENTAGE);
        }

        this.discountPercentage = discountPercentage;
    }

    public override getTotal(): number {
        const currentTotal = this.order.getTotal();
        const discountAmount = this.calculateDiscountAmount(currentTotal);

        return currentTotal - discountAmount;
    }

    public override getBreakdown(): ReadonlyArray<IOrderBreakdownLine> {
        const currentTotal = this.order.getTotal();
        const discountAmount = this.calculateDiscountAmount(currentTotal);

        return [
            ...this.order.getBreakdown(),
            {
                kind: ORDER_BREAKDOWN_KINDS.DISCOUNT,
                amount: -discountAmount,
                percentage: this.discountPercentage,
            },
        ];
    }

    private calculateDiscountAmount(amount: number): number {
        return amount * (this.discountPercentage / ORDER_CONFIG.PERCENTAGE_DIVISOR);
    }
}
