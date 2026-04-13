import { v7 as uuidv7 } from 'uuid';
import type { IOrder } from '../../domain/interfaces/IOrder';
import type { FieldKey } from './orderFormTypes';

type OrderFormValues = Record<FieldKey, string>;

export interface IOrderFormState {
    readonly orderId: string;
    readonly values: OrderFormValues;
    readonly confirmedOrder: IOrder | null;
    readonly userMessage: string | null;
}

export type OrderFormAction =
    | { type: 'setField'; field: FieldKey; value: string }
    | { type: 'confirmOrder'; order: IOrder; message: string }
    | { type: 'setMessage'; message: string | null }
    | { type: 'newOrder' };

function createInitialValues(): OrderFormValues {
    return {
        baseAmount: '',
        discount: '',
        tax: '',
        shipping: '',
        surcharge: '',
    };
}

export function createInitialOrderFormState(): IOrderFormState {
    return {
        orderId: uuidv7(),
        values: createInitialValues(),
        confirmedOrder: null,
        userMessage: null,
    };
}

export function orderFormReducer(
    state: IOrderFormState,
    action: OrderFormAction,
): IOrderFormState {
    if (action.type === 'setField') {
        return {
            ...state,
            values: {
                ...state.values,
                [action.field]: action.value,
            },
            userMessage: null,
        };
    }

    if (action.type === 'confirmOrder') {
        return {
            ...state,
            confirmedOrder: action.order,
            userMessage: action.message,
        };
    }

    if (action.type === 'setMessage') {
        return {
            ...state,
            userMessage: action.message,
        };
    }

    if (action.type === 'newOrder') {
        return createInitialOrderFormState();
    }

    return state;
}
