import { ValidationResult, ValidationContext, ValidatorFunction } from '../core/types';

/**
 * Core validation utilities for Sugar CRM fields
 * These validators can be used across all field types
 */

export const createValidationResult = (
    isValid: boolean,
    errors: string[] = [],
    warnings: string[] = []
): ValidationResult => ({
    isValid,
    errors,
    warnings,
});

/**
 * Required field validator
 */
export const required = (message?: string): ValidatorFunction => {
    return (value: any, context?: ValidationContext) => {
        const isEmpty =
            value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
            const errorMessage = message || `${context?.fieldName || 'Field'} is required`;
            return createValidationResult(false, [errorMessage]);
        }

        return createValidationResult(true);
    };
};

/**
 * Minimum length validator for strings and arrays
 */
export const minLength = (min: number, message?: string): ValidatorFunction => {
    return (value: any, context?: ValidationContext) => {
        if (value === null || value === undefined) {
            return createValidationResult(true); // Let required validator handle empty values
        }

        const length = typeof value === 'string' || Array.isArray(value) ? value.length : 0;

        if (length < min) {
            const errorMessage =
                message ||
                `${context?.fieldName || 'Field'} must be at least ${min} characters long`;
            return createValidationResult(false, [errorMessage]);
        }

        return createValidationResult(true);
    };
};

/**
 * Maximum length validator for strings and arrays
 */
export const maxLength = (max: number, message?: string): ValidatorFunction => {
    return (value: any, context?: ValidationContext) => {
        if (value === null || value === undefined) {
            return createValidationResult(true);
        }

        const length = typeof value === 'string' || Array.isArray(value) ? value.length : 0;

        if (length > max) {
            const errorMessage =
                message ||
                `${context?.fieldName || 'Field'} must be no more than ${max} characters long`;
            return createValidationResult(false, [errorMessage]);
        }

        return createValidationResult(true);
    };
};

/**
 * Pattern validator for regex matching
 */
export const pattern = (regex: RegExp, message?: string): ValidatorFunction => {
    return (value: any, context?: ValidationContext) => {
        if (value === null || value === undefined || value === '') {
            return createValidationResult(true);
        }

        if (typeof value !== 'string' || !regex.test(value)) {
            const errorMessage = message || `${context?.fieldName || 'Field'} format is invalid`;
            return createValidationResult(false, [errorMessage]);
        }

        return createValidationResult(true);
    };
};

/**
 * Custom validator function
 */
export const custom = (
    validator: (value: any, context?: ValidationContext) => boolean | string | ValidationResult,
    message?: string
): ValidatorFunction => {
    return (value: any, context?: ValidationContext) => {
        const result = validator(value, context);

        // If validator returns ValidationResult, use it directly
        if (typeof result === 'object' && 'isValid' in result) {
            return result;
        }

        // If validator returns string, treat as error message
        if (typeof result === 'string') {
            return createValidationResult(false, [result]);
        }

        // If validator returns boolean false, use provided message
        if (result === false) {
            const errorMessage = message || `${context?.fieldName || 'Field'} is invalid`;
            return createValidationResult(false, [errorMessage]);
        }

        return createValidationResult(true);
    };
};

/**
 * Validates a value against multiple validators
 */
export const validateValue = <T>(
    value: T,
    validators: ValidatorFunction<T>[],
    context?: ValidationContext
): ValidationResult => {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    for (const validator of validators) {
        const result = validator(value, context);
        allErrors.push(...result.errors);
        if (result.warnings) {
            allWarnings.push(...result.warnings);
        }
    }

    return createValidationResult(allErrors.length === 0, allErrors, allWarnings);
};
