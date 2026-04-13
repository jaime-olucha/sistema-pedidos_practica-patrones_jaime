import { ORDER_CONFIG } from "../constants/orderConfig";
import { ORDER_BREAKDOWN_KINDS } from "../constants/orderBreakdownKinds";
import { ORDER_ERROR_MESSAGES } from "../constants/orderErrorMessages";
import type { IOrder } from "../interfaces/IOrder";
import type { IOrderBreakdownLine } from "../interfaces/IOrderBreakdownLine";
import { OrderDecorator } from "./OrderDecorator";

export class SurchargeDecorator extends OrderDecorator {
    private readonly surchargeValue: number;

    constructor(order: IOrder, surchargeValue: number) {
        super(order);

        if (surchargeValue < ORDER_CONFIG.MINIMUM_VALUE) {
            throw new Error(ORDER_ERROR_MESSAGES.INVALID_SURCHARGE_PRICE);
        }

        this.surchargeValue = surchargeValue;
    }

    public override getTotal(): number {
        const currentTotal = this.order.getTotal();
        const surchargeAmount = this.calculateSurchargeAmount();

        return currentTotal + surchargeAmount;
    }

    public override getBreakdown(): ReadonlyArray<IOrderBreakdownLine> {
        const surchargeAmount = this.calculateSurchargeAmount();

        return [
            ...this.order.getBreakdown(),
            {
                kind: ORDER_BREAKDOWN_KINDS.SURCHARGE,
                amount: surchargeAmount,
            },
        ];
    }

    private calculateSurchargeAmount(): number {
        return this.surchargeValue;
    }
}
