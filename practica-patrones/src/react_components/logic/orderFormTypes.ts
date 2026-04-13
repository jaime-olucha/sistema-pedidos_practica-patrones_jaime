export type OperationKey = 'discount' | 'tax' | 'shipping' | 'surcharge';
import { ORDER_ERROR_MESSAGES } from "../../domain/constants/orderErrorMessages";

export type FieldKey = 'baseAmount' | OperationKey;

export type OperationResultKey =
    | 'discountPercentage'
    | 'taxPercentage'
    | 'shippingValue'
    | 'surchargeValue';

export interface IServiceDefinition {
    readonly key: OperationKey;
    readonly label: string;
    readonly resultKey: OperationResultKey;
    readonly validation: 'percentage' | 'amount';
    readonly errorMessage: string;
}

export const SERVICE_DEFINITIONS: ReadonlyArray<IServiceDefinition> = [
    {
        key: 'discount',
        label: 'Descuento (%)',
        resultKey: 'discountPercentage',
        validation: 'percentage',
        errorMessage: ORDER_ERROR_MESSAGES.INVALID_DISCOUNT_PERCENTAGE,
    },
    {
        key: 'tax',
        label: 'Impuesto (%)',
        resultKey: 'taxPercentage',
        validation: 'percentage',
        errorMessage: ORDER_ERROR_MESSAGES.INVALID_TAX_PERCENTAGE,
    },
    {
        key: 'shipping',
        label: 'Envío (€)',
        resultKey: 'shippingValue',
        validation: 'amount',
        errorMessage: ORDER_ERROR_MESSAGES.INVALID_SHIPPING_PRICE,
    },
    {
        key: 'surcharge',
        label: 'Recargo (€)',
        resultKey: 'surchargeValue',
        validation: 'amount',
        errorMessage: ORDER_ERROR_MESSAGES.INVALID_SURCHARGE_PRICE,
    },
] as const;
