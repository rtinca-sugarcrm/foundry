import React, { createContext, useContext, ReactNode } from 'react';
import { SugarTheme, defaultTheme } from './theme';

interface SugarThemeContextValue {
    theme: SugarTheme;
}

const SugarThemeContext = createContext<SugarThemeContextValue>({
    theme: defaultTheme,
});

export interface SugarThemeProviderProps {
    theme?: Partial<SugarTheme>;
    children: ReactNode;
}

/**
 * Merges provided theme with default theme
 */
const mergeTheme = (customTheme: Partial<SugarTheme>): SugarTheme => {
    return {
        ...defaultTheme,
        ...customTheme,
        colors: {
            ...defaultTheme.colors,
            ...customTheme.colors,
            text: {
                ...defaultTheme.colors.text,
                ...customTheme.colors?.text,
            },
            background: {
                ...defaultTheme.colors.background,
                ...customTheme.colors?.background,
            },
            border: {
                ...defaultTheme.colors.border,
                ...customTheme.colors?.border,
            },
        },
        spacing: {
            ...defaultTheme.spacing,
            ...customTheme.spacing,
        },
        typography: {
            ...defaultTheme.typography,
            ...customTheme.typography,
            fontSize: {
                ...defaultTheme.typography.fontSize,
                ...customTheme.typography?.fontSize,
            },
            fontWeight: {
                ...defaultTheme.typography.fontWeight,
                ...customTheme.typography?.fontWeight,
            },
        },
        borderRadius: {
            ...defaultTheme.borderRadius,
            ...customTheme.borderRadius,
        },
        shadows: {
            ...defaultTheme.shadows,
            ...customTheme.shadows,
        },
        transitions: {
            ...defaultTheme.transitions,
            ...customTheme.transitions,
        },
    };
};

export const SugarThemeProvider: React.FC<SugarThemeProviderProps> = ({
    theme: customTheme = {},
    children,
}) => {
    const theme = mergeTheme(customTheme);

    return <SugarThemeContext.Provider value={{ theme }}>{children}</SugarThemeContext.Provider>;
};

export const useSugarTheme = (): SugarTheme => {
    const context = useContext(SugarThemeContext);
    return context.theme;
};
