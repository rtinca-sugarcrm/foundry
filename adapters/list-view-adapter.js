/*
 * Your installation or use of this SugarCRM file is subject to the applicable
 * terms available at
 * http://support.sugarcrm.com/Resources/Master_Subscription_Agreements/.
 * If you do not agree to all of the applicable terms or do not have the
 * authority to bind the entity as an authorized representative, then do not
 * install or use this SugarCRM file.
 *
 * Copyright (C) SugarCRM Inc. All rights reserved.
 */
/**
 * @class View.Views.Base.ListViewAdapter
 * @alias SUGAR.App.view.views.BaseListViewAdapter
 * @extends View.Views.Base.BaseView
 */
({
    extendsFrom: 'BaseView',
    plugins: ['ExternalReactBase'],

    initialize: function(options) {
        // Follow the same pattern as list/flex-list views to properly fetch metadata
        // Grab the list of fields to display from the main list view metadata
        var listViewMeta = app.metadata.getView(options.module, 'list') || {};
        // Extend from an empty object to prevent pollution of the base metadata
        options.meta = _.extend({}, listViewMeta, options.meta || {});
        
        this._super('initialize', [options]);
        
        // Listen to collection events
        if (this.collection) {
            this.collection.on('reset', this.render, this);
            this.collection.on('add', this.render, this);
            this.collection.on('remove', this.render, this);
            this.collection.on('sync', this.render, this);
        }
    },

    getProps: function() {
        const columns = this._getColumns();
        const rows = this._getRows();
        
        return {
            columns: columns,
            rows: rows,
            selectable: this.options.selectable !== false,
            multiSelect: this.options.multiSelect !== false,
            selectedIds: this._getSelectedIds(),
            sort: this.options.sort,
            loading: this.options.loading || false,
            emptyMessage: this.options.emptyMessage || app.lang.get('LBL_NO_DATA'),
            hoverable: this.options.hoverable !== false,
            clickableRows: this.options.clickableRows !== false,
            showHeader: this.options.showHeader !== false,
            maxHeight: this.options.maxHeight,
            // Row actions
            showEdit: this.options.showEdit !== false,
            showDelete: this.options.showDelete !== false,
            customActions: this.options.customActions || [],
            // Callbacks
            onSelectionChange: this._onSelectionChange.bind(this),
            onRowClick: this._onRowClick.bind(this),
            onRowDoubleClick: this._onRowDoubleClick.bind(this),
            onSortChange: this._onSortChange.bind(this),
            onColumnHeaderClick: this._onColumnHeaderClick.bind(this),
            onRowAction: this._onRowAction.bind(this)
        };
    },

    /**
     * Transform Sugar metadata into ListView columns
     */
    _getColumns: function() {
        // Follow the same pattern as list/flex-list/recordlist views
        // Metadata is stored in this.meta.panels after being fetched and processed
        const panels = this.meta?.panels || [];
        const fields = panels[0]?.fields || [];
        
        // Safety check: ensure module is available
        if (!this.module) {
            app.logger.error('react-list: module is not defined');
            return [];
        }
        
        return fields.map(fieldMeta => {
            // app.metadata.getField expects an options object with module and name properties
            const fieldDef = app.metadata.getField({
                module: this.module,
                name: fieldMeta.name
            }) || {};
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
            const appListStrings = app.lang.getAppListStrings(fieldDef.options);
            
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
                    app.router.navigate(module + '/' + recordId, { trigger: true });
                }
            };
        }
        
        return props;
    },

    /**
     * Get selected row IDs from collection
     */
    _getSelectedIds: function() {
        if (!this.collection) return [];
        return this.collection.models
            .filter(model => model.get('_selected'))
            .map(model => model.get('id'));
    },

    /**
     * Transform Sugar collection models into ListView rows
     */
    _getRows: function() {
        if (!this.collection || !this.collection.models) {
            return [];
        }

        return this.collection.models.map(model => {
            const data = {};
            const columns = this._getColumns();
            
            columns.forEach(col => {
                data[col.key] = model.get(col.key);
                
                // Include related field data for name/relate fields
                if (['name', 'relate'].includes(col.type)) {
                    data[`${col.key}_id`] = model.get(`${col.key}_id`) || model.get('id');
                    data[`${col.key}_module`] = model.get(`${col.key}_module`) || this.module;
                }
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
     * Callback handlers
     */
    _onSelectionChange: function(selectedIds) {
        // Update collection models
        if (this.collection) {
            this.collection.models.forEach(model => {
                model.set('_selected', selectedIds.includes(model.get('id')));
            });
        }
        
        // Trigger context event
        if (this.context) {
            this.context.trigger('list:selection:change', selectedIds);
        }
        
        // Call custom callback
        if (this.options.onSelectionChange) {
            this.options.onSelectionChange.call(this, selectedIds);
        }
    },

    _onRowClick: function(row, rowIndex) {
        const model = this.collection && this.collection.get(row.id);
        
        if (this.options.onRowClick) {
            this.options.onRowClick.call(this, row, rowIndex, model);
        } else {
            // Default: navigate to record
            app.router.navigate(this.module + '/' + row.id, { trigger: true });
        }
    },

    _onRowDoubleClick: function(row, rowIndex) {
        const model = this.collection && this.collection.get(row.id);
        
        if (this.options.onRowDoubleClick) {
            this.options.onRowDoubleClick.call(this, row, rowIndex, model);
        }
    },

    _onSortChange: function(sort) {
        if (this.options.onSortChange) {
            this.options.onSortChange.call(this, sort);
        } else {
            // Default: update collection and fetch
            if (this.collection) {
                this.collection.orderBy = {
                    field: sort.columnKey,
                    direction: sort.direction
                };
                this.collection.fetch();
            }
        }
    },

    _onColumnHeaderClick: function(column) {
        if (this.options.onColumnHeaderClick) {
            this.options.onColumnHeaderClick.call(this, column);
        }
    },

    _onRowAction: function(action, row, rowIndex) {
        const model = this.collection && this.collection.get(row.id);
        
        // Handle built-in actions
        if (action === 'edit') {
            // Check if user has access to edit
            if (model && this._hasAccess(model, 'edit')) {
                // Trigger context event for edit mode entered
                if (this.context) {
                    this.context.trigger('list:edit:fire', model);
                }
            } else {
                app.alert.show('no-access', {
                    level: 'error',
                    messages: app.lang.get('LBL_NO_ACCESS', this.module)
                });
            }
        } else if (action === 'save') {
            // Save edited row data
            if (model && this._hasAccess(model, 'edit')) {
                // Update model with edited data
                model.set(row.data);
                
                // Save to server
                model.save(null, {
                    success: () => {
                        app.alert.show('save-success', {
                            level: 'success',
                            messages: app.lang.get('LBL_RECORD_SAVED', this.module),
                            autoClose: true
                        });
                        
                        // Trigger context event
                        if (this.context) {
                            this.context.trigger('list:save:success', model);
                        }
                    },
                    error: (error) => {
                        app.alert.show('save-error', {
                            level: 'error',
                            messages: app.lang.get('ERR_GENERIC_SERVER_ERROR')
                        });
                        
                        // Trigger context event
                        if (this.context) {
                            this.context.trigger('list:save:error', model, error);
                        }
                    }
                });
            } else {
                app.alert.show('no-access', {
                    level: 'error',
                    messages: app.lang.get('LBL_NO_ACCESS', this.module)
                });
            }
        } else if (action === 'delete') {
            // Show confirmation dialog before delete
            if (model && this._hasAccess(model, 'delete')) {
                app.alert.show('delete-confirmation', {
                    level: 'confirmation',
                    messages: app.lang.get('NTC_DELETE_CONFIRMATION'),
                    onConfirm: () => {
                        model.destroy({
                            success: () => {
                                app.alert.show('delete-success', {
                                    level: 'success',
                                    messages: app.lang.get('LBL_RECORD_DELETED', this.module),
                                    autoClose: true
                                });
                                
                                // Trigger context event
                                if (this.context) {
                                    this.context.trigger('list:delete:success', model);
                                }
                            },
                            error: () => {
                                app.alert.show('delete-error', {
                                    level: 'error',
                                    messages: app.lang.get('ERR_GENERIC_SERVER_ERROR')
                                });
                            }
                        });
                    }
                });
            } else {
                app.alert.show('no-access', {
                    level: 'error',
                    messages: app.lang.get('LBL_NO_ACCESS', this.module)
                });
            }
        } else {
            // Handle custom actions
            if (this.options.onRowAction) {
                this.options.onRowAction.call(this, action, row, rowIndex, model);
            }
        }
    },

    // Plugin configuration
    getNamespace: function() { return 'UIReactComponents'; },
    getComponent: function() { return 'ListView'; },
    getMountEl: function() { return _.first(this.$('.external-react-root')); }
});
