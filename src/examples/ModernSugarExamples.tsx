import React, { useState } from 'react';
import {
    SugarThemeProvider,
    EnumField,
    EnumFieldMetadata,
    required,
    minSelections,
    defaultTheme,
    SugarTheme,
} from '../index';

// Custom Sugar CRM theme
const sugarTheme: Partial<SugarTheme> = {
    colors: {
        ...defaultTheme.colors,
        primary: '#0070f3',
        primaryHover: '#0051cc',
    },
    borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
    },
};

// Example 1: Basic Account Status Enum
const AccountStatusExample: React.FC = () => {
    const [status, setStatus] = useState<string>('active');

    const statusMetadata: EnumFieldMetadata = {
        name: 'account_status',
        label: 'Account Status',
        required: true,
        options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending' },
            { value: 'archived', label: 'Archived' },
        ],
        placeholder: 'Select status...',
        help: 'Choose the current status of this account',
        testId: 'account-status-field',
    };

    return (
        <EnumField
            value={status}
            metadata={statusMetadata}
            validators={[required('Account status is required')]}
            events={{
                onChange: (value, fieldName) => {
                    setStatus(value as string);
                    console.log(`${fieldName} changed to:`, value);
                },
                onValidate: (result, fieldName) => {
                    console.log(`${fieldName} validation:`, result);
                },
            }}
        />
    );
};

// Example 2: Multi-select Industries with Advanced Features
const IndustriesExample: React.FC = () => {
    const [industries, setIndustries] = useState<string[]>(['technology']);

    const industriesMetadata: EnumFieldMetadata = {
        name: 'target_industries',
        label: 'Target Industries',
        multiple: true,
        required: true,
        searchable: true,
        maxVisibleOptions: 5,
        options: [
            { value: 'technology', label: 'Technology', icon: '💻' },
            { value: 'finance', label: 'Financial Services', icon: '💰' },
            { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
            { value: 'retail', label: 'Retail', icon: '🛍️' },
            { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
            { value: 'education', label: 'Education', icon: '🎓' },
            { value: 'government', label: 'Government', icon: '🏛️' },
            { value: 'nonprofit', label: 'Non-Profit', icon: '❤️' },
        ],
        display: 'dropdown',
        placeholder: 'Search and select industries...',
        help: 'Select all industries this opportunity targets',
    };

    return (
        <EnumField
            value={industries}
            metadata={industriesMetadata}
            validators={[
                required('At least one industry must be selected'),
                minSelections(1, 'Please select at least one industry'),
            ]}
            events={{
                onChange: (value, fieldName) => {
                    setIndustries(value as string[]);
                    console.log(`${fieldName} changed to:`, value);
                },
                onValidate: (result, fieldName) => {
                    if (!result.isValid) {
                        console.error(`${fieldName} validation errors:`, result.errors);
                    }
                },
            }}
        />
    );
};

// Example 3: Priority Radio Buttons
const PriorityExample: React.FC = () => {
    const [priority, setPriority] = useState<string>('medium');

    const priorityMetadata: EnumFieldMetadata = {
        name: 'priority',
        label: 'Priority Level',
        required: true,
        options: [
            { value: 'low', label: 'Low Priority' },
            { value: 'medium', label: 'Medium Priority' },
            { value: 'high', label: 'High Priority' },
            { value: 'urgent', label: 'Urgent Priority' },
        ],
        display: 'radio',
        help: 'Set the priority level for this task',
    };

    return (
        <EnumField
            value={priority}
            metadata={priorityMetadata}
            validators={[required('Priority is required')]}
            events={{
                onChange: (value, fieldName) => {
                    setPriority(value as string);
                    console.log(`${fieldName} changed to:`, value);
                },
            }}
        />
    );
};

// Example 4: Readonly Status Display
const ReadonlyStatusExample: React.FC = () => {
    const statusMetadata: EnumFieldMetadata = {
        name: 'record_status',
        label: 'Record Status',
        readonly: true,
        options: [
            { value: 'draft', label: 'Draft' },
            { value: 'submitted', label: 'Submitted' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
        ],
        help: 'This status is automatically set by the system',
    };

    return <EnumField value="approved" metadata={statusMetadata} />;
};

// Main demo component with theme provider
export const ModernSugarExamples: React.FC = () => {
    return (
        <SugarThemeProvider theme={sugarTheme}>
            <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
                <h1>🍯 Modern Sugar UI React Components</h1>
                <p>
                    Modular, atomic components with CSS-in-JS styling and advanced field state
                    management.
                </p>

                <div style={{ display: 'grid', gap: '32px', marginTop: '32px' }}>
                    <section>
                        <h2>Basic Account Status</h2>
                        <p>Single-select dropdown with validation</p>
                        <AccountStatusExample />
                    </section>

                    <section>
                        <h2>Multi-select Industries</h2>
                        <p>Searchable multi-select with custom validation</p>
                        <IndustriesExample />
                    </section>

                    <section>
                        <h2>Priority Radio Buttons</h2>
                        <p>Radio button group for exclusive selection</p>
                        <PriorityExample />
                    </section>

                    <section>
                        <h2>Readonly Status</h2>
                        <p>Display-only field for system-controlled values</p>
                        <ReadonlyStatusExample />
                    </section>
                </div>

                <div
                    style={{
                        marginTop: '48px',
                        padding: '24px',
                        backgroundColor: '#f0f9ff',
                        borderRadius: '8px',
                    }}
                >
                    <h3>🚀 Modern Architecture Features</h3>
                    <ul>
                        <li>
                            ✅ <strong>Atomic Design:</strong> Modular components following atomic
                            design principles
                        </li>
                        <li>
                            ✅ <strong>CSS-in-JS:</strong> No external CSS files, all styling in
                            JavaScript with theme support
                        </li>
                        <li>
                            ✅ <strong>Type Safety:</strong> Full TypeScript support with
                            comprehensive type checking
                        </li>
                        <li>
                            ✅ <strong>Field State Management:</strong> Advanced state management
                            with validation
                        </li>
                        <li>
                            ✅ <strong>Theme System:</strong> Customizable design tokens for brand
                            consistency
                        </li>
                        <li>
                            ✅ <strong>Gradual Adoption:</strong> Can be used alongside existing
                            Sugar CRM components
                        </li>
                        <li>
                            ✅ <strong>Modern Hooks:</strong> Built with React hooks and modern
                            patterns
                        </li>
                        <li>
                            ✅ <strong>Accessibility:</strong> WCAG compliant with proper ARIA
                            attributes
                        </li>
                    </ul>
                </div>
            </div>
        </SugarThemeProvider>
    );
};
