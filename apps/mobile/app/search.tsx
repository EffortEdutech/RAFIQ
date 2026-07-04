import type { GuidanceSession } from '@rafiq/shared';
import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { GuidanceDeepLinks } from '../src/components/GuidanceDeepLinks';
import { PrivateWorkspaceShell } from '../src/components/PrivateWorkspaceShell';
import { getArabicFontPreference } from '../src/services/companionPreferences';
import {
  saveGuidanceSession,
  updateGrowthAction,
  updateGrowthReflection,
} from '../src/services/growthMemory';
import { createGuidanceSession } from '../src/services/privateContentApi';
import {
  companionColors,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../src/theme/mobileCompanionDesignSystem';

const THEME_STARTERS = [
  { query: 'I need patience with my family', title: 'Family patience' },
  { query: 'I want to improve my prayer', title: 'Prayer focus' },
  { query: 'I want sincerity in my actions', title: 'Intention' },
  { query: 'I want to respond with mercy', title: 'Mercy' },
];

function evidenceText(session: GuidanceSession) {
  if (session.status === 'blocked_no_evidence') return 'This need needs stronger evidence before learning can continue.';
  const quran = session.verification.quranEvidenceCount;
  const sunnah = session.verification.sunnahEvidenceCount;
  return sunnah ? `${quran} Quran layer(s), ${sunnah} Sunnah support` : `${quran} Quran layer(s)`;
}

export default function LearnScreen() {
  const [theme, setTheme] = useState(THEME_STARTERS[0].query);
  const [submittedTheme, setSubmittedTheme] = useState(THEME_STARTERS[0].query);
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
    setSession(null);
    setReflection('');
    setActionDone(false);
    setArabicFontFamily(getArabicFontPreference());

    createGuidanceSession({
      entryPoint: 'learn_theme',
      input: submittedTheme,
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
        if (mounted) setError('This knowledge path could not open. Try again in a moment.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [submittedTheme]);

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

  function submitTheme(nextTheme = theme) {
    const clean = nextTheme.trim() || THEME_STARTERS[0].query;
    setTheme(clean);
    setSubmittedTheme(clean);
  }

  return (
    <PrivateWorkspaceShell
      action={{ href: '/sources', label: 'Sources' }}
      eyebrow="Learn"
      title="Guided discovery"
      subtitle="Start with a need. RAFIQ opens one path."
    >
      <View style={[styles.themePanel, companionShadow.soft]}>
        <Text style={styles.panelKicker}>What do you need guidance for?</Text>
        <TextInput
          accessibilityLabel="Guided discovery need"
          onChangeText={setTheme}
          onSubmitEditing={() => submitTheme()}
          placeholder="Example: I need patience with my family"
          placeholderTextColor={companionColors.muted}
          style={styles.input}
          value={theme}
        />
        <Pressable accessibilityRole="button" onPress={() => submitTheme()} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Open guidance</Text>
        </Pressable>
      </View>

      <View style={styles.starterRow}>
        {THEME_STARTERS.map((starter) => {
          const active = submittedTheme === starter.query;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={starter.query}
              onPress={() => submitTheme(starter.query)}
              style={[styles.starterChip, active ? styles.starterChipActive : null]}
            >
              <Text style={[styles.starterText, active ? styles.starterTextActive : null]}>{starter.title}</Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.loadingPanel}>
          <ActivityIndicator color={companionColors.gold} />
          <Text style={styles.loadingText}>Opening knowledge path...</Text>
        </View>
      ) : null}

      {!loading && error ? (
        <View style={styles.blockedPanel}>
          <Text style={styles.panelKicker}>Path unavailable</Text>
          <Text style={styles.blockedText}>{error}</Text>
        </View>
      ) : null}

      {!loading && session ? (
        <>
          <View style={[styles.pathPanel, companionShadow.soft]}>
            <Text style={styles.panelKicker}>RAFIQ Path</Text>
            <Text style={styles.pathTitle}>{session.need.detectedTheme}</Text>
            <Text style={styles.pathBody}>
              {session.quranAnchor
                ? `Begin with ${session.quranAnchor.verseKey}. Understand it, connect practice, then carry one action.`
                : 'This path is paused until RAFIQ can anchor it in verified Quran evidence.'}
            </Text>
          </View>

          {session.learningPath ? (
            <View style={styles.learningRail}>
              <View style={styles.learningRailHeader}>
                <Text style={styles.panelKicker}>Guided Steps</Text>
                <Text style={styles.learningRailTitle}>{session.learningPath.title}</Text>
              </View>
              <Text style={styles.learningRailSummary}>{session.learningPath.summary}</Text>
              {session.learningPath.steps.map((step, index) => (
                <View
                  key={step.stepId}
                  style={[styles.learningStep, !step.available ? styles.learningStepMuted : null]}
                >
                  <View style={styles.stepNumberBox}>
                    <Text style={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</Text>
                  </View>
                  <View style={styles.stepCopy}>
                    <View style={styles.stepMeta}>
                      <Text style={styles.stepLabel}>{step.label}</Text>
                      {step.reference ? <Text style={styles.stepReference}>{step.reference}</Text> : null}
                    </View>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepBody}>{step.body}</Text>
                    {step.route && step.available ? (
                      <Link href={step.route as never} style={styles.stepLink}>
                        Open
                      </Link>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          <View style={[styles.quranPanel, companionShadow.soft]}>
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
                {tafsirSummary ? <Text style={styles.tafsir}>{tafsirSummary}</Text> : null}
                <GuidanceDeepLinks
                  links={session.quranAnchor.deepLinks}
                  suggestions={session.quranAnchor.researchSuggestions}
                  title="Open study"
                />
                <Link href={quranHref as never} style={styles.goldLink}>
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
                Open Sunnah practice
              </Link>
            </View>
          ) : null}

          <View style={styles.guidanceLayer}>
            <Text style={styles.layerKicker}>Guidance</Text>
            <Text style={styles.layerText}>
              {session.quranAnchor
                ? 'This path is for practice: Quran first, meaning next, Sunnah with caution, then one action.'
                : 'Ask with one clearer life situation so RAFIQ can open a stronger path.'}
            </Text>
            <Text style={styles.verificationText}>{evidenceText(session)}</Text>
            <GuidanceDeepLinks suggestions={session.researchSuggestions} title="Research this path" />
          </View>

          <View style={styles.reflectionPanel}>
            <Text style={styles.layerKicker}>Reflect Once</Text>
            <Text style={styles.prompt}>{session.guidance.reflectionPrompt}</Text>
            <TextInput
              accessibilityLabel="Knowledge path reflection"
              multiline
              onChangeText={setReflection}
              placeholder="Write one honest sentence..."
              placeholderTextColor={companionColors.muted}
              style={styles.reflectionInput}
              value={reflection}
            />
          </View>

          <View style={styles.actionDock}>
            <View style={styles.actionCopy}>
              <Text style={styles.layerKicker}>One Action</Text>
              <Text style={styles.actionText}>{session.guidance.action.label}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: actionDone }}
              onPress={() => setActionDone((value) => !value)}
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
    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  themePanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.md,
    padding: companionSpacing.md,
  },
  panelKicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    color: companionColors.ink,
    fontSize: 15,
    minHeight: 38,
    padding: companionSpacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    justifyContent: 'center',
    minHeight: 38,
  },
  primaryButtonText: {
    color: companionColors.white,
    fontWeight: '800',
  },
  starterRow: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.xxs,
    padding: companionSpacing.xxs,
  },
  starterChip: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: companionRadii.sm,
    flex: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: companionSpacing.xs,
    paddingVertical: companionSpacing.xs,
  },
  starterChipActive: {
    backgroundColor: companionColors.paper,
  },
  starterText: {
    color: companionColors.mint,
    fontSize: 12,
    fontWeight: '700',
  },
  starterTextActive: {
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
    flex: 1,
    fontWeight: '700',
  },
  blockedPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  blockedText: {
    ...companionTypography.body,
    color: companionColors.ink,
    fontWeight: '800',
  },
  pathPanel: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  pathTitle: {
    color: companionColors.white,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    textTransform: 'capitalize',
  },
  pathBody: {
    ...companionTypography.body,
    color: companionColors.mint,
  },
  learningRail: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  learningRailHeader: {
    gap: companionSpacing.xxs,
  },
  learningRailTitle: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  learningRailSummary: {
    color: companionColors.inkSoft,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  learningStep: {
    borderColor: companionColors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.sm,
    paddingTop: companionSpacing.sm,
  },
  learningStepMuted: {
    opacity: 0.58,
  },
  stepNumberBox: {
    alignItems: 'center',
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 34,
  },
  stepNumber: {
    color: companionColors.gold,
    fontSize: 11,
    fontWeight: '900',
  },
  stepCopy: {
    flex: 1,
    gap: companionSpacing.xxs,
    minWidth: 0,
  },
  stepMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.xs,
  },
  stepLabel: {
    color: companionColors.gold,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  stepReference: {
    color: companionColors.inkSoft,
    fontSize: 12,
    fontWeight: '800',
  },
  stepTitle: {
    color: companionColors.ink,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
  },
  stepBody: {
    color: companionColors.inkSoft,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  stepLink: {
    alignSelf: 'flex-start',
    color: companionColors.night,
    fontSize: 13,
    fontWeight: '900',
    paddingVertical: companionSpacing.xxs,
  },
  quranPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.md,
    padding: companionSpacing.md,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.sm,
    justifyContent: 'space-between',
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
  goldLink: {
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
    alignSelf: 'flex-start',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    color: companionColors.white,
    fontWeight: '800',
    marginTop: companionSpacing.xs,
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
    textAlign: 'center',
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
    color: companionColors.mint,
    flex: 1,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingVertical: companionSpacing.md,
    textAlign: 'center',
  },
});
