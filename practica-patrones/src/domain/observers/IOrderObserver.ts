import type { IOrder } from '../interfaces/IOrder';

export interface IOrderObserver {
    onOrderConfirmed(order: IOrder): void;
}
