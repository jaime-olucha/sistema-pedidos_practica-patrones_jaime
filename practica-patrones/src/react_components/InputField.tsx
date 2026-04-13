interface IInputFieldProps {
    readonly id?: string;
    readonly label: string;
    readonly value: string;
    readonly placeholder?: string;
    readonly inputMode?: 'text' | 'decimal' | 'numeric';
    readonly wrapperClassName?: string;
    readonly onValueChange: (value: string) => void;
}

export function InputField({
    id,
    label,
    value,
    placeholder,
    inputMode = 'decimal',
    wrapperClassName,
    onValueChange,
}: IInputFieldProps) {
    return (
        <label className={wrapperClassName} htmlFor={id}>
            <span>{label}</span>
            <input
                id={id}
                type="text"
                inputMode={inputMode}
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                placeholder={placeholder}
            />
        </label>
    );
}
