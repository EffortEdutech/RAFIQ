import type { PropsWithChildren } from 'react';
import { Link, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomDeviceNav } from './BottomDeviceNav';
import {
  companionColors,
  companionLayout,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../theme/mobileCompanionDesignSystem';

type Props = PropsWithChildren<{
  action?: {
    href: string;
    label: string;
  };
  eyebrow?: string;
  includeBottomNav?: boolean;
  subtitle?: string;
  title?: string;
}>;

export function CompanionDeviceShell({
  action,
  children,
  eyebrow = 'RAFIQ',
  includeBottomNav = true,
  subtitle,
  title,
}: Props) {
  const pathname = usePathname();
  const showSettingsAction = pathname !== '/settings';

  return (
    <SafeAreaView style={styles.outer}>
      <View style={[styles.device, companionShadow.soft]}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            includeBottomNav ? styles.contentWithNav : null,
          ]}
          style={styles.scroller}
        >
          <View style={styles.statusHeader}>
            <View style={styles.brandLink}>
              <Text style={styles.brand}>RAFIQ</Text>
              <Text style={styles.brandSubline}>Quran-guided companion</Text>
            </View>
            <View style={styles.headerActions}>
              {action ? (
                <Link href={action.href as never} style={styles.headerAction}>
                  {action.label}
                </Link>
              ) : null}
              {showSettingsAction ? (
                <Link href="/settings" style={styles.settingsAction}>
                  ⚙
                </Link>
              ) : null}
            </View>
          </View>

          {title ? (
            <View style={styles.screenIntro}>
              <Text style={styles.eyebrow}>{eyebrow}</Text>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
          ) : null}

          {children}
        </ScrollView>
        {includeBottomNav ? <BottomDeviceNav /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    backgroundColor: companionColors.nightSoft,
    flex: 1,
    justifyContent: 'center',
  },
  device: {
    backgroundColor: companionColors.night,
    flex: 1,
    maxWidth: companionLayout.deviceMaxWidth,
    overflow: 'hidden',
    width: '100%',
  },
  scroller: {
    backgroundColor: companionColors.night,
    flex: 1,
  },
  content: {
    gap: companionSpacing.md,
    padding: companionLayout.contentPadding,
  },
  contentWithNav: {
    paddingBottom: companionLayout.bottomNavHeight + companionSpacing.lg,
  },
  statusHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: companionSpacing.sm,
    justifyContent: 'space-between',
    minHeight: 42,
  },
  brandLink: {
    minHeight: 34,
  },
  brand: {
    ...companionTypography.brand,
    color: companionColors.goldSoft,
  },
  brandSubline: {
    color: companionColors.mint,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 13,
    textTransform: 'uppercase',
  },
  headerAction: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    color: companionColors.mint,
    fontWeight: '800',
    minHeight: companionLayout.minTouch,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.xs,
    paddingVertical: companionSpacing.xs,
    textAlign: 'center',
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: companionSpacing.xs,
  },
  settingsAction: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    color: companionColors.mint,
    fontSize: 17,
    fontWeight: '700',
    minHeight: companionLayout.minTouch,
    minWidth: companionLayout.minTouch,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.xs,
    paddingVertical: companionSpacing.xs,
    textAlign: 'center',
  },
  screenIntro: {
    borderBottomColor: 'rgba(255,255,255,0.12)',
    borderBottomWidth: 1,
    gap: companionSpacing.xxs,
    paddingBottom: companionSpacing.sm,
  },
  eyebrow: {
    ...companionTypography.label,
    color: companionColors.goldSoft,
    textTransform: 'uppercase',
  },
  title: {
    color: companionColors.white,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  subtitle: {
    color: companionColors.mint,
    fontSize: 13,
    lineHeight: 19,
  },
});
