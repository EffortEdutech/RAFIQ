export const companionColors = {
  night: '#111714',
  nightSoft: '#18211D',
  ink: '#151A17',
  inkSoft: '#3B4741',
  paper: '#FAFAF7',
  paperWarm: '#F2F0EA',
  pearl: '#F7F7F3',
  mist: '#ECEFED',
  mint: '#C9D3CE',
  gold: '#8F7A45',
  goldSoft: '#E7DDC4',
  line: '#D8DAD4',
  muted: '#69736D',
  white: '#FFFFFF',
  danger: '#8F3A2E',
};

export const companionSpacing = {
  xxs: 4,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

export const companionRadii = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  full: 8,
};

export const companionTypography = {
  quranArabic: {
    fontFamily: 'RafiqKfgqpcHafs',
    letterSpacing: 0,
  },
  brand: {
    fontSize: 18,
    fontWeight: '800' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    letterSpacing: 0,
    lineHeight: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 21,
  },
  label: {
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 0,
    lineHeight: 14,
  },
};

export const companionLayout = {
  deviceMaxWidth: 430,
  contentPadding: 12,
  bottomNavHeight: 52,
  minTouch: 40,
};

export const companionShadow = {
  soft: {
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },
};
