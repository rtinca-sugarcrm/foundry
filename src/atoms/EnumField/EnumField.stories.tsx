import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EnumField, EnumOption } from './EnumField';

const statusOptions: EnumOption[] = [
    { value: 'new', label: 'New' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
];

const industryOptions: EnumOption[] = [
    { value: 'tech', label: 'Technology' },
    { value: 'finance', label: 'Financial Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'media', label: 'Media & Entertainment' },
];

const meta: Meta<typeof EnumField> = {
    title: 'Components/EnumField',
    component: EnumField,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof EnumField>;

export const EditMode: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>('new');

        return (
            <div style={{ width: '350px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status (Edit Mode)
                </label>
                <EnumField
                    value={value}
                    options={statusOptions}
                    mode="edit"
                    placeholder="Select status..."
                    onChange={(newValue) => {
                        console.log('Changed:', newValue);
                        setValue(newValue as string);
                    }}
                />
                <p className="mt-2 text-xs text-gray-500">
                    Selected: <strong>{value || 'none'}</strong>
                </p>
            </div>
        );
    },
};

export const ReadonlyMode: Story = {
    render: () => {
        return (
            <div style={{ width: '350px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status (Readonly Mode)
                </label>
                <EnumField
                    value="in_progress"
                    options={statusOptions}
                    mode="readonly"
                    placeholder="Select status..."
                />
                <p className="mt-2 text-xs text-gray-500">Displays value as plain text</p>
            </div>
        );
    },
};

export const DisabledMode: Story = {
    render: () => {
        return (
            <div style={{ width: '350px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status (Disabled Mode)
                </label>
                <EnumField
                    value="completed"
                    options={statusOptions}
                    mode="disabled"
                    placeholder="Select status..."
                />
                <p className="mt-2 text-xs text-gray-500">Dropdown visible but not interactable</p>
            </div>
        );
    },
};

export const Required: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        const [error, setError] = useState<string>('');

        return (
            <div style={{ width: '350px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                </label>
                <EnumField
                    value={value}
                    options={statusOptions}
                    required
                    placeholder="Select status..."
                    error={error}
                    onChange={(newValue) => {
                        setValue(newValue as string);
                        setError(newValue ? '' : 'This field is required');
                    }}
                />
                <p className="mt-2 text-xs text-gray-500">Try submitting without a value</p>
            </div>
        );
    },
};

export const MultiSelect: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>(['tech', 'finance']);

        return (
            <div style={{ width: '350px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industries (Multi-select)
                </label>
                <EnumField
                    value={value}
                    options={industryOptions}
                    multiple
                    placeholder="Select industries..."
                    onChange={(newValue) => {
                        console.log('Changed:', newValue);
                        setValue((newValue as string[]) || []);
                    }}
                />
                <p className="mt-2 text-xs text-gray-500">
                    Selected ({value.length}): {value.length > 0 ? value.join(', ') : 'none'}
                </p>
            </div>
        );
    },
};

export const Searchable: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);

        return (
            <div style={{ width: '350px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry (Searchable)
                </label>
                <EnumField
                    value={value}
                    options={industryOptions}
                    searchable
                    placeholder="Search industries..."
                    onChange={(newValue) => {
                        console.log('Changed:', newValue);
                        setValue(newValue as string);
                    }}
                />
                <p className="mt-2 text-xs text-gray-500">Type to filter options</p>
            </div>
        );
    },
};

export const SearchableMultiSelect: Story = {
    render: () => {
        const [value, setValue] = useState<string[]>([]);

        return (
            <div style={{ width: '350px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industries (Searchable Multi-select)
                </label>
                <EnumField
                    value={value}
                    options={industryOptions}
                    multiple
                    searchable
                    placeholder="Search and select..."
                    onChange={(newValue) => {
                        console.log('Changed:', newValue);
                        setValue((newValue as string[]) || []);
                    }}
                />
                <p className="mt-2 text-xs text-gray-500">
                    Selected ({value.length}): {value.length > 0 ? value.join(', ') : 'none'}
                </p>
            </div>
        );
    },
};

export const WithError: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);

        return (
            <div style={{ width: '350px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <EnumField
                    value={value}
                    options={statusOptions}
                    placeholder="Select status..."
                    error="This field is required"
                    onChange={(newValue) => {
                        setValue(newValue as string);
                    }}
                />
            </div>
        );
    },
};

export const DisabledOptions: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>('new');

        const optionsWithDisabled: EnumOption[] = [
            { value: 'new', label: 'New' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed', disabled: true },
            { value: 'archived', label: 'Archived', disabled: true },
        ];

        return (
            <div style={{ width: '350px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <EnumField
                    value={value}
                    options={optionsWithDisabled}
                    placeholder="Select status..."
                    onChange={(newValue) => {
                        setValue(newValue as string);
                    }}
                />
                <p className="mt-2 text-xs text-gray-500">Completed and Archived are disabled</p>
            </div>
        );
    },
};

export const AllModeComparison: Story = {
    render: () => {
        return (
            <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Edit Mode (Interactive)
                    </label>
                    <EnumField
                        value="in_progress"
                        options={statusOptions}
                        mode="edit"
                        onChange={() => {}}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Readonly Mode (Text Only)
                    </label>
                    <EnumField value="in_progress" options={statusOptions} mode="readonly" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Disabled Mode (Greyed Out)
                    </label>
                    <EnumField value="in_progress" options={statusOptions} mode="disabled" />
                </div>
            </div>
        );
    },
};
