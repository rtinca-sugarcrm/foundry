import { ValidatorFunction } from '../../core/types';
import { createValidationResult } from '../../core/validation';
import { EnumValues } from './types';

/**
 * Enum-specific validation functions
 */

/**
 * Validates that at least one option is selected for multi-select enums
 */
export const minSelections = (min: number, message?: string): ValidatorFunction<EnumValues> => {
    return (value: EnumValues, context) => {
        if (!Array.isArray(value)) {
            return createValidationResult(true); // Let other validators handle type validation
        }

        if (value.length < min) {
            const errorMessage =
                message || `Please select at least ${min} option${min > 1 ? 's' : ''}`;
            return createValidationResult(false, [errorMessage]);
        }

        return createValidationResult(true);
    };
};

/**
 * Validates that no more than max options are selected for multi-select enums
 */
export const maxSelections = (max: number, message?: string): ValidatorFunction<EnumValues> => {
    return (value: EnumValues, context) => {
        if (!Array.isArray(value)) {
            return createValidationResult(true);
        }

        if (value.length > max) {
            const errorMessage =
                message || `Please select no more than ${max} option${max > 1 ? 's' : ''}`;
            return createValidationResult(false, [errorMessage]);
        }

        return createValidationResult(true);
    };
};

/**
 * Validates that selected values exist in the options list
 */
export const validOptions = (
    allowedValues: (string | number)[],
    message?: string
): ValidatorFunction => {
    return (value: any, context) => {
        if (value === null || value === undefined || value === '') {
            return createValidationResult(true);
        }

        const valuesToCheck = Array.isArray(value) ? value : [value];
        const invalidValues = valuesToCheck.filter((v) => !allowedValues.includes(v));

        if (invalidValues.length > 0) {
            const errorMessage =
                message ||
                `Invalid selection${invalidValues.length > 1 ? 's' : ''}: ${invalidValues.join(
                    ', '
                )}`;
            return createValidationResult(false, [errorMessage]);
        }

        return createValidationResult(true);
    };
};

/**
 * Validates enum selection against business rules
 */
export const enumBusinessRule = (
    rule: (value: any, context?: any) => boolean | string,
    message?: string
): ValidatorFunction => {
    return (value: any, context) => {
        const result = rule(value, context);

        if (typeof result === 'string') {
            return createValidationResult(false, [result]);
        }

        if (result === false) {
            const errorMessage = message || 'Selection does not meet business requirements';
            return createValidationResult(false, [errorMessage]);
        }

        return createValidationResult(true);
    };
};
