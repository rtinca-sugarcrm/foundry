// Base types for Sugar CRM field metadata
export interface BaseFieldMetadata {
    /** Field name/key */
    name: string;
    /** Display label for the field */
    label: string;
    /** Whether the field is required */
    required?: boolean;
    /** Whether the field is readonly */
    readonly?: boolean;
    /** Whether the field is currently in edit mode */
    edit?: boolean;
    /** Help text or description */
    help?: string;
    /** Custom CSS classes */
    className?: string;
    /** Field validation rules */
    validation?: ValidationRule[];
    /** Whether to auto-commit changes */
    autoCommit?: boolean;
}

// Validation types
export interface ValidationRule {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
    message: string;
    value?: any;
    validator?: (value: any) => boolean | string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Enum specific types
export interface EnumOption {
    /** The actual value to be stored */
    value: string | number;
    /** Display label for the option */
    label: string;
    /** Whether this option is disabled */
    disabled?: boolean;
    /** Additional metadata for the option */
    metadata?: Record<string, any>;
}

export interface EnumFieldMetadata extends BaseFieldMetadata {
    /** Available options for the enum */
    options: EnumOption[];
    /** Default value */
    defaultValue?: string | number;
    /** Whether to allow empty/null selection */
    allowEmpty?: boolean;
    /** Placeholder text when no value is selected */
    placeholder?: string;
    /** Whether to show options in a dropdown or as radio buttons */
    display?: 'dropdown' | 'radio' | 'checkbox'; // checkbox for multi-select enums
    /** For multi-select enums */
    multiple?: boolean;
}

// Event handlers
export interface FieldEventHandlers<T = any> {
    /** Called when field value changes */
    onChange?: (value: T, metadata: BaseFieldMetadata) => void;
    /** Called when field loses focus */
    onBlur?: (value: T, metadata: BaseFieldMetadata) => void;
    /** Called when field gains focus */
    onFocus?: (metadata: BaseFieldMetadata) => void;
    /** Called when validation occurs */
    onValidation?: (result: ValidationResult, metadata: BaseFieldMetadata) => void;
    /** Called when field enters edit mode */
    onEdit?: (metadata: BaseFieldMetadata) => void;
    /** Called when changes are committed */
    onCommit?: (value: T, metadata: BaseFieldMetadata) => void;
    /** Called when edit is cancelled */
    onCancel?: (metadata: BaseFieldMetadata) => void;
}

// Component props base
export interface BaseFieldProps<T = any> extends FieldEventHandlers<T> {
    /** Current field value */
    value?: T;
    /** Field metadata */
    metadata: BaseFieldMetadata;
    /** Additional props to pass to the underlying input */
    inputProps?: Record<string, any>;
}
