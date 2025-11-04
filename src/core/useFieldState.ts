import { useState, useCallback, useEffect } from 'react';
import { FieldState, ValidationResult, ValidatorFunction, ValidationContext } from '../core/types';
import { validateValue } from '../core/validation';

export interface UseFieldStateOptions<T> {
    initialValue?: T;
    validators?: ValidatorFunction<T>[];
    fieldName: string;
    required?: boolean;
    onChange?: (value: T, fieldName: string) => void;
    onValidate?: (result: ValidationResult, fieldName: string) => void;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
}

export interface UseFieldStateReturn<T> {
    value: T;
    state: FieldState<T>;
    setValue: (value: T) => void;
    setTouched: (touched?: boolean) => void;
    validate: () => ValidationResult;
    reset: () => void;
    handleChange: (value: T) => void;
    handleBlur: () => void;
    handleFocus: () => void;
}

/**
 * Custom hook for managing field state with validation
 */
export const useFieldState = <T = any>({
    initialValue,
    validators = [],
    fieldName,
    required = false,
    onChange,
    onValidate,
    validateOnChange = true,
    validateOnBlur = true,
}: UseFieldStateOptions<T>): UseFieldStateReturn<T> => {
    const [state, setState] = useState<FieldState<T>>({
        value: initialValue as T,
        isDirty: false,
        isTouched: false,
        isValid: true,
        errors: [],
        warnings: [],
    });

    // Create validation context
    const validationContext: ValidationContext = {
        fieldName,
        required,
    };

    // Validate function
    const validate = useCallback((): ValidationResult => {
        const result = validateValue(state.value, validators, validationContext);

        setState((prev) => ({
            ...prev,
            isValid: result.isValid,
            errors: result.errors,
            warnings: result.warnings || [],
        }));

        onValidate?.(result, fieldName);
        return result;
    }, [state.value, validators, fieldName, required, onValidate]);

    // Update value and state
    const updateValue = useCallback(
        (newValue: T) => {
            setState((prev) => ({
                ...prev,
                value: newValue,
                isDirty: newValue !== initialValue,
            }));
        },
        [initialValue]
    );

    // Set touched state
    const setTouched = useCallback((touched: boolean = true) => {
        setState((prev) => ({
            ...prev,
            isTouched: touched,
        }));
    }, []);

    // Reset field to initial state
    const reset = useCallback(() => {
        setState({
            value: initialValue as T,
            isDirty: false,
            isTouched: false,
            isValid: true,
            errors: [],
            warnings: [],
        });
    }, [initialValue]);

    // Handle value change
    const handleChange = useCallback(
        (newValue: T) => {
            updateValue(newValue);
            onChange?.(newValue, fieldName);

            if (validateOnChange) {
                // Validate after state update
                const result = validateValue(newValue, validators, validationContext);
                setState((prev) => ({
                    ...prev,
                    value: newValue,
                    isDirty: newValue !== initialValue,
                    isValid: result.isValid,
                    errors: result.errors,
                    warnings: result.warnings || [],
                }));
                onValidate?.(result, fieldName);
            }
        },
        [
            updateValue,
            onChange,
            fieldName,
            validateOnChange,
            validators,
            validationContext,
            initialValue,
            onValidate,
        ]
    );

    // Handle blur event
    const handleBlur = useCallback(() => {
        setTouched(true);

        if (validateOnBlur) {
            validate();
        }
    }, [setTouched, validateOnBlur, validate]);

    // Handle focus event
    const handleFocus = useCallback(() => {
        // Focus handler can be used for additional logic if needed
    }, []);

    // Validate when validators change
    useEffect(() => {
        if (state.isTouched && validators.length > 0) {
            validate();
        }
    }, [validators, validate, state.isTouched]);

    return {
        value: state.value,
        state,
        setValue: updateValue,
        setTouched,
        validate,
        reset,
        handleChange,
        handleBlur,
        handleFocus,
    };
};
