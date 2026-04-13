import type { OrderConfirmedNotifier } from '../../domain/order/observers/OrderConfirmedNotifier';
import type { IOrder } from '../../domain/interfaces/IOrder';
import type { IOrderBreakdownLine } from '../../domain/interfaces/IOrderBreakdownLine';

export interface ConfirmOrderOutput {
    readonly orderId: string;
    readonly total: number;
    readonly breakdown: ReadonlyArray<IOrderBreakdownLine>;
}

export function confirmOrder(order: IOrder, notifier: OrderConfirmedNotifier): ConfirmOrderOutput {
    notifier.notify(order);

    return {
        orderId: order.id,
        total: order.getTotal(),
        breakdown: order.getBreakdown(),
    };
}
