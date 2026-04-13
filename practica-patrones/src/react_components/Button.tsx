import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    readonly variant?: "primary" | "secondary";
    readonly children: ReactNode;
}

export function Button({
    variant = "primary",
    className,
    children,
    type = "button",
    ...buttonProps
}: IButtonProps) {
    const buttonClassName = variant === "secondary" ? "secondary" : "";
    const mergedClassName = [buttonClassName, className]
        .filter(Boolean)
        .join(" ");

    return (
        <button type={type} className={mergedClassName} {...buttonProps}>
            {children}
        </button>
    );
}
