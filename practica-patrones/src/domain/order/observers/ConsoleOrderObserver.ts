import type { IOrder } from '../interfaces/IOrder';
import type { IOrderObserver } from './IOrderObserver';

export class ConsoleOrderObserver implements IOrderObserver {
    onOrderConfirmed(order: IOrder): void {
        const breakdown = order.getBreakdown();
        const total = order.getTotal();

        console.log(
            `+ Pedido confirmado: ${order.id}`,
        );
        console.log('   Desglose:');
        breakdown.forEach((line) => {
            console.log(`   - ${line.kind}: ${line.amount.toFixed(2)}€`);
        });
        console.log('   TOTAL FINAL: ' + total.toFixed(2) + '€');
    }
}
