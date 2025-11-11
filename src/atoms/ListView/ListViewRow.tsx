import React from 'react';
import { EnumField } from '../EnumField';
import { TextField } from '../TextField';
import { NameField } from '../NameField';
import type { ListViewColumn, ListViewRow as ListViewRowType } from './ListView';

interface ListViewRowProps {
    row: ListViewRowType;
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
    customActions: Array<{ label: string; action: string }>;
    openDropdownId: string | null;
    onSelect: (rowId: string, event?: React.MouseEvent) => void;
    onClick: (row: ListViewRowType, rowIndex: number, event: React.MouseEvent) => void;
    onDoubleClick: (row: ListViewRowType, rowIndex: number) => void;
    onFieldChange: (columnKey: string, newValue: any) => void;
    onSave: (row: ListViewRowType, rowIndex: number) => void;
    onCancel: () => void;
    onToggleDropdown: (rowId: string, event: React.MouseEvent) => void;
    onActionClick: (action: string, row: ListViewRowType, rowIndex: number) => void;
    onRowAction?: (action: string, row: ListViewRowType, rowIndex: number) => void;
}

export const ListViewRow: React.FC<ListViewRowProps> = ({
    row,
    rowIndex,
    columns,
    selectable,
    isSelected,
    isEditing,
    editingRowData,
    hoverable,
    clickableRows,
    hasRowActions,
    showEdit,
    showDelete,
    customActions,
    openDropdownId,
    onSelect,
    onClick,
    onDoubleClick,
    onFieldChange,
    onSave,
    onCancel,
    onToggleDropdown,
    onActionClick,
    onRowAction,
}) => {
    const isClickable = clickableRows && !row.disabled;
    const visibleColumns = columns.filter((col) => col.visible !== false);

    // Render cell content
    const renderCell = (column: ListViewColumn) => {
        const value = isEditing ? editingRowData[column.key] : row.data[column.key];
        const mode = isEditing ? 'edit' : 'readonly';

        // Use custom render if provided
        if (column.render) {
            return column.render(value, row.data, rowIndex);
        }

        // Handle null/undefined values
        if (value === null || value === undefined) {
            if (isEditing) {
                // In edit mode, show empty field
            } else {
                return <span className="text-gray-400">-</span>;
            }
        }

        // Render based on field type using our components
        switch (column.type) {
            case 'enum':
                return (
                    <EnumField
                        value={value}
                        options={column.options || []}
                        mode={mode}
                        onChange={
                            isEditing ? (newVal) => onFieldChange(column.key, newVal) : undefined
                        }
                        {...(column.fieldProps || {})}
                    />
                );

            case 'name':
            case 'relate':
                return (
                    <NameField
                        value={value}
                        mode={mode}
                        link={!isEditing && (column.type === 'name' || column.type === 'relate')}
                        recordId={row.data[`${column.key}_id`]}
                        module={row.data[`${column.key}_module`]}
                        onChange={
                            isEditing ? (newVal) => onFieldChange(column.key, newVal) : undefined
                        }
                        onLinkClick={
                            !isEditing
                                ? column.fieldProps?.onLinkClick ||
                                  ((recordId, module) => {
                                      onRowAction?.('navigate', row, rowIndex);
                                  })
                                : undefined
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
                        mode={mode}
                        type={
                            column.type === 'email'
                                ? 'email'
                                : column.type === 'phone'
                                ? 'tel'
                                : column.type === 'url'
                                ? 'url'
                                : 'text'
                        }
                        onChange={
                            isEditing ? (newVal) => onFieldChange(column.key, newVal) : undefined
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

    return (
        <tr
            className={`
                ${hoverable && !row.disabled ? 'hover:bg-gray-50' : ''}
                ${isSelected ? 'bg-blue-50' : ''}
                ${isClickable ? 'cursor-pointer' : ''}
                ${row.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${row.className || ''}
            `}
            onClick={(e) => onClick(row, rowIndex, e)}
            onDoubleClick={() => onDoubleClick(row, rowIndex)}
        >
            {/* Selection column */}
            {selectable && (
                <td className="w-12 px-4 py-3">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={row.disabled}
                        onChange={(e) => onSelect(row.id, e as any)}
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
                    {renderCell(column)}
                </td>
            ))}

            {/* Actions column */}
            {hasRowActions && (
                <td className="w-16 px-4 py-3 text-right">
                    {isEditing ? (
                        // Edit mode: Show Save and Cancel buttons
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancel();
                                }}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSave(row, rowIndex);
                                }}
                                className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        // Normal mode: Show actions dropdown
                        <div className="relative actions-dropdown">
                            <button
                                onClick={(e) => onToggleDropdown(row.id, e)}
                                disabled={row.disabled}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>

                            {openDropdownId === row.id && (
                                <div className="absolute right-0 z-20 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                                    <div className="py-1">
                                        {showEdit && (
                                            <button
                                                onClick={() => onActionClick('edit', row, rowIndex)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {showDelete && (
                                            <button
                                                onClick={() =>
                                                    onActionClick('delete', row, rowIndex)
                                                }
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        )}
                                        {customActions.map((customAction, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() =>
                                                    onActionClick(
                                                        customAction.action,
                                                        row,
                                                        rowIndex
                                                    )
                                                }
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {customAction.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </td>
            )}
        </tr>
    );
};
