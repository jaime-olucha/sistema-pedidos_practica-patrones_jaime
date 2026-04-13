import { Order } from '../../domain/entities/Order';
import type { IOrder } from '../../domain/interfaces/IOrder';

export interface CreateOrderInput {
    readonly baseAmount: number;
    readonly generateOrderId: () => string;
}

export function createOrder({ baseAmount, generateOrderId }: CreateOrderInput): IOrder {
    const orderId = generateOrderId();

    return new Order(orderId, baseAmount);
}
