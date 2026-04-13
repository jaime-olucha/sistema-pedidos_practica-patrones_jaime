export const ORDER_BREAKDOWN_KINDS = {
    BASE_AMOUNT: "baseAmount",
    DISCOUNT: "discount",
    TAX: "tax",
    SHIPPING: "shipping",
    SURCHARGE: "surcharge",
} as const;

export type OrderBreakdownKind =
    (typeof ORDER_BREAKDOWN_KINDS)[keyof typeof ORDER_BREAKDOWN_KINDS];
