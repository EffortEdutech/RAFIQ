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
  ['Home', '/'],
  ['Review', '/review'],
  ['Work', '/review-workbench'],
  ['Graph', '/knowledge-graphify'],
  ['CP24', '/graph-aware-retrieval'],
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
        <View style={styles.brandBlock}>
          <Link href="/" style={styles.brand}>
            RAFIQ
          </Link>
          <Text style={styles.brandTagline}>{subtitle}</Text>
        </View>
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
  brandBlock: { flexShrink: 1, gap: publicSpacing.space4, minHeight: 48, minWidth: 0 },
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
  nav: {
    alignContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
    justifyContent: 'flex-start',
    maxWidth: '100%',
    width: '100%',
  },
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
