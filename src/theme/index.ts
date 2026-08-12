export interface ColorTheme {
  primary: string;
  secondary: string;
  background: string;
  mint: string;
  mintDark: string;
  mintLight: string;
  slate: string;
  ocean: string;
  oceanDark: string;
  oceanLight: string;
  coral: string;
  rose: string;
  coralDark: string;
  roseLight: string;
  glass: string;
  glassBorder: string;
  glassShadow: string;
  graySubtle: string;
  grayLight: string;
  grayMedium: string;
  border: string;
  borderLight: string;
  borderDark: string;
  buttonBorder: string;
  buttonSecondaryBorder: string;
  buttonPrimaryBackground: string;
  buttonSecondaryBackground: string;
  systemBlue: string;
  systemGreen: string;
  systemRed: string;
  silver: string;
  charcoal: string;
  text: string;
  textSecondary: string;
  surface: string;
  card: string;
  cardBorder: string;
  cardBorderInteractive: string;
  inputBackground: string;
}

export const lightColors: ColorTheme = {
  primary: '#0F0F0F',
  secondary: '#F1F3F4',
  background: '#F8F9FA',
  mint: '#A8D5BA',
  mintDark: '#7FB89A',
  mintLight: '#C8E6D7',
  slate: '#5A6B7C',
  ocean: '#7A8B9E',
  oceanDark: '#5A6B7C',
  oceanLight: '#B8C8DB',
  coral: '#F49090',
  rose: '#F0A5C1',
  coralDark: '#E87474',
  roseLight: '#F8B8D0',
  glass: 'rgba(255, 255, 255, 0.55)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',
  glassShadow: 'rgba(0, 0, 0, 0.12)',
  graySubtle: '#8B95A1',
  grayLight: '#C1C7CD',
  grayMedium: '#5A6B7C',
  border: 'rgba(0, 0, 0, 0.1)',
  borderLight: 'rgba(0, 0, 0, 0.06)',
  borderDark: 'rgba(0, 0, 0, 0.18)',
  buttonBorder: 'rgba(0, 0, 0, 0.2)',
  buttonSecondaryBorder: 'rgba(0, 0, 0, 0.15)',
  buttonPrimaryBackground: '#0F0F0F',
  buttonSecondaryBackground: '#FFFFFF',
  systemBlue: '#7A8B9E',
  systemGreen: '#A8D5BA',
  systemRed: '#F49090',
  silver: '#8B95A1',
  charcoal: '#3A4B5C',
  text: '#0F0F0F',
  textSecondary: '#8B95A1',
  surface: '#FAFAFA',
  card: '#FFFFFF',
  cardBorder: 'rgba(0, 0, 0, 0.08)',
  cardBorderInteractive: 'rgba(0, 0, 0, 0.12)',
  inputBackground: '#F1F3F4',
};

export const darkColors: ColorTheme = {
  primary: '#F8F9FA',
  secondary: '#1C1C1E',
  background: '#0F0F0F',
  mint: '#7FB89A',
  mintDark: '#A8D5BA',
  mintLight: '#1C3328',
  slate: '#8B95A1',
  ocean: '#B8C8DB',
  oceanDark: '#5A6B7C',
  oceanLight: '#1C2A3A',
  coral: '#F49090',
  rose: '#F0A5C1',
  coralDark: '#E87474',
  roseLight: '#3A2A30',
  glass: 'rgba(40, 40, 40, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassShadow: 'rgba(0, 0, 0, 0.5)',
  graySubtle: '#8B95A1',
  grayLight: '#5A6B7C',
  grayMedium: '#A1AAB4',
  border: 'rgba(255, 255, 255, 0.15)',
  borderLight: 'rgba(255, 255, 255, 0.08)',
  borderDark: 'rgba(255, 255, 255, 0.22)',
  buttonBorder: 'rgba(255, 255, 255, 0.25)',
  buttonSecondaryBorder: 'rgba(255, 255, 255, 0.2)',
  buttonPrimaryBackground: '#F8F9FA',
  buttonSecondaryBackground: '#2C2C2E',
  systemBlue: '#B8C8DB',
  systemGreen: '#7FB89A',
  systemRed: '#F49090',
  silver: '#8B95A1',
  charcoal: '#E8EAED',
  text: '#F8F9FA',
  textSecondary: '#8B95A1',
  surface: '#1C1C1E',
  card: '#1C1C1E',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  cardBorderInteractive: 'rgba(255, 255, 255, 0.18)',
  inputBackground: '#2C2C2E',
};

// Legacy exports for backward compatibility
export const colors = lightColors;

export const getThemeColors = (isDark: boolean): ColorTheme => {
  return isDark ? darkColors : lightColors;
};

export const shadows = {
  glass: {
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 10,
  },
  soft: {
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  medium: {
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  button: {
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
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
