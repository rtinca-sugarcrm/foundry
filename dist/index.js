'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

const EnumField = ({ value, options, mode = 'edit', multiple = false, searchable = false, required = false, placeholder = 'Select...', error, onChange, }) => {
    const [isOpen, setIsOpen] = react.useState(false);
    const [searchQuery, setSearchQuery] = react.useState('');
    const containerRef = react.useRef(null);
    const searchInputRef = react.useRef(null);
    const isReadonly = mode === 'readonly';
    const isDisabled = mode === 'disabled';
    // Close dropdown on outside click
    react.useEffect(() => {
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
    react.useEffect(() => {
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
        return jsxRuntime.jsx("div", { className: "text-sm text-gray-900", children: displayText });
    }
    // Edit or Disabled mode - show dropdown
    return (jsxRuntime.jsxs("div", { ref: containerRef, className: "relative", children: [jsxRuntime.jsxs("button", { type: "button", onClick: () => !isDisabled && setIsOpen(!isOpen), disabled: isDisabled, className: `
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
                `, children: [jsxRuntime.jsx("span", { className: `flex-1 truncate ${!value || (Array.isArray(value) && value.length === 0)
                            ? 'text-gray-400'
                            : 'text-gray-900'}`, children: displayText }), jsxRuntime.jsx("svg", { className: `w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), error && (jsxRuntime.jsxs("div", { className: "mt-1 flex items-center gap-1 text-xs text-red-600", children: [jsxRuntime.jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), error] })), isOpen && !isDisabled && (jsxRuntime.jsxs("div", { className: "absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl", children: [searchable && (jsxRuntime.jsx("div", { className: "p-2 border-b border-gray-200", children: jsxRuntime.jsxs("div", { className: "relative", children: [jsxRuntime.jsx("svg", { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), jsxRuntime.jsx("input", { ref: searchInputRef, type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search...", className: "w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" })] }) })), jsxRuntime.jsx("div", { className: "max-h-60 overflow-y-auto", children: filteredOptions.length === 0 ? (jsxRuntime.jsx("div", { className: "px-3 py-8 text-center text-sm text-gray-500", children: "No options found" })) : (filteredOptions.map((option) => {
                            const selected = isSelected(option.value);
                            const optionDisabled = option.disabled;
                            return (jsxRuntime.jsxs("button", { type: "button", onClick: () => !optionDisabled && handleSelectOption(option.value), disabled: optionDisabled, className: `
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
                                    jsxRuntime.jsx("div", { className: `
                                                w-4 h-4 border rounded flex items-center justify-center flex-shrink-0
                                                ${selected
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'border-gray-300 bg-white'}
                                            `, children: selected && (jsxRuntime.jsx("svg", { className: "w-3 h-3 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })) })) : (
                                    // Checkmark for single-select
                                    jsxRuntime.jsx("div", { className: "w-4 h-4 flex items-center justify-center flex-shrink-0", children: selected && (jsxRuntime.jsx("svg", { className: "w-4 h-4 text-blue-600", fill: "currentColor", viewBox: "0 0 20 20", children: jsxRuntime.jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })) })), jsxRuntime.jsx("span", { className: "flex-1 truncate", children: option.label })] }, option.value));
                        })) })] }))] }));
};

exports.EnumField = EnumField;
//# sourceMappingURL=index.js.map
