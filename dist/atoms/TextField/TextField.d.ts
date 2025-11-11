import React from 'react';
export interface TextFieldProps {
    value: string | null;
    mode?: 'edit' | 'readonly' | 'disabled';
    type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number';
    required?: boolean;
    placeholder?: string;
    error?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    multiline?: boolean;
    rows?: number;
    onChange?: (value: string | null) => void;
    onBlur?: () => void;
    onFocus?: () => void;
}
export declare const TextField: React.FC<TextFieldProps>;
//# sourceMappingURL=TextField.d.ts.map