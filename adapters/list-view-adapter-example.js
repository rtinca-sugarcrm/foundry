/**
 * Example usage of the ListView adapter in Sugar CRM
 * 
 * This example shows how to create a custom list view using the React ListView component
 * with built-in edit and delete functionality.
 */

// Example 1: Basic usage with edit and delete buttons
({
    extendsFrom: 'ListViewAdapter',
    
    initialize: function(options) {
        // Enable edit and delete actions
        options.showEdit = true;
        options.showDelete = true;
        
        // Add custom actions (optional)
        options.customActions = [
            { label: 'View Details', action: 'view-details' },
            { label: 'Export', action: 'export' }
        ];
        
        // Configure other options
        options.selectable = true;
        options.multiSelect = true;
        options.clickableRows = true;
        
        this._super('initialize', [options]);
    },
    
    // Handle custom row actions
    _onRowAction: function(action, row, rowIndex, model) {
        // Call parent to handle edit, delete, save actions
        this._super('_onRowAction', [action, row, rowIndex]);
        
        // Handle custom actions
        if (action === 'view-details') {
            // Custom logic for viewing details
            console.log('Viewing details for:', row.data);
        } else if (action === 'export') {
            // Custom logic for export
            console.log('Exporting row:', row.data);
        }
    }
});

// Example 2: Customizing edit behavior
({
    extendsFrom: 'ListViewAdapter',
    
    initialize: function(options) {
        options.showEdit = true;
        options.showDelete = false; // Disable delete
        
        this._super('initialize', [options]);
    },
    
    _onRowAction: function(action, row, rowIndex) {
        const model = this.collection && this.collection.get(row.id);
        
        if (action === 'edit') {
            // Custom edit behavior - e.g., open in drawer instead of inline edit
            app.drawer.open({
                layout: 'record',
                context: {
                    module: this.module,
                    modelId: row.id,
                    model: model
                }
            }, function() {
                // Refresh list after drawer closes
                this.collection.fetch();
            }.bind(this));
        } else if (action === 'save') {
            // Custom save validation before calling parent
            if (this._validateRowData(row.data)) {
                this._super('_onRowAction', [action, row, rowIndex]);
            } else {
                app.alert.show('validation-error', {
                    level: 'error',
                    messages: 'Please fix validation errors before saving'
                });
            }
        } else {
            // Call parent for other actions
            this._super('_onRowAction', [action, row, rowIndex]);
        }
    },
    
    _validateRowData: function(data) {
        // Custom validation logic
        if (!data.name || data.name.trim() === '') {
            return false;
        }
        return true;
    }
});

// Example 3: Creating a simple list view component
App.view.views.BaseMyCustomListView = App.view.views.BaseListViewAdapter.extend({
    initialize: function(options) {
        // Set your preferences
        options.showEdit = true;
        options.showDelete = true;
        options.hoverable = true;
        options.clickableRows = true;
        
        this._super('initialize', [options]);
    }
});

/**
 * How to instantiate the view in your code:
 * 
 * // Create a collection
 * var myCollection = app.data.createBeanCollection('Accounts');
 * 
 * // Create the view
 * var listView = app.view.createView({
 *     type: 'list-view-adapter',  // or 'my-custom-list'
 *     module: 'Accounts',
 *     collection: myCollection,
 *     showEdit: true,
 *     showDelete: true,
 *     customActions: [
 *         { label: 'Clone', action: 'clone' },
 *         { label: 'Email', action: 'email' }
 *     ]
 * });
 * 
 * // Fetch data
 * myCollection.fetch({
 *     success: function() {
 *         // Render the view
 *         listView.render();
 *     }
 * });
 */
