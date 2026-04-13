import type { OrderBreakdownKind } from "../constants/orderBreakdownKinds";

export interface IOrderBreakdownLine {
    readonly kind: OrderBreakdownKind;
    readonly amount: number;
    readonly percentage?: number;
}
