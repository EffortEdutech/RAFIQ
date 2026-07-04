import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { GuidanceSession, QuranSurahAyah, QuranSurahResponse } from '@rafiq/shared';
import { PrivateWorkspaceShell } from '../../src/components/PrivateWorkspaceShell';
import { createGuidanceSession, getQuranSurah } from '../../src/services/privateContentApi';
import type { SourceDetailTarget } from '../../src/services/privateContentApi';
import { getArabicFontPreference } from '../../src/services/companionPreferences';
import { saveGuidanceSession, saveQuranReadingMemory } from '../../src/services/growthMemory';
import {
  companionColors,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../../src/theme/mobileCompanionDesignSystem';

const READING_INTENTIONS = [
  'Seek guidance',
  'Reflect slowly',
  'Understand meaning',
  'Carry one action',
];

const READING_LAYERS = [
  'Translation',
  'Tafsir',
  'Sunnah',
  'Themes',
  'Sources',
] as const;

type ReadingLayer = (typeof READING_LAYERS)[number];

type AyahGuidanceState = {
  error?: string | null;
  loading: boolean;
  session?: GuidanceSession | null;
  verseKey: string;
};

function sourceDetailHref(target?: SourceDetailTarget | null) {
  if (!target) return '/' as const;
  return {
    pathname: '/source-detail',
    params: { entityType: target.entityType, entityId: target.entityId },
  } as never;
}

function tafsirText(ayah: QuranSurahAyah) {
  const passage = ayah.tafsirPassages[0];
  if (!passage) return 'No tafsir note is available for this ayah yet.';
  if (passage.blankText) return 'No tafsir note is available for this ayah yet.';
  return passage.text;
}

function topicText(ayah: QuranSurahAyah) {
  const theme = ayah.sourceAyahThemes[0]?.themeText;
  if (theme) return theme;
  const topics = ayah.sourceTopics.slice(0, 4).map((topic) => topic.name);
  if (!topics.length) return 'Related themes will appear here when available.';
  return topics.join(' - ');
}

function ayahAction(ayah: QuranSurahAyah) {
  if (ayah.verseKey === '1:1') return 'Begin your next task with Bismillah and presence.';
  if (ayah.verseKey === '1:2') return 'Name one blessing and praise Allah for it.';
  if (ayah.verseKey === '1:5') return 'Ask Allah for help before your next obligation.';
  if (ayah.verseKey === '1:6') return 'Make dua for guidance before choosing your next step.';
  return 'Read this ayah once more, then choose one small act of obedience.';
}

export default function QuranSurahScreen() {
  const { surahNumber } = useLocalSearchParams<{ surahNumber: string }>();
  const [payload, setPayload] = useState<QuranSurahResponse | null>(null);
  const [selectedIntention, setSelectedIntention] = useState(READING_INTENTIONS[0]);
  const [arabicFontFamily, setArabicFontFamily] = useState(getArabicFontPreference);
  const [activeLayers, setActiveLayers] = useState<Record<ReadingLayer, boolean>>({
    Translation: true,
    Tafsir: true,
    Sunnah: true,
    Themes: false,
    Sources: false,
  });
  const [reflectionByAyah, setReflectionByAyah] = useState<Record<string, string>>({});
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [ayahGuidance, setAyahGuidance] = useState<AyahGuidanceState | null>(null);

  useEffect(() => {
    setPayload(null);
    void getQuranSurah(Number(surahNumber ?? 1)).then(setPayload);
    setArabicFontFamily(getArabicFontPreference());
  }, [surahNumber]);

  useFocusEffect(
    useCallback(() => {
      setArabicFontFamily(getArabicFontPreference());
    }, []),
  );

  if (!payload) {
    return (
      <PrivateWorkspaceShell
        eyebrow="Read"
        title="Quran Reading Room"
        subtitle="Preparing the surah for reading."
      >
        <View style={styles.loadingPanel}>
          <ActivityIndicator color={companionColors.gold} />
          <Text style={styles.loadingText}>Opening Quran...</Text>
        </View>
      </PrivateWorkspaceShell>
    );
  }

  const surahTitle = `Surah ${payload.surah.surahNumber}: ${payload.surah.nameTransliteration}`;
  const firstAyah = payload.ayahs[0];

  function toggleLayer(layer: ReadingLayer) {
    setActiveLayers((current) => ({ ...current, [layer]: !current[layer] }));
  }

  function openAyahGuidance(ayah: QuranSurahAyah) {
    setAyahGuidance({ loading: true, verseKey: ayah.verseKey });
    void createGuidanceSession({
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
        setAyahGuidance({
          loading: false,
          session: response.session,
          verseKey: ayah.verseKey,
        });
      })
      .catch(() => {
        setAyahGuidance({
          error: 'Guidance could not open for this ayah. Try again in a moment.',
          loading: false,
          verseKey: ayah.verseKey,
        });
      });
  }

  return (
    <PrivateWorkspaceShell
      action={{ href: '/answer', label: 'Ask' }}
      eyebrow="Read"
      title={surahTitle}
      subtitle="Arabic first. Meaning and guidance stay close."
    >
      <View style={[styles.surahHero, companionShadow.soft]}>
        <Text style={[styles.arabicSurah, { fontFamily: arabicFontFamily }]}>{payload.surah.nameArabic}</Text>
        <Text style={styles.surahName}>{payload.surah.nameTransliteration}</Text>
        <Text style={styles.surahMeta}>{payload.surah.ayahCount} ayahs - {selectedIntention}</Text>
      </View>

      <View style={styles.intentionRow}>
        {READING_INTENTIONS.map((intention) => {
          const active = selectedIntention === intention;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={intention}
              onPress={() => setSelectedIntention(intention)}
              style={[styles.intentionChip, active ? styles.intentionChipActive : null]}
            >
              <Text style={[styles.intentionText, active ? styles.intentionTextActive : null]}>
                {intention}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.layerRow}>
        {READING_LAYERS.map((layer) => {
          const active = activeLayers[layer];
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={layer}
              onPress={() => toggleLayer(layer)}
              style={[styles.layerChip, active ? styles.layerChipActive : null]}
            >
              <Text style={[styles.layerChipText, active ? styles.layerChipTextActive : null]}>
                {layer}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {firstAyah ? (
        <View style={styles.startPanel}>
          <Text style={styles.panelKicker}>Start Here</Text>
          <Text style={[styles.startArabic, { fontFamily: arabicFontFamily }]}>{firstAyah.quranText}</Text>
          <Text style={styles.startReference}>{firstAyah.verseKey}</Text>
        </View>
      ) : null}

      <View style={styles.ayahStack}>
        {payload.ayahs.map((ayah) => {
          const reflection = reflectionByAyah[ayah.verseKey] ?? '';
          const completed = completedActions[ayah.verseKey] ?? false;

          return (
            <View key={ayah.verseKey} style={[styles.ayahCard, companionShadow.soft]}>
              <View style={styles.ayahHeader}>
                <Text style={styles.verseKey}>{ayah.verseKey}</Text>
                <Text style={styles.readerLabel}>Quran</Text>
              </View>

              <Text style={[styles.arabicText, { fontFamily: arabicFontFamily }]}>{ayah.quranText}</Text>

              {activeLayers.Translation ? (
                <View style={styles.translationLayer}>
                  <Text style={styles.layerKicker}>Translation</Text>
                  <Text style={styles.translationText}>
                    {ayah.translation?.text ?? 'No translation is available for this ayah yet.'}
                  </Text>
                </View>
              ) : null}

              {activeLayers.Tafsir ? (
                <View style={styles.tafsirLayer}>
                  <Text style={styles.layerKicker}>Tafsir</Text>
                  <Text style={styles.layerText}>{tafsirText(ayah)}</Text>
                </View>
              ) : null}

              {activeLayers.Sunnah ? (
                <View style={styles.sunnahLayer}>
                  <Text style={styles.layerKicker}>Sunnah Support</Text>
                  <Text style={styles.layerText}>
                    Carry the ayah into adab, worship, and one lived practice.
                  </Text>
                <Link href={`/sources?q=${encodeURIComponent(ayah.verseKey)}&domain=hadith` as never} style={styles.inlineLink}>
                  Study Sunnah
                </Link>
                </View>
              ) : null}

              {activeLayers.Themes ? (
                <View style={styles.themeLayer}>
                  <Text style={styles.layerKicker}>Theme</Text>
                  <Text style={styles.layerText}>{topicText(ayah)}</Text>
                </View>
              ) : null}

              <View style={styles.reflectionPanel}>
                <Text style={styles.layerKicker}>Reflect Once</Text>
                <Text style={styles.prompt}>What is this ayah asking me to notice or practice?</Text>
                <TextInput
                  accessibilityLabel={`Reflection for ${ayah.verseKey}`}
                  multiline
                  onChangeText={(value) => {
                    setReflectionByAyah((current) => ({ ...current, [ayah.verseKey]: value }));
                    saveQuranReadingMemory({
                      verseKey: ayah.verseKey,
                      surahNumber: ayah.surahNumber,
                      actionLabel: ayahAction(ayah),
                      actionCompleted: completed,
                      reflectionText: value,
                      simpleMeaning: ayah.translation?.text ?? null,
                    });
                  }}
                  placeholder="Write one sentence..."
                  placeholderTextColor={companionColors.muted}
                  style={styles.reflectionInput}
                  value={reflection}
                />
              </View>

              <View style={styles.actionDock}>
                <View style={styles.actionCopy}>
                  <Text style={styles.layerKicker}>One Action</Text>
                  <Text style={styles.actionText}>{ayahAction(ayah)}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: completed }}
                  onPress={() => {
                    setCompletedActions((current) => ({ ...current, [ayah.verseKey]: !completed }));
                    saveQuranReadingMemory({
                      verseKey: ayah.verseKey,
                      surahNumber: ayah.surahNumber,
                      actionLabel: ayahAction(ayah),
                      actionCompleted: !completed,
                      reflectionText: reflection,
                      simpleMeaning: ayah.translation?.text ?? null,
                    });
                  }}
                  style={[styles.actionButton, completed ? styles.actionButtonDone : null]}
                >
                  <Text style={styles.actionButtonText}>{completed ? 'Done' : 'Mark done'}</Text>
                </Pressable>
              </View>

              <View style={styles.nextRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => openAyahGuidance(ayah)}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>Open guidance</Text>
                </Pressable>
                <Link href={`/quran/${ayah.surahNumber}/${ayah.ayahNumber}` as never} style={styles.secondaryLink}>
                  Study ayah
                </Link>
              </View>

              {ayahGuidance?.verseKey === ayah.verseKey ? (
                <View style={styles.guidanceSessionLayer}>
                  <Text style={styles.layerKicker}>Guidance From This Ayah</Text>
                  {ayahGuidance.loading ? (
                    <View style={styles.guidanceLoading}>
                      <ActivityIndicator color={companionColors.gold} />
                      <Text style={styles.guidanceLoadingText}>Opening ayah guidance...</Text>
                    </View>
                  ) : null}
                  {ayahGuidance.error ? (
                    <Text style={styles.layerText}>{ayahGuidance.error}</Text>
                  ) : null}
                  {ayahGuidance.session ? (
                    <>
                      <Text style={styles.layerText}>
                        {ayahGuidance.session.guidance.message}
                      </Text>
                      <Text style={styles.prompt}>
                        {ayahGuidance.session.guidance.reflectionPrompt}
                      </Text>
                      <Text style={styles.sessionActionText}>
                        {ayahGuidance.session.guidance.action.label}
                      </Text>
                    </>
                  ) : null}
                </View>
              ) : null}

              {activeLayers.Sources ? (
                <View style={styles.sourcesLayer}>
                  <Text style={styles.layerKicker}>Sources</Text>
                  <View style={styles.sourcesRow}>
                    <Link href={sourceDetailHref(ayah.quranTextSourceDetailTarget ?? ayah.sourceDetailTarget)} style={styles.sourceLink}>
                      Quran text
                    </Link>
                    <Link href={sourceDetailHref(ayah.translation?.sourceDetailTarget)} style={styles.sourceLink}>
                      Translation
                    </Link>
                    {ayah.tafsirPassages.slice(0, 1).map((passage) => (
                      <Link key={passage.passageId} href={sourceDetailHref(passage.sourceDetailTarget)} style={styles.sourceLink}>
                        Tafsir
                      </Link>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
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
  surahHero: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  arabicSurah: {
    ...companionTypography.quranArabic,
    color: companionColors.ink,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 42,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  surahName: {
    color: companionColors.gold,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  surahMeta: {
    color: companionColors.inkSoft,
    fontWeight: '700',
  },
  intentionRow: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.xxs,
    padding: companionSpacing.xxs,
  },
  intentionChip: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: companionRadii.sm,
    flex: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: companionSpacing.xs,
    paddingVertical: companionSpacing.xs,
  },
  intentionChipActive: {
    backgroundColor: companionColors.paper,
  },
  intentionText: {
    color: companionColors.mint,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  intentionTextActive: {
    color: companionColors.ink,
    fontWeight: '800',
  },
  layerRow: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.xs,
    padding: companionSpacing.xs,
  },
  layerChip: {
    backgroundColor: companionColors.pearl,
    borderRadius: companionRadii.sm,
    minHeight: 30,
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.xxs,
  },
  layerChipActive: {
    backgroundColor: companionColors.night,
  },
  layerChipText: {
    color: companionColors.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  layerChipTextActive: {
    color: companionColors.white,
  },
  startPanel: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  panelKicker: {
    ...companionTypography.label,
    color: companionColors.goldSoft,
    textTransform: 'uppercase',
  },
  startArabic: {
    ...companionTypography.quranArabic,
    color: companionColors.white,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 44,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  startReference: {
    color: companionColors.goldSoft,
    fontWeight: '800',
  },
  ayahStack: {
    gap: companionSpacing.md,
  },
  ayahCard: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.md,
    padding: companionSpacing.md,
  },
  ayahHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verseKey: {
    color: companionColors.gold,
    fontWeight: '800',
  },
  readerLabel: {
    backgroundColor: companionColors.mist,
    borderRadius: companionRadii.sm,
    color: companionColors.ink,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.xs,
    textTransform: 'uppercase',
  },
  arabicText: {
    ...companionTypography.quranArabic,
    color: companionColors.ink,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 48,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  translationLayer: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  tafsirLayer: {
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  sunnahLayer: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  themeLayer: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  layerKicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  translationText: {
    ...companionTypography.body,
    color: companionColors.ink,
  },
  layerText: {
    ...companionTypography.body,
    color: companionColors.ink,
  },
  inlineLink: {
    alignSelf: 'flex-start',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    color: companionColors.white,
    fontWeight: '800',
    minHeight: 36,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
    textAlign: 'center',
  },
  reflectionPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  prompt: {
    color: companionColors.ink,
    fontWeight: '700',
    lineHeight: 22,
  },
  reflectionInput: {
    backgroundColor: companionColors.white,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    color: companionColors.ink,
    fontSize: 14,
    minHeight: 80,
    padding: companionSpacing.md,
    textAlignVertical: 'top',
  },
  actionDock: {
    alignItems: 'center',
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.md,
    padding: companionSpacing.md,
  },
  actionCopy: {
    flex: 1,
    gap: companionSpacing.xs,
  },
  actionText: {
    color: companionColors.ink,
    fontWeight: '700',
    lineHeight: 23,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    justifyContent: 'center',
    minHeight: 38,
    minWidth: 90,
    paddingHorizontal: companionSpacing.md,
  },
  actionButtonDone: {
    backgroundColor: companionColors.inkSoft,
  },
  actionButtonText: {
    color: companionColors.white,
    fontWeight: '800',
  },
  nextRow: {
    flexDirection: 'row',
    gap: companionSpacing.sm,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
  },
  primaryButtonText: {
    color: companionColors.white,
    fontWeight: '800',
    textAlign: 'center',
  },
  primaryLink: {
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    color: companionColors.white,
    flex: 1,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingVertical: companionSpacing.md,
    textAlign: 'center',
  },
  secondaryLink: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    color: companionColors.mint,
    flex: 1,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingVertical: companionSpacing.md,
    textAlign: 'center',
  },
  guidanceSessionLayer: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.gold,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  guidanceLoading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: companionSpacing.sm,
  },
  guidanceLoadingText: {
    color: companionColors.ink,
    flex: 1,
    fontWeight: '700',
  },
  sessionActionText: {
    backgroundColor: companionColors.paperWarm,
    borderRadius: companionRadii.sm,
    color: companionColors.ink,
    fontWeight: '700',
    lineHeight: 22,
    overflow: 'hidden',
    padding: companionSpacing.md,
  },
  sourcesLayer: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  sourcesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.xs,
  },
  sourceLink: {
    backgroundColor: companionColors.paper,
    borderRadius: companionRadii.sm,
    color: companionColors.ink,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.xs,
  },
});
