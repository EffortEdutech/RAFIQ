import { Link } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { publicColors, publicRadii, publicShadows, publicSpacing, publicTypography } from '../../theme/publicDesignSystem';
import { PublicStatusBadge } from './PublicStatusBadge';

const PUBLIC_NAV_ITEMS: Array<{ href: string; label: string }> = [
  { href: '/public', label: 'Home' },
  { href: '/public/search', label: 'Explore' },
  { href: '/public/answer', label: 'Ask' },
  { href: '/public/quran', label: 'Read Quran' },
  { href: '/public/hadith', label: 'Hadith' },
  { href: '/public/sources', label: 'Sources' },
  { href: '/public/about', label: 'About' },
];

type Props = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  subtitle: string;
}>;

export function PublicAppShell({ children, eyebrow = 'RAFIQ', title, subtitle }: Props) {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandLockup}>
            <Link href="/public" style={styles.brand}>
              RAFIQ
            </Link>
            <Text style={styles.brandSubline}>Source-guided Islamic knowledge</Text>
          </View>
          <PublicStatusBadge kind="privatePreview" label="Release candidate" />
        </View>
        <View style={styles.nav}>
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href as never} style={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </View>
      </View>

      <View style={[styles.hero, publicShadows.raised]}>
        <View style={styles.heroAccent} />
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      {children}

      <View style={styles.footer}>
        <View style={styles.footerGrid}>
          <View style={styles.footerCopy}>
            <Text style={styles.footerTitle}>Public release boundary</Text>
            <Text style={styles.footerText}>
              Public pages use release-filtered public routes only. Real source content remains hidden until
              source, attribution, editorial, and scholar/content approval gates pass.
            </Text>
          </View>
          <View style={styles.footerLinks}>
            <Link href="/public/sources" style={styles.footerLink}>
              Source policy
            </Link>
            <Link href="/public/about" style={styles.footerLink}>
              About RAFIQ
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: publicColors.pearl,
  },
  container: {
    gap: publicSpacing.space32,
    marginHorizontal: 'auto' as never,
    maxWidth: 1120,
    padding: publicSpacing.space20,
    width: '100%',
  },
  topBar: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space20,
    padding: publicSpacing.space20,
    ...publicShadows.card,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space12,
    justifyContent: 'space-between',
  },
  brand: {
    color: publicColors.deepGreen,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    minHeight: 44,
    paddingVertical: publicSpacing.space4,
  },
  brandLockup: {
    gap: publicSpacing.space4,
  },
  brandSubline: {
    ...publicTypography.metadata,
    color: publicColors.muted,
  },
  nav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  navLink: {
    backgroundColor: publicColors.mintSoft,
    borderColor: publicColors.line,
    borderRadius: publicRadii.pill,
    borderWidth: 1,
    color: publicColors.inkSoft,
    fontWeight: '900',
    minHeight: 44,
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
  hero: {
    backgroundColor: publicColors.forest,
    borderColor: publicColors.deepGreen,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space24,
    overflow: 'hidden',
    padding: publicSpacing.space32,
  },
  heroAccent: {
    backgroundColor: publicColors.gold,
    borderRadius: publicRadii.pill,
    height: 7,
    width: 120,
  },
  heroCopy: {
    gap: publicSpacing.space12,
  },
  eyebrow: {
    ...publicTypography.label,
    color: publicColors.goldSoft,
    textTransform: 'uppercase',
  },
  title: {
    ...publicTypography.hero,
    color: publicColors.white,
  },
  subtitle: {
    ...publicTypography.body,
    color: publicColors.mint,
    maxWidth: 860,
  },
  footer: {
    borderTopColor: publicColors.line,
    borderTopWidth: 1,
    gap: publicSpacing.space12,
    paddingVertical: publicSpacing.space24,
  },
  footerGrid: {
    gap: publicSpacing.space16,
  },
  footerCopy: {
    gap: publicSpacing.space12,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  footerLink: {
    backgroundColor: publicColors.mintSoft,
    borderColor: publicColors.line,
    borderRadius: publicRadii.pill,
    borderWidth: 1,
    color: publicColors.deepGreen,
    fontWeight: '900',
    minHeight: 44,
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
  footerTitle: {
    ...publicTypography.label,
    color: publicColors.ink,
    textTransform: 'uppercase',
  },
  footerText: {
    ...publicTypography.metadata,
    color: publicColors.muted,
  },
});
