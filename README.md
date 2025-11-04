# Sugar UI React Components

A modern, modular React components library for Sugar CRM products following atomic design principles with CSS-in-JS styling and comprehensive TypeScript support.

## 🎯 Architecture

This library is built with a **gradual adoption strategy** in mind, allowing teams to:
- Start with atomic components (like EnumField)
- Progressively adopt more complex components
- Eventually migrate entire layouts and views
- Maintain consistency across all Sugar products

### 🏗️ Design Principles

- **Atomic Design**: Components are organized as atoms → molecules → organisms → templates → pages
- **CSS-in-JS**: No external CSS files, all styling managed in JavaScript with theme support
- **Type Safety**: Full TypeScript coverage with comprehensive type definitions
- **Modular Architecture**: Each component is self-contained with its own validation and styling
- **Theme-driven**: Consistent design tokens across all components

## 🚀 Features

- 🎯 **Sugar CRM Agnostic**: Works across all Sugar products
- 🧩 **Modular Components**: Easy to adopt gradually
- 🎨 **CSS-in-JS**: Theme-based styling without external CSS
- 📝 **TypeScript First**: Complete type safety
- 🔧 **Field State Management**: Advanced state handling with validation
- ♿ **Accessible**: WCAG compliant
- 🧪 **Thoroughly Tested**: Comprehensive test coverage

## 📦 Installation

```bash
npm install @sugar/ui-react
```

## 🎨 Theme System

The library uses a comprehensive theme system that can be customized for each Sugar product:

```tsx
import { SugarThemeProvider, defaultTheme } from '@sugar/ui-react';

// Custom theme for your Sugar product
const customTheme = {
  colors: {
    ...defaultTheme.colors,
    primary: '#your-brand-color',
    primaryHover: '#your-brand-hover-color',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};

function App() {
  return (
    <SugarThemeProvider theme={customTheme}>
      {/* Your components */}
    </SugarThemeProvider>
  );
}
```

## 🧩 Atomic Components

### EnumField

A comprehensive enum/dropdown field supporting all Sugar CRM enum features.

```tsx
import { 
  EnumField, 
  EnumFieldMetadata, 
  required, 
  minSelections 
} from '@sugar/ui-react';

function MyComponent() {
  const [status, setStatus] = useState('active');

  const metadata: EnumFieldMetadata = {
    name: 'account_status',
    label: 'Account Status',
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' }
    ],
    placeholder: 'Select status...',
    help: 'Choose the current status'
  };

  return (
    <EnumField
      value={status}
      metadata={metadata}
      validators={[required('Status is required')]}
      events={{
        onChange: (value, fieldName) => setStatus(value),
        onValidate: (result) => console.log('Validation:', result),
      }}
    />
  );
}
```

#### Display Modes

**Dropdown (default)**
```tsx
const metadata = {
  name: 'status',
  label: 'Status',
  options: statusOptions,
  display: 'dropdown', // or omit for default
  searchable: true, // Enable search
};
```

**Radio Buttons**
```tsx
const metadata = {
  name: 'priority',
  label: 'Priority',
  options: priorityOptions,
  display: 'radio',
};
```

**Checkboxes (Multi-select)**
```tsx
const metadata = {
  name: 'industries',
  label: 'Industries',
  multiple: true,
  options: industryOptions,
  display: 'checkbox',
};
```

#### Advanced Features

**Multi-select with Validation**
```tsx
const [industries, setIndustries] = useState(['tech']);

const metadata: EnumFieldMetadata = {
  name: 'target_industries',
  label: 'Target Industries',
  multiple: true,
  searchable: true,
  options: industryOptions,
};

<EnumField
  value={industries}
  metadata={metadata}
  validators={[
    required('At least one industry is required'),
    minSelections(1, 'Please select at least one'),
  ]}
  events={{
    onChange: setIndustries,
    onValidate: (result) => {
      if (!result.isValid) {
        console.error('Validation errors:', result.errors);
      }
    },
  }}
/>
```

## 🔧 Field State Management

The library includes a powerful field state management system:

```tsx
import { useFieldState, required } from '@sugar/ui-react';

function CustomField() {
  const fieldState = useFieldState({
    initialValue: '',
    validators: [required('This field is required')],
    fieldName: 'custom_field',
    required: true,
    onChange: (value, fieldName) => {
      console.log(`${fieldName} changed to:`, value);
    },
    onValidate: (result, fieldName) => {
      console.log(`${fieldName} validation:`, result);
    },
  });

  return (
    <input
      value={fieldState.value}
      onChange={(e) => fieldState.handleChange(e.target.value)}
      onBlur={fieldState.handleBlur}
      style={{
        borderColor: fieldState.state.isValid ? 'green' : 'red'
      }}
    />
  );
}
```

## ✅ Validation System

### Core Validators
```tsx
import { 
  required, 
  minLength, 
  maxLength, 
  pattern, 
  custom 
} from '@sugar/ui-react';

const validators = [
  required('This field is required'),
  minLength(3, 'Must be at least 3 characters'),
  maxLength(50, 'Must be no more than 50 characters'),
  pattern(/^[A-Z]/, 'Must start with uppercase letter'),
  custom((value) => {
    return value !== 'forbidden' || 'This value is not allowed';
  }),
];
```

### Enum-specific Validators
```tsx
import { 
  minSelections, 
  maxSelections, 
  validOptions,
  enumBusinessRule 
} from '@sugar/ui-react';

const enumValidators = [
  minSelections(2, 'Select at least 2 options'),
  maxSelections(5, 'Select no more than 5 options'),
  validOptions(['active', 'inactive'], 'Invalid selection'),
  enumBusinessRule((value) => {
    return value !== 'restricted' || 'This option is restricted';
  }),
];
```

## 🔗 Sugar CRM Integration

### Converting Sugar Field Metadata

```tsx
import { EnumFieldMetadata, required } from '@sugar/ui-react';

function convertSugarField(sugarField: any): EnumFieldMetadata {
  return {
    name: sugarField.name,
    label: sugarField.vname || sugarField.label,
    required: sugarField.required === true,
    readonly: !sugarField.editable,
    disabled: sugarField.disabled === true,
    options: Object.entries(sugarField.options || {}).map(([value, label]) => ({
      value,
      label: typeof label === 'string' ? label : (label as any).label
    })),
    placeholder: sugarField.placeholder,
    help: sugarField.help || sugarField.comment,
  };
}

// Usage in Sugar modules
function SugarFieldWrapper({ sugarFieldDef, model }) {
  const metadata = convertSugarField(sugarFieldDef);
  const validators = sugarFieldDef.required ? [required()] : [];

  return (
    <EnumField
      value={model.get(metadata.name)}
      metadata={metadata}
      validators={validators}
      events={{
        onChange: (value) => model.set(metadata.name, value),
        onCommit: () => model.save(),
      }}
    />
  );
}
```

### Backbone.js Integration

```tsx
// For existing Sugar CRM Backbone views
class ModernEnumFieldView extends Backbone.View {
  render() {
    const metadata = convertSugarField(this.def);
    
    ReactDOM.render(
      <SugarThemeProvider>
        <EnumField
          value={this.model.get(this.name)}
          metadata={metadata}
          events={{
            onChange: (value) => {
              this.model.set(this.name, value);
              this.trigger('change', value);
            }
          }}
        />
      </SugarThemeProvider>,
      this.el
    );
    
    return this;
  }
}
```

## 🎨 Styling and Customization

All styling is done via CSS-in-JS with no external CSS files:

```tsx
// Custom styled enum field
const StyledEnumField = ({ metadata, ...props }) => {
  return (
    <SugarThemeProvider theme={{
      colors: {
        primary: '#custom-color',
      },
      borderRadius: {
        md: '12px',
      },
    }}>
      <EnumField metadata={metadata} {...props} />
    </SugarThemeProvider>
  );
};
```

## 📋 API Reference

### Core Types

```tsx
interface BaseFieldProps<T, M extends BaseFieldMetadata> {
  value?: T;
  metadata: M;
  state?: Partial<FieldState<T>>;
  events?: FieldEventHandlers<T>;
  validators?: ValidatorFunction<T>[];
  inputProps?: Record<string, any>;
}

interface FieldState<T> {
  value: T;
  isDirty: boolean;
  isTouched: boolean;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

### EnumField Types

```tsx
interface EnumFieldMetadata extends BaseFieldMetadata {
  options: EnumOption[];
  multiple?: boolean;
  allowEmpty?: boolean;
  display?: 'dropdown' | 'radio' | 'checkbox';
  searchable?: boolean;
  maxVisibleOptions?: number;
}

interface EnumOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  metadata?: Record<string, any>;
}
```

## 🛣️ Roadmap

### Phase 1: Atoms (Current)
- ✅ EnumField
- 🔄 TextField
- 🔄 NumberField
- 🔄 DateField
- 🔄 BooleanField

### Phase 2: Molecules
- 🔄 FieldGroup
- 🔄 FormSection
- 🔄 SearchFilter

### Phase 3: Organisms
- 🔄 RecordView
- 🔄 ListView
- 🔄 FormLayout

### Phase 4: Templates & Pages
- 🔄 RecordDetailTemplate
- 🔄 ListViewTemplate
- 🔄 DashboardTemplate

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run Storybook for development
npm run storybook

# Build the library
npm run build

# Run tests
npm test

# Type checking
npm run type-check
```

## 📄 License

MIT © Sugar CRM
