import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { confirmOrder } from '../../application/use-cases/confirmOrder';
import { ConsoleOrderObserver } from '../../domain/observers/ConsoleOrderObserver';
import { OrderConfirmedNotifier } from '../../domain/observers/OrderConfirmedNotifier';
import { TextFileOrderObserver } from '../../domain/observers/TextFileOrderObserver';
import { downloadTextFile } from '../../infrastructure/downloadTextFile';
import { buildPreviewOrder, sanitizeNumericInput } from './orderFormPreview';
import {
    createInitialOrderFormState,
    orderFormReducer,
    type IOrderFormState,
} from './orderFormState';
import type { FieldKey } from './orderFormTypes';

const NOTIFICATION_BANNER_TIMEOUT_MS = 3200;

export interface IOrderFormViewModel {
    readonly state: IOrderFormState;
    readonly summaryOrder: IOrderFormState['confirmedOrder'];
    readonly message: string | null;
    readonly canConfirm: boolean;
    readonly canDownload: boolean;
    readonly bannerMessage: string | null;
    onValueChange: (field: FieldKey, value: string) => void;
    onConfirmOrder: () => void;
    onDownloadReport: () => void;
    onResetOrder: () => void;
}

export function useOrderForm(): IOrderFormViewModel {
    const [state, dispatch] = useReducer(orderFormReducer, undefined, createInitialOrderFormState);
    const [bannerMessage, setBannerMessage] = useState<string | null>(null);
    const bannerTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (bannerTimerRef.current !== null) {
                window.clearTimeout(bannerTimerRef.current);
            }
        };
    }, []);

    const orderConfirmedNotifier = useMemo(() => {
        const notifier = new OrderConfirmedNotifier();
        notifier.addObserver(new ConsoleOrderObserver());

        return notifier;
    }, []);

    const textFileObserver = useMemo(() => {
        return new TextFileOrderObserver(downloadTextFile);
    }, []);

    const computedState = useMemo(() => buildPreviewOrder(state), [state]);
    const summaryOrder = state.confirmedOrder ?? computedState.previewOrder;

    const canConfirm =
        computedState.validationErrors.length === 0 && computedState.previewOrder !== null;

    const canDownload = state.confirmedOrder !== null;

    const firstValidationError = computedState.validationErrors[0] ?? null;
    const message = state.userMessage ?? firstValidationError;

    const onValueChange = (field: FieldKey, value: string): void => {
        dispatch({
            type: 'setField',
            field,
            value: sanitizeNumericInput(value),
        });
    };

    const onConfirmOrder = (): void => {
        if (!computedState.previewOrder || !canConfirm) {
            dispatch({
                type: 'setMessage',
                message: message ?? 'Revisa los datos del pedido antes de confirmar.',
            });
            return;
        }

        confirmOrder(computedState.previewOrder, orderConfirmedNotifier);

        dispatch({
            type: 'confirmOrder',
            order: computedState.previewOrder,
            message: 'Pedido confirmado correctamente.',
        });

        setBannerMessage('Se envia una notificacion por correo al cliente.');

        if (bannerTimerRef.current !== null) {
            window.clearTimeout(bannerTimerRef.current);
        }

        bannerTimerRef.current = window.setTimeout(() => {
            setBannerMessage(null);
        }, NOTIFICATION_BANNER_TIMEOUT_MS);
    };

    const onDownloadReport = (): void => {
        if (!state.confirmedOrder) {
            dispatch({
                type: 'setMessage',
                message: 'Primero debes confirmar el pedido para descargar el informe.',
            });
            return;
        }

        textFileObserver.onOrderConfirmed(state.confirmedOrder);

        dispatch({
            type: 'setMessage',
            message: 'Informe descargado correctamente.',
        });
    };

    const onResetOrder = (): void => {
        dispatch({ type: 'newOrder' });
    };

    return {
        state,
        summaryOrder,
        message,
        canConfirm,
        canDownload,
        bannerMessage,
        onValueChange,
        onConfirmOrder,
        onDownloadReport,
        onResetOrder,
    };
}
