import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  companionColors,
  companionLayout,
  companionRadii,
  companionSpacing,
} from '../theme/mobileCompanionDesignSystem';

const NAV_ITEMS = [
  { href: '/', label: 'Today', match: (path: string) => path === '/' },
  { href: '/answer', label: 'Ask', match: (path: string) => path.startsWith('/answer') },
  { href: '/quran/1', label: 'Read', match: (path: string) => path.startsWith('/quran') },
  { href: '/search', label: 'Learn', match: (path: string) => path.startsWith('/search') || path.startsWith('/hadith') || path.startsWith('/sources') },
  { href: '/profile', label: 'Growth', match: (path: string) => path.startsWith('/profile') },
];

export function BottomDeviceNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={item.href}
              onPress={() => router.push(item.href as never)}
              style={[styles.item, active ? styles.itemActive : null]}
            >
              <Text style={[styles.label, active ? styles.labelActive : null]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: companionColors.night,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderTopWidth: 1,
    paddingBottom: companionSpacing.xxs,
    paddingHorizontal: companionSpacing.sm,
    paddingTop: companionSpacing.xxs,
  },
  nav: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    flexDirection: 'row',
    gap: companionSpacing.xxs,
    minHeight: companionLayout.bottomNavHeight - 2,
    padding: 0,
  },
  item: {
    alignItems: 'center',
    borderRadius: companionRadii.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: companionLayout.minTouch - 2,
    overflow: 'hidden',
    paddingVertical: companionSpacing.xxs,
  },
  itemActive: {
    backgroundColor: companionColors.nightSoft,
  },
  label: {
    color: companionColors.mint,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
    textAlign: 'center',
  },
  labelActive: {
    color: companionColors.goldSoft,
    fontWeight: '800',
  },
});
