import React from 'react';

interface EnumOption {
    value: string;
    label: string;
    disabled?: boolean;
}
interface EnumFieldProps {
    value: string | string[] | null;
    options: EnumOption[];
    mode?: 'edit' | 'readonly' | 'disabled';
    multiple?: boolean;
    searchable?: boolean;
    required?: boolean;
    placeholder?: string;
    error?: string;
    onChange?: (value: string | string[] | null) => void;
}
declare const EnumField: React.FC<EnumFieldProps>;

interface TextFieldProps {
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
declare const TextField: React.FC<TextFieldProps>;

interface NameFieldProps {
    value: string | null;
    mode?: 'edit' | 'readonly' | 'disabled';
    required?: boolean;
    placeholder?: string;
    error?: string;
    maxLength?: number;
    /** Whether the name should be rendered as a link */
    link?: boolean;
    /** ID of the related record (for linking) */
    recordId?: string;
    /** Module name of the related record */
    module?: string;
    /** Whether to show a focus/drawer icon */
    showFocusIcon?: boolean;
    /** Callback when the name link is clicked */
    onLinkClick?: (recordId: string, module: string) => void;
    /** Callback when the focus icon is clicked */
    onFocusClick?: (recordId: string, module: string) => void;
    /** Callback when value changes (edit mode) */
    onChange?: (value: string | null) => void;
    onBlur?: () => void;
    onFocus?: () => void;
}
declare const NameField: React.FC<NameFieldProps>;

export { EnumField, NameField, TextField };
export type { EnumFieldProps, EnumOption, NameFieldProps, TextFieldProps };
