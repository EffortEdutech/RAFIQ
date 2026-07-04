import { Link } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompanionDeviceShell } from './CompanionDeviceShell';
import { RafiqNavigationBar } from './RafiqNavigationBar';
import {
  publicColors,
  publicRadii,
  publicShadows,
  publicSpacing,
  publicTypography,
} from '../theme/publicDesignSystem';

type Props = PropsWithChildren<{
  eyebrow: string;
  title: string;
  subtitle: string;
  includeReviewNav?: boolean;
  action?: {
    href: string;
    label: string;
  };
}>;

export function PrivateWorkspaceShell({
  action,
  children,
  eyebrow,
  includeReviewNav = false,
  subtitle,
  title,
}: Props) {
  if (!includeReviewNav) {
    return (
      <CompanionDeviceShell
        action={action}
        eyebrow={eyebrow}
        subtitle={subtitle}
        title={title}
      >
        {children}
      </CompanionDeviceShell>
    );
  }

  return (
    <ScrollView stickyHeaderIndices={[0]} style={styles.page} contentContainerStyle={styles.container}>
      <RafiqNavigationBar
        includeReview={includeReviewNav}
        subtitle={includeReviewNav ? 'internal quality workspace' : 'Quran-guided companion'}
        variant={includeReviewNav ? 'internal' : 'product'}
      />
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={[styles.hero, publicShadows.raised]}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {action ? (
          <Link href={action.href as never} style={styles.heroAction}>
            {action.label}
          </Link>
        ) : null}
      </View>

      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: publicColors.forest,
  },
  glowOne: {
    backgroundColor: 'rgba(201, 154, 58, 0.16)',
    borderRadius: 999,
    height: 260,
    position: 'absolute',
    right: -90,
    top: -80,
    width: 260,
  },
  glowTwo: {
    backgroundColor: 'rgba(221, 239, 232, 0.12)',
    borderRadius: 999,
    height: 360,
    left: -160,
    position: 'absolute',
    top: 260,
    width: 360,
  },
  container: {
    gap: publicSpacing.space20,
    marginHorizontal: 'auto' as never,
    maxWidth: 1180,
    padding: publicSpacing.space20,
    width: '100%',
  },
  hero: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 251, 241, 0.96)',
    borderColor: publicColors.gold,
    borderRadius: 38,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space20,
    justifyContent: 'space-between',
    padding: publicSpacing.space32,
  },
  heroCopy: {
    flex: 1,
    gap: publicSpacing.space8,
    minWidth: 260,
  },
  eyebrow: {
    ...publicTypography.label,
    color: publicColors.gold,
    textTransform: 'uppercase',
  },
  title: {
    color: publicColors.ink,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 49,
  },
  subtitle: {
    color: publicColors.slate,
    fontSize: 18,
    lineHeight: 29,
    maxWidth: 780,
  },
  heroAction: {
    backgroundColor: publicColors.deepGreen,
    borderRadius: publicRadii.pill,
    color: publicColors.white,
    fontWeight: '900',
    minHeight: 52,
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space24,
    paddingVertical: publicSpacing.space16,
  },
});
