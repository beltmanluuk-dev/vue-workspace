export const colors = {
  // Vision OS / Glassmorphic Palette - Darker
  primary: '#0F0F0F',
  secondary: '#F1F3F4',
  background: '#F8F9FA',
  
  // Soft Mint (darker)
  mint: '#A8D5BA',
  mintDark: '#7FB89A',
  mintLight: '#C8E6D7',
  
  // Muted Slate/Ocean (darker)
  slate: '#5A6B7C',
  ocean: '#7A8B9E',
  oceanDark: '#5A6B7C',
  oceanLight: '#B8C8DB',
  
  // Soft Coral/Rose (darker)
  coral: '#F49090',
  rose: '#F0A5C1',
  coralDark: '#E87474',
  roseLight: '#F8B8D0',
  
  // Glassmorphic (more opaque)
  glass: 'rgba(255, 255, 255, 0.35)',
  glassBorder: 'rgba(255, 255, 255, 0.25)',
  glassShadow: 'rgba(0, 0, 0, 0.15)',
  
  // Neutrals (darker)
  graySubtle: '#8B95A1',
  grayLight: '#C1C7CD',
  grayMedium: '#5A6B7C',
  border: 'rgba(255, 255, 255, 0.3)',
  
  // Legacy compatibility
  systemBlue: '#7A8B9E',
  systemGreen: '#A8D5BA',
  systemRed: '#F49090',
  silver: '#8B95A1',
  charcoal: '#3A4B5C',
  
  // Added for component compatibility
  text: '#0F0F0F',
  textSecondary: '#8B95A1',
  surface: '#FAFAFA',
};

export const shadows = {
  glass: {
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8,
  },
  soft: {
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  medium: {
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const typography = {
  // Inter-inspired typography
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};
