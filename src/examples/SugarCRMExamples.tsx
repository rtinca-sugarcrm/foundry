import React, { useState } from 'react';
import { EnumField } from '../atoms/EnumField';
import { SugarThemeProvider } from '../design-system/ThemeProvider';
import { defaultTheme } from '../design-system/theme';

// Example: Multi-Select Dropdown (Tags/Chips style)
const MultiSelectDropdownExample = () => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['javascript', 'react']);

    return (
        <EnumField
            value={selectedSkills}
            metadata={{
                name: 'skills',
                label: 'Skills & Technologies',
                multiple: true, // ← THIS ENABLES MULTI-SELECT
                placeholder: 'Select multiple skills...',
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
                help: 'Click to select multiple skills',
            }}
            events={{
                onChange: (value) => {
                    setSelectedSkills(value as string[]);
                    console.log('Selected skills:', value);
                },
            }}
        />
    );
};

// Example: Multi-Select Dropdown with Search
const MultiSelectSearchableExample = () => {
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    return (
        <EnumField
            value={selectedCountries}
            metadata={{
                name: 'countries',
                label: 'Target Countries',
                multiple: true,
                searchable: true, // ← ADD SEARCH CAPABILITY
                placeholder: 'Search and select countries...',
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
                    { value: 'mx', label: 'Mexico' },
                    { value: 'es', label: 'Spain' },
                    { value: 'it', label: 'Italy' },
                    { value: 'nl', label: 'Netherlands' },
                    { value: 'se', label: 'Sweden' },
                ],
                help: 'Type to search, click to select multiple countries',
            }}
            events={{
                onChange: (value) => {
                    setSelectedCountries(value as string[]);
                    console.log('Selected countries:', value);
                },
            }}
        />
    );
};

// Example: Multi-Select with Checkboxes (Alternative Display)
const MultiSelectCheckboxExample = () => {
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>(['tech']);

    return (
        <EnumField
            value={selectedIndustries}
            metadata={{
                name: 'industries',
                label: 'Target Industries',
                multiple: true,
                display: 'checkbox', // ← SHOW AS CHECKBOXES INSTEAD OF DROPDOWN
                options: [
                    { value: 'tech', label: 'Technology' },
                    { value: 'finance', label: 'Financial Services' },
                    { value: 'healthcare', label: 'Healthcare' },
                    { value: 'retail', label: 'Retail' },
                    { value: 'manufacturing', label: 'Manufacturing' },
                    { value: 'education', label: 'Education' },
                ],
                help: 'Select all industries that apply',
            }}
            events={{
                onChange: (value) => {
                    setSelectedIndustries(value as string[]);
                    console.log('Selected industries:', value);
                },
            }}
        />
    );
};

// Example: Single-Select Dropdown (for comparison)
const SingleSelectExample = () => {
    const [accountStatus, setAccountStatus] = useState<string>('active');

    return (
        <EnumField
            value={accountStatus}
            metadata={{
                name: 'account_status',
                label: 'Account Status',
                required: true,
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'archived', label: 'Archived' },
                ],
                help: 'Select ONE account status',
            }}
            events={{
                onChange: (value) => {
                    setAccountStatus(value as string);
                    console.log('Account status:', value);
                },
            }}
        />
    );
};

// Example: Required Multi-Select with Validation
const RequiredMultiSelectExample = () => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    return (
        <EnumField
            value={selectedTags}
            metadata={{
                name: 'tags',
                label: 'Tags (Required)',
                multiple: true,
                required: true, // ← REQUIRE AT LEAST ONE SELECTION
                placeholder: 'Select at least one tag...',
                options: [
                    { value: 'urgent', label: '🔥 Urgent' },
                    { value: 'important', label: '⭐ Important' },
                    { value: 'followup', label: '📞 Follow-up' },
                    { value: 'review', label: '👀 Needs Review' },
                    { value: 'approved', label: '✅ Approved' },
                ],
                help: 'At least one tag must be selected',
            }}
            events={{
                onChange: (value) => {
                    setSelectedTags(value as string[]);
                    console.log('Selected tags:', value);
                },
                onValidate: (result) => {
                    console.log('Validation:', result);
                },
            }}
        />
    );
};

// Main Example Component
export const SugarCRMExamples: React.FC = () => {
    return (
        <SugarThemeProvider theme={defaultTheme}>
            <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '10px', fontSize: '32px', fontWeight: 'bold' }}>
                    🍯 Multi-Select Dropdown Examples
                </h1>
                <p style={{ marginBottom: '40px', color: '#6b7280', fontSize: '16px' }}>
                    EnumField supports multiple selection modes - just set{' '}
                    <code>multiple: true</code>
                </p>

                <div style={{ marginBottom: '50px' }}>
                    <h2
                        style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '15px',
                            color: '#0ea5e9',
                        }}
                    >
                        1️⃣ Multi-Select Dropdown (Default)
                    </h2>
                    <p style={{ marginBottom: '15px', color: '#6b7280', fontSize: '14px' }}>
                        Click items to select/deselect. Selected items show with checkmarks.
                    </p>
                    <MultiSelectDropdownExample />
                </div>

                <div style={{ marginBottom: '50px' }}>
                    <h2
                        style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '15px',
                            color: '#0ea5e9',
                        }}
                    >
                        2️⃣ Multi-Select with Search
                    </h2>
                    <p style={{ marginBottom: '15px', color: '#6b7280', fontSize: '14px' }}>
                        Type to filter options, great for long lists.
                    </p>
                    <MultiSelectSearchableExample />
                </div>

                <div style={{ marginBottom: '50px' }}>
                    <h2
                        style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '15px',
                            color: '#0ea5e9',
                        }}
                    >
                        3️⃣ Multi-Select as Checkboxes
                    </h2>
                    <p style={{ marginBottom: '15px', color: '#6b7280', fontSize: '14px' }}>
                        Alternative display style showing all options at once.
                    </p>
                    <MultiSelectCheckboxExample />
                </div>

                <div style={{ marginBottom: '50px' }}>
                    <h2
                        style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '15px',
                            color: '#0ea5e9',
                        }}
                    >
                        4️⃣ Required Multi-Select with Validation
                    </h2>
                    <p style={{ marginBottom: '15px', color: '#6b7280', fontSize: '14px' }}>
                        Must select at least one option. Try clearing all selections.
                    </p>
                    <RequiredMultiSelectExample />
                </div>

                <div
                    style={{
                        marginBottom: '50px',
                        padding: '20px',
                        background: '#f3f4f6',
                        borderRadius: '8px',
                    }}
                >
                    <h2
                        style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '15px',
                            color: '#374151',
                        }}
                    >
                        📝 For Comparison: Single-Select Dropdown
                    </h2>
                    <p style={{ marginBottom: '15px', color: '#6b7280', fontSize: '14px' }}>
                        Without <code>multiple: true</code>, it works as a normal dropdown.
                    </p>
                    <SingleSelectExample />
                </div>

                <div
                    style={{
                        marginTop: '60px',
                        padding: '30px',
                        background: '#ecfeff',
                        borderRadius: '12px',
                        border: '2px solid #0ea5e9',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            marginBottom: '15px',
                            color: '#0369a1',
                        }}
                    >
                        💡 Quick Reference
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                            <code
                                style={{
                                    background: '#fff',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                }}
                            >
                                multiple: true
                            </code>{' '}
                            → Enable multi-select dropdown
                        </li>
                        <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                            <code
                                style={{
                                    background: '#fff',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                }}
                            >
                                searchable: true
                            </code>{' '}
                            → Add search/filter box
                        </li>
                        <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                            <code
                                style={{
                                    background: '#fff',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                }}
                            >
                                display: 'checkbox'
                            </code>{' '}
                            → Show as checkboxes instead
                        </li>
                        <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                            <code
                                style={{
                                    background: '#fff',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                }}
                            >
                                required: true
                            </code>{' '}
                            → Require at least one selection
                        </li>
                        <li style={{ fontSize: '14px' }}>
                            <code
                                style={{
                                    background: '#fff',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                }}
                            >
                                value: string[]
                            </code>{' '}
                            → Array of selected values
                        </li>
                    </ul>
                </div>
            </div>
        </SugarThemeProvider>
    );
};
