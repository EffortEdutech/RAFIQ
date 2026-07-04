import type { GuidanceSession, QuranSurahAyah, QuranSurahResponse } from '@rafiq/shared';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { GuidanceDeepLinks } from '../../../src/components/GuidanceDeepLinks';
import { PrivateWorkspaceShell } from '../../../src/components/PrivateWorkspaceShell';
import { getArabicFontPreference } from '../../../src/services/companionPreferences';
import { createGuidanceSession, getQuranSurah, type SourceDetailTarget } from '../../../src/services/privateContentApi';
import { saveGuidanceSession } from '../../../src/services/growthMemory';
import {
  companionColors,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../../../src/theme/mobileCompanionDesignSystem';

function sourceDetailHref(target?: SourceDetailTarget | null) {
  if (!target) return '/sources' as const;
  return {
    pathname: '/source-detail',
    params: { entityType: target.entityType, entityId: target.entityId },
  } as never;
}

function tafsirText(ayah: QuranSurahAyah) {
  const passage = ayah.tafsirPassages.find((item) => !item.blankText);
  return passage?.text ?? 'No tafsir note is available for this ayah yet.';
}

function themesText(ayah: QuranSurahAyah) {
  const themes = ayah.sourceAyahThemes.slice(0, 2).map((theme) => theme.themeText);
  const topics = ayah.sourceTopics.slice(0, 3).map((topic) => topic.name);
  const combined = [...new Set([...themes, ...topics].map((item) => item.trim()).filter(Boolean))];
  return combined.length ? combined.join(' - ') : 'Related themes will appear here when available.';
}

export default function AyahStudyRoom() {
  const params = useLocalSearchParams<{ surahNumber: string; ayahNumber: string }>();
  const surahNumber = Number(params.surahNumber ?? 1);
  const ayahNumber = Number(params.ayahNumber ?? 1);
  const [payload, setPayload] = useState<QuranSurahResponse | null>(null);
  const [session, setSession] = useState<GuidanceSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [arabicFontFamily] = useState(getArabicFontPreference);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setPayload(null);
    getQuranSurah(surahNumber)
      .then((nextPayload) => {
        if (mounted) setPayload(nextPayload);
      })
      .catch(() => {
        if (mounted) setError('This ayah study room could not open.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [surahNumber]);

  const ayah = useMemo(
    () => payload?.ayahs.find((item) => item.ayahNumber === ayahNumber) ?? null,
    [ayahNumber, payload],
  );

  function openGuidance() {
    if (!ayah) return;
    setGuidanceLoading(true);
    createGuidanceSession({
      entryPoint: 'quran_ayah',
      input: ayah.verseKey,
      language: 'en',
      domain: 'all',
      surahNumber: ayah.surahNumber,
      ayahNumber: ayah.ayahNumber,
      verseKey: ayah.verseKey,
    })
      .then((response) => {
        if (response.session) saveGuidanceSession(response.session);
        setSession(response.session);
      })
      .catch(() => setError('Guidance could not open from this ayah yet.'))
      .finally(() => setGuidanceLoading(false));
  }

  if (loading) {
    return (
      <PrivateWorkspaceShell eyebrow="Ayah" title="Opening ayah" subtitle="Preparing Quran study.">
        <View style={styles.loadingPanel}>
          <ActivityIndicator color={companionColors.gold} />
          <Text style={styles.loadingText}>Opening ayah...</Text>
        </View>
      </PrivateWorkspaceShell>
    );
  }

  if (!ayah || error) {
    return (
      <PrivateWorkspaceShell eyebrow="Ayah" title="Ayah unavailable" subtitle="Try another Quran reference.">
        <View style={styles.panel}>
          <Text style={styles.kicker}>Unavailable</Text>
          <Text style={styles.body}>{error ?? 'This ayah was not found in the current Quran payload.'}</Text>
        </View>
      </PrivateWorkspaceShell>
    );
  }

  const tafsir = ayah.tafsirPassages.find((item) => !item.blankText);

  return (
    <PrivateWorkspaceShell
      action={{ href: `/quran/${surahNumber}`, label: 'Surah' }}
      eyebrow="Ayah"
      title={`Study ${ayah.verseKey}`}
      subtitle="Read the ayah, open meaning, then continue into guidance or sources."
    >
      <View style={[styles.ayahPanel, companionShadow.soft]}>
        <Text style={styles.kicker}>Quran</Text>
        <Text style={[styles.arabicText, { fontFamily: arabicFontFamily }]}>{ayah.quranText}</Text>
        <Text style={styles.reference}>{ayah.verseKey}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.kicker}>Meaning</Text>
        <Text style={styles.body}>{ayah.translation?.text ?? 'No translation is available for this ayah yet.'}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.kicker}>Tafsir</Text>
        <Text style={styles.body}>{tafsirText(ayah)}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.kicker}>Themes</Text>
        <Text style={styles.body}>{themesText(ayah)}</Text>
      </View>

      <View style={styles.actionPanel}>
        <Text style={styles.kicker}>Continue Study</Text>
        <View style={styles.linkRow}>
          <Link href={`/sources?q=${encodeURIComponent(ayah.verseKey)}&domain=tafsir` as never} style={styles.primaryLink}>
            Tafsir sources
          </Link>
          <Link href={`/sources?q=${encodeURIComponent(ayah.verseKey)}&domain=hadith` as never} style={styles.secondaryLink}>
            Sunnah support
          </Link>
          <Link href={sourceDetailHref(ayah.quranTextSourceDetailTarget ?? ayah.sourceDetailTarget)} style={styles.secondaryLink}>
            Text source
          </Link>
        </View>
      </View>

      <View style={styles.actionPanel}>
        <Text style={styles.kicker}>Guidance</Text>
        <Pressable accessibilityRole="button" onPress={openGuidance} style={styles.button}>
          <Text style={styles.buttonText}>{guidanceLoading ? 'Opening...' : 'Open guidance from this ayah'}</Text>
        </Pressable>
        {session ? (
          <>
            <Text style={styles.body}>{session.guidance.message}</Text>
            <GuidanceDeepLinks
              links={session.quranAnchor?.deepLinks}
              suggestions={session.researchSuggestions}
              title="Study from guidance"
            />
          </>
        ) : null}
      </View>

      <View style={styles.panel}>
        <Text style={styles.kicker}>Attribution</Text>
        <View style={styles.linkRow}>
          <Link href={sourceDetailHref(ayah.translation?.sourceDetailTarget)} style={styles.secondaryLink}>
            Translation
          </Link>
          {tafsir ? (
            <Link href={sourceDetailHref(tafsir.sourceDetailTarget)} style={styles.secondaryLink}>
              Tafsir
            </Link>
          ) : null}
        </View>
      </View>
    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  loadingPanel: {
    alignItems: 'center',
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  loadingText: {
    color: companionColors.mint,
    fontWeight: '700',
  },
  ayahPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  panel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  actionPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.md,
    padding: companionSpacing.md,
  },
  kicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  arabicText: {
    ...companionTypography.quranArabic,
    color: companionColors.ink,
    fontSize: 27,
    fontWeight: '700',
    lineHeight: 50,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  reference: {
    color: companionColors.gold,
    fontWeight: '900',
  },
  body: {
    ...companionTypography.body,
    color: companionColors.ink,
  },
  linkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.xs,
  },
  primaryLink: {
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    color: companionColors.white,
    fontSize: 12,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.sm,
  },
  secondaryLink: {
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    color: companionColors.ink,
    fontSize: 12,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.sm,
  },
  button: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: companionSpacing.md,
  },
  buttonText: {
    color: companionColors.white,
    fontWeight: '900',
  },
});
