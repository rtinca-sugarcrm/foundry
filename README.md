# Sugar UI React

Agnostic React component library for Sugar CRM.

## Installation

```bash
npm install @ui/react-components
```

**Important: CSS Required**

```javascript
// Import CSS
import '@ui/react-components/dist/ui-react-components.css';

// Import components
import { EnumField, TextField, NameField } from '@ui/react-components';
```

### Or via CDN (for Sugar CRM)

```html
<!-- In your tpls/sidecar.tpl -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@main/dist/ui-react-components.css">
<script src="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@main/dist/ui-react-components.umd.js"></script>
```

## What is this?

A collection of reusable React components designed to work with Sugar CRM through adapters. Components are framework-agnostic and can be used in any React application.

## Components

### EnumField

Dropdown with search and multi-select support.

### TextField

Text input with support for various types (text, email, password, textarea, etc.).

### NameField

Name field with linking and focus drawer support for Sugar CRM.

## Sugar CRM Integration

### 1. Load via CDN (in tpls/sidecar.tpl)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@main/dist/ui-react-components.css">
<script src="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@main/dist/ui-react-components.umd.js"></script>
```

### 2. Use Field Adapters

Field adapters are available in the repo but not distributed publicly.

Each adapter needs a template:

```handlebars
{{!-- custom/clients/base/fields/enum/enum.hbs --}}
<div class="external-react-root"></div>
```

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

## License

MIT