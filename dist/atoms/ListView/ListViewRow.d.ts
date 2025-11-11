import React from 'react';
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
    customActions: Array<{
        label: string;
        action: string;
    }>;
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
export declare const ListViewRow: React.FC<ListViewRowProps>;
export {};
//# sourceMappingURL=ListViewRow.d.ts.map