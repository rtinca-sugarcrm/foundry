# Sugar UI React

Agnostic React component library for Sugar CRM.

## What is this?

A collection of reusable React components designed to work with Sugar CRM through adapters. Components are framework-agnostic and can be used in any React application.

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **Rollup** - Module bundler
- **Storybook** - Component development and documentation

## Components

### EnumField

A dropdown component with search and multi-select support.

```tsx
import { EnumField } from '@sugar/ui-react';

<EnumField
  value={value}
  options={[
    { value: 'new', label: 'New' },
    { value: 'in_progress', label: 'In Progress' },
  ]}
  onChange={(newValue) => setValue(newValue)}
/>
```

**Features:**
- Single and multi-select
- Searchable
- Error states
- Disabled options
- Custom styling

## Development

```bash
# Install dependencies
npm install

# Run Storybook
npm run storybook

# Build bundle
npm run build

# Run tests
npm test
```

## Build Output

```
dist/
  ├── index.js          # CommonJS bundle
  ├── index.esm.js      # ES Module bundle
  ├── index.css         # Styles
  └── index.d.ts        # TypeScript definitions
```

## Usage in Sugar CRM

Components are loaded via a Sugar field adapter:

```javascript
// custom/clients/base/fields/enum/enum.js
({
  plugins: ['ReactPlugin'],
  
  getReactComponent() {
    return window.SugarUIReact.EnumField;
  },
  
  getReactProps() {
    return {
      value: this.model.get(this.name),
      options: this.getOptions(),
      onChange: (value) => this.model.set(this.name, value),
    };
  },
})
```

## License

MIT
