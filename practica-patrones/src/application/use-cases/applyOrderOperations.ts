import { DiscountDecorator } from '../../domain/decorators/DiscountDecorator';
import { ShippingDecorator } from '../../domain/decorators/ShippingDecorator';
import { SurchargeDecorator } from '../../domain/decorators/SurchargeDecorator';
import { TaxDecorator } from '../../domain/decorators/TaxDecorator';
import type { IOrder } from '../../domain/interfaces/IOrder';

export interface ApplyOrderOperationsInput {
    readonly order: IOrder;
    readonly discountPercentage?: number;
    readonly taxPercentage?: number;
    readonly shippingValue?: number;
    readonly surchargeValue?: number;
}

interface IOrderOperationConfig {
    readonly value?: number;
    readonly apply: (order: IOrder, value: number) => IOrder;
}

export function applyOrderOperations({
    order,
    discountPercentage,
    taxPercentage,
    shippingValue,
    surchargeValue,
}: ApplyOrderOperationsInput): IOrder {
    const operations: ReadonlyArray<IOrderOperationConfig> = [
        {
            value: discountPercentage,
            apply: (currentOrder, value) => new DiscountDecorator(currentOrder, value),
        },
        {
            value: taxPercentage,
            apply: (currentOrder, value) => new TaxDecorator(currentOrder, value),
        },
        {
            value: shippingValue,
            apply: (currentOrder, value) => new ShippingDecorator(currentOrder, value),
        },
        {
            value: surchargeValue,
            apply: (currentOrder, value) => new SurchargeDecorator(currentOrder, value),
        },
    ];

    return operations.reduce((currentOrder, operation) => {
        if (typeof operation.value !== 'number') {
            return currentOrder;
        }

        return operation.apply(currentOrder, operation.value);
    }, order);
}
