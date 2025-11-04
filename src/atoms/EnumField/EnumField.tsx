import React, { useState, useRef, useEffect } from 'react';

export interface EnumOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface EnumFieldProps {
    value: string | string[] | null;
    options: EnumOption[];
    mode?: 'edit' | 'readonly' | 'disabled';
    multiple?: boolean;
    searchable?: boolean;
    required?: boolean;
    placeholder?: string;
    error?: string;
    onChange?: (value: string | string[] | null) => void;
}

export const EnumField: React.FC<EnumFieldProps> = ({
    value,
    options,
    mode = 'edit',
    multiple = false,
    searchable = false,
    required = false,
    placeholder = 'Select...',
    error,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const isReadonly = mode === 'readonly';
    const isDisabled = mode === 'disabled';

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    // Get display text for selected value(s)
    const displayText = (() => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            return placeholder;
        }

        if (Array.isArray(value)) {
            const selectedLabels = options
                .filter((opt) => value.includes(opt.value))
                .map((opt) => opt.label);
            return selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder;
        }

        const selectedOption = options.find((opt) => opt.value === value);
        return selectedOption?.label || placeholder;
    })();

    // Handle option selection
    const handleSelectOption = (optionValue: string) => {
        if (isDisabled) return;

        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            const newValues = currentValues.includes(optionValue)
                ? currentValues.filter((v) => v !== optionValue)
                : [...currentValues, optionValue];
            onChange?.(newValues.length > 0 ? newValues : null);
        } else {
            onChange?.(optionValue);
            setIsOpen(false);
            setSearchQuery('');
        }
    };

    // Filter options based on search query
    const filteredOptions = searchQuery
        ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : options;

    // Check if option is selected
    const isSelected = (optionValue: string): boolean => {
        if (Array.isArray(value)) {
            return value.includes(optionValue);
        }
        return value === optionValue;
    };

    // Readonly mode - just show the text
    if (isReadonly) {
        return <div className="text-sm text-gray-900">{displayText}</div>;
    }

    // Edit or Disabled mode - show dropdown
    return (
        <div ref={containerRef} className="relative">
            {/* Dropdown Trigger Button */}
            <button
                type="button"
                onClick={() => !isDisabled && setIsOpen(!isOpen)}
                disabled={isDisabled}
                className={`
                    w-full px-3 py-2 text-left text-sm
                    bg-white border rounded-lg shadow-sm
                    flex items-center justify-between gap-2
                    transition-colors duration-150
                    ${
                        isDisabled
                            ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200'
                            : error
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }
                    ${required && !value ? 'border-red-300' : ''}
                `}
            >
                <span
                    className={`flex-1 truncate ${
                        !value || (Array.isArray(value) && value.length === 0)
                            ? 'text-gray-400'
                            : 'text-gray-900'
                    }`}
                >
                    {displayText}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    } ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

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

            {/* Dropdown Flyout Panel */}
            {isOpen && !isDisabled && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
                    {/* Search Input */}
                    {searchable && (
                        <div className="p-2 border-b border-gray-200">
                            <div className="relative">
                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-8 text-center text-sm text-gray-500">
                                No options found
                            </div>
                        ) : (
                            filteredOptions.map((option) => {
                                const selected = isSelected(option.value);
                                const optionDisabled = option.disabled;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            !optionDisabled && handleSelectOption(option.value)
                                        }
                                        disabled={optionDisabled}
                                        className={`
                                            w-full px-3 py-2 text-left text-sm
                                            flex items-center gap-2
                                            transition-colors duration-100
                                            ${
                                                optionDisabled
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : selected
                                                    ? 'bg-blue-50 text-blue-900'
                                                    : 'text-gray-900 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {multiple ? (
                                            // Checkbox for multi-select
                                            <div
                                                className={`
                                                w-4 h-4 border rounded flex items-center justify-center flex-shrink-0
                                                ${
                                                    selected
                                                        ? 'bg-blue-600 border-blue-600'
                                                        : 'border-gray-300 bg-white'
                                                }
                                            `}
                                            >
                                                {selected && (
                                                    <svg
                                                        className="w-3 h-3 text-white"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        ) : (
                                            // Checkmark for single-select
                                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                                                {selected && (
                                                    <svg
                                                        className="w-4 h-4 text-blue-600"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        )}
                                        <span className="flex-1 truncate">{option.label}</span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
