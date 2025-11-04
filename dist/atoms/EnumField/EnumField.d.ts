import React from 'react';
export interface EnumOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface EnumFieldProps {
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
export declare const EnumField: React.FC<EnumFieldProps>;
//# sourceMappingURL=EnumField.d.ts.map