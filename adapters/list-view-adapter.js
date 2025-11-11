/**
 * Sugar CRM ListView Adapter
 * 
 * This adapter converts Sugar CRM metadata and collection data into
 * the format expected by the ListView component.
 * 
 * Usage Example:
 * 
 * const ListView = ExternalReact.createComponent(
 *     window.UIReactComponents.ListView,
 *     {
 *         metadata: {
 *             panels: [{
 *                 fields: [
 *                     { name: 'name', label: 'Name', sortable: true, width: 200 },
 *                     { name: 'email', label: 'Email', sortable: true },
 *                     { name: 'status', label: 'Status', type: 'enum' }
 *                 ]
 *             }]
 *         },
 *         collection: accountsCollection,
 *         context: recordViewContext
 *     },
 *     {
 *         // Callbacks
 *         onRowClick: function(row) {
 *             app.navigate(this.context, this.collection.get(row.id));
 *         },
 *         onSelectionChange: function(selectedIds) {
 *             this.context.trigger('list:selection:change', selectedIds);
 *         },
 *         onSortChange: function(sort) {
 *             this.collection.orderBy = {
 *                 field: sort.columnKey,
 *                 direction: sort.direction
 *             };
 *             this.collection.fetch();
 *         }
 *     }
 * );
 */

(function(App) {
    'use strict';

    App.ExternalReact.addAdapter('ListView', {
        /**
         * Transform Sugar metadata into ListView columns
         */
        getColumns: function() {
            const panels = this.options.metadata?.panels || [];
            const fields = panels[0]?.fields || [];
            
            return fields.map(fieldMeta => {
                const fieldDef = App.metadata.getField(this.options.module, fieldMeta.name) || {};
                const fieldType = fieldDef.type || 'varchar';
                
                return {
                    key: fieldMeta.name,
                    label: fieldMeta.label || fieldDef.vname || fieldMeta.name,
                    width: fieldMeta.width || this._getDefaultWidth(fieldType),
                    sortable: fieldMeta.sortable !== false,
                    align: this._getAlignment(fieldType),
                    visible: fieldMeta.visible !== false,
                    type: this._mapFieldTypeToComponentType(fieldType),
                    options: this._getFieldOptions(fieldDef),
                    fieldProps: this._getFieldProps(fieldMeta.name, fieldDef)
                };
            });
        },

        /**
         * Map Sugar field types to ListView component types
         */
        _mapFieldTypeToComponentType: function(sugarFieldType) {
            const typeMap = {
                'name': 'name',
                'fullname': 'name',
                'relate': 'relate',
                'parent': 'relate',
                'email': 'email',
                'phone': 'phone',
                'tel': 'phone',
                'url': 'url',
                'enum': 'enum',
                'multienum': 'enum',
                'radioenum': 'enum',
                'varchar': 'text',
                'text': 'text',
                'int': 'text',
                'decimal': 'text',
                'float': 'text',
                'currency': 'text',
                'date': 'text',
                'datetime': 'text',
                'datetimecombo': 'text',
                'bool': 'text'
            };
            
            return typeMap[sugarFieldType] || 'text';
        },

        /**
         * Get options for enum fields
         */
        _getFieldOptions: function(fieldDef) {
            const fieldType = fieldDef.type;
            
            if (['enum', 'multienum', 'radioenum'].includes(fieldType)) {
                const appListStrings = App.lang.getAppListStrings(fieldDef.options);
                
                if (appListStrings) {
                    return Object.keys(appListStrings).map(key => ({
                        value: key,
                        label: appListStrings[key]
                    }));
                }
            }
            
            return undefined;
        },

        /**
         * Get additional props to pass to field components
         */
        _getFieldProps: function(fieldName, fieldDef) {
            const fieldType = fieldDef.type;
            const props = {};
            
            // Add link click handler for name/relate fields
            if (['name', 'fullname', 'relate', 'parent'].includes(fieldType)) {
                props.onLinkClick = (recordId, module) => {
                    if (recordId && module) {
                        App.router.navigate(module + '/' + recordId, { trigger: true });
                    }
                };
            }
            
            return props;
        },

        /**
         * Transform Sugar collection models into ListView rows
         */
        getRows: function() {
            const collection = this.options.collection;
            if (!collection || !collection.models) {
                return [];
            }

            return collection.models.map(model => {
                const data = {};
                const columns = this.getColumns();
                
                columns.forEach(col => {
                    data[col.key] = model.get(col.key);
                });

                return {
                    id: model.get('id'),
                    data: data,
                    disabled: !this._hasAccess(model, 'view'),
                    selected: model.get('_selected') || false
                };
            });
        },

        /**
         * Get default width based on field type
         */
        _getDefaultWidth: function(fieldType) {
            const widthMap = {
                'id': 100,
                'name': 200,
                'email': 250,
                'phone': 150,
                'date': 120,
                'datetime': 180,
                'bool': 80,
                'enum': 150,
                'currency': 120,
                'int': 100,
                'relate': 200
            };
            return widthMap[fieldType] || 'auto';
        },

        /**
         * Get alignment based on field type
         */
        _getAlignment: function(fieldType) {
            if (['int', 'currency', 'decimal', 'float'].includes(fieldType)) {
                return 'right';
            }
            if (['bool'].includes(fieldType)) {
                return 'center';
            }
            return 'left';
        },

        /**
         * Check if user has access to perform action on model
         */
        _hasAccess: function(model, action) {
            const acls = model.get('_acl') || {};
            return acls[action] !== false;
        },

        /**
         * Get props for ListView component
         */
        getProps: function() {
            const columns = this.getColumns();
            const rows = this.getRows();
            
            return {
                columns: columns,
                rows: rows,
                selectable: this.options.selectable !== false,
                multiSelect: this.options.multiSelect !== false,
                selectedIds: this.options.selectedIds || [],
                sort: this.options.sort,
                loading: this.options.loading || false,
                emptyMessage: this.options.emptyMessage || App.lang.get('LBL_NO_DATA'),
                hoverable: this.options.hoverable !== false,
                clickableRows: this.options.clickableRows !== false,
                showHeader: this.options.showHeader !== false,
                maxHeight: this.options.maxHeight,
                
                // Callbacks
                onSelectionChange: this.onSelectionChange.bind(this),
                onRowClick: this.onRowClick.bind(this),
                onRowDoubleClick: this.onRowDoubleClick.bind(this),
                onSortChange: this.onSortChange.bind(this),
                onColumnHeaderClick: this.onColumnHeaderClick.bind(this),
                onRowAction: this.onRowAction.bind(this)
            };
        },

        /**
         * Callback handlers
         */
        onSelectionChange: function(selectedIds) {
            // Update collection models
            const collection = this.options.collection;
            if (collection) {
                collection.models.forEach(model => {
                    model.set('_selected', selectedIds.includes(model.get('id')));
                });
            }
            
            // Trigger context event
            if (this.options.context) {
                this.options.context.trigger('list:selection:change', selectedIds);
            }
            
            // Call custom callback
            if (this.options.onSelectionChange) {
                this.options.onSelectionChange.call(this, selectedIds);
            }
        },

        onRowClick: function(row, rowIndex) {
            const model = this.options.collection?.get(row.id);
            
            if (this.options.onRowClick) {
                this.options.onRowClick.call(this, row, rowIndex, model);
            } else {
                // Default: navigate to record
                const module = this.options.module;
                App.router.navigate(module + '/' + row.id, { trigger: true });
            }
        },

        onRowDoubleClick: function(row, rowIndex) {
            const model = this.options.collection?.get(row.id);
            
            if (this.options.onRowDoubleClick) {
                this.options.onRowDoubleClick.call(this, row, rowIndex, model);
            }
        },

        onSortChange: function(sort) {
            if (this.options.onSortChange) {
                this.options.onSortChange.call(this, sort);
            } else {
                // Default: update collection and fetch
                const collection = this.options.collection;
                if (collection) {
                    collection.orderBy = {
                        field: sort.columnKey,
                        direction: sort.direction
                    };
                    collection.fetch();
                }
            }
        },

        onColumnHeaderClick: function(column) {
            if (this.options.onColumnHeaderClick) {
                this.options.onColumnHeaderClick.call(this, column);
            }
        },

        onRowAction: function(action, row, rowIndex) {
            const model = this.options.collection?.get(row.id);
            
            if (this.options.onRowAction) {
                this.options.onRowAction.call(this, action, row, rowIndex, model);
            }
        }
    });

})(SUGAR.App);
