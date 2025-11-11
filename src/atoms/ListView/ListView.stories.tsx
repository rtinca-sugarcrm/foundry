import type { Meta, StoryObj } from '@storybook/react';
import { ListView } from './ListView';
import { useState } from 'react';
import type { ListViewColumn, ListViewRow, ListViewSort } from './ListView';

const meta = {
    title: 'Atoms/ListView',
    component: ListView,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ListView>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const sampleColumns: ListViewColumn[] = [
    {
        key: 'name',
        label: 'Name',
        width: 200,
        sortable: true,
        type: 'name',
    },
    {
        key: 'email',
        label: 'Email',
        width: 250,
        sortable: true,
        type: 'email',
    },
    {
        key: 'role',
        label: 'Role',
        width: 150,
        sortable: true,
        type: 'enum',
        options: [
            { value: 'admin', label: 'Admin' },
            { value: 'user', label: 'User' },
            { value: 'editor', label: 'Editor' },
        ],
    },
    {
        key: 'status',
        label: 'Status',
        width: 120,
        sortable: true,
        align: 'center',
        type: 'enum',
        options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending' },
        ],
    },
    {
        key: 'actions',
        label: 'Actions',
        width: 100,
        align: 'right',
        type: 'custom',
        render: (value, row) => (
            <div className="flex gap-2 justify-end">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        alert(`Edit ${row.name}`);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                >
                    Edit
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        alert(`Delete ${row.name}`);
                    }}
                    className="text-red-600 hover:text-red-800"
                >
                    Delete
                </button>
            </div>
        ),
    },
];

const sampleRows: ListViewRow[] = [
    {
        id: '1',
        data: {
            name: 'John Doe',
            name_id: '1',
            name_module: 'Contacts',
            email: 'john.doe@example.com',
            role: 'admin',
            status: 'active',
        },
    },
    {
        id: '2',
        data: {
            name: 'Jane Smith',
            name_id: '2',
            name_module: 'Contacts',
            email: 'jane.smith@example.com',
            role: 'user',
            status: 'active',
        },
    },
    {
        id: '3',
        data: {
            name: 'Bob Johnson',
            name_id: '3',
            name_module: 'Contacts',
            email: 'bob.johnson@example.com',
            role: 'editor',
            status: 'pending',
        },
    },
    {
        id: '4',
        data: {
            name: 'Alice Williams',
            name_id: '4',
            name_module: 'Contacts',
            email: 'alice.williams@example.com',
            role: 'user',
            status: 'inactive',
        },
        disabled: true,
    },
    {
        id: '5',
        data: {
            name: 'Charlie Brown',
            name_id: '5',
            name_module: 'Contacts',
            email: 'charlie.brown@example.com',
            role: 'admin',
            status: 'active',
        },
    },
];

export const Default: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
    },
};

export const WithSelection = {
    render: () => {
        const [selectedIds, setSelectedIds] = useState<string[]>([]);

        return (
            <div className="space-y-4">
                <div className="text-sm text-gray-600">Selected: {selectedIds.length} row(s)</div>
                <ListView
                    columns={sampleColumns}
                    rows={sampleRows}
                    selectable
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                />
            </div>
        );
    },
};

export const SingleSelection = {
    render: () => {
        const [selectedIds, setSelectedIds] = useState<string[]>([]);

        return (
            <div className="space-y-4">
                <div className="text-sm text-gray-600">
                    Selected: {selectedIds.length > 0 ? selectedIds[0] : 'None'}
                </div>
                <ListView
                    columns={sampleColumns}
                    rows={sampleRows}
                    selectable
                    multiSelect={false}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                />
            </div>
        );
    },
};

export const WithSorting = {
    render: () => {
        const [sort, setSort] = useState<ListViewSort>({ columnKey: 'name', direction: 'asc' });
        const [sortedRows, setSortedRows] = useState(sampleRows);

        const handleSortChange = (newSort: ListViewSort) => {
            setSort(newSort);
            const sorted = [...sampleRows].sort((a, b) => {
                const aVal = a.data[newSort.columnKey];
                const bVal = b.data[newSort.columnKey];
                const comparison = String(aVal).localeCompare(String(bVal));
                return newSort.direction === 'asc' ? comparison : -comparison;
            });
            setSortedRows(sorted);
        };

        return (
            <ListView
                columns={sampleColumns}
                rows={sortedRows}
                sort={sort}
                onSortChange={handleSortChange}
            />
        );
    },
};

export const ClickableRows: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
        clickableRows: true,
        onRowClick: (row) => alert(`Clicked: ${row.data.name}`),
        onRowDoubleClick: (row) => alert(`Double-clicked: ${row.data.name}`),
    },
};

export const Loading: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
        loading: true,
    },
};

export const Empty: Story = {
    args: {
        columns: sampleColumns,
        rows: [],
        emptyMessage: 'No users found',
    },
};

export const ScrollableWithMaxHeight: Story = {
    args: {
        columns: sampleColumns,
        rows: [...sampleRows, ...sampleRows, ...sampleRows],
        maxHeight: 300,
    },
};

export const CustomColumnAlignment: Story = {
    args: {
        columns: [
            { key: 'id', label: 'ID', width: 80, align: 'center' },
            { key: 'name', label: 'Name', width: 200 },
            { key: 'amount', label: 'Amount', width: 150, align: 'right' },
        ],
        rows: [
            { id: '1', data: { id: '001', name: 'Product A', amount: '$1,234.56' } },
            { id: '2', data: { id: '002', name: 'Product B', amount: '$987.65' } },
            { id: '3', data: { id: '003', name: 'Product C', amount: '$2,456.78' } },
        ],
    },
};

export const WithHiddenColumns: Story = {
    args: {
        columns: [
            ...sampleColumns,
            {
                key: 'hidden',
                label: 'Hidden Column',
                visible: false,
            },
        ],
        rows: sampleRows,
    },
};

export const DifferentFieldTypes: Story = {
    args: {
        columns: [
            {
                key: 'name',
                label: 'Contact Name',
                width: 200,
                type: 'name',
            },
            {
                key: 'email',
                label: 'Email',
                width: 200,
                type: 'email',
            },
            {
                key: 'phone',
                label: 'Phone',
                width: 150,
                type: 'phone',
            },
            {
                key: 'website',
                label: 'Website',
                width: 200,
                type: 'url',
            },
            {
                key: 'department',
                label: 'Department',
                width: 150,
                type: 'enum',
                options: [
                    { value: 'sales', label: 'Sales' },
                    { value: 'marketing', label: 'Marketing' },
                    { value: 'engineering', label: 'Engineering' },
                ],
            },
        ],
        rows: [
            {
                id: '1',
                data: {
                    name: 'John Doe',
                    name_id: '1',
                    name_module: 'Contacts',
                    email: 'john.doe@acme.com',
                    phone: '555-0100',
                    website: 'www.johndoe.com',
                    department: 'sales',
                },
            },
            {
                id: '2',
                data: {
                    name: 'Jane Smith',
                    name_id: '2',
                    name_module: 'Contacts',
                    email: 'jane.smith@acme.com',
                    phone: '555-0101',
                    website: 'www.janesmith.com',
                    department: 'marketing',
                },
            },
            {
                id: '3',
                data: {
                    name: 'Bob Johnson',
                    name_id: '3',
                    name_module: 'Contacts',
                    email: 'bob.johnson@acme.com',
                    phone: '555-0102',
                    website: 'www.bobjohnson.com',
                    department: 'engineering',
                },
            },
        ],
    },
};

export const WithBuiltInActions: Story = {
    args: {
        columns: [
            { key: 'name', label: 'Name', width: 200, type: 'name' },
            { key: 'email', label: 'Email', width: 200, type: 'email' },
            {
                key: 'role',
                label: 'Role',
                width: 150,
                type: 'enum',
                options: [
                    { value: 'admin', label: 'Admin' },
                    { value: 'user', label: 'User' },
                    { value: 'editor', label: 'Editor' },
                ],
            },
        ],
        rows: sampleRows.slice(0, 3),
        showEdit: true,
        showDelete: true,
        customActions: [
            { label: 'View Details', action: 'view' },
            { label: 'Duplicate', action: 'duplicate' },
        ],
        onRowAction: (action, row, rowIndex) => {
            console.log(`Action: ${action}`, { row, rowIndex });

            if (action === 'edit') {
                alert(`Entering edit mode for: ${row.data.name}`);
            } else if (action === 'save') {
                alert(
                    `Saving changes for: ${row.data.name}\n\nUpdated data:\n${JSON.stringify(
                        row.data,
                        null,
                        2
                    )}`
                );
            } else if (action === 'delete') {
                alert(`Delete action for: ${row.data.name}`);
            } else {
                alert(`Custom action "${action}" on: ${row.data.name}`);
            }
        },
    },
};
