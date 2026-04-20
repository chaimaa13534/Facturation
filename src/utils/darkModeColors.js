/**
 * Utilitaire pour les couleurs du Dark Mode
 * Fournit des fonctions pour obtenir les bonnes couleurs selon le mode
 */

export const getDarkModeColors = (isDark) => ({
  // Couleurs de base
  background: {
    primary: isDark ? '#0f172a' : '#f8fafc',
    secondary: isDark ? '#1e293b' : '#f1f5f9',
    tertiary: isDark ? '#334155' : '#e2e8f0',
  },
  text: {
    primary: isDark ? '#e2e8f0' : '#0f172a',
    secondary: isDark ? '#94a3b8' : '#64748b',
    tertiary: isDark ? '#64748b' : '#94a3b8',
    disabled: isDark ? '#475569' : '#cbd5e1',
  },
  border: {
    light: isDark ? '#334155' : '#e2e8f0',
    medium: isDark ? '#475569' : '#cbd5e1',
    dark: isDark ? '#1e293b' : '#cbd5e1',
  },
  card: {
    background: isDark ? '#1e293b' : '#ffffff',
    hover: isDark ? '#334155' : '#f8fafc',
    border: isDark ? '#334155' : '#e2e8f0',
  },
  input: {
    background: isDark ? '#334155' : '#ffffff',
    border: isDark ? '#475569' : '#e2e8f0',
    text: isDark ? '#e2e8f0' : '#0f172a',
  },
  shadow: {
    light: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.04)',
    medium: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)',
    heavy: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.25)',
  },
  gradient: {
    bg: isDark 
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
      : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  },
});

/**
 * Hook pour utiliser le contexte du theme MUI
 * Retourne les couleurs appropriées basé sur le mode
 */
export const useThemeColors = (theme) => {
  return getDarkModeColors(theme.palette.mode === 'dark');
};
