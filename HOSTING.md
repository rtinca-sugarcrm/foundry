# Hosting the UMD Bundle

You now have a **UMD bundle** ready to be hosted and used anywhere!

## 📦 Built Files

- `dist/ui-react-components.umd.js` (18KB minified) - The component bundle
- `dist/example.html` - Demo showing how to use it

## 🚀 Hosting Options

### Option 1: GitHub Pages (Free & Easy)

1. **Enable GitHub Pages:**
   ```bash
   git add dist/
   git commit -m "Add UMD bundle"
   git push origin main
   ```

2. **Go to repo settings → Pages → Deploy from branch → `main/dist`**

3. **Use in Sugar:**
   ```html
   <script src="https://USERNAME.github.io/REPO/ui-react-components.umd.js"></script>
   ```

### Option 2: AWS S3 + CloudFront (Production)

```bash
# Upload to S3
aws s3 cp dist/ui-react-components.umd.js s3://your-bucket/ui-components/v1.0.0/

# Make public
aws s3api put-object-acl --bucket your-bucket --key ui-components/v1.0.0/ui-react-components.umd.js --acl public-read
```

### Option 3: Internal CDN

Just copy `dist/ui-react-components.umd.js` to your company's CDN or static file server.

### Option 4: NPM CDN (if published to NPM)

```html
<script src="https://unpkg.com/@ui/react-components@0.1.0/dist/ui-react-components.umd.js"></script>
```

## 📝 Usage in Sugar

### HTML Approach (Direct Load):

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- React -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Your Components -->
    <script src="https://YOUR-HOST/ui-react-components.umd.js"></script>
</head>
<body>
    <div id="root"></div>
    <script>
        const { EnumField } = window.UIReactComponents;
        
        // Use it!
        ReactDOM.render(
            React.createElement(EnumField, {
                value: 'option1',
                options: [
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                ],
                onChange: (value) => console.log(value)
            }),
            document.getElementById('root')
        );
    </script>
</body>
</html>
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
