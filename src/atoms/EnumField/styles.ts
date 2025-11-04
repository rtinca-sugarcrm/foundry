import { createStyles, styleUtils } from '../../core/styles';
import { SugarTheme } from '../../design-system/theme';

interface EnumFieldStyleProps {
    isOpen?: boolean;
    hasError?: boolean;
    isDisabled?: boolean;
    isReadonly?: boolean;
    isFocused?: boolean;
    display?: 'dropdown' | 'radio' | 'checkbox' | 'toggle' | 'segmented';
}

export const enumFieldStyles = createStyles<EnumFieldStyleProps>({
    container: (theme, props) => ({
        ...styleUtils.container(theme),
        position: 'relative',
        opacity: props?.isDisabled ? 0.6 : 1,
    }),

    label: (theme, props) => ({
        ...styleUtils.label(theme),
        color: props?.hasError ? theme.colors.error : theme.colors.text.primary,
    }),

    requiredIndicator: (theme) => ({
        color: theme.colors.error,
        marginLeft: theme.spacing.xs,
    }),

    // Dropdown styles
    dropdownTrigger: (theme, props) => ({
        ...styleUtils.inputBase(theme),
        cursor: props?.isDisabled ? 'not-allowed' : 'pointer',
        justifyContent: 'space-between',
        userSelect: 'none',
        backgroundColor: props?.isReadonly
            ? theme.colors.background.disabled
            : theme.colors.background.primary,
        borderColor: props?.hasError
            ? theme.colors.border.error
            : props?.isFocused
            ? theme.colors.border.focus
            : theme.colors.border.primary,
        ...(props?.isFocused && styleUtils.focus(theme)),
        ...(props?.isDisabled && styleUtils.disabled(theme)),
    }),

    dropdownValue: (theme) => ({
        flex: 1,
        textAlign: 'left' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
    }),

    placeholder: (theme) => ({
        color: theme.colors.text.disabled,
        fontStyle: 'italic',
    }),

    dropdownArrow: (theme, props) => ({
        marginLeft: theme.spacing.sm,
        transition: theme.transitions.fast,
        transform: props?.isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        color: theme.colors.text.secondary,
    }),

    dropdownMenu: (theme) => ({
        position: 'absolute' as const,
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: theme.colors.background.primary,
        border: `1px solid ${theme.colors.border.primary}`,
        borderRadius: theme.borderRadius.md,
        boxShadow: theme.shadows.md,
        marginTop: theme.spacing.xs,
        maxHeight: '200px',
        overflowY: 'auto' as const,
    }),

    searchInput: (theme) => ({
        ...styleUtils.inputBase(theme),
        margin: theme.spacing.sm,
        marginBottom: 0,
    }),

    option: (theme) => ({
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        transition: theme.transitions.fast,
        '&:hover': {
            backgroundColor: theme.colors.background.secondary,
        },
    }),

    optionSelected: (theme) => ({
        backgroundColor: theme.colors.primary,
        color: theme.colors.text.inverse,
        '&:hover': {
            backgroundColor: theme.colors.primaryHover,
        },
    }),

    optionDisabled: (theme) => ({
        ...styleUtils.disabled(theme),
        cursor: 'not-allowed',
        '&:hover': {
            backgroundColor: 'transparent',
        },
    }),

    // Radio/Checkbox group styles
    radioGroup: (theme) => ({
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.spacing.sm,
    }),

    checkboxGroup: (theme) => ({
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.spacing.sm,
    }),

    radioOption: (theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        cursor: 'pointer',
        padding: theme.spacing.xs,
    }),

    checkboxOption: (theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        cursor: 'pointer',
        padding: theme.spacing.xs,
    }),

    radioInput: (theme) => ({
        margin: 0,
        cursor: 'pointer',
    }),

    checkboxInput: (theme) => ({
        margin: 0,
        cursor: 'pointer',
    }),

    optionLabel: (theme) => ({
        ...styleUtils.typography(theme),
        cursor: 'pointer',
        flex: 1,
    }),

    // Segmented control styles
    segmentedContainer: (theme) => ({
        display: 'flex',
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xs,
        gap: theme.spacing.xs,
    }),

    segmentedOption: (theme) => ({
        flex: 1,
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        borderRadius: theme.borderRadius.sm,
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: theme.transitions.fast,
        ...styleUtils.typography(theme, 'sm'),
        textAlign: 'center' as const,
    }),

    segmentedOptionSelected: (theme) => ({
        backgroundColor: theme.colors.background.primary,
        color: theme.colors.primary,
        boxShadow: theme.shadows.sm,
    }),

    // Toggle styles
    toggleContainer: (theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
    }),

    toggle: (theme) => ({
        position: 'relative' as const,
        width: '48px',
        height: '24px',
        backgroundColor: theme.colors.background.secondary,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: theme.transitions.fast,
    }),

    toggleActive: (theme) => ({
        backgroundColor: theme.colors.primary,
    }),

    toggleThumb: (theme) => ({
        position: 'absolute' as const,
        top: '2px',
        left: '2px',
        width: '20px',
        height: '20px',
        backgroundColor: theme.colors.background.primary,
        borderRadius: '50%',
        transition: theme.transitions.fast,
        boxShadow: theme.shadows.sm,
    }),

    toggleThumbActive: () => ({
        transform: 'translateX(24px)',
    }),

    // Common styles
    helpText: (theme) => styleUtils.helpText(theme),

    errorText: (theme) => styleUtils.errorText(theme),

    errorContainer: (theme) => ({
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.spacing.xs,
        marginTop: theme.spacing.xs,
    }),
});
