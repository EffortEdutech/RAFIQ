import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { publicColors, publicRadii, publicShadows, publicSpacing } from '../theme/publicDesignSystem';

const PRIMARY_NAV = [
  ['Today', '/'],
  ['Companion', '/answer'],
  ['Quran', '/quran/1'],
  ['Library', '/search'],
  ['Profile', '/profile'],
];

const INTERNAL_NAV = [
  ['Product Home', '/'],
  ['Library', '/search'],
  ['Internal Review', '/review'],
];

type Props = {
  includeReview?: boolean;
  variant?: 'product' | 'internal';
  subtitle?: string;
};

export function RafiqNavigationBar({
  includeReview = false,
  variant = 'product',
  subtitle = 'Your daily companion in deen',
}: Props) {
  const navItems = variant === 'internal' || includeReview ? INTERNAL_NAV : PRIMARY_NAV;

  return (
    <View style={styles.stickyWrap}>
      <View style={[styles.topBar, publicShadows.card]}>
        <Link href="/" style={styles.brandBlock}>
          <Text style={styles.brand}>RAFIQ</Text>
          <Text style={styles.brandTagline}>{subtitle}</Text>
        </Link>
        <View style={styles.nav}>
          {navItems.map(([label, href]) => (
            <Link href={href as never} key={href} style={styles.navLink}>
              {label}
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyWrap: {
    backgroundColor: publicColors.forest,
    paddingBottom: publicSpacing.space8,
    paddingTop: publicSpacing.space8,
    zIndex: 20,
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 247, 0.98)',
    borderColor: 'rgba(255, 253, 247, 0.45)',
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space16,
    justifyContent: 'space-between',
    padding: publicSpacing.space16,
  },
  brandBlock: { minHeight: 48 },
  brand: {
    color: publicColors.deepGreen,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
  },
  brandTagline: {
    color: publicColors.slate,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  nav: { flexDirection: 'row', flexWrap: 'wrap', gap: publicSpacing.space8 },
  navLink: {
    backgroundColor: publicColors.mintSoft,
    borderRadius: publicRadii.pill,
    color: publicColors.ink,
    fontWeight: '900',
    minHeight: 44,
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
});
