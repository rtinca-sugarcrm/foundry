import React, { useState, useRef } from 'react';

export interface TextFieldProps {
    value: string | null;
    mode?: 'edit' | 'readonly' | 'disabled';
    type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number';
    required?: boolean;
    placeholder?: string;
    error?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    multiline?: boolean;
    rows?: number;
    onChange?: (value: string | null) => void;
    onBlur?: () => void;
    onFocus?: () => void;
}

export const TextField: React.FC<TextFieldProps> = ({
    value,
    mode = 'edit',
    type = 'text',
    required = false,
    placeholder = '',
    error,
    maxLength,
    minLength,
    pattern,
    autoComplete,
    autoFocus = false,
    multiline = false,
    rows = 3,
    onChange,
    onBlur,
    onFocus,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isReadonly = mode === 'readonly';
    const isDisabled = mode === 'disabled';

    // Get display text for the current value
    const displayText = value || placeholder;

    // Handle value change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (isDisabled || isReadonly) return;
        const newValue = e.target.value;
        onChange?.(newValue === '' ? null : newValue);
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

    // Readonly mode - just show the text
    if (isReadonly) {
        return (
            <div className="text-sm text-gray-900">
                {multiline ? (
                    <div className="whitespace-pre-wrap">{value || '-'}</div>
                ) : (
                    <span>{value || '-'}</span>
                )}
            </div>
        );
    }

    // Common input classes
    const inputClasses = `
        w-full px-3 py-2 text-sm
        bg-white border rounded-lg shadow-sm
        transition-colors duration-150
        ${
            isDisabled
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200'
                : error
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : isFocused
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-300 hover:border-gray-400'
        }
        ${required && !value ? 'border-red-300' : ''}
        focus:outline-none
    `;

    // Edit or Disabled mode - show input/textarea
    return (
        <div className="relative">
            {multiline ? (
                <textarea
                    ref={textareaRef}
                    value={value || ''}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    required={required}
                    maxLength={maxLength}
                    minLength={minLength}
                    rows={rows}
                    autoFocus={autoFocus}
                    className={`${inputClasses} resize-y`}
                />
            ) : (
                <input
                    ref={inputRef}
                    type={type}
                    value={value || ''}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    required={required}
                    maxLength={maxLength}
                    minLength={minLength}
                    pattern={pattern}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    className={inputClasses}
                />
            )}

            {/* Character Counter */}
            {maxLength && !isDisabled && (
                <div className="mt-1 text-xs text-right text-gray-500">
                    {(value || '').length} / {maxLength}
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
};
