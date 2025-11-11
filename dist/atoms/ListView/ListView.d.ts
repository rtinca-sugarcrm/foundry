import React from 'react';
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
    /** Show edit action in row actions dropdown */
    showEdit?: boolean;
    /** Show delete action in row actions dropdown */
    showDelete?: boolean;
    /** Custom row actions to add to dropdown */
    customActions?: Array<{
        label: string;
        action: string;
    }>;
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
export declare const ListView: React.FC<ListViewProps>;
//# sourceMappingURL=ListView.d.ts.map