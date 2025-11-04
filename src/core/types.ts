/**
 * Base types for Sugar CRM field components
 * These types define the core interfaces for the atomic field system
 */

// Core field validation types
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}

export type ValidatorFunction<T = any> = (
    value: T,
    context?: ValidationContext
) => ValidationResult;

export interface ValidationContext {
    fieldName: string;
    required: boolean;
    [key: string]: any;
}

// Base field metadata interface
export interface BaseFieldMetadata {
    /** Unique field identifier */
    name: string;
    /** Display label */
    label: string;
    /** Whether field is required */
    required?: boolean;
    /** Whether field is readonly */
    readonly?: boolean;
    /** Whether field is disabled */
    disabled?: boolean;
    /** Help text */
    help?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Custom CSS classes */
    className?: string;
    /** Test ID for automation */
    testId?: string;
}

// Field state management
export interface FieldState<T = any> {
    value: T;
    isDirty: boolean;
    isTouched: boolean;
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

// Event handlers for field interactions
export interface FieldEventHandlers<T = any> {
    onChange?: (value: T, fieldName: string) => void;
    onBlur?: (value: T, fieldName: string) => void;
    onFocus?: (fieldName: string) => void;
    onValidate?: (result: ValidationResult, fieldName: string) => void;
}

// Base props for all field components
export interface BaseFieldProps<T = any, M extends BaseFieldMetadata = BaseFieldMetadata> {
    /** Current field value */
    value?: T;
    /** Field metadata configuration */
    metadata: M;
    /** Field state information */
    state?: Partial<FieldState<T>>;
    /** Event handlers */
    events?: FieldEventHandlers<T>;
    /** Custom validators */
    validators?: ValidatorFunction<T>[];
    /** Additional props for the input element */
    inputProps?: Record<string, any>;
}

// Utility type for extracting value type from field props
export type FieldValue<P> = P extends BaseFieldProps<infer T> ? T : never;
