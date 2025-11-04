// Design System
export { SugarThemeProvider, useSugarTheme } from './design-system/ThemeProvider';
export type { SugarTheme } from './design-system/theme';
export { defaultTheme } from './design-system/theme';

// Core types and utilities
export type {
    BaseFieldMetadata,
    BaseFieldProps,
    FieldState,
    FieldEventHandlers,
    ValidationResult,
    ValidationContext,
    ValidatorFunction,
} from './core/types';

export {
    required,
    minLength,
    maxLength,
    pattern,
    custom,
    validateValue,
    createValidationResult,
} from './core/validation';

export { useFieldState } from './core/useFieldState';
export type { UseFieldStateOptions, UseFieldStateReturn } from './core/useFieldState';

// Atoms
export { EnumField } from './atoms/EnumField';
export type {
    EnumFieldProps,
    EnumValue,
    EnumValues,
    EnumOption,
    EnumFieldMetadata,
    EnumFieldState,
} from './atoms/EnumField';
export { minSelections, maxSelections, validOptions, enumBusinessRule } from './atoms/EnumField';
