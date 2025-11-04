import { BaseFieldMetadata } from '../../core/types';

/**
 * Enum-specific types and interfaces
 */

export type EnumValue = string | number;
export type EnumValues = EnumValue | EnumValue[];

export interface EnumOption {
    /** The actual value to be stored */
    value: EnumValue;
    /** Display label for the option */
    label: string;
    /** Whether this option is disabled */
    disabled?: boolean;
    /** Additional metadata for the option */
    metadata?: Record<string, any>;
    /** Icon or other visual indicator */
    icon?: string;
    /** Group for organizing options */
    group?: string;
}

export interface EnumFieldMetadata extends BaseFieldMetadata {
    /** Available options for the enum */
    options: EnumOption[];
    /** Whether to allow multiple selections */
    multiple?: boolean;
    /** Whether to allow empty/null selection */
    allowEmpty?: boolean;
    /** Display style for the enum */
    display?: 'dropdown' | 'radio' | 'checkbox' | 'toggle' | 'segmented';
    /** Whether to show search/filter for large option lists */
    searchable?: boolean;
    /** Maximum number of visible options before scrolling */
    maxVisibleOptions?: number;
    /** Custom render function for options */
    renderOption?: (option: EnumOption, isSelected: boolean) => React.ReactNode;
    /** Custom render function for selected value display */
    renderValue?: (value: EnumValues, options: EnumOption[]) => React.ReactNode;
}

export interface EnumFieldProps {
    /** Current field value */
    value?: EnumValues;
    /** Field metadata configuration */
    metadata: EnumFieldMetadata;
    /** Event handlers */
    events?: {
        onChange?: (value: EnumValues, fieldName: string) => void;
        onBlur?: (value: EnumValues, fieldName: string) => void;
        onFocus?: (fieldName: string) => void;
        onValidate?: (result: any, fieldName: string) => void;
    };
    /** Additional props for the input element */
    inputProps?: Record<string, any>;
}

export interface EnumFieldState {
    /** Whether dropdown is open */
    isOpen: boolean;
    /** Search query for filtering options */
    searchQuery: string;
    /** Currently focused option index */
    focusedIndex: number;
}
