import { createTheme } from '@mui/material/styles';

// Palette de couleurs partagée
const baseColors = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryLighter: '#93c5fd',
  primaryDark: '#1e40af',
  primaryDarker: '#1e3a8a',
  
  secondary: '#06b6d4',
  secondaryLight: '#22d3ee',
  secondaryDark: '#0891b2',
  
  success: '#10b981',
  successLight: '#6ee7b7',
  successDark: '#047857',
  
  error: '#ef4444',
  errorLight: '#fca5a5',
  errorDark: '#991b1b',
  
  warning: '#f59e0b',
  warningLight: '#fcd34d',
  warningDark: '#92400e',
};

// Créer un thème basé sur le mode
export const createAppTheme = (mode = 'light') => {
  const isDark = mode === 'dark';
  
  const palette = {
    mode,
    primary: {
      main: baseColors.primary,
      light: baseColors.primaryLight,
      lighter: baseColors.primaryLighter,
      dark: baseColors.primaryDark,
      darker: baseColors.primaryDarker,
      contrastText: isDark ? '#e2e8f0' : '#ffffff',
    },
    secondary: {
      main: baseColors.secondary,
      light: baseColors.secondaryLight,
      dark: baseColors.secondaryDark,
      contrastText: '#e2e8f0',
    },
    success: {
      main: baseColors.success,
      light: baseColors.successLight,
      dark: baseColors.successDark,
    },
    error: {
      main: baseColors.error,
      light: baseColors.errorLight,
      dark: baseColors.errorDark,
    },
    warning: {
      main: baseColors.warning,
      light: baseColors.warningLight,
      dark: baseColors.warningDark,
    },
    info: {
      main: baseColors.primary,
      light: baseColors.primaryLight,
      dark: baseColors.primaryDark,
    },
    background: {
      default: isDark ? '#0f172a' : '#f8fafc',
      paper: isDark ? '#1e293b' : '#ffffff',
    },
    text: {
      primary: isDark ? '#e2e8f0' : '#0f172a',
      secondary: isDark ? '#94a3b8' : '#64748b',
      disabled: isDark ? '#475569' : '#cbd5e1',
    },
    grey: isDark ? {
      50: '#0f172a',
      100: '#1e293b',
      200: '#334155',
      300: '#475569',
      400: '#64748b',
      500: '#94a3b8',
      600: '#cbd5e1',
      700: '#d1d5db',
      800: '#e2e8f0',
      900: '#f1f5f9',
    } : {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    action: {
      active: baseColors.primary,
      hover: isDark ? 'rgba(59, 130, 246, 0.16)' : 'rgba(59, 130, 246, 0.08)',
      selected: isDark ? 'rgba(59, 130, 246, 0.24)' : 'rgba(59, 130, 246, 0.16)',
      disabled: isDark ? '#475569' : '#cbd5e1',
      disabledBackground: isDark ? '#334155' : '#e2e8f0',
    },
    divider: isDark ? '#334155' : '#e2e8f0',
  };

  return createTheme({
    palette,
    typography: {
      fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '3rem',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 800,
        fontSize: '2.25rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.875rem',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.3px',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.57,
        letterSpacing: '0.25px',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.5px',
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.4px',
      },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
    shadows: isDark ? [
      'none',
      '0px 1px 2px rgba(0, 0, 0, 0.3)',
      '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.3)',
      '0px 4px 6px rgba(0, 0, 0, 0.4), 0px 1px 3px rgba(0, 0, 0, 0.5)',
      '0px 10px 15px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.4)',
      '0px 20px 25px rgba(0, 0, 0, 0.5), 0px 10px 10px rgba(0, 0, 0, 0.3)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
      '0px 25px 50px rgba(0, 0, 0, 0.6)',
    ] : [
      'none',
      '0px 1px 2px rgba(0, 0, 0, 0.05)',
      '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
      '0px 4px 6px rgba(0, 0, 0, 0.07), 0px 1px 3px rgba(0, 0, 0, 0.1)',
      '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
      '0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
      '0px 25px 50px rgba(0, 0, 0, 0.25)',
    ],
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#e2e8f0' : '#0f172a',
          },
        },
      },
    },
  });
};

// Export du thème par défaut (light)
export const theme = createAppTheme('light');
