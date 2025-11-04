/**
 * Sugar Design System Tokens
 *
 * This file contains the core design tokens that can be customized
 * by each Sugar product while maintaining consistency across the library.
 */

export interface SugarTheme {
    colors: {
        primary: string;
        primaryHover: string;
        primaryActive: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
        text: {
            primary: string;
            secondary: string;
            disabled: string;
            inverse: string;
        };
        background: {
            primary: string;
            secondary: string;
            disabled: string;
            inverse: string;
        };
        border: {
            primary: string;
            secondary: string;
            focus: string;
            error: string;
        };
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    typography: {
        fontFamily: string;
        fontSize: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
        fontWeight: {
            normal: number;
            medium: number;
            semibold: number;
            bold: number;
        };
    };
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
    };
    shadows: {
        sm: string;
        md: string;
        lg: string;
    };
    transitions: {
        fast: string;
        medium: string;
        slow: string;
    };
}

// Default Sugar theme
export const defaultTheme: SugarTheme = {
    colors: {
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        primaryActive: '#1d4ed8',
        secondary: '#6b7280',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        text: {
            primary: '#1f2937',
            secondary: '#6b7280',
            disabled: '#9ca3af',
            inverse: '#ffffff',
        },
        background: {
            primary: '#ffffff',
            secondary: '#f9fafb',
            disabled: '#f3f4f6',
            inverse: '#1f2937',
        },
        border: {
            primary: '#d1d5db',
            secondary: '#e5e7eb',
            focus: '#3b82f6',
            error: '#ef4444',
        },
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
    },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
            lg: '18px',
            xl: '20px',
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
    },
    borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    transitions: {
        fast: '150ms ease',
        medium: '300ms ease',
        slow: '500ms ease',
    },
};
