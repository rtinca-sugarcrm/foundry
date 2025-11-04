import React, { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { BaseFieldProps } from '../../core/types';
import { useFieldState } from '../../core/useFieldState';
import { useSugarTheme } from '../../design-system/ThemeProvider';
import { required } from '../../core/validation';
import { EnumFieldMetadata, EnumValues, EnumOption, EnumFieldState } from './types';
import { minSelections, validOptions } from './validation';
import { enumFieldStyles } from './styles';

export interface EnumFieldProps extends BaseFieldProps<EnumValues, EnumFieldMetadata> {}

export const EnumField: React.FC<EnumFieldProps> = ({
    value,
    metadata,
    state: externalState,
    events = {},
    validators = [],
    inputProps = {},
}) => {
    const theme = useSugarTheme();
    const styles = enumFieldStyles(theme);

    // Local component state
    const [componentState, setComponentState] = useState<EnumFieldState>({
        isOpen: false,
        searchQuery: '',
        focusedIndex: -1,
    });

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Build validators
    const allValidators = [
        ...validators,
        ...(metadata.required ? [required()] : []),
        validOptions(metadata.options.map((opt) => opt.value)),
        ...(metadata.multiple && metadata.required ? [minSelections(1)] : []),
    ];

    // Field state management
    const fieldState = useFieldState({
        initialValue: value,
        validators: allValidators,
        fieldName: metadata.name,
        required: metadata.required,
        onChange: events.onChange,
        onValidate: events.onValidate,
    });

    const currentState = { ...fieldState.state, ...externalState };

    // Filter options based on search
    const filteredOptions = metadata.searchable
        ? metadata.options.filter((option) =>
              option.label.toLowerCase().includes(componentState.searchQuery.toLowerCase())
          )
        : metadata.options;

    // Get selected options
    const selectedValues = Array.isArray(fieldState.value) ? fieldState.value : [fieldState.value];

    // Handle option selection
    const handleOptionSelect = useCallback(
        (option: EnumOption) => {
            if (option.disabled) return;

            let newValue: EnumValues;

            if (metadata.multiple) {
                const currentValues = Array.isArray(fieldState.value) ? fieldState.value : [];
                if (currentValues.includes(option.value)) {
                    newValue = currentValues.filter((v) => v !== option.value);
                } else {
                    newValue = [...currentValues, option.value];
                }
            } else {
                newValue = option.value;
                setComponentState((prev) => ({ ...prev, isOpen: false }));
            }

            fieldState.handleChange(newValue);
        },
        [metadata.multiple, fieldState]
    );

    // Handle dropdown toggle
    const toggleDropdown = useCallback(() => {
        if (metadata.readonly || metadata.disabled) return;

        setComponentState((prev) => ({
            ...prev,
            isOpen: !prev.isOpen,
            searchQuery: '',
            focusedIndex: -1,
        }));
    }, [metadata.readonly, metadata.disabled]);

    // Handle search
    const handleSearch = useCallback((query: string) => {
        setComponentState((prev) => ({
            ...prev,
            searchQuery: query,
            focusedIndex: -1,
        }));
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!componentState.isOpen) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown();
                }
                return;
            }

            switch (e.key) {
                case 'Escape':
                    setComponentState((prev) => ({ ...prev, isOpen: false }));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setComponentState((prev) => ({
                        ...prev,
                        focusedIndex: Math.min(prev.focusedIndex + 1, filteredOptions.length - 1),
                    }));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setComponentState((prev) => ({
                        ...prev,
                        focusedIndex: Math.max(prev.focusedIndex - 1, 0),
                    }));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (componentState.focusedIndex >= 0) {
                        handleOptionSelect(filteredOptions[componentState.focusedIndex]);
                    }
                    break;
            }
        },
        [
            componentState.isOpen,
            componentState.focusedIndex,
            filteredOptions,
            toggleDropdown,
            handleOptionSelect,
        ]
    );

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setComponentState((prev) => ({ ...prev, isOpen: false }));
            }
        };

        if (componentState.isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [componentState.isOpen]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (componentState.isOpen && metadata.searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [componentState.isOpen, metadata.searchable]);

    // Render value display
    const renderValue = () => {
        if (metadata.renderValue) {
            return metadata.renderValue(fieldState.value, metadata.options);
        }

        if (
            !fieldState.value ||
            (Array.isArray(fieldState.value) && fieldState.value.length === 0)
        ) {
            return <span style={styles.placeholder}>{metadata.placeholder}</span>;
        }

        if (Array.isArray(fieldState.value)) {
            const labels = fieldState.value
                .map((v) => metadata.options.find((opt) => opt.value === v)?.label)
                .filter(Boolean);
            return labels.join(', ');
        }

        const option = metadata.options.find((opt) => opt.value === fieldState.value);
        return option?.label || fieldState.value;
    };

    // Render option
    const renderOption = (option: EnumOption, index: number) => {
        const isSelected = selectedValues.includes(option.value);
        const isFocused = index === componentState.focusedIndex;

        if (metadata.renderOption) {
            return metadata.renderOption(option, isSelected);
        }

        const optionStyle = {
            ...styles.option,
            ...(isSelected ? styles.optionSelected : {}),
            ...(option.disabled ? styles.optionDisabled : {}),
            ...(isFocused ? { backgroundColor: theme.colors.background.secondary } : {}),
        };

        return (
            <div
                key={option.value}
                style={optionStyle}
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => setComponentState((prev) => ({ ...prev, focusedIndex: index }))}
            >
                {metadata.multiple && (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by parent click
                        style={styles.checkboxInput}
                        tabIndex={-1}
                    />
                )}
                <span style={styles.optionLabel}>{option.label}</span>
            </div>
        );
    };

    // Render dropdown
    const renderDropdown = () => (
        <div ref={dropdownRef} style={styles.container}>
            <div
                style={styles.dropdownTrigger}
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                tabIndex={metadata.disabled ? -1 : 0}
                {...inputProps}
            >
                <div style={styles.dropdownValue}>{renderValue()}</div>
                <span style={styles.dropdownArrow}>▼</span>
            </div>

            {componentState.isOpen && (
                <div style={styles.dropdownMenu}>
                    {metadata.searchable && (
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search options..."
                            value={componentState.searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={styles.searchInput}
                        />
                    )}

                    {metadata.allowEmpty && !metadata.multiple && (
                        <div
                            style={{
                                ...styles.option,
                                ...(fieldState.value === undefined ||
                                fieldState.value === null ||
                                fieldState.value === ''
                                    ? styles.optionSelected
                                    : {}),
                            }}
                            onClick={() => fieldState.handleChange(metadata.multiple ? [] : '')}
                        >
                            <span style={styles.optionLabel}>{metadata.placeholder || 'None'}</span>
                        </div>
                    )}

                    {filteredOptions.map(renderOption)}

                    {filteredOptions.length === 0 && metadata.searchable && (
                        <div style={styles.option}>
                            <span style={styles.optionLabel}>No options found</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    // Render radio group
    const renderRadioGroup = () => (
        <div style={styles.radioGroup}>
            {metadata.options.map((option) => (
                <label key={option.value} style={styles.radioOption}>
                    <input
                        type="radio"
                        name={metadata.name}
                        value={option.value}
                        checked={fieldState.value === option.value}
                        disabled={option.disabled || metadata.disabled}
                        onChange={() => handleOptionSelect(option)}
                        style={styles.radioInput}
                        {...inputProps}
                    />
                    <span style={styles.optionLabel}>{option.label}</span>
                </label>
            ))}
        </div>
    );

    // Render checkbox group
    const renderCheckboxGroup = () => (
        <div style={styles.checkboxGroup}>
            {metadata.options.map((option) => (
                <label key={option.value} style={styles.checkboxOption}>
                    <input
                        type="checkbox"
                        name={metadata.name}
                        value={option.value}
                        checked={selectedValues.includes(option.value)}
                        disabled={option.disabled || metadata.disabled}
                        onChange={() => handleOptionSelect(option)}
                        style={styles.checkboxInput}
                        {...inputProps}
                    />
                    <span style={styles.optionLabel}>{option.label}</span>
                </label>
            ))}
        </div>
    );

    // Render main input based on display type
    const renderInput = () => {
        switch (metadata.display) {
            case 'radio':
                return renderRadioGroup();
            case 'checkbox':
                return renderCheckboxGroup();
            case 'dropdown':
            default:
                return renderDropdown();
        }
    };

    const containerStyle = {
        ...styles.container,
        ...(!currentState.isValid ? { borderColor: theme.colors.border.error } : {}),
    };

    return (
        <div
            style={containerStyle}
            className={clsx(metadata.className)}
            data-testid={metadata.testId}
        >
            {/* Label */}
            {metadata.label && (
                <label style={styles.label} htmlFor={metadata.name}>
                    {metadata.label}
                    {metadata.required && <span style={styles.requiredIndicator}>*</span>}
                </label>
            )}

            {/* Input */}
            {renderInput()}

            {/* Error messages */}
            {!currentState.isValid && currentState.errors.length > 0 && (
                <div style={styles.errorContainer}>
                    {currentState.errors.map((error, index) => (
                        <span key={index} style={styles.errorText}>
                            {error}
                        </span>
                    ))}
                </div>
            )}

            {/* Help text */}
            {metadata.help && <span style={styles.helpText}>{metadata.help}</span>}
        </div>
    );
};
