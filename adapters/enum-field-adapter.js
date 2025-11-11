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
 * @class View.Fields.Base.EnumFieldAdapter
 * @alias SUGAR.App.view.fields.BaseEnumFieldAdapter
 * @extends View.Fields.Base.BaseField
 */
({
    extendsFrom: 'BaseField',
    plugins: ['ExternalReactBase'],

    _getOptions() {
        const list = this.def.options && app.lang.getAppListStrings(this.def.options) || {};
        return Object.keys(list).map(v => ({ value: v, label: list[v] }));
    },

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

        return {
            value: this.model.get(this.name) || '',
            options: this._getOptions(),
            required: !!this.def.required,
            mode: mode,
            error: this._error || undefined,
            multiple: !!this.def.isMultiSelect,
            searchable: !!this.def.searchable,
            placeholder: this.def.placeholder || '',
            onChange: async (newVal) => {
                this.model.set(this.name, newVal);
            }
        };
    },

    // Plugin configuration
    getNamespace() { return 'UIReactComponents'; },
    getComponent() { return 'EnumField'; },
    getMountEl()   { return _.first(this.$('.external-react-root')); }
});
