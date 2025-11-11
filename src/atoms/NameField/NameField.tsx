import React, { useState, useRef, useEffect } from 'react';

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

export const NameField: React.FC<NameFieldProps> = ({
    value,
    mode = 'edit',
    required = false,
    placeholder = 'Enter name...',
    error,
    maxLength,
    link = false,
    recordId,
    module,
    showFocusIcon = false,
    onLinkClick,
    onFocusClick,
    onChange,
    onBlur,
    onFocus,
}) => {
    const [internalValue, setInternalValue] = useState<string | null>(value);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const isReadonly = mode === 'readonly';
    const isDisabled = mode === 'disabled';
    const isEditable = mode === 'edit';

    // Sync internal state when external value prop changes
    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    // Handle value change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isDisabled || isReadonly) return;
        const newValue = e.target.value;
        const finalValue = newValue === '' ? null : newValue;
        setInternalValue(finalValue);
        onChange?.(finalValue);
    };

    // Handle focus
    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    };

    // Handle blur
    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    // Handle link click
    const handleLinkClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (recordId && module && onLinkClick) {
            onLinkClick(recordId, module);
        }
    };

    // Handle focus icon click
    const handleFocusIconClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (recordId && module && onFocusClick) {
            onFocusClick(recordId, module);
        }
    };

    // Handle keyboard navigation for focus icon
    const handleFocusIconKeyUp = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && recordId && module && onFocusClick) {
            e.preventDefault();
            onFocusClick(recordId, module);
        }
    };

    // Render readonly/disabled mode with optional link
    if (isReadonly || (isDisabled && internalValue)) {
        const displayValue = internalValue || '-';
        const canShowLink = link && recordId && module && !isDisabled;
        const canShowFocusIcon =
            showFocusIcon && recordId && module && internalValue && !isDisabled;

        return (
            <div className="flex items-center gap-2 text-sm text-gray-900">
                {canShowLink ? (
                    <a
                        href="#"
                        onClick={handleLinkClick}
                        className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                        data-link-target="focus"
                        data-module={module}
                        data-model-id={recordId}
                    >
                        {displayValue}
                    </a>
                ) : (
                    <span>{displayValue}</span>
                )}

                {canShowFocusIcon && (
                    <div className="focus-icon-container">
                        <button
                            type="button"
                            onClick={handleFocusIconClick}
                            onKeyUp={handleFocusIconKeyUp}
                            className="focus-icon inline-flex items-center justify-center w-5 h-5 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
                            aria-label="Open in focus drawer"
                            tabIndex={0}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Render edit mode
    if (isEditable) {
        const inputClasses = `
            w-full px-3 py-2 text-sm
            bg-white border rounded-lg shadow-sm
            transition-colors duration-150
            ${
                error
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : isFocused
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
            }
            ${required && !internalValue ? 'border-red-300' : ''}
            focus:outline-none
        `;

        return (
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={internalValue || ''}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    required={required}
                    maxLength={maxLength}
                    className={inputClasses}
                />

                {/* Character Counter */}
                {maxLength && (
                    <div className="mt-1 text-xs text-right text-gray-500">
                        {(internalValue || '').length} / {maxLength}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {error}
                    </div>
                )}
            </div>
        );
    }

    // Disabled mode with no value - show disabled input
    return (
        <div className="relative">
            <input
                type="text"
                value=""
                disabled
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed border border-gray-200 rounded-lg shadow-sm focus:outline-none"
            />
        </div>
    );
};
