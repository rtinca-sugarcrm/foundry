import { CSSProperties } from 'react';
import { SugarTheme } from '../design-system/theme';

/**
 * Utility for creating CSS-in-JS styles with theme support
 */

export type StyleFunction<P = {}> = (theme: SugarTheme, props?: P) => CSSProperties;
export type StyleObject<P = {}> = CSSProperties | StyleFunction<P>;

/**
 * Creates CSS styles with theme integration
 */
export const createStyles = <P = {}>(styles: Record<string, StyleObject<P>>) => {
    return (theme: SugarTheme, props?: P): Record<string, CSSProperties> => {
        const computedStyles: Record<string, CSSProperties> = {};

        for (const [key, style] of Object.entries(styles)) {
            computedStyles[key] = typeof style === 'function' ? style(theme, props) : style;
        }

        return computedStyles;
    };
};

/**
 * Common style utilities
 */
export const styleUtils = {
    /**
     * Focus styles consistent across components
     */
    focus: (theme: SugarTheme): CSSProperties => ({
        outline: 'none',
        borderColor: theme.colors.border.focus,
        boxShadow: `0 0 0 2px ${theme.colors.border.focus}20`,
    }),

    /**
     * Error state styles
     */
    error: (theme: SugarTheme): CSSProperties => ({
        borderColor: theme.colors.border.error,
        color: theme.colors.error,
    }),

    /**
     * Disabled state styles
     */
    disabled: (theme: SugarTheme): CSSProperties => ({
        backgroundColor: theme.colors.background.disabled,
        color: theme.colors.text.disabled,
        cursor: 'not-allowed',
        opacity: 0.6,
    }),

    /**
     * Transition styles
     */
    transition: (theme: SugarTheme, properties: string[] = ['all']): CSSProperties => ({
        transition: properties.map((prop) => `${prop} ${theme.transitions.fast}`).join(', '),
    }),

    /**
     * Typography styles
     */
    typography: (
        theme: SugarTheme,
        size: keyof SugarTheme['typography']['fontSize'] = 'md'
    ): CSSProperties => ({
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize[size],
        fontWeight: theme.typography.fontWeight.normal,
    }),

    /**
     * Container styles
     */
    container: (theme: SugarTheme): CSSProperties => ({
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
    }),

    /**
     * Label styles
     */
    label: (theme: SugarTheme): CSSProperties => ({
        ...styleUtils.typography(theme, 'sm'),
        fontWeight: theme.typography.fontWeight.medium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    }),

    /**
     * Input base styles
     */
    inputBase: (theme: SugarTheme): CSSProperties => ({
        ...styleUtils.typography(theme),
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        border: `1px solid ${theme.colors.border.primary}`,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.primary,
        color: theme.colors.text.primary,
        ...styleUtils.transition(theme, ['border-color', 'box-shadow']),
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
    }),

    /**
     * Helper text styles
     */
    helpText: (theme: SugarTheme): CSSProperties => ({
        ...styleUtils.typography(theme, 'xs'),
        color: theme.colors.text.secondary,
        marginTop: theme.spacing.xs,
    }),

    /**
     * Error text styles
     */
    errorText: (theme: SugarTheme): CSSProperties => ({
        ...styleUtils.typography(theme, 'xs'),
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
    }),
};
