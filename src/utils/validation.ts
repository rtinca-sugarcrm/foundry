import { ValidationRule, ValidationResult, BaseFieldMetadata } from '../types/field.types';

/**
 * Validates a field value against its validation rules
 */
export const validateField = (value: any, metadata: BaseFieldMetadata): ValidationResult => {
    const errors: string[] = [];

    if (!metadata.validation) {
        return { isValid: true, errors: [] };
    }

    for (const rule of metadata.validation) {
        const error = validateRule(value, rule, metadata);
        if (error) {
            errors.push(error);
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validates a single validation rule
 */
const validateRule = (
    value: any,
    rule: ValidationRule,
    metadata: BaseFieldMetadata
): string | null => {
    switch (rule.type) {
        case 'required':
            if (metadata.required && (value === null || value === undefined || value === '')) {
                return rule.message || `${metadata.label} is required`;
            }
            break;

        case 'minLength':
            if (value && typeof value === 'string' && value.length < rule.value) {
                return (
                    rule.message ||
                    `${metadata.label} must be at least ${rule.value} characters long`
                );
            }
            break;

        case 'maxLength':
            if (value && typeof value === 'string' && value.length > rule.value) {
                return (
                    rule.message ||
                    `${metadata.label} must be no more than ${rule.value} characters long`
                );
            }
            break;

        case 'pattern':
            if (value && typeof value === 'string' && !rule.value.test(value)) {
                return rule.message || `${metadata.label} format is invalid`;
            }
            break;

        case 'custom':
            if (rule.validator) {
                const result = rule.validator(value);
                if (typeof result === 'string') {
                    return result;
                }
                if (result === false) {
                    return rule.message || `${metadata.label} is invalid`;
                }
            }
            break;

        default:
            break;
    }

    return null;
};

/**
 * Creates a required validation rule
 */
export const required = (message?: string): ValidationRule => ({
    type: 'required',
    message: message || 'This field is required',
});

/**
 * Creates a minimum length validation rule
 */
export const minLength = (length: number, message?: string): ValidationRule => ({
    type: 'minLength',
    value: length,
    message: message || `Must be at least ${length} characters long`,
});

/**
 * Creates a maximum length validation rule
 */
export const maxLength = (length: number, message?: string): ValidationRule => ({
    type: 'maxLength',
    value: length,
    message: message || `Must be no more than ${length} characters long`,
});

/**
 * Creates a pattern validation rule
 */
export const pattern = (regex: RegExp, message?: string): ValidationRule => ({
    type: 'pattern',
    value: regex,
    message: message || 'Invalid format',
});

/**
 * Creates a custom validation rule
 */
export const custom = (
    validator: (value: any) => boolean | string,
    message?: string
): ValidationRule => ({
    type: 'custom',
    validator,
    message: message || 'Invalid value',
});
