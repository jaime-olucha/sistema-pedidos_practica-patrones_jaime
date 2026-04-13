import { applyOrderOperations } from '../../application/use-cases/applyOrderOperations';
import type { ApplyOrderOperationsInput } from '../../application/use-cases/applyOrderOperations';
import { createOrder } from '../../application/use-cases/createOrder';
import type { IOrder } from '../../domain/interfaces/IOrder';
import type { IOrderFormState } from './orderFormState';
import { SERVICE_DEFINITIONS } from './orderFormTypes';
import type { OperationResultKey } from './orderFormTypes';

type ParsedInput = Partial<Record<'baseAmount' | OperationResultKey, number>>;
type ValidatedOperations = Omit<ApplyOrderOperationsInput, 'order'>;

export interface IOrderFormComputedState {
    readonly previewOrder: IOrder | null;
    readonly validationErrors: ReadonlyArray<string>;
}

export function sanitizeNumericInput(value: string): string {
    const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');
    const parts = normalized.split('.');
    const integerPart = parts[0] ?? '';

    if (parts.length === 1) {
        return integerPart;
    }

    const decimalPart = parts.slice(1).join('').slice(0, 2);

    return `${integerPart}.${decimalPart}`;
}

export function buildPreviewOrder(state: IOrderFormState): IOrderFormComputedState {
    const parsedInput = parseInputs(state);
    const validationErrors = validateInputs(state, parsedInput);

    if (typeof parsedInput.baseAmount !== 'number' || parsedInput.baseAmount <= 0) {
        return {
            previewOrder: null,
            validationErrors,
        };
    }

    const baseOrder = createOrder({
        baseAmount: parsedInput.baseAmount,
        generateOrderId: () => state.orderId,
    });

    try {
        const previewOrder = applyOrderOperations({
            order: baseOrder,
            ...getValidatedOperations(state, parsedInput),
        });

        return {
            previewOrder,
            validationErrors,
        };
    } catch {
        return {
            previewOrder: baseOrder,
            validationErrors: [
                ...validationErrors,
                'Hay valores inválidos en los servicios. Revisa los campos.',
            ],
        };
    }
}

function parseNumericInput(value: string): number | undefined {
    if (!value.trim()) {
        return undefined;
    }

    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
        return undefined;
    }

    return parsedValue;
}

function parseInputs(state: IOrderFormState): ParsedInput {
    const parsedInput: ParsedInput = {
        baseAmount: parseNumericInput(state.values.baseAmount),
    };

    SERVICE_DEFINITIONS.forEach((service) => {
        parsedInput[service.resultKey] = parseNumericInput(state.values[service.key]);
    });

    return parsedInput;
}

function validateInputs(state: IOrderFormState, parsedInput: ParsedInput): ReadonlyArray<string> {
    const validationErrors: string[] = [];

    if (typeof parsedInput.baseAmount !== 'number' || parsedInput.baseAmount <= 0) {
        validationErrors.push('El importe base debe ser mayor que 0.');
    }

    SERVICE_DEFINITIONS.forEach((service) => {
        const currentValue = state.values[service.key].trim();
        const parsedValue = parsedInput[service.resultKey];

        if (!currentValue) {
            return;
        }

        if (!isValidServiceValue(service.validation, parsedValue)) {
            validationErrors.push(service.errorMessage);
        }
    });

    return validationErrors;
}

function getValidatedOperations(
    state: IOrderFormState,
    parsedInput: ParsedInput,
): ValidatedOperations {
    return SERVICE_DEFINITIONS.reduce<ValidatedOperations>((operations, service) => {
        const currentValue = state.values[service.key].trim();
        const parsedValue = parsedInput[service.resultKey];

        if (!currentValue || !isValidServiceValue(service.validation, parsedValue)) {
            return operations;
        }

        return {
            ...operations,
            [service.resultKey]: parsedValue,
        };
    }, {});
}

function isValidServiceValue(
    validation: 'percentage' | 'amount',
    value: number | undefined,
): value is number {
    if (validation === 'percentage') {
        return isValidPercentage(value);
    }

    return isValidPositiveValue(value);
}

function isValidPercentage(value: number | undefined): value is number {
    return typeof value === 'number' && value > 0 && value <= 100;
}

function isValidPositiveValue(value: number | undefined): value is number {
    return typeof value === 'number' && value > 0;
}
