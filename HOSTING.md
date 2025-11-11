# Hosting the React Components

## 📦 Built Files

After running `npm run build`, you get:

- `dist/ui-react-components.umd.js` - The component bundle
- `dist/ui-react-components.css` - Required CSS file
- `dist/index.esm.js` - ES Module version
- `dist/index.js` - CommonJS version

## 🚀 CDN Usage (jsDelivr)

jsDelivr automatically hosts GitHub repositories. Use this in Sugar CRM:

```html
<!-- In tpls/sidecar.tpl -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@main/dist/ui-react-components.css">
<script src="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@main/dist/ui-react-components.umd.js"></script>
```

### Version Pinning

```html
<!-- Use specific commit -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@COMMIT_SHA/dist/ui-react-components.css">
<script src="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@COMMIT_SHA/dist/ui-react-components.umd.js"></script>

<!-- Or use a tag -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@v1.0.0/dist/ui-react-components.css">
<script src="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@v1.0.0/dist/ui-react-components.umd.js"></script>
```

## 📝 Usage in Sugar CRM

### HTML Approach (Direct Load):

```html
## 📝 Usage in Sugar CRM

Components are available globally as `window.UIReactComponents`:

```javascript
const { EnumField, TextField, NameField } = window.UIReactComponents;

// Use in your field adapter
getProps() {
    return {
        value: this.model.get(this.name),
        options: this._getOptions(),
        onChange: (value) => this.model.set(this.name, value),
    };
}
```

See the `adapters/` folder for complete Sugar field adapters.

## 🔄 Versioning

For production, pin to a specific version:

```html
<!-- Use a git tag -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@v1.0.0/dist/ui-react-components.css">
<script src="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@v1.0.0/dist/ui-react-components.umd.js"></script>

<!-- Or use a commit SHA -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@abc123/dist/ui-react-components.css">
<script src="https://cdn.jsdelivr.net/gh/rtinca-sugarcrm/foundry@abc123/dist/ui-react-components.umd.js"></script>
```
```

### JavaScript/TypeScript Module Approach:

```typescript
// If Sugar uses module bundler (Webpack/Vite)
import { EnumField, EnumFieldProps, EnumOption } from '@ui/react-components';

// Use it
<EnumField
  value={value}
  options={options}
  onChange={(newValue) => handleChange(newValue)}
/>
```

### React Component in Sugar:

```typescript
import React, { useState } from 'react';

// If using UMD
declare global {
    interface Window {
        UIReactComponents: {
            EnumField: React.ComponentType<any>;
        };
    }
}

const MyComponent = () => {
    const [value, setValue] = useState<string | null>(null);
    const { EnumField } = window.UIReactComponents;
    
    return (
        <EnumField
            value={value}
            options={[
                { value: '1', label: 'Option 1' },
                { value: '2', label: 'Option 2' },
            ]}
            onChange={setValue}
        />
    );
};
```

## 🔄 Versioning

For production, use versioned URLs:

```html
<script src="https://your-cdn.com/ui-components/v1.0.0/ui-react-components.umd.js"></script>
<script src="https://your-cdn.com/ui-components/v1.0.1/ui-react-components.umd.js"></script>
<script src="https://your-cdn.com/ui-components/latest/ui-react-components.umd.js"></script>
```

## 📊 Bundle Info

- **Size:** 18KB minified
- **Dependencies:** React 17+ or 18+, Tailwind CSS
- **Format:** UMD (Universal Module Definition)
- **Global:** `window.UIReactComponents`

## 🎯 Quick Test

Open `dist/example.html` in a browser to see it working!
