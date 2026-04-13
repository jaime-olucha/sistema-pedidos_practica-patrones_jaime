import { ORDER_CONFIG } from "../constants/orderConfig";
import { ORDER_BREAKDOWN_KINDS } from "../constants/orderBreakdownKinds";
import { ORDER_ERROR_MESSAGES } from "../constants/orderErrorMessages";
import type { IOrder } from "../interfaces/IOrder";
import type { IOrderBreakdownLine } from "../interfaces/IOrderBreakdownLine";
import { OrderDecorator } from "./OrderDecorator";

export class TaxDecorator extends OrderDecorator {
    private readonly taxPercentage: number;

    constructor(order: IOrder, taxPercentage: number) {
        super(order);

        if (
            taxPercentage < ORDER_CONFIG.MINIMUM_PERCENTAGE ||
            taxPercentage > ORDER_CONFIG.MAXIMUM_PERCENTAGE
        ) {
            throw new Error(ORDER_ERROR_MESSAGES.INVALID_TAX_PERCENTAGE);
        }

        this.taxPercentage = taxPercentage;
    }

    public override getTotal(): number {
        const currentTotal = this.order.getTotal();
        const taxAmount = this.calculateTaxAmount(currentTotal);

        return currentTotal + taxAmount;
    }

    public override getBreakdown(): ReadonlyArray<IOrderBreakdownLine> {
        const currentTotal = this.order.getTotal();
        const taxAmount = this.calculateTaxAmount(currentTotal);

        return [
            ...this.order.getBreakdown(),
            {
                kind: ORDER_BREAKDOWN_KINDS.TAX,
                amount: taxAmount,
                percentage: this.taxPercentage,
            },
        ];
    }

    private calculateTaxAmount(amount: number): number {
        return amount * (this.taxPercentage / ORDER_CONFIG.PERCENTAGE_DIVISOR);
    }
}
