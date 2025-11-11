# ListView Adapter Update Summary

## Changes Made

The ListView adapter has been updated to work with the new refactored ListView component that includes:
- Separate `ListViewRow` component for better performance and maintainability
- Built-in edit, delete, and custom action support
- Inline row editing with Save/Cancel buttons

## Key Updates

### 1. New Props Added to `getProps()`
```javascript
// Row actions
showEdit: this.options.showEdit !== false,
showDelete: this.options.showDelete !== false,
customActions: this.options.customActions || [],
```

### 2. Enhanced `_onRowAction()` Handler

The `_onRowAction` function now handles three built-in actions:

#### Edit Action
- Checks user access permissions
- Triggers context event `list:edit:fire`
- Shows error alert if user lacks permissions

#### Save Action
- Updates model with edited data from `row.data`
- Saves to server via `model.save()`
- Shows success/error alerts
- Triggers context events: `list:save:success` or `list:save:error`

#### Delete Action
- Checks user access permissions
- Shows confirmation dialog before deletion
- Destroys model via `model.destroy()`
- Shows success/error alerts
- Triggers context event `list:delete:success`

### 3. Proper Metadata Handling

Updated `initialize()` to fetch metadata like list/flex-list views:
```javascript
var listViewMeta = app.metadata.getView(options.module, 'list') || {};
options.meta = _.extend({}, listViewMeta, options.meta || {});
```

Updated `_getColumns()` to use correct API:
```javascript
const fieldDef = app.metadata.getField({
    module: this.module,
    name: fieldMeta.name
}) || {};
```

## Usage

### Basic Usage with Edit and Delete
```javascript
var listView = app.view.createView({
    type: 'list-view-adapter',
    module: 'Accounts',
    collection: myCollection,
    showEdit: true,        // Show Edit button
    showDelete: true,      // Show Delete button
});
```

### With Custom Actions
```javascript
var listView = app.view.createView({
    type: 'list-view-adapter',
    module: 'Accounts',
    collection: myCollection,
    showEdit: true,
    showDelete: true,
    customActions: [
        { label: 'Clone', action: 'clone' },
        { label: 'Email', action: 'email' },
        { label: 'Export', action: 'export' }
    ],
    onRowAction: function(action, row, rowIndex, model) {
        if (action === 'clone') {
            // Handle clone action
        } else if (action === 'email') {
            // Handle email action
        }
    }
});
```

### Inline Editing Flow

1. User clicks "Edit" button → Row enters edit mode
2. All fields become editable (EnumField, TextField, NameField components)
3. User makes changes to field values
4. User clicks "Save" → `_onRowAction('save', row, rowIndex)` is called
5. Adapter updates model and saves to server
6. Success/error alert is shown
7. Row exits edit mode

### Extending the Adapter

```javascript
App.view.views.BaseMyCustomListView = App.view.views.BaseListViewAdapter.extend({
    initialize: function(options) {
        options.showEdit = true;
        options.showDelete = false; // Disable delete
        this._super('initialize', [options]);
    },
    
    _onRowAction: function(action, row, rowIndex) {
        if (action === 'save') {
            // Custom validation before save
            if (this._validateRowData(row.data)) {
                this._super('_onRowAction', [action, row, rowIndex]);
            }
        } else {
            this._super('_onRowAction', [action, row, rowIndex]);
        }
    },
    
    _validateRowData: function(data) {
        // Your validation logic
        return data.name && data.name.trim() !== '';
    }
});
```

## Context Events

The adapter triggers the following context events:

- `list:edit:fire` - When entering edit mode
- `list:save:success` - When save succeeds
- `list:save:error` - When save fails
- `list:delete:success` - When delete succeeds
- `list:selection:change` - When selection changes

## ACL Integration

All actions respect Sugar CRM ACL:
- Edit button only works if user has `edit` access
- Delete button only works if user has `delete` access
- Appropriate error messages shown when access is denied

## Files Modified

1. `adapters/list-view-adapter.js` - Main adapter file
2. `adapters/list-view-adapter-example.js` - Usage examples (NEW)

## Testing

To test the updated adapter:

1. Create a view instance with `showEdit: true` and `showDelete: true`
2. Click the three-dot menu on a row
3. Click "Edit" - row should enter edit mode with editable fields
4. Make changes to field values
5. Click "Save" - changes should be saved to server
6. Click "Delete" - confirmation dialog should appear
7. Confirm deletion - record should be deleted

## Backward Compatibility

The adapter maintains backward compatibility:
- `showEdit` defaults to `true` if not specified
- `showDelete` defaults to `true` if not specified
- Custom `onRowAction` callbacks still work for custom actions
- All existing options and callbacks continue to work
