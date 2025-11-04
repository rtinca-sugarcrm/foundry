import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { EnumField } from './EnumField';
import { SugarThemeProvider } from '../../design-system/ThemeProvider';
import { defaultTheme } from '../../design-system/theme';
import { EnumFieldMetadata } from './types';
import { required } from '../../core/validation';
import { minSelections } from './validation';

// Sample enum options
const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'archived', label: 'Archived' },
];

const industryOptions = [
    { value: 'tech', label: 'Technology' },
    { value: 'finance', label: 'Financial Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' },
];

const meta: Meta<typeof EnumField> = {
    title: 'Sugar UI/Atoms/EnumField',
    component: EnumField,
    decorators: [
        (Story) => (
            <SugarThemeProvider theme={defaultTheme}>
                <div style={{ padding: '20px', maxWidth: '400px' }}>
                    <Story />
                </div>
            </SugarThemeProvider>
        ),
    ],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'An atomic enum field component with CSS-in-JS styling and advanced state management.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof EnumField>;

// Basic dropdown
export const BasicDropdown: Story = {
    args: {
        value: 'active',
        metadata: {
            name: 'status',
            label: 'Account Status',
            options: statusOptions,
            placeholder: 'Select a status...',
            help: 'Choose the current status',
        } as EnumFieldMetadata,
        events: {
            onChange: action('onChange'),
            onValidate: action('onValidate'),
        },
    },
};

// Required field with validation
export const RequiredField: Story = {
    args: {
        value: '',
        metadata: {
            name: 'priority',
            label: 'Priority Level',
            required: true,
            options: statusOptions,
            placeholder: 'Select priority...',
            help: 'This field is required',
        } as EnumFieldMetadata,
        validators: [required('Priority is required')],
        events: {
            onChange: action('onChange'),
            onValidate: action('onValidate'),
        },
    },
};

// Multi-select with checkboxes
export const MultiSelectCheckbox: Story = {
    args: {
        value: ['tech', 'finance'],
        metadata: {
            name: 'industries',
            label: 'Target Industries',
            multiple: true,
            required: true,
            options: industryOptions,
            display: 'checkbox',
            help: 'Select all applicable industries',
        } as EnumFieldMetadata,
        validators: [
            required('At least one industry is required'),
            minSelections(1, 'Please select at least one industry'),
        ],
        events: {
            onChange: action('onChange'),
            onValidate: action('onValidate'),
        },
    },
};

// Searchable dropdown
export const SearchableDropdown: Story = {
    args: {
        value: 'tech',
        metadata: {
            name: 'industry',
            label: 'Primary Industry',
            options: industryOptions,
            searchable: true,
            placeholder: 'Search industries...',
            help: 'Type to search for industries',
        } as EnumFieldMetadata,
        events: {
            onChange: action('onChange'),
            onValidate: action('onValidate'),
        },
    },
};

// Radio buttons
export const RadioButtons: Story = {
    args: {
        value: 'active',
        metadata: {
            name: 'status',
            label: 'Status',
            options: statusOptions.slice(0, 3),
            display: 'radio',
            help: 'Select one option',
        } as EnumFieldMetadata,
        events: {
            onChange: action('onChange'),
            onValidate: action('onValidate'),
        },
    },
};

// Readonly field
export const ReadonlyField: Story = {
    args: {
        value: 'active',
        metadata: {
            name: 'status',
            label: 'Record Status',
            readonly: true,
            options: statusOptions,
            help: 'This field cannot be edited',
        } as EnumFieldMetadata,
    },
};

// Disabled field
export const DisabledField: Story = {
    args: {
        value: 'pending',
        metadata: {
            name: 'status',
            label: 'Processing Status',
            disabled: true,
            options: statusOptions,
            help: 'This field is temporarily disabled',
        } as EnumFieldMetadata,
    },
};

// With custom theme
export const CustomTheme: Story = {
    decorators: [
        (Story) => (
            <SugarThemeProvider
                theme={{
                    colors: {
                        ...defaultTheme.colors,
                        primary: '#8b5cf6',
                        primaryHover: '#7c3aed',
                    },
                    borderRadius: {
                        sm: '8px',
                        md: '12px',
                        lg: '16px',
                    },
                }}
            >
                <div style={{ padding: '20px', maxWidth: '400px' }}>
                    <Story />
                </div>
            </SugarThemeProvider>
        ),
    ],
    args: {
        value: 'tech',
        metadata: {
            name: 'industry',
            label: 'Industry (Custom Theme)',
            options: industryOptions,
            placeholder: 'Select industry...',
            help: 'This uses a custom purple theme',
        } as EnumFieldMetadata,
        events: {
            onChange: action('onChange'),
        },
    },
};

// Error state
export const WithErrors: Story = {
    args: {
        value: '',
        metadata: {
            name: 'required_field',
            label: 'Required Selection',
            required: true,
            options: statusOptions,
            placeholder: 'Please select...',
        } as EnumFieldMetadata,
        validators: [required('This field is required')],
        state: {
            errors: ['This field is required', 'Please make a selection'],
            isValid: false,
            isTouched: true,
        },
        events: {
            onChange: action('onChange'),
            onValidate: action('onValidate'),
        },
    },
};

// Multi-select dropdown
export const MultiSelectDropdown: Story = {
    args: {
        value: ['javascript', 'react', 'nodejs'],
        metadata: {
            name: 'skills',
            label: 'Skills & Technologies',
            multiple: true,
            options: [
                { value: 'javascript', label: 'JavaScript' },
                { value: 'typescript', label: 'TypeScript' },
                { value: 'react', label: 'React' },
                { value: 'vue', label: 'Vue.js' },
                { value: 'angular', label: 'Angular' },
                { value: 'nodejs', label: 'Node.js' },
                { value: 'python', label: 'Python' },
                { value: 'java', label: 'Java' },
            ],
            placeholder: 'Select multiple skills...',
            help: 'Click items to select/deselect multiple options',
        } as EnumFieldMetadata,
        events: {
            onChange: action('onChange'),
            onValidate: action('onValidate'),
        },
    },
};

// Multi-select with search
export const MultiSelectWithSearch: Story = {
    args: {
        value: ['us', 'uk'],
        metadata: {
            name: 'countries',
            label: 'Target Countries',
            multiple: true,
            searchable: true,
            options: [
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
                { value: 'ca', label: 'Canada' },
                { value: 'au', label: 'Australia' },
                { value: 'de', label: 'Germany' },
                { value: 'fr', label: 'France' },
                { value: 'jp', label: 'Japan' },
                { value: 'cn', label: 'China' },
                { value: 'in', label: 'India' },
                { value: 'br', label: 'Brazil' },
            ],
            placeholder: 'Search and select countries...',
            help: 'Type to filter, click to select multiple',
        } as EnumFieldMetadata,
        events: {
            onChange: action('onChange'),
            onValidate: action('onValidate'),
        },
    },
};
