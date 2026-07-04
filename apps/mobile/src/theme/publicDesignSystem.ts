export const publicColors = {
  ink: '#10201C',
  inkSoft: '#1B332D',
  deepGreen: '#0F5F55',
  deepGreenPressed: '#0A453E',
  forest: '#073B35',
  mint: '#DDEFE8',
  mintSoft: '#EEF8F3',
  sand: '#F8F1E3',
  paper: '#FFFDF7',
  cream: '#FDF7EA',
  pearl: '#FFFBF1',
  gold: '#C99A3A',
  goldSoft: '#F3E3B7',
  goldWash: '#FBF2D6',
  slate: '#53605A',
  muted: '#7A867F',
  line: '#E7DCC7',
  lineStrong: '#D2BE94',
  success: '#237A57',
  warning: '#A86E00',
  danger: '#A13D2D',
  info: '#2F6F9F',
  white: '#FFFFFF',
  black: '#000000',
};

export const publicSpacing = {
  space4: 4,
  space8: 8,
  space12: 12,
  space16: 16,
  space20: 20,
  space24: 24,
  space32: 32,
  space40: 40,
  space48: 48,
  space64: 64,
};

export const publicRadii = {
  small: 10,
  medium: 16,
  large: 24,
  xlarge: 32,
  pill: 999,
};

export const publicTypography = {
  hero: {
    fontSize: 46,
    fontWeight: '900' as const,
    lineHeight: 50,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '900' as const,
    lineHeight: 39,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900' as const,
    lineHeight: 31,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 29,
  },
  metadata: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '900' as const,
    letterSpacing: 0,
    lineHeight: 16,
  },
};

export const publicShadows = {
  card: {
    elevation: 2,
    shadowColor: publicColors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  raised: {
    elevation: 5,
    shadowColor: publicColors.black,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
  },
};
