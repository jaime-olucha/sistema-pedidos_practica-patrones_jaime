import type { IOrderBreakdownLine } from "./IOrderBreakdownLine";

export interface IOrder {
    readonly id: string;
    readonly baseAmount: number;
    getTotal(): number;
    getBreakdown(): ReadonlyArray<IOrderBreakdownLine>;
}
