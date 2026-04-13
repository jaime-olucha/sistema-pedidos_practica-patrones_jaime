import type { IOrder } from '../interfaces/IOrder';
import type { ITextFilePayload } from '../interfaces/ITextFilePayload';
import type { IOrderObserver } from './IOrderObserver';

export class TextFileOrderObserver implements IOrderObserver {
    private readonly saveTextFile: (payload: ITextFilePayload) => void;

    constructor(saveTextFile: (payload: ITextFilePayload) => void = () => undefined) {
        this.saveTextFile = saveTextFile;
    }

    onOrderConfirmed(order: IOrder): void {
        const breakdown = order.getBreakdown();
        const total = order.getTotal();

        let content = `+ RESUMEN DEL PEDIDO\n`;
        content += `- - - - - - - - - - - - - - - - - - -\n\n`;
        content += `- ID DEL PEDIDO: ${order.id}\n`;
        content += `- FECHA: ${new Date().toLocaleDateString('es-ES')}\n`;
        content += `- HORA: ${new Date().toLocaleTimeString('es-ES')}\n\n`;

        content += `DESGLOSE:\n`;

        breakdown.forEach((line) => {
            const percentage = line.percentage ? ` (${line.percentage.toFixed(2)}%)` : '';
            content += `${line.kind}:   ${line.amount.toFixed(2)}€${percentage}\n`;
        });

        content += `TOTAL FINAL:    ${total.toFixed(2)}€\n`;

        this.saveTextFile({
            filename: `pedido_${order.id}.txt`,
            content: `${content}\n`,
        });
    }
}
