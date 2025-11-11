import React from 'react';

interface EnumOption {
    value: string;
    label: string;
    disabled?: boolean;
}
interface EnumFieldProps {
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
declare const EnumField: React.FC<EnumFieldProps>;

interface TextFieldProps {
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
declare const TextField: React.FC<TextFieldProps>;

interface NameFieldProps {
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
declare const NameField: React.FC<NameFieldProps>;

interface ListViewColumn {
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
interface ListViewRow$1 {
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
interface ListViewSort {
    /** Column key to sort by */
    columnKey: string;
    /** Sort direction */
    direction: 'asc' | 'desc';
}
interface ListViewProps {
    /** Column definitions */
    columns: ListViewColumn[];
    /** Row data */
    rows: ListViewRow$1[];
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
    onRowClick?: (row: ListViewRow$1, rowIndex: number) => void;
    /** Callback when a row is double-clicked */
    onRowDoubleClick?: (row: ListViewRow$1, rowIndex: number) => void;
    /** Callback when sort changes */
    onSortChange?: (sort: ListViewSort) => void;
    /** Callback when a column header is clicked */
    onColumnHeaderClick?: (column: ListViewColumn) => void;
    /** Callback for custom row actions */
    onRowAction?: (action: string, row: ListViewRow$1, rowIndex: number) => void;
}
declare const ListView: React.FC<ListViewProps>;

interface ListViewRowProps {
    row: ListViewRow$1;
    rowIndex: number;
    columns: ListViewColumn[];
    selectable: boolean;
    isSelected: boolean;
    isEditing: boolean;
    editingRowData: Record<string, any>;
    hoverable: boolean;
    clickableRows: boolean;
    hasRowActions: boolean;
    showEdit: boolean;
    showDelete: boolean;
    customActions: Array<{
        label: string;
        action: string;
    }>;
    openDropdownId: string | null;
    onSelect: (rowId: string, event?: React.MouseEvent) => void;
    onClick: (row: ListViewRow$1, rowIndex: number, event: React.MouseEvent) => void;
    onDoubleClick: (row: ListViewRow$1, rowIndex: number) => void;
    onFieldChange: (columnKey: string, newValue: any) => void;
    onSave: (row: ListViewRow$1, rowIndex: number) => void;
    onCancel: () => void;
    onToggleDropdown: (rowId: string, event: React.MouseEvent) => void;
    onActionClick: (action: string, row: ListViewRow$1, rowIndex: number) => void;
    onRowAction?: (action: string, row: ListViewRow$1, rowIndex: number) => void;
}
declare const ListViewRow: React.FC<ListViewRowProps>;

export { EnumField, ListView, ListViewRow, NameField, TextField };
export type { EnumFieldProps, EnumOption, ListViewColumn, ListViewProps, ListViewSort, NameFieldProps, TextFieldProps };
