import { Button } from "./Button";
import { ORDER_BREAKDOWN_KINDS } from "../domain/constants/orderBreakdownKinds";
import type { IOrder } from "../domain/interfaces/IOrder";

interface IOrderSummaryPanelProps {
    readonly orderId: string;
    readonly summaryOrder: IOrder | null;
    readonly canConfirm: boolean;
    readonly canDownload: boolean;
    readonly message: string | null;
    readonly onConfirm: () => void;
    readonly onDownloadReport: () => void;
    readonly onNewOrder: () => void;
}

interface IActionDefinition {
    readonly label: string;
    readonly onClick: () => void;
    readonly disabled?: boolean;
    readonly variant?: "primary" | "secondary";
}

const euroFormatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
});

export function OrderSummaryPanel({
    orderId,
    summaryOrder,
    canConfirm,
    canDownload,
    message,
    onConfirm,
    onDownloadReport,
    onNewOrder,
}: IOrderSummaryPanelProps) {
    const actions: ReadonlyArray<IActionDefinition> = [
        {
            label: "Confirmar pedido",
            onClick: onConfirm,
            disabled: !canConfirm,
        },
        {
            label: "Descargar informe",
            onClick: onDownloadReport,
            disabled: !canDownload,
        },
        {
            label: "Nuevo pedido",
            onClick: onNewOrder,
            variant: "secondary",
        },
    ];

    return (
        <aside className="order-summary">
            <h2>Resumen del pedido</h2>
            <p className="order-id">Pedido ID: {orderId}</p>

            <ul className="summary-lines">
                {summaryOrder?.getBreakdown().map((line) => (
                    <li
                        key={`${line.kind}-${line.amount}-${line.percentage ?? "na"}`}
                    >
                        <span>{getLineLabel(line.kind)}</span>
                        <span>
                            {euroFormatter.format(line.amount)}
                            {typeof line.percentage === "number"
                                ? ` (${line.percentage.toFixed(2)}%)`
                                : ""}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="summary-total">
                <span>Total</span>
                <strong>
                    {summaryOrder
                        ? euroFormatter.format(summaryOrder.getTotal())
                        : "0,00 €"}
                </strong>
            </div>

            <div className="summary-actions">
                {actions.map((action) => (
                    <Button
                        key={action.label}
                        variant={action.variant}
                        onClick={action.onClick}
                        disabled={action.disabled}
                    >
                        {action.label}
                    </Button>
                ))}
            </div>

            {message && <p className="user-message">{message}</p>}
        </aside>
    );
}

function getLineLabel(kind: string): string {
    if (kind === ORDER_BREAKDOWN_KINDS.BASE_AMOUNT) {
        return "Importe base";
    }

    if (kind === ORDER_BREAKDOWN_KINDS.DISCOUNT) {
        return "Descuento";
    }

    if (kind === ORDER_BREAKDOWN_KINDS.TAX) {
        return "Impuestos";
    }

    if (kind === ORDER_BREAKDOWN_KINDS.SHIPPING) {
        return "Envío";
    }

    if (kind === ORDER_BREAKDOWN_KINDS.SURCHARGE) {
        return "Recargo";
    }

    return kind;
}
