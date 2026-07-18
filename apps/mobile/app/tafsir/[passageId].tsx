import type { GuidanceSession, TafsirStudyPassage, TafsirStudyResponse } from '@rafiq/shared';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { GuidanceDeepLinks } from '../../src/components/GuidanceDeepLinks';
import { PrivateWorkspaceShell } from '../../src/components/PrivateWorkspaceShell';
import { createGuidanceSession, getTafsirPassage } from '../../src/services/privateContentApi';
import {
  companionColors,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../../src/theme/mobileCompanionDesignSystem';

function compactText(text?: string | null, limit = 360) {
  const cleaned = text?.replace(/\s+/g, ' ').trim() ?? '';
  if (cleaned.length <= limit) return cleaned;
  return `${cleaned.slice(0, limit - 3)}...`;
}

function passageTitle(passage: TafsirStudyPassage | null) {
  return passage?.edition.title ?? passage?.edition.editionKey ?? 'Tafsir passage';
}

function isRtl(languageCode?: string | null) {
  return languageCode === 'ar' || languageCode === 'ur' || languageCode === 'fa';
}

export default function TafsirStudyRoom() {
  const { passageId } = useLocalSearchParams<{ passageId: string }>();
  const [payload, setPayload] = useState<TafsirStudyResponse | null>(null);
  const [session, setSession] = useState<GuidanceSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setPayload(null);

    if (!passageId) {
      setError('This tafsir passage could not open.');
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    getTafsirPassage(passageId)
      .then((nextPayload) => {
        if (mounted) setPayload(nextPayload);
      })
      .catch(() => {
        if (mounted) setError('This tafsir passage could not open.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [passageId]);

  const primaryAyah = payload?.ayahs[0] ?? null;
  const passage = payload?.passage ?? null;
  const comparisonRows = useMemo(
    () => payload?.comparisons.filter((item) => item.passageId !== passage?.passageId).slice(0, 3) ?? [],
    [passage?.passageId, payload?.comparisons],
  );

  function openGuidance() {
    if (!primaryAyah) return;
    setGuidanceLoading(true);
    createGuidanceSession({
      entryPoint: 'quran_ayah',
      input: primaryAyah.verseKey,
      language: 'en',
      domain: 'all',
      surahNumber: primaryAyah.surahNumber,
      ayahNumber: primaryAyah.ayahNumber,
      verseKey: primaryAyah.verseKey,
    })
      .then((response) => setSession(response.session))
      .catch(() => setError('Guidance could not open from this tafsir yet.'))
      .finally(() => setGuidanceLoading(false));
  }

  if (loading) {
    return (
      <PrivateWorkspaceShell eyebrow="Tafsir" title="Opening tafsir" subtitle="Preparing Quran context.">
        <View style={styles.loadingPanel}>
          <ActivityIndicator color={companionColors.gold} />
          <Text style={styles.loadingText}>Opening tafsir...</Text>
        </View>
      </PrivateWorkspaceShell>
    );
  }

  if (!payload || !passage || !primaryAyah || error) {
    return (
      <PrivateWorkspaceShell eyebrow="Tafsir" title="Tafsir unavailable" subtitle="Try another ayah or source result.">
        <View style={styles.panel}>
          <Text style={styles.kicker}>Unavailable</Text>
          <Text style={styles.body}>{error ?? 'This tafsir passage was not found in the current study payload.'}</Text>
        </View>
      </PrivateWorkspaceShell>
    );
  }

  const tafsirRtl = isRtl(passage.edition.languageCode);

  return (
    <PrivateWorkspaceShell
      action={{ href: `/quran/${primaryAyah.surahNumber}/${primaryAyah.ayahNumber}`, label: 'Ayah' }}
      eyebrow="Tafsir"
      title={`Tafsir ${primaryAyah.verseKey}`}
      subtitle="Read the ayah, then study the explanation with source care."
    >
      <View style={[styles.ayahPanel, companionShadow.soft]}>
        <Text style={styles.kicker}>Quran Anchor</Text>
        {primaryAyah.quranText ? <Text style={styles.arabicText}>{primaryAyah.quranText}</Text> : null}
        <Text style={styles.reference}>{primaryAyah.verseKey}</Text>
        {primaryAyah.translationText ? <Text style={styles.body}>{primaryAyah.translationText}</Text> : null}
      </View>

      <View style={[styles.tafsirPanel, companionShadow.soft]}>
        <Text style={styles.kicker}>Explanation</Text>
        <Text style={styles.sourceTitle}>{passageTitle(passage)}</Text>
        <Text style={tafsirRtl ? styles.rtlBody : styles.tafsirText}>{passage.text}</Text>
      </View>

      {comparisonRows.length ? (
        <View style={styles.panel}>
          <Text style={styles.kicker}>Compare Sources</Text>
          {comparisonRows.map((item) => (
            <Link href={`/tafsir/${item.passageId}` as never} key={item.passageId} style={styles.comparisonRow}>
              <Text style={styles.comparisonTitle}>{passageTitle(item)}</Text>
              <Text style={styles.comparisonText}>{compactText(item.text, 180)}</Text>
            </Link>
          ))}
        </View>
      ) : null}

      <View style={styles.actionPanel}>
        <Text style={styles.kicker}>Continue Study</Text>
        <View style={styles.linkRow}>
          <Link href={`/quran/${primaryAyah.surahNumber}/${primaryAyah.ayahNumber}` as never} style={styles.primaryLink}>
            Read ayah
          </Link>
          <Link href={`/sources?q=${encodeURIComponent(primaryAyah.verseKey)}&domain=hadith` as never} style={styles.secondaryLink}>
            Sunnah support
          </Link>
          <Link href={`/sources?q=${encodeURIComponent(primaryAyah.verseKey)}&domain=tafsir` as never} style={styles.secondaryLink}>
            More tafsir
          </Link>
        </View>
      </View>

      <View style={styles.actionPanel}>
        <Text style={styles.kicker}>Guidance</Text>
        <Pressable accessibilityRole="button" onPress={openGuidance} style={styles.button}>
          <Text style={styles.buttonText}>{guidanceLoading ? 'Opening...' : 'Open guidance from this tafsir'}</Text>
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
          <Link
            href={`/source-detail?entityType=tafsir_passage&entityId=${passage.passageId}` as never}
            style={styles.secondaryLink}
          >
            Tafsir source
          </Link>
          <Link href={`/sources?q=${encodeURIComponent(primaryAyah.verseKey)}&domain=tafsir` as never} style={styles.secondaryLink}>
            Source search
          </Link>
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
  tafsirPanel: {
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
    fontSize: 25,
    fontWeight: '700',
    lineHeight: 46,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  reference: {
    color: companionColors.gold,
    fontWeight: '900',
  },
  sourceTitle: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  body: {
    ...companionTypography.body,
    color: companionColors.ink,
  },
  tafsirText: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 25,
  },
  rtlBody: {
    color: companionColors.ink,
    fontSize: 21,
    fontWeight: '500',
    lineHeight: 38,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  comparisonRow: {
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    color: companionColors.ink,
    gap: 4,
    overflow: 'hidden',
    padding: companionSpacing.sm,
  },
  comparisonTitle: {
    color: companionColors.ink,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
  comparisonText: {
    color: companionColors.inkSoft,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
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
