import type { IOrder } from '../interfaces/IOrder';
import type { IOrderObserver } from './IOrderObserver';

export class OrderConfirmedNotifier {
    private observers: IOrderObserver[] = [];

    addObserver(observer: IOrderObserver): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    removeObserver(observer: IOrderObserver): void {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    notify(order: IOrder): void {
        this.observers.forEach((observer) => {
            observer.onOrderConfirmed(order);
        });
    }

    getObserversCount(): number {
        return this.observers.length;
    }

    clearObservers(): void {
        this.observers = [];
    }
}
