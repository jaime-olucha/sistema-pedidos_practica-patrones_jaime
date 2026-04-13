import { InputField } from "./InputField";
import { SERVICE_DEFINITIONS, type OperationKey } from "./logic/orderFormTypes";

interface IOrderControlsPanelProps {
    readonly values: Record<"baseAmount" | OperationKey, string>;
    readonly onValueChange: (
        field: "baseAmount" | OperationKey,
        value: string,
    ) => void;
}

export function OrderControlsPanel({
    values,
    onValueChange,
}: IOrderControlsPanelProps) {
    return (
        <div className="order-controls">
            <h1>Sistema de Pedidos</h1>

            <InputField
                id="base-amount"
                label="Importe base"
                value={values.baseAmount}
                onValueChange={(value) => onValueChange("baseAmount", value)}
                placeholder="Ej. 120"
                wrapperClassName="field-group"
            />

            <div className="services-panel">
                <h2>Servicios</h2>

                {SERVICE_DEFINITIONS.map((service) => (
                    <InputField
                        key={service.key}
                        label={service.label}
                        value={values[service.key]}
                        placeholder="..."
                        wrapperClassName="service-field"
                        onValueChange={(value) =>
                            onValueChange(service.key, value)
                        }
                    />
                ))}
            </div>
        </div>
    );
}
