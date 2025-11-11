import React from 'react';
export interface NameFieldProps {
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
export declare const NameField: React.FC<NameFieldProps>;
//# sourceMappingURL=NameField.d.ts.map