import type { IOrder } from "../interfaces/IOrder";
import type { IOrderBreakdownLine } from "../interfaces/IOrderBreakdownLine";

export abstract class OrderDecorator implements IOrder {
    protected readonly order: IOrder;

    protected constructor(order: IOrder) {
        this.order = order;
    }

    public get id(): string {
        return this.order.id;
    }

    public get baseAmount(): number {
        return this.order.baseAmount;
    }

    public getTotal(): number {
        return this.order.getTotal();
    }

    public getBreakdown(): ReadonlyArray<IOrderBreakdownLine> {
        return this.order.getBreakdown();
    }
}
