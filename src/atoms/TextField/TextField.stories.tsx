import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
    title: 'Atoms/TextField',
    component: TextField,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        mode: {
            control: 'select',
            options: ['edit', 'readonly', 'disabled'],
            description: 'The mode of the text field',
        },
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'url', 'tel', 'number'],
            description: 'The input type',
        },
        required: {
            control: 'boolean',
            description: 'Whether the field is required',
        },
        multiline: {
            control: 'boolean',
            description: 'Whether to use a textarea instead of input',
        },
        error: {
            control: 'text',
            description: 'Error message to display',
        },
    },
};

export default meta;
type Story = StoryObj<typeof TextField>;

// Interactive wrapper component
const InteractiveTextField = (args: any) => {
    const [value, setValue] = useState<string | null>(args.value || null);
    return <TextField {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
    args: {
        value: '',
        placeholder: 'Enter text...',
        mode: 'edit',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const WithValue: Story = {
    args: {
        value: 'Hello, World!',
        placeholder: 'Enter text...',
        mode: 'edit',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const Required: Story = {
    args: {
        value: '',
        placeholder: 'This field is required',
        required: true,
        mode: 'edit',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const WithError: Story = {
    args: {
        value: 'invalid@',
        placeholder: 'Enter email...',
        error: 'Please enter a valid email address',
        mode: 'edit',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const Disabled: Story = {
    args: {
        value: 'This field is disabled',
        placeholder: 'Enter text...',
        mode: 'disabled',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const Readonly: Story = {
    args: {
        value: 'This field is readonly',
        placeholder: 'Enter text...',
        mode: 'readonly',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const EmailType: Story = {
    args: {
        value: '',
        type: 'email',
        placeholder: 'Enter email...',
        mode: 'edit',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const PasswordType: Story = {
    args: {
        value: '',
        type: 'password',
        placeholder: 'Enter password...',
        mode: 'edit',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const WithMaxLength: Story = {
    args: {
        value: '',
        placeholder: 'Max 50 characters...',
        maxLength: 50,
        mode: 'edit',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const Multiline: Story = {
    args: {
        value: '',
        placeholder: 'Enter multiple lines...',
        multiline: true,
        rows: 4,
        mode: 'edit',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const MultilineWithValue: Story = {
    args: {
        value: 'Line 1\nLine 2\nLine 3',
        placeholder: 'Enter multiple lines...',
        multiline: true,
        rows: 4,
        mode: 'edit',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const MultilineWithMaxLength: Story = {
    args: {
        value: '',
        placeholder: 'Max 200 characters...',
        multiline: true,
        rows: 5,
        maxLength: 200,
        mode: 'edit',
    },
    render: (args) => <InteractiveTextField {...args} />,
};

export const AllStates: Story = {
    render: () => (
        <div className="space-y-6 w-80">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edit Mode</label>
                <InteractiveTextField value="" placeholder="Enter text..." mode="edit" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">With Value</label>
                <InteractiveTextField value="Sample text" placeholder="Enter text..." mode="edit" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required</label>
                <InteractiveTextField
                    value=""
                    placeholder="Required field"
                    required={true}
                    mode="edit"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">With Error</label>
                <InteractiveTextField
                    value="invalid"
                    placeholder="Enter text..."
                    error="This field has an error"
                    mode="edit"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disabled</label>
                <InteractiveTextField
                    value="Disabled text"
                    placeholder="Enter text..."
                    mode="disabled"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Readonly</label>
                <InteractiveTextField
                    value="Readonly text"
                    placeholder="Enter text..."
                    mode="readonly"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Multiline</label>
                <InteractiveTextField
                    value="Line 1\nLine 2\nLine 3"
                    placeholder="Enter text..."
                    multiline={true}
                    rows={4}
                    mode="edit"
                />
            </div>
        </div>
    ),
};
