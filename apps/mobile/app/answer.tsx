import type { GuidanceSession } from '@rafiq/shared';
import { Link, useLocalSearchParams } from 'expo-router';
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

const STARTERS = [
  'mercy',
  'guidance',
  'patience before a difficult conversation',
  'gratitude',
];

function evidenceText(session: GuidanceSession) {
  if (session.status === 'blocked_no_evidence') return 'No verified evidence was retrieved for this wording.';
  const quran = session.verification.quranEvidenceCount;
  const sunnah = session.verification.sunnahEvidenceCount;
  return sunnah ? `${quran} Quran layer(s), ${sunnah} Sunnah support` : `${quran} Quran layer(s)`;
}

export default function AskScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const initialQuestion = params.q ? String(params.q) : STARTERS[0];
  const [question, setQuestion] = useState(initialQuestion);
  const [submittedQuestion, setSubmittedQuestion] = useState(initialQuestion);
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
      entryPoint: 'ask',
      input: submittedQuestion,
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
        if (mounted) setError('RAFIQ could not open this guidance session. Try again in a moment.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [submittedQuestion]);

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

  function submitQuestion() {
    const next = question.trim();
    if (!next) return;
    setSubmittedQuestion(next);
  }

  return (
    <PrivateWorkspaceShell
      action={{ href: '/', label: 'Today' }}
      eyebrow="Ask"
      subtitle="Ask in your own words. RAFIQ opens guidance only with evidence."
      title="Ask for guidance"
    >
      <View style={[styles.askPanel, companionShadow.soft]}>
        <Text style={styles.panelKicker}>Your Question</Text>
        <TextInput
          accessibilityLabel="Ask RAFIQ"
          multiline
          onChangeText={setQuestion}
          placeholder="What is your heart carrying?"
          placeholderTextColor={companionColors.muted}
          style={styles.askInput}
          value={question}
        />
        <View style={styles.starterStack}>
          {STARTERS.map((starter) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: question === starter }}
              key={starter}
              onPress={() => setQuestion(starter)}
              style={[styles.starterChip, question === starter ? styles.starterChipActive : null]}
            >
              <Text style={[styles.starterText, question === starter ? styles.starterTextActive : null]}>
                {starter}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable accessibilityRole="button" onPress={submitQuestion} style={styles.guideButton}>
          <Text style={styles.guideButtonText}>Open guidance</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingPanel}>
          <ActivityIndicator color={companionColors.gold} />
          <Text style={styles.loadingText}>Finding Quran-centered guidance...</Text>
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
          <View style={[styles.questionPanel, companionShadow.soft]}>
            <Text style={styles.panelKicker}>Question</Text>
            <Text style={styles.questionText}>{session.need.rawInput}</Text>
          </View>

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

          {session.riskAssessment.escalationRoute !== 'none' ? (
            <View style={styles.blockedPanel}>
              <Text style={styles.panelKicker}>
                {session.riskAssessment.escalationRoute === 'scholar' ? 'Scholar Boundary' : 'Care Boundary'}
              </Text>
              <Text style={styles.blockedText}>{session.riskAssessment.userBoundary}</Text>
              <Text style={styles.verificationText}>{session.guidance.action.label}</Text>
            </View>
          ) : null}

          <View style={styles.guidanceLayer}>
            <Text style={styles.layerKicker}>Guidance</Text>
            <Text style={styles.layerText}>
              {session.quranAnchor
                ? 'Begin from the ayah, then carry its meaning into the reflection and action below.'
                : 'This question is paused until RAFIQ can anchor it in verified Quran evidence.'}
            </Text>
            <Text style={styles.verificationText}>{evidenceText(session)}</Text>
            <GuidanceDeepLinks suggestions={session.researchSuggestions} title="Research this answer" />
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

          <View style={styles.reflectionPanel}>
            <Text style={styles.layerKicker}>Reflect Once</Text>
            <Text style={styles.prompt}>{session.guidance.reflectionPrompt}</Text>
            <TextInput
              accessibilityLabel="Ask reflection"
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
  askPanel: {
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
  askInput: {
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    color: companionColors.ink,
    fontSize: 15,
    minHeight: 92,
    padding: companionSpacing.md,
    textAlignVertical: 'top',
  },
  starterStack: {
    gap: companionSpacing.xs,
  },
  starterChip: {
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    minHeight: 36,
    padding: companionSpacing.sm,
  },
  starterChipActive: {
    backgroundColor: companionColors.night,
    borderColor: companionColors.night,
  },
  starterText: {
    color: companionColors.ink,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  starterTextActive: {
    color: companionColors.white,
  },
  guideButton: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: companionSpacing.lg,
  },
  guideButtonText: {
    color: companionColors.white,
    fontWeight: '800',
  },
  loadingPanel: {
    alignItems: 'center',
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255, 255, 255, 0.14)',
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
  questionPanel: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  questionText: {
    color: companionColors.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
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
  guidanceLayer: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  sunnahLayer: {
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
