import type { GuidanceSession } from '@rafiq/shared';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrivateWorkspaceShell } from '../src/components/PrivateWorkspaceShell';
import {
  createGuidanceSession,
  searchPrivateSources,
  type PrivateSearchDomain,
  type PrivateSearchResult,
  type PrivateSourceSearchResponse,
  type SourceToGuidanceTarget,
} from '../src/services/privateContentApi';
import {
  companionColors,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../src/theme/mobileCompanionDesignSystem';

const DOMAIN_FILTERS: Array<{ label: string; value: PrivateSearchDomain }> = [
  { label: 'All', value: 'all' },
  { label: 'Quran', value: 'quran' },
  { label: 'Tafsir', value: 'tafsir' },
  { label: 'Hadith', value: 'hadith' },
  { label: 'Themes', value: 'themes' },
];

const STARTERS = ['mercy', 'intention', 'الله', '2:255'];

function compactSnippet(text: string) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 128) return cleaned;
  return `${cleaned.slice(0, 125)}...`;
}

function resultMeta(result: PrivateSearchResult) {
  const ref = result.reference.verseKey ?? result.reference.collectionKey ?? result.subtitle ?? result.domain;
  return [result.domain.replace('_', ' '), ref].filter(Boolean).join(' - ');
}

function resultDedupeKey(result: PrivateSearchResult) {
  const verseKey = result.reference.verseKey ?? result.target.verseKey;
  if (verseKey && ['quran', 'translation', 'ayah_theme'].includes(result.domain)) {
    return `${result.domain}:${verseKey}`;
  }
  if (verseKey && result.domain === 'tafsir') {
    return `${result.domain}:${verseKey}:${result.subtitle ?? 'tafsir'}`;
  }
  return result.resultId;
}

function compactGroupResults(results: PrivateSearchResult[]) {
  const seen = new Set<string>();
  return results
    .filter((result) => {
      const key = resultDedupeKey(result);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3);
}

export default function SourceSearchScreen() {
  const params = useLocalSearchParams<{ q?: string; domain?: string }>();
  const initialQuery = typeof params.q === 'string' && params.q.trim() ? params.q : 'mercy';
  const initialDomain =
    typeof params.domain === 'string' && DOMAIN_FILTERS.some((item) => item.value === params.domain)
      ? (params.domain as PrivateSearchDomain)
      : 'all';

  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [domain, setDomain] = useState<PrivateSearchDomain>(initialDomain);
  const [payload, setPayload] = useState<PrivateSourceSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<GuidanceSession | null>(null);
  const [guidanceLoadingId, setGuidanceLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setGuidance(null);

    searchPrivateSources({
      q: submittedQuery,
      domain,
      limit: 18,
      offset: 0,
    })
      .then((nextPayload) => {
        if (mounted) setPayload(nextPayload);
      })
      .catch(() => {
        if (mounted) setError('Source search could not open. Try another phrase or reference.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [domain, submittedQuery]);

  function submit(nextQuery = query) {
    const clean = nextQuery.trim() || 'mercy';
    setQuery(clean);
    setSubmittedQuery(clean);
  }

  function openGuidance(target: SourceToGuidanceTarget | null | undefined, resultId: string) {
    if (!target) return;
    setGuidanceLoadingId(resultId);
    createGuidanceSession({
      entryPoint: target.entryPoint,
      input: target.input,
      language: 'en',
      domain: target.domain ?? 'all',
      surahNumber: target.quran?.surahNumber,
      ayahNumber: target.quran?.ayahNumber,
      verseKey: target.quran?.verseKey,
      hadithRecordId: target.hadithRecordId ?? undefined,
    })
      .then((response) => setGuidance(response.session))
      .catch(() => setError('Guidance could not open from this source yet.'))
      .finally(() => setGuidanceLoadingId(null));
  }

  return (
    <PrivateWorkspaceShell
      action={{ href: '/search', label: 'Guidance' }}
      eyebrow="Sources"
      title="Source search"
      subtitle="Research Quran, tafsir, themes, and Hadith. Open a source or turn it into guidance."
    >
      <View style={[styles.searchPanel, companionShadow.soft]}>
        <Text style={styles.kicker}>Research phrase or reference</Text>
        <View style={styles.searchRow}>
          <TextInput
            accessibilityLabel="Source search query"
            onChangeText={setQuery}
            onSubmitEditing={() => submit()}
            placeholder="Search mercy, intention, 2:255..."
            placeholderTextColor={companionColors.muted}
            style={styles.input}
            value={query}
          />
          <Pressable accessibilityRole="button" onPress={() => submit()} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.filterRow}>
        {DOMAIN_FILTERS.map((item) => {
          const active = domain === item.value;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={item.value}
              onPress={() => setDomain(item.value)}
              style={[styles.filterChip, active ? styles.filterChipActive : null]}
            >
              <Text style={[styles.filterText, active ? styles.filterTextActive : null]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.starterRow}>
        {STARTERS.map((starter) => (
          <Pressable
            accessibilityRole="button"
            key={starter}
            onPress={() => submit(starter)}
            style={styles.starter}
          >
            <Text style={styles.starterText}>{starter}</Text>
          </Pressable>
        ))}
      </View>

      {guidance ? (
        <View style={styles.guidancePanel}>
          <Text style={styles.kicker}>Guidance opened</Text>
          <Text style={styles.guidanceTitle}>{guidance.quranAnchor?.verseKey ?? guidance.need.detectedTheme}</Text>
          <Text style={styles.guidanceText}>{guidance.guidance.action.label}</Text>
          <Link href="/search" style={styles.guidanceLink}>Continue guidance</Link>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingPanel}>
          <ActivityIndicator color={companionColors.gold} />
          <Text style={styles.loadingText}>Searching sources...</Text>
        </View>
      ) : null}

      {!loading && error ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.kicker}>Search paused</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : null}

      {!loading && payload && !payload.groups.length ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.kicker}>No source result</Text>
          <Text style={styles.emptyText}>
            Try an Arabic phrase, a Quran reference like 2:255, or a more specific Hadith phrase.
          </Text>
        </View>
      ) : null}

      {!loading && payload?.groups.map((group) => {
        const visibleResults = compactGroupResults(group.results);
        return (
          <View key={group.groupKey} style={styles.groupPanel}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{group.label}</Text>
              <Text style={styles.groupCount}>{visibleResults.length}/{group.total}</Text>
            </View>

            {visibleResults.map((result) => (
              <View key={result.resultId} style={styles.resultRow}>
                <Text style={styles.resultMeta}>{resultMeta(result)}</Text>
                <Text style={styles.resultTitle}>{result.title}</Text>
                <Text numberOfLines={3} style={styles.resultSnippet}>{compactSnippet(result.snippet)}</Text>
                <View style={styles.resultActions}>
                  <Link href={result.target.route as never} style={styles.openLink}>Open</Link>
                  {result.deepLinks?.find((link) => link.kind === 'source_detail') ? (
                    <Link
                      href={result.deepLinks.find((link) => link.kind === 'source_detail')?.route as never}
                      style={styles.quietLink}
                    >
                      Attribution
                    </Link>
                  ) : null}
                  <Pressable
                    accessibilityRole="button"
                    disabled={!result.openGuidanceTarget || guidanceLoadingId === result.resultId}
                    onPress={() => openGuidance(result.openGuidanceTarget, result.resultId)}
                    style={[styles.guideButton, !result.openGuidanceTarget ? styles.guideButtonDisabled : null]}
                  >
                    <Text style={styles.guideButtonText}>
                      {guidanceLoadingId === result.resultId ? 'Opening...' : 'Guide'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}

            {group.total > visibleResults.length ? (
              <Text style={styles.moreHint}>Showing the clearest matches first.</Text>
            ) : null}
          </View>
        );
      })}
    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  searchPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.md,
  },
  kicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  searchRow: {
    flexDirection: 'row',
    gap: companionSpacing.sm,
  },
  input: {
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    color: companionColors.ink,
    flex: 1,
    fontSize: 15,
    minHeight: 40,
    minWidth: 0,
    paddingHorizontal: companionSpacing.md,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: companionSpacing.md,
  },
  searchButtonText: {
    color: companionColors.white,
    fontWeight: '800',
  },
  filterRow: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.xxs,
    padding: companionSpacing.xxs,
  },
  filterChip: {
    alignItems: 'center',
    borderRadius: companionRadii.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: companionSpacing.xs,
  },
  filterChipActive: {
    backgroundColor: companionColors.paper,
  },
  filterText: {
    color: companionColors.mint,
    fontSize: 11,
    fontWeight: '700',
  },
  filterTextActive: {
    color: companionColors.ink,
    fontWeight: '800',
  },
  starterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.xs,
  },
  starter: {
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.xs,
  },
  starterText: {
    color: companionColors.inkSoft,
    fontSize: 12,
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
  emptyPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  emptyText: {
    ...companionTypography.body,
    color: companionColors.ink,
  },
  guidancePanel: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  guidanceTitle: {
    color: companionColors.white,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  guidanceText: {
    color: companionColors.mint,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  guidanceLink: {
    alignSelf: 'flex-start',
    color: companionColors.goldSoft,
    fontSize: 13,
    fontWeight: '900',
    paddingVertical: companionSpacing.xs,
  },
  groupPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  groupHeader: {
    alignItems: 'center',
    backgroundColor: companionColors.paperWarm,
    borderBottomColor: companionColors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
  },
  groupTitle: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  groupCount: {
    color: companionColors.gold,
    fontSize: 12,
    fontWeight: '900',
  },
  resultRow: {
    borderBottomColor: companionColors.line,
    borderBottomWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.md,
  },
  resultMeta: {
    color: companionColors.gold,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  resultTitle: {
    color: companionColors.ink,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  resultSnippet: {
    color: companionColors.inkSoft,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  resultActions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.sm,
    paddingTop: companionSpacing.xs,
  },
  openLink: {
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.sm,
    color: companionColors.white,
    fontSize: 12,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
  },
  quietLink: {
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    color: companionColors.ink,
    fontSize: 12,
    fontWeight: '800',
    minHeight: 38,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
  },
  guideButton: {
    alignItems: 'center',
    backgroundColor: companionColors.gold,
    borderRadius: companionRadii.sm,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: companionSpacing.md,
  },
  guideButtonDisabled: {
    opacity: 0.45,
  },
  guideButtonText: {
    color: companionColors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  moreHint: {
    color: companionColors.muted,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
  },
});
