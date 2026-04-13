import { ORDER_CONFIG } from "../constants/orderConfig";
import { ORDER_BREAKDOWN_KINDS } from "../constants/orderBreakdownKinds";
import { ORDER_ERROR_MESSAGES } from "../constants/orderErrorMessages";
import type { IOrder } from "../interfaces/IOrder";
import type { IOrderBreakdownLine } from "../interfaces/IOrderBreakdownLine";

export class Order implements IOrder {
    private readonly _id: string;
    private readonly _baseAmount: number;

    constructor(id: string, baseAmount: number) {
        const trimmedId = id.trim();

        if (!trimmedId) {
            throw new Error(ORDER_ERROR_MESSAGES.EMPTY_ID);
        }

        if (baseAmount <= ORDER_CONFIG.MINIMUM_VALUE) {
            throw new Error(ORDER_ERROR_MESSAGES.INVALID_BASE_AMOUNT);
        }

        this._id = trimmedId;
        this._baseAmount = baseAmount;
    }

    public get id(): string {
        return this._id;
    }

    public get baseAmount(): number {
        return this._baseAmount;
    }

    public getTotal(): number {
        return this._baseAmount;
    }

    public getBreakdown(): ReadonlyArray<IOrderBreakdownLine> {
        return [
            {
                kind: ORDER_BREAKDOWN_KINDS.BASE_AMOUNT,
                amount: this._baseAmount,
            },
        ];
    }
}
