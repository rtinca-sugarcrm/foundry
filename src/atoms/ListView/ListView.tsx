import React, { useState, useEffect, useRef } from 'react';
import { EnumField } from '../EnumField';
import { TextField } from '../TextField';
import { NameField } from '../NameField';
import type { EnumOption } from '../EnumField';

export interface ListViewColumn {
    /** Unique identifier for the column */
    key: string;
    /** Display label for the column header */
    label: string;
    /** Width of the column (px, %, or 'auto') */
    width?: string | number;
    /** Whether the column is sortable */
    sortable?: boolean;
    /** Alignment of column content */
    align?: 'left' | 'center' | 'right';
    /** Field type to determine which component to use */
    type?: 'text' | 'email' | 'phone' | 'url' | 'enum' | 'name' | 'relate' | 'custom';
    /** Options for enum fields */
    options?: EnumOption[];
    /** Additional props to pass to the field component */
    fieldProps?: Record<string, any>;
    /** Custom render function for the cell (overrides type-based rendering) */
    render?: (value: any, row: any, rowIndex: number) => React.ReactNode;
    /** Whether the column is visible */
    visible?: boolean;
}

export interface ListViewRow {
    /** Unique identifier for the row */
    id: string;
    /** Data object containing all field values */
    data: Record<string, any>;
    /** Whether the row is selected */
    selected?: boolean;
    /** Whether the row is disabled */
    disabled?: boolean;
    /** CSS classes for the row */
    className?: string;
}

export interface ListViewSort {
    /** Column key to sort by */
    columnKey: string;
    /** Sort direction */
    direction: 'asc' | 'desc';
}

export interface ListViewProps {
    /** Column definitions */
    columns: ListViewColumn[];
    /** Row data */
    rows: ListViewRow[];
    /** Whether to show selection checkboxes */
    selectable?: boolean;
    /** Whether to allow multiple selections */
    multiSelect?: boolean;
    /** Selected row IDs */
    selectedIds?: string[];
    /** Current sort configuration */
    sort?: ListViewSort;
    /** Whether the list is loading */
    loading?: boolean;
    /** Message to show when no data */
    emptyMessage?: string;
    /** Whether to show row hover effect */
    hoverable?: boolean;
    /** Whether rows are clickable */
    clickableRows?: boolean;
    /** Custom CSS class for the table */
    className?: string;
    /** Whether to show header */
    showHeader?: boolean;
    /** Whether to make the table scrollable */
    maxHeight?: string | number;
    /** Callback when selection changes */
    onSelectionChange?: (selectedIds: string[]) => void;
    /** Callback when a row is clicked */
    onRowClick?: (row: ListViewRow, rowIndex: number) => void;
    /** Callback when a row is double-clicked */
    onRowDoubleClick?: (row: ListViewRow, rowIndex: number) => void;
    /** Callback when sort changes */
    onSortChange?: (sort: ListViewSort) => void;
    /** Callback when a column header is clicked */
    onColumnHeaderClick?: (column: ListViewColumn) => void;
    /** Callback for custom row actions */
    onRowAction?: (action: string, row: ListViewRow, rowIndex: number) => void;
}

export const ListView: React.FC<ListViewProps> = ({
    columns,
    rows,
    selectable = false,
    multiSelect = true,
    selectedIds = [],
    sort,
    loading = false,
    emptyMessage = 'No data available',
    hoverable = true,
    clickableRows = false,
    className = '',
    showHeader = true,
    maxHeight,
    onSelectionChange,
    onRowClick,
    onRowDoubleClick,
    onSortChange,
    onColumnHeaderClick,
    onRowAction,
}) => {
    const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(selectedIds);
    const tableRef = useRef<HTMLDivElement>(null);

    // Sync internal state with external selectedIds prop
    useEffect(() => {
        setInternalSelectedIds(selectedIds);
    }, [selectedIds]);

    // Get visible columns
    const visibleColumns = columns.filter((col) => col.visible !== false);

    // Check if all rows are selected
    const allSelected =
        rows.length > 0 &&
        rows.every((row) => row.disabled || internalSelectedIds.includes(row.id));

    // Check if some rows are selected (for indeterminate state)
    const someSelected =
        internalSelectedIds.length > 0 &&
        !allSelected &&
        rows.some((row) => internalSelectedIds.includes(row.id));

    // Handle select all
    const handleSelectAll = () => {
        if (allSelected) {
            // Deselect all
            setInternalSelectedIds([]);
            onSelectionChange?.([]);
        } else {
            // Select all non-disabled rows
            const allIds = rows.filter((row) => !row.disabled).map((row) => row.id);
            setInternalSelectedIds(allIds);
            onSelectionChange?.(allIds);
        }
    };

    // Handle row selection
    const handleRowSelect = (rowId: string, event?: React.MouseEvent) => {
        let newSelectedIds: string[];

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
            } else {
                newSelectedIds = [rowId];
            }
        } else if (multiSelect && (event?.ctrlKey || event?.metaKey)) {
            // Ctrl/Cmd-click: toggle selection
            if (internalSelectedIds.includes(rowId)) {
                newSelectedIds = internalSelectedIds.filter((id) => id !== rowId);
            } else {
                newSelectedIds = [...internalSelectedIds, rowId];
            }
        } else if (multiSelect) {
            // Regular click in multi-select mode: toggle
            if (internalSelectedIds.includes(rowId)) {
                newSelectedIds = internalSelectedIds.filter((id) => id !== rowId);
            } else {
                newSelectedIds = [...internalSelectedIds, rowId];
            }
        } else {
            // Single select mode
            newSelectedIds = internalSelectedIds.includes(rowId) ? [] : [rowId];
        }

        setInternalSelectedIds(newSelectedIds);
        onSelectionChange?.(newSelectedIds);
    };

    // Handle sort
    const handleSort = (columnKey: string) => {
        const column = columns.find((col) => col.key === columnKey);
        if (!column?.sortable) return;

        const newDirection =
            sort?.columnKey === columnKey && sort.direction === 'asc' ? 'desc' : 'asc';

        onSortChange?.({
            columnKey,
            direction: newDirection,
        });
    };

    // Handle row click
    const handleRowClick = (row: ListViewRow, rowIndex: number, event: React.MouseEvent) => {
        if (row.disabled) return;

        // Don't trigger row click if clicking on checkbox or interactive elements
        const target = event.target as HTMLElement;
        if (
            target.closest('input[type="checkbox"]') ||
            target.closest('button') ||
            target.closest('a')
        ) {
            return;
        }

        onRowClick?.(row, rowIndex);
    };

    // Handle row double click
    const handleRowDoubleClick = (row: ListViewRow, rowIndex: number) => {
        if (row.disabled) return;
        onRowDoubleClick?.(row, rowIndex);
    };

    // Render cell content
    const renderCell = (column: ListViewColumn, row: ListViewRow, rowIndex: number) => {
        const value = row.data[column.key];

        // Use custom render if provided
        if (column.render) {
            return column.render(value, row.data, rowIndex);
        }

        // Handle null/undefined values
        if (value === null || value === undefined) {
            return <span className="text-gray-400">-</span>;
        }

        // Render based on field type using our components
        switch (column.type) {
            case 'enum':
                return (
                    <EnumField
                        value={value}
                        options={column.options || []}
                        mode="readonly"
                        {...(column.fieldProps || {})}
                    />
                );

            case 'name':
            case 'relate':
                return (
                    <NameField
                        value={value}
                        mode="readonly"
                        link={column.type === 'name' || column.type === 'relate'}
                        recordId={row.data[`${column.key}_id`]}
                        module={row.data[`${column.key}_module`]}
                        onLinkClick={
                            column.fieldProps?.onLinkClick ||
                            ((recordId, module) => {
                                onRowAction?.('navigate', row, rowIndex);
                            })
                        }
                        {...(column.fieldProps || {})}
                    />
                );

            case 'email':
            case 'phone':
            case 'url':
            case 'text':
                return (
                    <TextField
                        value={value}
                        mode="readonly"
                        type={
                            column.type === 'email'
                                ? 'email'
                                : column.type === 'phone'
                                ? 'tel'
                                : column.type === 'url'
                                ? 'url'
                                : 'text'
                        }
                        {...(column.fieldProps || {})}
                    />
                );

            case 'custom':
                // Custom type but no render function provided
                return <div className="text-sm text-gray-900">{String(value)}</div>;

            default:
                // Default: plain text rendering
                return <div className="text-sm text-gray-900">{String(value)}</div>;
        }
    };

    // Get column width style
    const getColumnWidth = (column: ListViewColumn) => {
        if (!column.width) return undefined;
        return typeof column.width === 'number' ? `${column.width}px` : column.width;
    };

    // Loading state
    if (loading) {
        return (
            <div className="w-full p-8 text-center">
                <div className="inline-flex items-center gap-2 text-gray-600">
                    <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    // Empty state
    if (rows.length === 0) {
        return (
            <div className="w-full p-8 text-center">
                <div className="text-gray-500">{emptyMessage}</div>
            </div>
        );
    }

    return (
        <div
            ref={tableRef}
            className={`w-full overflow-auto ${className}`}
            style={{
                maxHeight: maxHeight
                    ? typeof maxHeight === 'number'
                        ? `${maxHeight}px`
                        : maxHeight
                    : undefined,
            }}
        >
            <table className="w-full border-collapse">
                {showHeader && (
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="border-b border-gray-200">
                            {/* Selection column */}
                            {selectable && (
                                <th className="w-12 px-4 py-3 text-left">
                                    {multiSelect && (
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            ref={(input) => {
                                                if (input) {
                                                    input.indeterminate = someSelected;
                                                }
                                            }}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    )}
                                </th>
                            )}

                            {/* Column headers */}
                            {visibleColumns.map((column) => (
                                <th
                                    key={column.key}
                                    style={{ width: getColumnWidth(column) }}
                                    className={`px-4 py-3 text-sm font-semibold text-gray-700 ${
                                        column.align === 'center'
                                            ? 'text-center'
                                            : column.align === 'right'
                                            ? 'text-right'
                                            : 'text-left'
                                    } ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                    onClick={() => {
                                        if (column.sortable) {
                                            handleSort(column.key);
                                        }
                                        onColumnHeaderClick?.(column);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{column.label}</span>
                                        {column.sortable && (
                                            <span className="text-gray-400">
                                                {sort?.columnKey === column.key ? (
                                                    sort.direction === 'asc' ? (
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    )
                                                ) : (
                                                    <svg
                                                        className="w-4 h-4 opacity-0 group-hover:opacity-100"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                                                    </svg>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}

                <tbody className="bg-white divide-y divide-gray-200">
                    {rows.map((row, rowIndex) => {
                        const isSelected = internalSelectedIds.includes(row.id);
                        const isClickable = clickableRows && !row.disabled;

                        return (
                            <tr
                                key={row.id}
                                className={`
                                    ${hoverable && !row.disabled ? 'hover:bg-gray-50' : ''}
                                    ${isSelected ? 'bg-blue-50' : ''}
                                    ${isClickable ? 'cursor-pointer' : ''}
                                    ${row.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                    ${row.className || ''}
                                `}
                                onClick={(e) => handleRowClick(row, rowIndex, e)}
                                onDoubleClick={() => handleRowDoubleClick(row, rowIndex)}
                            >
                                {/* Selection column */}
                                {selectable && (
                                    <td className="w-12 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            disabled={row.disabled}
                                            onChange={(e) => handleRowSelect(row.id, e as any)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </td>
                                )}

                                {/* Data columns */}
                                {visibleColumns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-4 py-3 text-sm text-gray-900 ${
                                            column.align === 'center'
                                                ? 'text-center'
                                                : column.align === 'right'
                                                ? 'text-right'
                                                : 'text-left'
                                        }`}
                                    >
                                        {renderCell(column, row, rowIndex)}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
