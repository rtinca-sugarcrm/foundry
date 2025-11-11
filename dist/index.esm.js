import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';

const EnumField = ({ value, options, mode = 'edit', multiple = false, searchable = false, required = false, placeholder = 'Select...', error, onChange, }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);
    const isReadonly = mode === 'readonly';
    const isDisabled = mode === 'disabled';
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
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
    const handleSelectOption = (optionValue) => {
        if (isDisabled)
            return;
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            const newValues = currentValues.includes(optionValue)
                ? currentValues.filter((v) => v !== optionValue)
                : [...currentValues, optionValue];
            onChange?.(newValues.length > 0 ? newValues : null);
        }
        else {
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
    const isSelected = (optionValue) => {
        if (Array.isArray(value)) {
            return value.includes(optionValue);
        }
        return value === optionValue;
    };
    // Readonly mode - just show the text
    if (isReadonly) {
        return jsx("div", { className: "text-sm text-gray-900", children: displayText });
    }
    // Edit or Disabled mode - show dropdown
    return (jsxs("div", { ref: containerRef, className: "relative", children: [jsxs("button", { type: "button", onClick: () => !isDisabled && setIsOpen(!isOpen), disabled: isDisabled, className: `
                    w-full px-3 py-2 text-left text-sm
                    bg-white border rounded-lg shadow-sm
                    flex items-center justify-between gap-2
                    transition-colors duration-150
                    ${isDisabled
                    ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200'
                    : error
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}
                    ${required && !value ? 'border-red-300' : ''}
                `, children: [jsx("span", { className: `flex-1 truncate ${!value || (Array.isArray(value) && value.length === 0)
                            ? 'text-gray-400'
                            : 'text-gray-900'}`, children: displayText }), jsx("svg", { className: `w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), error && (jsxs("div", { className: "mt-1 flex items-center gap-1 text-xs text-red-600", children: [jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), error] })), isOpen && !isDisabled && (jsxs("div", { className: "absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl", children: [searchable && (jsx("div", { className: "p-2 border-b border-gray-200", children: jsxs("div", { className: "relative", children: [jsx("svg", { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), jsx("input", { ref: searchInputRef, type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search...", className: "w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" })] }) })), jsx("div", { className: "max-h-60 overflow-y-auto", children: filteredOptions.length === 0 ? (jsx("div", { className: "px-3 py-8 text-center text-sm text-gray-500", children: "No options found" })) : (filteredOptions.map((option) => {
                            const selected = isSelected(option.value);
                            const optionDisabled = option.disabled;
                            return (jsxs("button", { type: "button", onClick: () => !optionDisabled && handleSelectOption(option.value), disabled: optionDisabled, className: `
                                            w-full px-3 py-2 text-left text-sm
                                            flex items-center gap-2
                                            transition-colors duration-100
                                            ${optionDisabled
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : selected
                                        ? 'bg-blue-50 text-blue-900'
                                        : 'text-gray-900 hover:bg-gray-50'}
                                        `, children: [multiple ? (
                                    // Checkbox for multi-select
                                    jsx("div", { className: `
                                                w-4 h-4 border rounded flex items-center justify-center flex-shrink-0
                                                ${selected
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'border-gray-300 bg-white'}
                                            `, children: selected && (jsx("svg", { className: "w-3 h-3 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })) })) : (
                                    // Checkmark for single-select
                                    jsx("div", { className: "w-4 h-4 flex items-center justify-center flex-shrink-0", children: selected && (jsx("svg", { className: "w-4 h-4 text-blue-600", fill: "currentColor", viewBox: "0 0 20 20", children: jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })) })), jsx("span", { className: "flex-1 truncate", children: option.label })] }, option.value));
                        })) })] }))] }));
};

const TextField = ({ value, mode = 'edit', type = 'text', required = false, placeholder = '', error, maxLength, minLength, pattern, autoComplete, autoFocus = false, multiline = false, rows = 3, onChange, onBlur, onFocus, }) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const textareaRef = useRef(null);
    const isReadonly = mode === 'readonly';
    const isDisabled = mode === 'disabled';
    // Handle value change
    const handleChange = (e) => {
        if (isDisabled || isReadonly)
            return;
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
        return (jsx("div", { className: "text-sm text-gray-900", children: multiline ? (jsx("div", { className: "whitespace-pre-wrap", children: value || '-' })) : (jsx("span", { children: value || '-' })) }));
    }
    // Common input classes
    const inputClasses = `
        w-full px-3 py-2 text-sm
        bg-white border rounded-lg shadow-sm
        transition-colors duration-150
        ${isDisabled
        ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200'
        : error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : isFocused
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-300 hover:border-gray-400'}
        ${required && !value ? 'border-red-300' : ''}
        focus:outline-none
    `;
    // Edit or Disabled mode - show input/textarea
    return (jsxs("div", { className: "relative", children: [multiline ? (jsx("textarea", { ref: textareaRef, value: value || '', onChange: handleChange, onFocus: handleFocus, onBlur: handleBlur, placeholder: placeholder, disabled: isDisabled, required: required, maxLength: maxLength, minLength: minLength, rows: rows, autoFocus: autoFocus, className: `${inputClasses} resize-y` })) : (jsx("input", { ref: inputRef, type: type, value: value || '', onChange: handleChange, onFocus: handleFocus, onBlur: handleBlur, placeholder: placeholder, disabled: isDisabled, required: required, maxLength: maxLength, minLength: minLength, pattern: pattern, autoComplete: autoComplete, autoFocus: autoFocus, className: inputClasses })), maxLength && !isDisabled && (jsxs("div", { className: "mt-1 text-xs text-right text-gray-500", children: [(value || '').length, " / ", maxLength] })), error && (jsxs("div", { className: "mt-1 flex items-center gap-1 text-xs text-red-600", children: [jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), error] }))] }));
};

const NameField = ({ value, mode = 'edit', required = false, placeholder = 'Enter name...', error, maxLength, link = false, recordId, module, showFocusIcon = false, onLinkClick, onFocusClick, onChange, onBlur, onFocus, }) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const isReadonly = mode === 'readonly';
    const isDisabled = mode === 'disabled';
    const isEditable = mode === 'edit';
    // Handle value change
    const handleChange = (e) => {
        if (isDisabled || isReadonly)
            return;
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
    // Handle link click
    const handleLinkClick = (e) => {
        e.preventDefault();
        if (recordId && module && onLinkClick) {
            onLinkClick(recordId, module);
        }
    };
    // Handle focus icon click
    const handleFocusIconClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (recordId && module && onFocusClick) {
            onFocusClick(recordId, module);
        }
    };
    // Handle keyboard navigation for focus icon
    const handleFocusIconKeyUp = (e) => {
        if (e.key === 'Enter' && recordId && module && onFocusClick) {
            e.preventDefault();
            onFocusClick(recordId, module);
        }
    };
    // Render readonly/disabled mode with optional link
    if (isReadonly || (isDisabled && value)) {
        const displayValue = value || '-';
        const canShowLink = link && recordId && module && !isDisabled;
        const canShowFocusIcon = showFocusIcon && recordId && module && value && !isDisabled;
        return (jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-900", children: [canShowLink ? (jsx("a", { href: "#", onClick: handleLinkClick, className: "text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded", "data-link-target": "focus", "data-module": module, "data-model-id": recordId, children: displayValue })) : (jsx("span", { children: displayValue })), canShowFocusIcon && (jsx("div", { className: "focus-icon-container", children: jsx("button", { type: "button", onClick: handleFocusIconClick, onKeyUp: handleFocusIconKeyUp, className: "focus-icon inline-flex items-center justify-center w-5 h-5 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors", "aria-label": "Open in focus drawer", tabIndex: 0, children: jsxs("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }) }) }))] }));
    }
    // Render edit mode
    if (isEditable) {
        const inputClasses = `
            w-full px-3 py-2 text-sm
            bg-white border rounded-lg shadow-sm
            transition-colors duration-150
            ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : isFocused
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-300 hover:border-gray-400'}
            ${required && !value ? 'border-red-300' : ''}
            focus:outline-none
        `;
        return (jsxs("div", { className: "relative", children: [jsx("input", { ref: inputRef, type: "text", value: value || '', onChange: handleChange, onFocus: handleFocus, onBlur: handleBlur, placeholder: placeholder, required: required, maxLength: maxLength, className: inputClasses }), maxLength && (jsxs("div", { className: "mt-1 text-xs text-right text-gray-500", children: [(value || '').length, " / ", maxLength] })), error && (jsxs("div", { className: "mt-1 flex items-center gap-1 text-xs text-red-600", children: [jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), error] }))] }));
    }
    // Disabled mode with no value - show disabled input
    return (jsx("div", { className: "relative", children: jsx("input", { type: "text", value: "", disabled: true, placeholder: placeholder, className: "w-full px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed border border-gray-200 rounded-lg shadow-sm focus:outline-none" }) }));
};

export { EnumField, NameField, TextField };
//# sourceMappingURL=index.esm.js.map
