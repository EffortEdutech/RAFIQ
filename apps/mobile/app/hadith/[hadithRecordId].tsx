import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { GuidanceSession, HadithDetailResponse } from '@rafiq/shared';
import { GuidanceDeepLinks } from '../../src/components/GuidanceDeepLinks';
import { PrivateWorkspaceShell } from '../../src/components/PrivateWorkspaceShell';
import { createGuidanceSession, getHadithRecord } from '../../src/services/privateContentApi';
import {
  companionColors,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../../src/theme/mobileCompanionDesignSystem';

type PracticeTheme = {
  label: string;
  quranTheme: string;
  quranConnection: string;
  action: string;
  caution: string;
};

const MEANING_LANGUAGE_PRIORITY = ['en', 'ms', 'id', 'tr', 'bn', 'ru', 'ta', 'ur'];

function gradeSummary(payload: HadithDetailResponse) {
  const grade = payload.gradeAssertions[0];
  return grade?.normalizedLabel ?? grade?.rawGrade ?? 'Grade not listed';
}

function verificationSummary(payload: HadithDetailResponse) {
  const claim = payload.verificationClaims[0];
  if (claim?.claimText) return claim.claimText;
  if (claim?.rawConclusion) return claim.rawConclusion;
  const grade = payload.gradeAssertions[0];
  if (grade?.reviewStatus) return `Reliability note: ${grade.reviewStatus}.`;
  return 'No additional verification note is attached yet. Read with care and avoid sharing as a ruling.';
}

function referenceSummary(payload: HadithDetailResponse) {
  return (
    payload.record.printedReference ??
    payload.record.sourceHadithNumber ??
    payload.record.sourceArabicNumber ??
    payload.record.sourceHadithKey
  );
}

function detectPracticeTheme(text?: string): PracticeTheme {
  const lower = text?.toLowerCase() ?? '';
  if (
    lower.includes('intention') ||
    lower.includes('niat') ||
    lower.includes('niyyah') ||
    lower.includes('niyet') ||
    lower.includes('deeds') ||
    lower.includes('actions')
  ) {
    return {
      label: 'Intention',
      quranTheme: 'intention',
      quranConnection: 'Begin by seeking guidance and sincerity before action.',
      action: 'Pause before one action and renew the intention for Allah.',
      caution: 'Do not use this narration to judge another person\'s intention.',
    };
  }
  if (lower.includes('prayer') || lower.includes('salah') || lower.includes('salat')) {
    return {
      label: 'Prayer',
      quranTheme: 'prayer',
      quranConnection: 'Let the Quran anchor the duty, then let Sunnah shape the adab.',
      action: 'Protect the next prayer from rushing.',
      caution: 'Keep personal circumstances and fiqh detail for qualified guidance.',
    };
  }
  if (lower.includes('mercy') || lower.includes('kind') || lower.includes('forgive') || lower.includes('gentle')) {
    return {
      label: 'Mercy',
      quranTheme: 'mercy',
      quranConnection: 'Read the narration through the Quranic lens of mercy and restraint.',
      action: 'Let mercy lead one conversation today.',
      caution: 'Do not turn a mercy narration into a harsh rule against someone else.',
    };
  }
  if (lower.includes('patient') || lower.includes('patience') || lower.includes('anger') || lower.includes('restrain')) {
    return {
      label: 'Patience',
      quranTheme: 'patience',
      quranConnection: 'Hold the narration beside Quranic patience before reacting.',
      action: 'Delay one reaction until the heart is calmer.',
      caution: 'Do not use patience language to ignore harm or needed help.',
    };
  }
  if (lower.includes('thank') || lower.includes('grateful') || lower.includes('gratitude')) {
    return {
      label: 'Gratitude',
      quranTheme: 'gratitude',
      quranConnection: 'Let gratitude begin with recognizing Allah\'s favor.',
      action: 'Name one blessing and respond with one quiet act of thanks.',
      caution: 'Do not use gratitude to dismiss another person\'s hardship.',
    };
  }
  return {
    label: 'Guidance',
    quranTheme: 'guidance',
    quranConnection: 'Keep the Quran as the first lens before practice.',
    action: 'Choose one careful action after reading, not a ruling or claim to forward.',
    caution: 'If the application is specific, ask a qualified scholar.',
  };
}

function isRtl(languageCode?: string | null) {
  return languageCode === 'ar' || languageCode === 'ur' || languageCode === 'fa';
}

function languageLabel(languageCode?: string | null) {
  if (languageCode === 'id') return 'Indonesian meaning';
  if (languageCode === 'ms') return 'Malay meaning';
  if (languageCode === 'tr') return 'Turkish meaning';
  if (languageCode === 'bn') return 'Bengali meaning';
  if (languageCode === 'ru') return 'Russian meaning';
  if (languageCode === 'ta') return 'Tamil meaning';
  if (languageCode === 'ur') return 'Urdu meaning';
  return 'Meaning';
}

function cleanDisplayText(text: string) {
  return text.replace(/\s+/g, ' ').replace(/\b(\w+)\s+\1\b/gi, '$1').trim();
}

function hasTextQualityConcern(text: string, qualitySeverity?: string) {
  if (qualitySeverity === 'withheld') return true;
  return /\bthe\s+the\b/i.test(text) || /\bprayer\s+prayer\b/i.test(text) || /\bdid reply to him but\b/i.test(text);
}

function qualityStatusLabel(qualitySeverity?: string) {
  if (qualitySeverity === 'withheld') return 'Meaning review needed';
  if (qualitySeverity === 'review') return 'Meaning needs checking';
  return 'Meaning scan clear';
}

function qualityFlagLabel(flag: string) {
  if (flag === 'blank_text') return 'blank text';
  if (flag === 'known_broken_phrase') return 'damaged wording';
  if (flag === 'repeated_word') return 'repeated wording';
  if (flag === 'suspicious_short') return 'very short text';
  if (flag === 'suspicious_long') return 'unusually long text';
  return 'text review';
}

export default function HadithDetailScreen() {
  const { hadithRecordId } = useLocalSearchParams<{ hadithRecordId: string }>();
  const [payload, setPayload] = useState<HadithDetailResponse | null>(null);
  const [session, setSession] = useState<GuidanceSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    if (hadithRecordId) {
      void getHadithRecord(hadithRecordId).then(setPayload);
    }
  }, [hadithRecordId]);

  const preferredText = useMemo(() => {
    if (!payload) return null;
    for (const languageCode of MEANING_LANGUAGE_PRIORITY) {
      const version = payload.textVersions.find(
        (item) => item.languageCode === languageCode && item.qualitySeverity !== 'withheld',
      );
      if (version) return version;
    }
    return (
      payload.textVersions.find((version) => version.languageCode !== 'ar' && version.qualitySeverity !== 'withheld') ??
      payload.textVersions.find((version) => version.qualitySeverity !== 'withheld') ??
      payload.textVersions.find((version) => version.languageCode !== 'ar') ??
      payload.textVersions[0] ??
      null
    );
  }, [payload]);

  const arabicText = useMemo(
    () => payload?.textVersions.find((version) => version.languageCode === 'ar') ?? null,
    [payload],
  );

  const themeText = useMemo(
    () => payload?.textVersions.map((version) => version.fullText).join(' ') ?? preferredText?.fullText,
    [payload, preferredText?.fullText],
  );

  const practiceTheme = useMemo(
    () => detectPracticeTheme(themeText),
    [themeText],
  );

  useEffect(() => {
    if (!payload || !preferredText) return;
    let mounted = true;
    setSessionLoading(true);
    setSessionError(null);
    setSession(null);

    void createGuidanceSession({
      entryPoint: 'hadith_record',
      input: practiceTheme.quranTheme,
      language: 'en',
      domain: 'hadith',
      hadithRecordId: payload.record.hadithRecordId,
    })
      .then((response) => {
        if (mounted) setSession(response.session);
      })
      .catch(() => {
        if (mounted) setSessionError('Related Sunnah support could not open right now.');
      })
      .finally(() => {
        if (mounted) setSessionLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [payload, practiceTheme.quranTheme, preferredText]);

  if (!payload || !preferredText) {
    return (
      <PrivateWorkspaceShell eyebrow="Sunnah" title="Opening narration" subtitle="Preparing reliability and narration text.">
        <View style={styles.loadingPanel}>
          <ActivityIndicator color={companionColors.gold} />
          <Text style={styles.loadingText}>Opening narration...</Text>
        </View>
      </PrivateWorkspaceShell>
    );
  }

  const reference = referenceSummary(payload);
  const grade = gradeSummary(payload);
  const verification = verificationSummary(payload);
  const primarySupport = session?.sunnahSupport[0];
  const visibleSteps = session?.learningPath?.steps.filter((step) => step.available).slice(0, 4) ?? [];
  const preferredDisplayText = cleanDisplayText(preferredText.fullText);
  const qualityConcern = hasTextQualityConcern(preferredText.fullText, preferredText.qualitySeverity);
  const qualityFlags = preferredText.qualityFlags ?? [];
  const hasAnyQualityReview = Boolean(payload.qualitySummary?.flaggedTextVersionCount);
  const hasWithheldMeaning = Boolean(payload.qualitySummary?.withheldTextVersionCount);
  const overallQualityLabel = hasWithheldMeaning
    ? 'Meaning review needed'
    : hasAnyQualityReview
      ? qualityStatusLabel(preferredText.qualitySeverity)
      : 'Meaning scan clear';

  return (
    <PrivateWorkspaceShell
      action={{ href: '/hadith', label: 'Library' }}
      eyebrow="Sunnah"
      title="Read with verification"
      subtitle="Check reliability, connect the meaning, then practice with care."
    >
      <View style={[styles.reliabilityPanel, companionShadow.soft]}>
        <Text style={styles.panelKicker}>Reliability First</Text>
        <Text style={styles.reliabilityTitle}>{grade}</Text>
        <Text style={styles.reliabilityBody}>{verification}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaChip}>Ref {reference}</Text>
          <Text style={styles.metaChip}>{payload.record.collectionName ?? payload.record.collectionKey}</Text>
        </View>
        <View style={styles.verificationMap}>
          <View style={styles.verificationItem}>
            <Text style={styles.practiceLabel}>Grade</Text>
            <Text style={styles.verificationValue}>{grade}</Text>
          </View>
          <View style={styles.verificationItem}>
            <Text style={styles.practiceLabel}>Meaning</Text>
            <Text style={styles.verificationValue}>
              {overallQualityLabel}
            </Text>
          </View>
          <View style={styles.verificationItem}>
            <Text style={styles.practiceLabel}>Share</Text>
            <Text style={styles.verificationValue}>Keep reference visible</Text>
          </View>
        </View>
      </View>

      <View style={[styles.narrationPanel, companionShadow.soft]}>
        <Text style={styles.panelKicker}>Narration</Text>
        {arabicText ? (
          <Text style={styles.arabicHadithText}>
            {arabicText.fullText}
          </Text>
        ) : null}
        {arabicText && preferredText.languageCode !== 'ar' ? (
          <Text style={styles.meaningLabel}>{languageLabel(preferredText.languageCode)}</Text>
        ) : null}
        {preferredText.languageCode !== 'ar' && !qualityConcern ? (
          <Text style={isRtl(preferredText.languageCode) ? styles.rtlText : styles.narrationText}>
            {preferredDisplayText}
          </Text>
        ) : null}
        {qualityConcern ? (
          <Text style={styles.qualityNote}>
            Meaning text for this narration needs review. Use the Arabic, reference, and reliability note before quoting or sharing.
          </Text>
        ) : null}
        {hasAnyQualityReview ? (
          <View style={styles.qualityPanel}>
            <Text style={styles.qualityTitle}>{overallQualityLabel}</Text>
            <Text style={styles.qualityBody}>
              {qualityConcern || hasWithheldMeaning
                ? 'RAFIQ is withholding damaged meaning text from guidance until it is reviewed.'
                : 'This meaning can be read with care, while other text versions for this narration may need review.'}
            </Text>
            {qualityFlags.length > 0 ? (
              <Text style={styles.qualityFlags}>{qualityFlags.map(qualityFlagLabel).join(', ')}</Text>
            ) : null}
          </View>
        ) : null}
      </View>

      <View style={[styles.practicePanel, companionShadow.soft]}>
        <Text style={styles.panelKicker}>Practice Map</Text>
        <Text style={styles.practiceTitle}>{practiceTheme.label}</Text>
        <View style={styles.practiceGrid}>
          <View style={styles.practiceItem}>
            <Text style={styles.practiceLabel}>Quran lens</Text>
            <Text style={styles.practiceValue}>{practiceTheme.quranConnection}</Text>
          </View>
          <View style={styles.practiceItem}>
            <Text style={styles.practiceLabel}>Careful action</Text>
            <Text style={styles.practiceValue}>{practiceTheme.action}</Text>
          </View>
          <View style={styles.practiceItem}>
            <Text style={styles.practiceLabel}>Boundary</Text>
            <Text style={styles.practiceValue}>{practiceTheme.caution}</Text>
          </View>
        </View>
        <Link href="/search" style={styles.inlineLink}>
          Open knowledge path
        </Link>
        <Link href={`/sources?q=${encodeURIComponent(practiceTheme.quranTheme)}&domain=quran` as never} style={styles.quietLink}>
          Quran connection
        </Link>
      </View>

      <View style={styles.supportPanel}>
        <Text style={styles.panelKicker}>Related Sunnah Path</Text>
        {sessionLoading ? (
          <View style={styles.supportLoading}>
            <ActivityIndicator color={companionColors.gold} />
            <Text style={styles.supportText}>Finding related support...</Text>
          </View>
        ) : null}
        {!sessionLoading && primarySupport ? (
          <>
            <Text style={styles.supportTitle}>{primarySupport.title}</Text>
            <Text style={styles.supportText}>{primarySupport.practiceConnection}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaChip}>{primarySupport.reference ?? 'Reference available in source'}</Text>
              <Text style={styles.metaChip}>{primarySupport.gradeLabel ?? session?.verification.reviewStatus ?? 'Verification shown'}</Text>
            </View>
            {visibleSteps.length > 0 ? (
              <View style={styles.stepRail}>
                {visibleSteps.map((step) => (
                  <View key={step.stepId} style={styles.stepPill}>
                    <Text style={styles.stepLabel}>{step.label}</Text>
                    <Text style={styles.stepText}>{step.title}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            <GuidanceDeepLinks
              links={primarySupport.deepLinks}
              suggestions={primarySupport.researchSuggestions}
              title="Study deeper"
            />
          </>
        ) : null}
        {!sessionLoading && !primarySupport ? (
          <Text style={styles.supportText}>
            {sessionError ?? 'No related support opened for this theme yet. Keep the reliability note visible before practice.'}
          </Text>
        ) : null}
      </View>

      <View style={styles.actionDock}>
        <View style={styles.actionCopy}>
          <Text style={styles.panelKicker}>One Careful Action</Text>
          <Text style={styles.actionText}>{practiceTheme.action}</Text>
        </View>
      </View>

      <View style={styles.sourcesPanel}>
        <Text style={styles.panelKicker}>Research</Text>
        <View style={styles.metaRow}>
          <Link href={`/sources?q=${encodeURIComponent(preferredText.fullText.slice(0, 120))}&domain=hadith` as never} style={styles.quietLink}>
            Related narrations
          </Link>
          <Link href={`/sources?q=${encodeURIComponent(preferredText.fullText.slice(0, 120))}&domain=quran` as never} style={styles.quietLink}>
            Quran link
          </Link>
          <Link href={`/source-detail?entityType=hadith_record&entityId=${payload.record.hadithRecordId}` as never} style={styles.quietLink}>
            Attribution
          </Link>
        </View>
      </View>

      <View style={styles.cautionPanel}>
        <Text style={styles.panelKicker}>Before Sharing</Text>
        <Text style={styles.cautionText}>
          Do not forward a narration as a ruling. Keep the reference and reliability note visible, and ask a qualified scholar when applying it to a specific case.
        </Text>
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
  panelKicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  reliabilityPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  reliabilityTitle: {
    color: companionColors.ink,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  reliabilityBody: {
    ...companionTypography.body,
    color: companionColors.ink,
  },
  verificationMap: {
    borderTopColor: companionColors.line,
    borderTopWidth: 1,
    gap: companionSpacing.xs,
    paddingTop: companionSpacing.sm,
  },
  verificationItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: companionSpacing.sm,
    justifyContent: 'space-between',
  },
  verificationValue: {
    color: companionColors.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'right',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.xs,
  },
  metaChip: {
    backgroundColor: companionColors.paperWarm,
    borderRadius: companionRadii.sm,
    color: companionColors.ink,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.xs,
  },
  narrationPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  narrationText: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
  },
  arabicHadithText: {
    color: companionColors.ink,
    fontSize: 20,
    lineHeight: 36,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  meaningLabel: {
    color: companionColors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  rtlText: {
    color: companionColors.ink,
    fontSize: 22,
    lineHeight: 38,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  practicePanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  practiceTitle: {
    color: companionColors.ink,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  practiceGrid: {
    gap: companionSpacing.sm,
  },
  practiceItem: {
    backgroundColor: companionColors.paperWarm,
    borderRadius: companionRadii.sm,
    gap: 2,
    padding: companionSpacing.sm,
  },
  practiceLabel: {
    color: companionColors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  practiceValue: {
    color: companionColors.ink,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  inlineLink: {
    alignSelf: 'flex-start',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    color: companionColors.white,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
    textAlign: 'center',
  },
  quietLink: {
    alignSelf: 'flex-start',
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    color: companionColors.ink,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
    textAlign: 'center',
  },
  supportPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  supportLoading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: companionSpacing.sm,
  },
  supportTitle: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  supportText: {
    ...companionTypography.body,
    color: companionColors.ink,
  },
  stepRail: {
    gap: companionSpacing.xs,
  },
  stepPill: {
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    gap: 2,
    padding: companionSpacing.sm,
  },
  stepLabel: {
    color: companionColors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  stepText: {
    color: companionColors.ink,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  actionDock: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    padding: companionSpacing.md,
  },
  sourcesPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  actionCopy: {
    gap: companionSpacing.xs,
  },
  actionText: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  qualityNote: {
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    color: companionColors.inkSoft,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    padding: companionSpacing.sm,
  },
  qualityPanel: {
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    gap: 3,
    padding: companionSpacing.sm,
  },
  qualityTitle: {
    color: companionColors.ink,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  qualityBody: {
    color: companionColors.inkSoft,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
  qualityFlags: {
    color: companionColors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  cautionPanel: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  cautionText: {
    ...companionTypography.body,
    color: companionColors.mint,
  },
});
