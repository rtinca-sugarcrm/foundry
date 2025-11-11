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
 * @class View.Fields.Base.NameFieldAdapter
 * @alias SUGAR.App.view.fields.BaseNameFieldAdapter
 * @extends View.Fields.Base.BaseField
 */
({
    extendsFrom: 'BaseField',
    plugins: ['ExternalReactBase', 'FocusDrawer', 'MetadataEventDriven'],

    getProps() {
        const canEdit = app.acl.hasAccess('edit', this.module, this.model, this.name);
        const isEditView = this.view && (this.view.action === 'edit' || this.view.name === 'edit');
        const isInlineEdit = !!(this.view && this.view.inlineEditMode);
        const isFieldEditing = this.isEditing && this.isEditing();
        const isViewEditing = this.view && (this.view.action === 'edit' || this.view.currentState === 'edit');

        // Determine mode based on various edit states
        let mode = 'readonly';

        if (canEdit && !this.def.readonly && !this.def.readOnly) {
            if (isEditView || isViewEditing || isFieldEditing || isInlineEdit) {
                mode = 'edit';
            }
        }

        // Handle disabled state
        if (this.def.disabled) {
            mode = 'disabled';
        }

        // Determine if link should be shown (based on Sugar's name field behavior)
        let showLink = false;
        if (mode === 'readonly' && this.def.link !== false) {
            // FIXME: This will be cleaned up by SC-3478.
            if (['audit', 'side-drawer-headerpane'].includes(this.view.name)) {
                showLink = false;
            } else if (this.view.name === 'preview') {
                showLink = _.isUndefined(this.def.link) ? true : this.def.link;
            } else {
                showLink = true;
            }
        }

        // Check if focus drawer icon should be shown
        const focusDrawerEnabled = this.checkFocusAvailability && this.checkFocusAvailability();

        return {
            value: this.model.get(this.name) || null,
            required: !!this.def.required,
            mode: mode,
            placeholder: this.def.placeholder || '',
            error: this._error || undefined,
            maxLength: this.def.len || this.def.maxLength || undefined,
            link: showLink,
            recordId: this.model.get('id') || undefined,
            module: this.model.get('_module') || this.module || undefined,
            showFocusIcon: focusDrawerEnabled && showLink,
            onChange: async (newVal) => {
                this.model.set(this.name, newVal);
            },
            onBlur: () => {
                // Trigger validation on blur if needed
                if (this.model.doValidate) {
                    this.model.doValidate([this.name]);
                }
            },
            onLinkClick: (recordId, module) => {
                // Navigate to record detail view
                if (recordId && module) {
                    app.router.navigate(module + '/' + recordId, {trigger: true});
                }
            },
            onFocusClick: (recordId, module) => {
                // Open focus drawer
                if (this.openFocusDrawer && recordId && module) {
                    const focusContext = this.getFocusContext('dashboard');
                    if (focusContext) {
                        this.openFocusDrawer(focusContext);
                    }
                }
            }
        };
    },

    /**
     * Used by the FocusDrawer plugin to get the ID of the record this field
     * links to
     *
     * @return {string} the ID of the related record
     */
    getFocusContextModelId: function() {
        return this.model && this.model.get('id') ? this.model.get('id') : '';
    },

    /**
     * Used by the FocusDrawer plugin to get the name of the module this
     * field links to
     *
     * @return {string} the name of the related module
     */
    getFocusContextModule: function() {
        return this.model && this.model.get('_module') ? this.model.get('_module') : '';
    },

    /**
     * Called by record view to set max width of inner record-cell div
     * to prevent long names from overflowing the outer record-cell container
     */
    setMaxWidth: function(width) {
        this.$el.css({'max-width': width});
    },

    /**
     * Return the width of padding on inner record-cell
     */
    getCellPadding: function() {
        let padding = 0;
        let $cell = this.$('.dropdown-toggle');

        if ($cell.length > 0) {
            padding = parseInt($cell.css('padding-left'), 10) + parseInt($cell.css('padding-right'), 10);
        }

        return padding;
    },

    // Plugin configuration
    getNamespace() { return 'UIReactComponents'; },
    getComponent() { return 'NameField'; },
    getMountEl()   { return _.first(this.$('.external-react-root')); }
});
