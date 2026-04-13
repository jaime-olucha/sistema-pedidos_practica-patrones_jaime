export const ORDER_ERROR_MESSAGES = {
    EMPTY_ID: "El identificador del pedido es obligatorio.",
    INVALID_BASE_AMOUNT: "El importe base debe ser mayor que cero.",
    INVALID_DISCOUNT_PERCENTAGE: "El descuento debe estar entre 0 y 100.",
    INVALID_TAX_PERCENTAGE: "El impuesto debe estar entre 0 y 100.",
    INVALID_SHIPPING_PRICE: "El gasto de envío no puede ser negativo.",
    INVALID_SURCHARGE_PRICE: "El importe del recargo no puede ser negativo.",
} as const;
