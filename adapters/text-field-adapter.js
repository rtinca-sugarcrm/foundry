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
 * @class View.Fields.Base.TextFieldAdapter
 * @alias SUGAR.App.view.fields.BaseTextFieldAdapter
 * @extends View.Fields.Base.BaseField
 */
({
    extendsFrom: 'BaseField',
    plugins: ['ExternalReactBase'],

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

        // Determine field type
        const fieldType = this.def.type || 'text';
        let inputType = 'text';

        // Map Sugar field types to HTML input types
        switch (fieldType) {
            case 'email':
                inputType = 'email';
                break;
            case 'phone':
            case 'tel':
                inputType = 'tel';
                break;
            case 'url':
                inputType = 'url';
                break;
            case 'int':
            case 'integer':
            case 'decimal':
            case 'float':
                inputType = 'number';
                break;
            case 'password':
                inputType = 'password';
                break;
            case 'textarea':
                // textarea will be handled by multiline prop
                inputType = 'text';
                break;
            default:
                inputType = 'text';
        }

        return {
            value: this.model.get(this.name) || null,
            type: inputType,
            required: !!this.def.required,
            mode: mode,
            placeholder: this.def.placeholder || '',
            error: this._error || undefined,
            maxLength: this.def.len || this.def.maxLength || undefined,
            minLength: this.def.minLength || undefined,
            multiline: fieldType === 'textarea' || this.def.multiline,
            rows: this.def.rows || 3,
            autoComplete: this.def.autocomplete || undefined,
            onChange: async (newVal) => {
                this.model.set(this.name, newVal);
            },
            onBlur: () => {
                // Trigger validation on blur if needed
                if (this.model.doValidate) {
                    this.model.doValidate([this.name]);
                }
            }
        };
    },

    // Plugin configuration
    getNamespace() { return 'UIReactComponents'; },
    getComponent() { return 'TextField'; },
    getMountEl()   { return _.first(this.$('.external-react-root')); }
});
