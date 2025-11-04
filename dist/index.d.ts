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

export { EnumField };
export type { EnumFieldProps, EnumOption };
