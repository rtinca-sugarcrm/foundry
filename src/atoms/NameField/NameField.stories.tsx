import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NameField } from './NameField';

const meta: Meta<typeof NameField> = {
    title: 'Atoms/NameField',
    component: NameField,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        mode: {
            control: 'select',
            options: ['edit', 'readonly', 'disabled'],
            description: 'The mode of the name field',
        },
        required: {
            control: 'boolean',
            description: 'Whether the field is required',
        },
        link: {
            control: 'boolean',
            description: 'Whether the name should be rendered as a clickable link',
        },
        showFocusIcon: {
            control: 'boolean',
            description: 'Whether to show the focus drawer icon',
        },
        error: {
            control: 'text',
            description: 'Error message to display',
        },
    },
};

export default meta;
type Story = StoryObj<typeof NameField>;

// Interactive wrapper component
const InteractiveNameField = (args: any) => {
    const [value, setValue] = useState<string | null>(args.value || null);
    return (
        <div className="w-80">
            <NameField
                {...args}
                value={value}
                onChange={setValue}
                onLinkClick={(recordId, module) => {
                    alert(`Link clicked! Record ID: ${recordId}, Module: ${module}`);
                }}
                onFocusClick={(recordId, module) => {
                    alert(`Focus icon clicked! Record ID: ${recordId}, Module: ${module}`);
                }}
            />
        </div>
    );
};

export const Default: Story = {
    args: {
        value: '',
        placeholder: 'Enter name...',
        mode: 'edit',
    },
    render: (args) => <InteractiveNameField {...args} />,
};

export const WithValue: Story = {
    args: {
        value: 'John Doe',
        placeholder: 'Enter name...',
        mode: 'edit',
    },
    render: (args) => <InteractiveNameField {...args} />,
};

export const Required: Story = {
    args: {
        value: '',
        placeholder: 'Name is required',
        required: true,
        mode: 'edit',
    },
    render: (args) => <InteractiveNameField {...args} />,
};

export const WithError: Story = {
    args: {
        value: 'J',
        placeholder: 'Enter name...',
        error: 'Name must be at least 2 characters',
        mode: 'edit',
    },
    render: (args) => <InteractiveNameField {...args} />,
};

export const WithMaxLength: Story = {
    args: {
        value: 'John Doe',
        placeholder: 'Max 50 characters...',
        maxLength: 50,
        mode: 'edit',
    },
    render: (args) => <InteractiveNameField {...args} />,
};

export const ReadonlyWithLink: Story = {
    args: {
        value: 'John Doe',
        mode: 'readonly',
        link: true,
        recordId: '123456',
        module: 'Contacts',
    },
    render: (args) => <InteractiveNameField {...args} />,
};

export const ReadonlyWithoutLink: Story = {
    args: {
        value: 'John Doe',
        mode: 'readonly',
        link: false,
    },
    render: (args) => <InteractiveNameField {...args} />,
};

export const ReadonlyWithFocusIcon: Story = {
    args: {
        value: 'John Doe',
        mode: 'readonly',
        link: true,
        showFocusIcon: true,
        recordId: '123456',
        module: 'Contacts',
    },
    render: (args) => <InteractiveNameField {...args} />,
};

export const Disabled: Story = {
    args: {
        value: 'Jane Smith',
        placeholder: 'Enter name...',
        mode: 'disabled',
    },
    render: (args) => <InteractiveNameField {...args} />,
};

export const DisabledEmpty: Story = {
    args: {
        value: null,
        placeholder: 'Enter name...',
        mode: 'disabled',
    },
    render: (args) => <InteractiveNameField {...args} />,
};

export const AllStates: Story = {
    render: () => (
        <div className="space-y-6 w-96">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edit Mode - Empty
                </label>
                <InteractiveNameField value="" placeholder="Enter name..." mode="edit" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edit Mode - With Value
                </label>
                <InteractiveNameField value="John Doe" placeholder="Enter name..." mode="edit" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edit Mode - Required
                </label>
                <InteractiveNameField
                    value=""
                    placeholder="Required field"
                    required={true}
                    mode="edit"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edit Mode - With Error
                </label>
                <InteractiveNameField
                    value="J"
                    placeholder="Enter name..."
                    error="Name is too short"
                    mode="edit"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edit Mode - With Max Length
                </label>
                <InteractiveNameField
                    value="John Doe"
                    placeholder="Max 50 characters..."
                    maxLength={50}
                    mode="edit"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Readonly - Plain Text
                </label>
                <InteractiveNameField value="Jane Smith" mode="readonly" link={false} />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Readonly - With Link
                </label>
                <InteractiveNameField
                    value="Jane Smith"
                    mode="readonly"
                    link={true}
                    recordId="123456"
                    module="Contacts"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Readonly - With Link & Focus Icon
                </label>
                <InteractiveNameField
                    value="Jane Smith"
                    mode="readonly"
                    link={true}
                    showFocusIcon={true}
                    recordId="123456"
                    module="Contacts"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disabled - With Value
                </label>
                <InteractiveNameField
                    value="Disabled User"
                    placeholder="Enter name..."
                    mode="disabled"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disabled - Empty
                </label>
                <InteractiveNameField value={null} placeholder="Enter name..." mode="disabled" />
            </div>
        </div>
    ),
};

export const InTableContext: Story = {
    render: () => (
        <div className="w-full">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Module
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <NameField
                                value="John Doe"
                                mode="readonly"
                                link={true}
                                showFocusIcon={true}
                                recordId="1"
                                module="Contacts"
                                onLinkClick={(id, mod) => alert(`Clicked: ${id} in ${mod}`)}
                                onFocusClick={(id, mod) => alert(`Focus: ${id} in ${mod}`)}
                            />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Contacts
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <NameField
                                value="Jane Smith"
                                mode="readonly"
                                link={true}
                                showFocusIcon={true}
                                recordId="2"
                                module="Leads"
                                onLinkClick={(id, mod) => alert(`Clicked: ${id} in ${mod}`)}
                                onFocusClick={(id, mod) => alert(`Focus: ${id} in ${mod}`)}
                            />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Leads</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <NameField
                                value="Bob Johnson"
                                mode="readonly"
                                link={true}
                                showFocusIcon={true}
                                recordId="3"
                                module="Accounts"
                                onLinkClick={(id, mod) => alert(`Clicked: ${id} in ${mod}`)}
                                onFocusClick={(id, mod) => alert(`Focus: ${id} in ${mod}`)}
                            />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Accounts
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    ),
};
