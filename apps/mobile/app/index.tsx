import type { GuidanceSession } from '@rafiq/shared';
import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CompanionDeviceShell } from '../src/components/CompanionDeviceShell';
import { GuidanceDeepLinks } from '../src/components/GuidanceDeepLinks';
import { createGuidanceSession } from '../src/services/privateContentApi';
import { getArabicFontPreference } from '../src/services/companionPreferences';
import {
  getGrowthSession,
  saveGuidanceSession,
  updateGrowthAction,
  updateGrowthReflection,
} from '../src/services/growthMemory';
import {
  companionColors,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../src/theme/mobileCompanionDesignSystem';

const TODAY_NEEDS = [
  { key: 'mercy', label: 'Mercy', input: 'mercy' },
  { key: 'guidance', label: 'Guidance', input: 'guidance' },
  { key: 'patience', label: 'Patience', input: 'patience' },
  { key: 'gratitude', label: 'Gratitude', input: 'gratitude' },
];

function evidenceLabel(session: GuidanceSession) {
  if (session.status === 'blocked_no_evidence') return 'Needs stronger evidence';
  const quran = session.verification.quranEvidenceCount;
  const sunnah = session.verification.sunnahEvidenceCount;
  if (sunnah) return `${quran} Quran layer(s), ${sunnah} Sunnah support`;
  return `${quran} Quran layer(s)`;
}

export default function TodayScreen() {
  const [activeNeed, setActiveNeed] = useState(TODAY_NEEDS[0]);
  const [session, setSession] = useState<GuidanceSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');
  const [actionDone, setActionDone] = useState(false);
  const [arabicFontFamily, setArabicFontFamily] = useState(getArabicFontPreference);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setReflection('');
    setActionDone(false);
    setArabicFontFamily(getArabicFontPreference());

    createGuidanceSession({
      entryPoint: 'today',
      input: activeNeed.input,
      language: 'en',
      domain: 'all',
    })
      .then((payload) => {
        if (!mounted) return;
        setSession(payload.session);
        if (payload.session) {
          const saved = saveGuidanceSession(payload.session);
          setReflection(saved.reflectionText);
          setActionDone(saved.actionCompleted);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setError('Today could not open a guidance session. Try again in a moment.');
        setSession(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeNeed]);

  useEffect(() => {
    if (!session) return;
    updateGrowthReflection(session.sessionId, reflection);
  }, [reflection, session]);

  useEffect(() => {
    if (!session) return;
    updateGrowthAction(session.sessionId, actionDone);
  }, [actionDone, session]);

  const quranHref = useMemo(() => {
    if (!session?.quranAnchor) return '/quran/1';
    return `/quran/${session.quranAnchor.surahNumber}`;
  }, [session]);
  const tafsirSummary =
    session?.quranAnchor?.tafsirSummary &&
    session.quranAnchor.tafsirSummary !== session.quranAnchor.simpleMeaning
      ? session.quranAnchor.tafsirSummary
      : null;
  const todayGuidanceText = session?.quranAnchor
    ? 'Read the ayah once more, then carry its meaning into the reflection and action below.'
    : session?.guidance.message;

  return (
    <CompanionDeviceShell action={{ href: '/answer', label: 'Ask' }}>
      <View style={styles.todayHeader}>
        <Text style={styles.kicker}>Today</Text>
        <Text style={styles.title}>Begin with guidance</Text>
        <Text style={styles.subtitle}>Quran, meaning, reflection, one action.</Text>
      </View>

      <View style={styles.needRow}>
        {TODAY_NEEDS.map((need) => {
          const active = need.key === activeNeed.key;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={need.key}
              onPress={() => setActiveNeed(need)}
              style={[styles.needChip, active ? styles.needChipActive : null]}
            >
              <Text style={[styles.needLabel, active ? styles.needLabelActive : null]}>{need.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.loadingPanel}>
          <ActivityIndicator color={companionColors.gold} />
          <Text style={styles.loadingText}>Opening today's session...</Text>
        </View>
      ) : null}

      {!loading && error ? (
        <View style={styles.blockedPanel}>
          <Text style={styles.panelKicker}>Session unavailable</Text>
          <Text style={styles.blockedText}>{error}</Text>
        </View>
      ) : null}

      {!loading && session ? (
        <>
          <View style={[styles.sessionPanel, companionShadow.soft]}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelKicker}>
                {session.quranAnchor ? 'Quran Anchor' : 'Evidence Gate'}
              </Text>
              <Text style={styles.reference}>
                {session.quranAnchor?.verseKey ?? session.status.replaceAll('_', ' ')}
              </Text>
            </View>

            {session.quranAnchor ? (
              <>
                <Text style={[styles.arabicText, { fontFamily: arabicFontFamily }]}>
                  {session.quranAnchor.arabicText}
                </Text>
                <Text style={styles.meaning}>{session.quranAnchor.simpleMeaning}</Text>
                {tafsirSummary ? (
                  <Text style={styles.tafsir}>{tafsirSummary}</Text>
                ) : null}
                <GuidanceDeepLinks
                  links={session.quranAnchor.deepLinks}
                  suggestions={session.quranAnchor.researchSuggestions}
                  title="Open study"
                />
                <Link href={quranHref as never} style={styles.goldButton}>
                  Read Quran
                </Link>
              </>
            ) : (
              <Text style={styles.blockedText}>{session.guidance.message}</Text>
            )}
          </View>

          {session.sunnahSupport.length ? (
            <View style={styles.sunnahLayer}>
              <Text style={styles.layerKicker}>Sunnah Support</Text>
              <Text style={styles.layerText}>{session.sunnahSupport[0].practiceConnection}</Text>
              <Text style={styles.verificationText}>{session.sunnahSupport[0].verificationSummary}</Text>
              <GuidanceDeepLinks
                links={session.sunnahSupport[0].deepLinks}
                suggestions={session.sunnahSupport[0].researchSuggestions}
                title="Open Sunnah study"
              />
              <Link href="/hadith" style={styles.inlineLink}>
                Study Sunnah
              </Link>
            </View>
          ) : null}

          <View style={styles.guidanceLayer}>
            <Text style={styles.layerKicker}>Guidance</Text>
            <Text style={styles.layerText}>{todayGuidanceText}</Text>
            <Text style={styles.verificationText}>{evidenceLabel(session)}</Text>
            <GuidanceDeepLinks suggestions={session.researchSuggestions} title="Research this path" />
          </View>

          <View style={styles.reflectionPanel}>
            <Text style={styles.layerKicker}>Reflect Once</Text>
            <Text style={styles.prompt}>{session.guidance.reflectionPrompt}</Text>
            <TextInput
              accessibilityLabel="Today reflection"
              multiline
              onChangeText={setReflection}
              placeholder="Write one honest sentence..."
              placeholderTextColor={companionColors.muted}
              style={styles.reflectionInput}
              value={reflection}
            />
            {reflection.length ? <Text style={styles.savedHint}>Saved in today's draft.</Text> : null}
          </View>

          <View style={styles.actionDock}>
            <View style={styles.actionCopy}>
              <Text style={styles.layerKicker}>One Action</Text>
              <Text style={styles.actionText}>{session.guidance.action.label}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: actionDone }}
              onPress={() => {
                if (session) {
                  const saved = getGrowthSession(session.sessionId);
                  setActionDone(!(saved?.actionCompleted ?? actionDone));
                } else {
                  setActionDone((value) => !value);
                }
              }}
              style={[styles.actionButton, actionDone ? styles.actionButtonDone : null]}
            >
              <Text style={styles.actionButtonText}>{actionDone ? 'Done' : 'Mark done'}</Text>
            </Pressable>
          </View>

          <View style={styles.nextPanel}>
            <Text style={styles.nextTitle}>{session.guidance.nextStep.label}</Text>
            <Text style={styles.nextText}>{session.guidance.nextStep.reason}</Text>
            <View style={styles.nextActions}>
              <Link href={session.guidance.nextStep.route as never} style={styles.primaryLink}>
                Continue
              </Link>
              <Link href="/profile" style={styles.secondaryLink}>
                Growth
              </Link>
            </View>
          </View>
        </>
      ) : null}
    </CompanionDeviceShell>
  );
}

const styles = StyleSheet.create({
  todayHeader: {
    gap: companionSpacing.xxs,
    paddingTop: companionSpacing.xxs,
  },
  kicker: {
    ...companionTypography.label,
    color: companionColors.goldSoft,
    textTransform: 'uppercase',
  },
  title: {
    ...companionTypography.screenTitle,
    color: companionColors.white,
  },
  subtitle: {
    ...companionTypography.body,
    color: companionColors.mint,
  },
  needRow: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.xxs,
    padding: companionSpacing.xxs,
  },
  needChip: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: companionRadii.sm,
    flex: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: companionSpacing.xs,
    paddingVertical: companionSpacing.xs,
  },
  needChipActive: {
    backgroundColor: companionColors.paper,
  },
  needLabel: {
    color: companionColors.mint,
    fontSize: 12,
    fontWeight: '700',
  },
  needLabelActive: {
    color: companionColors.ink,
    fontWeight: '800',
  },
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
  sessionPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.md,
    padding: companionSpacing.md,
  },
  blockedPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.sm,
    justifyContent: 'space-between',
  },
  panelKicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  reference: {
    color: companionColors.ink,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  arabicText: {
    ...companionTypography.quranArabic,
    color: companionColors.ink,
    fontSize: 25,
    fontWeight: '700',
    lineHeight: 47,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  meaning: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  tafsir: {
    ...companionTypography.body,
    color: companionColors.inkSoft,
  },
  blockedText: {
    ...companionTypography.body,
    color: companionColors.ink,
    fontWeight: '800',
  },
  goldButton: {
    alignSelf: 'flex-start',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    color: companionColors.white,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.lg,
    paddingVertical: companionSpacing.sm,
  },
  sunnahLayer: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  guidanceLayer: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  layerKicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  layerText: {
    ...companionTypography.body,
    color: companionColors.ink,
  },
  verificationText: {
    color: companionColors.inkSoft,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  inlineLink: {
    color: companionColors.night,
    fontWeight: '800',
    marginTop: companionSpacing.xs,
  },
  reflectionPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  prompt: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  reflectionInput: {
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    color: companionColors.ink,
    fontSize: 14,
    minHeight: 86,
    padding: companionSpacing.md,
    textAlignVertical: 'top',
  },
  savedHint: {
    color: companionColors.night,
    fontWeight: '700',
  },
  actionDock: {
    alignItems: 'center',
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.md,
    padding: companionSpacing.md,
  },
  actionCopy: {
    flex: 1,
    gap: companionSpacing.xs,
    minWidth: 0,
  },
  actionText: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    justifyContent: 'center',
    minHeight: 38,
    minWidth: 94,
    paddingHorizontal: companionSpacing.md,
  },
  actionButtonDone: {
    backgroundColor: companionColors.inkSoft,
  },
  actionButtonText: {
    color: companionColors.white,
    fontWeight: '800',
    textAlign: 'center',
  },
  nextPanel: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  nextTitle: {
    color: companionColors.white,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  nextText: {
    ...companionTypography.body,
    color: companionColors.mint,
  },
  nextActions: {
    flexDirection: 'row',
    gap: companionSpacing.sm,
  },
  primaryLink: {
    backgroundColor: companionColors.paper,
    borderRadius: companionRadii.sm,
    color: companionColors.ink,
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
    color: companionColors.ink,
    flex: 1,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingVertical: companionSpacing.md,
    textAlign: 'center',
  },
});
