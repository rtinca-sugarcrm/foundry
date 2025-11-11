import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';

const EnumField = ({ value, options, mode = 'edit', multiple = false, searchable = false, required = false, placeholder = 'Select...', error, onChange, }) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);
    const isReadonly = mode === 'readonly';
    const isDisabled = mode === 'disabled';
    // Sync internal state when external value prop changes
    useEffect(() => {
        setInternalValue(value);
    }, [value]);
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
        if (!internalValue || (Array.isArray(internalValue) && internalValue.length === 0)) {
            return placeholder;
        }
        if (Array.isArray(internalValue)) {
            const selectedLabels = options
                .filter((opt) => internalValue.includes(opt.value))
                .map((opt) => opt.label);
            return selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder;
        }
        const selectedOption = options.find((opt) => opt.value === internalValue);
        return selectedOption?.label || placeholder;
    })();
    // Handle option selection
    const handleSelectOption = (optionValue) => {
        if (isDisabled)
            return;
        if (multiple) {
            const currentValues = Array.isArray(internalValue) ? internalValue : [];
            const newValues = currentValues.includes(optionValue)
                ? currentValues.filter((v) => v !== optionValue)
                : [...currentValues, optionValue];
            const finalValue = newValues.length > 0 ? newValues : null;
            setInternalValue(finalValue);
            onChange?.(finalValue);
        }
        else {
            setInternalValue(optionValue);
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
        if (Array.isArray(internalValue)) {
            return internalValue.includes(optionValue);
        }
        return internalValue === optionValue;
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
                    ${required && !internalValue ? 'border-red-300' : ''}
                `, children: [jsx("span", { className: `flex-1 truncate ${!internalValue ||
                            (Array.isArray(internalValue) && internalValue.length === 0)
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
    const [internalValue, setInternalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const textareaRef = useRef(null);
    const isReadonly = mode === 'readonly';
    const isDisabled = mode === 'disabled';
    // Sync internal state when external value prop changes
    useEffect(() => {
        setInternalValue(value);
    }, [value]);
    // Handle value change
    const handleChange = (e) => {
        if (isDisabled || isReadonly)
            return;
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
    // Readonly mode - just show the text
    if (isReadonly) {
        return (jsx("div", { className: "text-sm text-gray-900", children: multiline ? (jsx("div", { className: "whitespace-pre-wrap", children: internalValue || '-' })) : (jsx("span", { children: internalValue || '-' })) }));
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
        ${required && !internalValue ? 'border-red-300' : ''}
        focus:outline-none
    `;
    // Edit or Disabled mode - show input/textarea
    return (jsxs("div", { className: "relative", children: [multiline ? (jsx("textarea", { ref: textareaRef, value: internalValue || '', onChange: handleChange, onFocus: handleFocus, onBlur: handleBlur, placeholder: placeholder, disabled: isDisabled, required: required, maxLength: maxLength, minLength: minLength, rows: rows, autoFocus: autoFocus, className: `${inputClasses} resize-y` })) : (jsx("input", { ref: inputRef, type: type, value: internalValue || '', onChange: handleChange, onFocus: handleFocus, onBlur: handleBlur, placeholder: placeholder, disabled: isDisabled, required: required, maxLength: maxLength, minLength: minLength, pattern: pattern, autoComplete: autoComplete, autoFocus: autoFocus, className: inputClasses })), maxLength && !isDisabled && (jsxs("div", { className: "mt-1 text-xs text-right text-gray-500", children: [(internalValue || '').length, " / ", maxLength] })), error && (jsxs("div", { className: "mt-1 flex items-center gap-1 text-xs text-red-600", children: [jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), error] }))] }));
};

const NameField = ({ value, mode = 'edit', required = false, placeholder = 'Enter name...', error, maxLength, link = false, recordId, module, showFocusIcon = false, onLinkClick, onFocusClick, onChange, onBlur, onFocus, }) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const isReadonly = mode === 'readonly';
    const isDisabled = mode === 'disabled';
    const isEditable = mode === 'edit';
    // Sync internal state when external value prop changes
    useEffect(() => {
        setInternalValue(value);
    }, [value]);
    // Handle value change
    const handleChange = (e) => {
        if (isDisabled || isReadonly)
            return;
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
    if (isReadonly || (isDisabled && internalValue)) {
        const displayValue = internalValue || '-';
        const canShowLink = link && recordId && module && !isDisabled;
        const canShowFocusIcon = showFocusIcon && recordId && module && internalValue && !isDisabled;
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
            ${required && !internalValue ? 'border-red-300' : ''}
            focus:outline-none
        `;
        return (jsxs("div", { className: "relative", children: [jsx("input", { ref: inputRef, type: "text", value: internalValue || '', onChange: handleChange, onFocus: handleFocus, onBlur: handleBlur, placeholder: placeholder, required: required, maxLength: maxLength, className: inputClasses }), maxLength && (jsxs("div", { className: "mt-1 text-xs text-right text-gray-500", children: [(internalValue || '').length, " / ", maxLength] })), error && (jsxs("div", { className: "mt-1 flex items-center gap-1 text-xs text-red-600", children: [jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), error] }))] }));
    }
    // Disabled mode with no value - show disabled input
    return (jsx("div", { className: "relative", children: jsx("input", { type: "text", value: "", disabled: true, placeholder: placeholder, className: "w-full px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed border border-gray-200 rounded-lg shadow-sm focus:outline-none" }) }));
};

const ListView = ({ columns, rows, selectable = false, multiSelect = true, selectedIds = [], sort, loading = false, emptyMessage = 'No data available', hoverable = true, clickableRows = false, className = '', showHeader = true, maxHeight, onSelectionChange, onRowClick, onRowDoubleClick, onSortChange, onColumnHeaderClick, onRowAction, }) => {
    const [internalSelectedIds, setInternalSelectedIds] = useState(selectedIds);
    const tableRef = useRef(null);
    // Sync internal state with external selectedIds prop
    useEffect(() => {
        setInternalSelectedIds(selectedIds);
    }, [selectedIds]);
    // Get visible columns
    const visibleColumns = columns.filter((col) => col.visible !== false);
    // Check if all rows are selected
    const allSelected = rows.length > 0 &&
        rows.every((row) => row.disabled || internalSelectedIds.includes(row.id));
    // Check if some rows are selected (for indeterminate state)
    const someSelected = internalSelectedIds.length > 0 &&
        !allSelected &&
        rows.some((row) => internalSelectedIds.includes(row.id));
    // Handle select all
    const handleSelectAll = () => {
        if (allSelected) {
            // Deselect all
            setInternalSelectedIds([]);
            onSelectionChange?.([]);
        }
        else {
            // Select all non-disabled rows
            const allIds = rows.filter((row) => !row.disabled).map((row) => row.id);
            setInternalSelectedIds(allIds);
            onSelectionChange?.(allIds);
        }
    };
    // Handle row selection
    const handleRowSelect = (rowId, event) => {
        let newSelectedIds;
        if (multiSelect && event?.shiftKey) {
            // Shift-click: select range
            const currentIndex = rows.findIndex((r) => r.id === rowId);
            const lastSelectedIndex = rows.findIndex((r) => internalSelectedIds.includes(r.id));
            if (lastSelectedIndex >= 0) {
                const start = Math.min(currentIndex, lastSelectedIndex);
                const end = Math.max(currentIndex, lastSelectedIndex);
                const rangeIds = rows
                    .slice(start, end + 1)
                    .filter((r) => !r.disabled)
                    .map((r) => r.id);
                newSelectedIds = Array.from(new Set([...internalSelectedIds, ...rangeIds]));
            }
            else {
                newSelectedIds = [rowId];
            }
        }
        else if (multiSelect && (event?.ctrlKey || event?.metaKey)) {
            // Ctrl/Cmd-click: toggle selection
            if (internalSelectedIds.includes(rowId)) {
                newSelectedIds = internalSelectedIds.filter((id) => id !== rowId);
            }
            else {
                newSelectedIds = [...internalSelectedIds, rowId];
            }
        }
        else if (multiSelect) {
            // Regular click in multi-select mode: toggle
            if (internalSelectedIds.includes(rowId)) {
                newSelectedIds = internalSelectedIds.filter((id) => id !== rowId);
            }
            else {
                newSelectedIds = [...internalSelectedIds, rowId];
            }
        }
        else {
            // Single select mode
            newSelectedIds = internalSelectedIds.includes(rowId) ? [] : [rowId];
        }
        setInternalSelectedIds(newSelectedIds);
        onSelectionChange?.(newSelectedIds);
    };
    // Handle sort
    const handleSort = (columnKey) => {
        const column = columns.find((col) => col.key === columnKey);
        if (!column?.sortable)
            return;
        const newDirection = sort?.columnKey === columnKey && sort.direction === 'asc' ? 'desc' : 'asc';
        onSortChange?.({
            columnKey,
            direction: newDirection,
        });
    };
    // Handle row click
    const handleRowClick = (row, rowIndex, event) => {
        if (row.disabled)
            return;
        // Don't trigger row click if clicking on checkbox or interactive elements
        const target = event.target;
        if (target.closest('input[type="checkbox"]') ||
            target.closest('button') ||
            target.closest('a')) {
            return;
        }
        onRowClick?.(row, rowIndex);
    };
    // Handle row double click
    const handleRowDoubleClick = (row, rowIndex) => {
        if (row.disabled)
            return;
        onRowDoubleClick?.(row, rowIndex);
    };
    // Render cell content
    const renderCell = (column, row, rowIndex) => {
        const value = row.data[column.key];
        // Use custom render if provided
        if (column.render) {
            return column.render(value, row.data, rowIndex);
        }
        // Handle null/undefined values
        if (value === null || value === undefined) {
            return jsx("span", { className: "text-gray-400", children: "-" });
        }
        // Render based on field type using our components
        switch (column.type) {
            case 'enum':
                return (jsx(EnumField, { value: value, options: column.options || [], mode: "readonly", ...(column.fieldProps || {}) }));
            case 'name':
            case 'relate':
                return (jsx(NameField, { value: value, mode: "readonly", link: column.type === 'name' || column.type === 'relate', recordId: row.data[`${column.key}_id`], module: row.data[`${column.key}_module`], onLinkClick: column.fieldProps?.onLinkClick ||
                        ((recordId, module) => {
                            onRowAction?.('navigate', row, rowIndex);
                        }), ...(column.fieldProps || {}) }));
            case 'email':
            case 'phone':
            case 'url':
            case 'text':
                return (jsx(TextField, { value: value, mode: "readonly", type: column.type === 'email'
                        ? 'email'
                        : column.type === 'phone'
                            ? 'tel'
                            : column.type === 'url'
                                ? 'url'
                                : 'text', ...(column.fieldProps || {}) }));
            case 'custom':
                // Custom type but no render function provided
                return jsx("div", { className: "text-sm text-gray-900", children: String(value) });
            default:
                // Default: plain text rendering
                return jsx("div", { className: "text-sm text-gray-900", children: String(value) });
        }
    };
    // Get column width style
    const getColumnWidth = (column) => {
        if (!column.width)
            return undefined;
        return typeof column.width === 'number' ? `${column.width}px` : column.width;
    };
    // Loading state
    if (loading) {
        return (jsx("div", { className: "w-full p-8 text-center", children: jsxs("div", { className: "inline-flex items-center gap-2 text-gray-600", children: [jsxs("svg", { className: "w-5 h-5 animate-spin", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", strokeWidth: "4" }), jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), jsx("span", { children: "Loading..." })] }) }));
    }
    // Empty state
    if (rows.length === 0) {
        return (jsx("div", { className: "w-full p-8 text-center", children: jsx("div", { className: "text-gray-500", children: emptyMessage }) }));
    }
    return (jsx("div", { ref: tableRef, className: `w-full overflow-auto ${className}`, style: {
            maxHeight: maxHeight
                ? typeof maxHeight === 'number'
                    ? `${maxHeight}px`
                    : maxHeight
                : undefined,
        }, children: jsxs("table", { className: "w-full border-collapse", children: [showHeader && (jsx("thead", { className: "bg-gray-50 sticky top-0 z-10", children: jsxs("tr", { className: "border-b border-gray-200", children: [selectable && (jsx("th", { className: "w-12 px-4 py-3 text-left", children: multiSelect && (jsx("input", { type: "checkbox", checked: allSelected, ref: (input) => {
                                        if (input) {
                                            input.indeterminate = someSelected;
                                        }
                                    }, onChange: handleSelectAll, className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" })) })), visibleColumns.map((column) => (jsx("th", { style: { width: getColumnWidth(column) }, className: `px-4 py-3 text-sm font-semibold text-gray-700 ${column.align === 'center'
                                    ? 'text-center'
                                    : column.align === 'right'
                                        ? 'text-right'
                                        : 'text-left'} ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`, onClick: () => {
                                    if (column.sortable) {
                                        handleSort(column.key);
                                    }
                                    onColumnHeaderClick?.(column);
                                }, children: jsxs("div", { className: "flex items-center gap-2", children: [jsx("span", { children: column.label }), column.sortable && (jsx("span", { className: "text-gray-400", children: sort?.columnKey === column.key ? (sort.direction === 'asc' ? (jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: jsx("path", { fillRule: "evenodd", d: "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z", clipRule: "evenodd" }) })) : (jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: jsx("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) }))) : (jsx("svg", { className: "w-4 h-4 opacity-0 group-hover:opacity-100", fill: "currentColor", viewBox: "0 0 20 20", children: jsx("path", { d: "M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" }) })) }))] }) }, column.key)))] }) })), jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: rows.map((row, rowIndex) => {
                        const isSelected = internalSelectedIds.includes(row.id);
                        const isClickable = clickableRows && !row.disabled;
                        return (jsxs("tr", { className: `
                                    ${hoverable && !row.disabled ? 'hover:bg-gray-50' : ''}
                                    ${isSelected ? 'bg-blue-50' : ''}
                                    ${isClickable ? 'cursor-pointer' : ''}
                                    ${row.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                    ${row.className || ''}
                                `, onClick: (e) => handleRowClick(row, rowIndex, e), onDoubleClick: () => handleRowDoubleClick(row, rowIndex), children: [selectable && (jsx("td", { className: "w-12 px-4 py-3", children: jsx("input", { type: "checkbox", checked: isSelected, disabled: row.disabled, onChange: (e) => handleRowSelect(row.id, e), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" }) })), visibleColumns.map((column) => (jsx("td", { className: `px-4 py-3 text-sm text-gray-900 ${column.align === 'center'
                                        ? 'text-center'
                                        : column.align === 'right'
                                            ? 'text-right'
                                            : 'text-left'}`, children: renderCell(column, row, rowIndex) }, column.key)))] }, row.id));
                    }) })] }) }));
};

export { EnumField, ListView, NameField, TextField };
//# sourceMappingURL=index.esm.js.map
