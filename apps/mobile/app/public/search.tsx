import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { PublicSearchDomain, PublicSearchResult } from '@rafiq/shared';
import { PublicAppShell } from '../../src/components/public/PublicAppShell';
import { PublicBoundaryPanel } from '../../src/components/public/PublicBoundaryPanel';
import { PublicStatusBadge } from '../../src/components/public/PublicStatusBadge';
import { searchPublicContent } from '../../src/services/publicContentApi';
import { publicColors, publicRadii, publicShadows, publicSpacing, publicTypography } from '../../src/theme/publicDesignSystem';

const PAGE_SIZE = 10;

const DOMAINS: Array<{ value: PublicSearchDomain; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'quran', label: 'Quran' },
  { value: 'tafsir', label: 'Tafsir' },
  { value: 'topics', label: 'Topics' },
  { value: 'themes', label: 'Themes' },
  { value: 'hadith', label: 'Hadith' },
];

const SEARCH_EXAMPLES: Array<{ query: string; label: string; domain: PublicSearchDomain }> = [
  { query: 'mercy', label: 'Mercy across Quran and Hadith', domain: 'all' },
  { query: 'prayer', label: 'Prayer guidance and source context', domain: 'all' },
  { query: 'patience', label: 'Patience, hardship, and hope', domain: 'all' },
  { query: 'charity', label: 'Charity and social care', domain: 'all' },
];

const FUTURE_SEARCH_LAYERS = [
  ['Quran', 'Ayah text, translations, themes, and tafsir links.'],
  ['Hadith', 'Collection, chapter, grade, and verification-aware results.'],
  ['Topics', 'Curated concepts that connect verses, themes, and narrations.'],
];

function labelDomain(domain: PublicSearchResult['domain']) {
  if (domain === 'ayah_theme') return 'Ayah Theme';
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

function resultHref(result: PublicSearchResult) {
  if (result.release?.entityType && result.release.entityId) {
    return `/public/source/${result.release.entityId}?entityType=${encodeURIComponent(result.release.entityType)}`;
  }
  return '/public/search';
}

export default function PublicSearchScreen() {
  const [query, setQuery] = useState('mercy');
  const [submittedQuery, setSubmittedQuery] = useState('mercy');
  const [domain, setDomain] = useState<PublicSearchDomain>('all');
  const [offset, setOffset] = useState(0);
  const [payload, setPayload] = useState<Awaited<ReturnType<typeof searchPublicContent>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPayload(null);
    setError(null);
    void searchPublicContent({
      q: submittedQuery,
      domain,
      limit: PAGE_SIZE,
      offset,
    })
      .then(setPayload)
      .catch((searchError: unknown) => {
        setError(searchError instanceof Error ? searchError.message : 'Public search failed');
      });
  }, [domain, offset, submittedQuery]);

  const hasResults = Boolean(payload?.results.length);
  const canGoBack = offset > 0;
  const canGoNext = payload ? offset + PAGE_SIZE < payload.pagination.total : false;
  const facetSummary = useMemo(() => {
    if (!payload) return 'Checking release-filtered public index';
    const entries = Object.entries(payload.facets);
    return entries.length
      ? entries.map(([key, value]) => `${key}: ${value}`).join(' | ')
      : 'No approved public facet counts yet';
  }, [payload]);

  return (
    <PublicAppShell
      eyebrow="Explore RAFIQ"
      title="Search the knowledge graph with source boundaries."
      subtitle="RAFIQ search is designed to connect Quran, Hadith, tafsir, topics, themes, and guided answers while showing exactly what is approved for public use."
    >
      <View style={[styles.searchPanel, publicShadows.raised]}>
        <View style={styles.searchHeader}>
          <PublicStatusBadge kind="approvalPending" label="Public release filter active" />
          <Text style={styles.sectionTitle}>Start with a question, theme, or source idea.</Text>
          <Text style={styles.body}>
            Search is the front door to RAFIQ. While public content approval is pending, this page shows
            the full product flow and keeps real private content hidden behind release filters.
          </Text>
        </View>

        <TextInput
          accessibilityLabel="Public search query"
          onChangeText={setQuery}
          onSubmitEditing={() => {
            setSubmittedQuery(query);
            setOffset(0);
          }}
          placeholder="Try mercy, guidance, patience, prayer..."
          style={styles.input}
          value={query}
        />

        <View style={styles.searchActions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setSubmittedQuery(query);
              setOffset(0);
            }}
            style={styles.searchButton}
          >
            <Text style={styles.searchButtonText}>Search release-approved knowledge</Text>
          </Pressable>
          <Link href="/public/answer" style={styles.secondaryLink}>
            Ask instead
          </Link>
        </View>
      </View>

      <View style={styles.examplePanel}>
        <Text style={styles.kicker}>Guided Starting Points</Text>
        <Text style={styles.sectionTitle}>Try a theme RAFIQ is built to connect.</Text>
        <View style={styles.exampleGrid}>
          {SEARCH_EXAMPLES.map((example) => (
            <Pressable
              accessibilityRole="button"
              key={example.query}
              onPress={() => {
                setQuery(example.query);
                setSubmittedQuery(example.query);
                setDomain(example.domain);
                setOffset(0);
              }}
              style={styles.exampleCard}
            >
              <Text style={styles.exampleTitle}>{example.query}</Text>
              <Text style={styles.exampleBody}>{example.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.domainRow}>
        {DOMAINS.map((item) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: domain === item.value }}
            key={item.value}
            onPress={() => {
              setDomain(item.value);
              setOffset(0);
            }}
            style={[styles.domainChip, domain === item.value ? styles.activeDomainChip : null]}
          >
            <Text style={[styles.domainLabel, domain === item.value ? styles.activeDomainLabel : null]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.summaryPanel, publicShadows.card]}>
        <View style={styles.summaryHeader}>
          <Text style={styles.kicker}>Search Readiness</Text>
          <Text style={styles.summaryTitle}>Release-filtered and ready for approved content.</Text>
        </View>
        <View style={styles.statusGrid}>
          <View style={styles.statusCard}>
            <Text style={styles.statusValue}>{payload ? payload.pagination.total : '...'}</Text>
            <Text style={styles.statusLabel}>Approved public results</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.statusValue}>{payload?.releaseFilter.status ?? 'checking'}</Text>
            <Text style={styles.statusLabel}>Release filter</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.statusValue}>
              {payload ? (payload.releaseFilter.pendingContentBlocked ? 'blocked' : 'open') : 'checking'}
            </Text>
            <Text style={styles.statusLabel}>Pending content</Text>
          </View>
        </View>
        <Text style={styles.meta}>Current query: {submittedQuery || 'empty'} | Domain: {domain}</Text>
        <Text style={styles.meta}>{facetSummary}</Text>
      </View>

      {error ? (
        <View style={styles.errorPanel}>
          <Text style={styles.errorTitle}>Public search could not load</Text>
          <Text style={styles.body}>{error}</Text>
        </View>
      ) : null}

      {!payload && !error ? <ActivityIndicator color={publicColors.deepGreen} style={styles.loading} /> : null}

      {payload && !hasResults ? (
        <View style={styles.emptyExperience}>
          <PublicBoundaryPanel
            title="Search is ready. Public content is still gated."
            body="RAFIQ can already shape the search journey, but release-approved public sources have not been opened yet. This is an intentional trust state, not a broken search."
          />
          <View style={[styles.futurePanel, publicShadows.card]}>
            <Text style={styles.kicker}>What appears here after approval</Text>
            <Text style={styles.sectionTitle}>Results will be grouped by source type and trust state.</Text>
            {FUTURE_SEARCH_LAYERS.map(([title, body]) => (
              <View key={title} style={styles.futureRow}>
                <Text style={styles.futureTitle}>{title}</Text>
                <Text style={styles.futureBody}>{body}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {payload?.results.map((result) => (
        <View key={result.resultId} style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.domainText}>{labelDomain(result.domain)}</Text>
            <PublicStatusBadge kind="approvedPublic" label="Approved public" />
          </View>
          <Text style={styles.resultTitle}>{result.title}</Text>
          {result.subtitle ? <Text style={styles.meta}>{result.subtitle}</Text> : null}
          <Text style={styles.snippet}>{result.snippet}</Text>
          {result.reference.verseKey ? <Text style={styles.meta}>Verse: {result.reference.verseKey}</Text> : null}
          {result.reference.collectionKey ? (
            <Text style={styles.meta}>Collection: {result.reference.collectionKey}</Text>
          ) : null}
          <Link href={resultHref(result) as never} style={styles.sourceLink}>
            View public source detail
          </Link>
        </View>
      ))}

      <View style={styles.pager}>
        <Pressable
          accessibilityRole="button"
          disabled={!canGoBack}
          onPress={() => setOffset((value) => Math.max(0, value - PAGE_SIZE))}
          style={[styles.pageButton, !canGoBack ? styles.disabledButton : null]}
        >
          <Text style={styles.pageButtonText}>Previous</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={!canGoNext}
          onPress={() => setOffset((value) => value + PAGE_SIZE)}
          style={[styles.pageButton, !canGoNext ? styles.disabledButton : null]}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </Pressable>
      </View>

      <View style={styles.nextStepPanel}>
        <Text style={styles.kicker}>Next Product Path</Text>
        <Text style={styles.sectionTitle}>Search should lead naturally into reading or asking.</Text>
        <View style={styles.nextLinks}>
          <Link href="/public/quran" style={styles.nextLink}>
            Preview Quran reading
          </Link>
          <Link href="/public/hadith" style={styles.nextLink}>
            Preview Hadith browsing
          </Link>
          <Link href="/public/sources" style={styles.nextLink}>
            Understand source trust
          </Link>
        </View>
      </View>
    </PublicAppShell>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: publicSpacing.space24,
  },
  searchPanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space24,
  },
  searchHeader: {
    gap: publicSpacing.space12,
  },
  sectionTitle: {
    ...publicTypography.sectionTitle,
    color: publicColors.ink,
  },
  body: {
    ...publicTypography.body,
    color: publicColors.slate,
  },
  input: {
    backgroundColor: publicColors.white,
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    color: publicColors.ink,
    minHeight: 48,
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
  searchButton: {
    backgroundColor: publicColors.deepGreen,
    borderRadius: publicRadii.medium,
    flex: 1,
    minHeight: 48,
    paddingHorizontal: publicSpacing.space20,
    paddingVertical: publicSpacing.space16,
  },
  searchButtonText: {
    color: publicColors.white,
    fontWeight: '900',
    textAlign: 'center',
  },
  searchActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space12,
  },
  secondaryLink: {
    backgroundColor: publicColors.mintSoft,
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    color: publicColors.deepGreen,
    fontWeight: '900',
    minHeight: 48,
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space20,
    paddingVertical: publicSpacing.space16,
    textAlign: 'center',
  },
  examplePanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  kicker: {
    ...publicTypography.label,
    color: publicColors.gold,
    textTransform: 'uppercase',
  },
  exampleGrid: {
    gap: publicSpacing.space12,
  },
  exampleCard: {
    backgroundColor: publicColors.mintSoft,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    minHeight: 84,
    padding: publicSpacing.space16,
  },
  exampleTitle: {
    color: publicColors.deepGreen,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
    textTransform: 'capitalize',
  },
  exampleBody: {
    ...publicTypography.metadata,
    color: publicColors.slate,
    marginTop: publicSpacing.space4,
  },
  domainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  domainChip: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.pill,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
  activeDomainChip: {
    backgroundColor: publicColors.deepGreen,
    borderColor: publicColors.deepGreen,
  },
  domainLabel: {
    color: publicColors.ink,
    fontWeight: '800',
  },
  activeDomainLabel: {
    color: publicColors.white,
  },
  summaryPanel: {
    backgroundColor: publicColors.goldWash,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  summaryHeader: {
    gap: publicSpacing.space8,
  },
  summaryTitle: {
    color: publicColors.ink,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
  },
  statusGrid: {
    gap: publicSpacing.space8,
  },
  statusCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    gap: publicSpacing.space4,
    padding: publicSpacing.space16,
  },
  statusValue: {
    color: publicColors.deepGreen,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },
  statusLabel: {
    ...publicTypography.label,
    color: publicColors.muted,
    textTransform: 'uppercase',
  },
  meta: {
    ...publicTypography.metadata,
    color: publicColors.muted,
  },
  errorPanel: {
    backgroundColor: '#F8E5DF',
    borderColor: publicColors.danger,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    gap: publicSpacing.space8,
    padding: publicSpacing.space16,
  },
  errorTitle: {
    color: publicColors.danger,
    fontSize: 18,
    fontWeight: '800',
  },
  resultCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  emptyExperience: {
    gap: publicSpacing.space16,
  },
  futurePanel: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  futureRow: {
    backgroundColor: publicColors.cream,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    gap: publicSpacing.space4,
    padding: publicSpacing.space16,
  },
  futureTitle: {
    ...publicTypography.cardTitle,
    color: publicColors.ink,
  },
  futureBody: {
    ...publicTypography.metadata,
    color: publicColors.slate,
  },
  resultHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
    justifyContent: 'space-between',
  },
  domainText: {
    ...publicTypography.label,
    color: publicColors.deepGreen,
    textTransform: 'uppercase',
  },
  resultTitle: {
    ...publicTypography.sectionTitle,
    color: publicColors.ink,
  },
  snippet: {
    ...publicTypography.body,
    color: publicColors.slate,
  },
  sourceLink: {
    color: publicColors.deepGreen,
    fontWeight: '800',
    marginTop: publicSpacing.space4,
  },
  pager: {
    flexDirection: 'row',
    gap: publicSpacing.space12,
  },
  pageButton: {
    backgroundColor: publicColors.deepGreen,
    borderRadius: publicRadii.medium,
    flex: 1,
    minHeight: 44,
    padding: publicSpacing.space12,
  },
  disabledButton: {
    backgroundColor: publicColors.muted,
  },
  pageButtonText: {
    color: publicColors.white,
    fontWeight: '800',
    textAlign: 'center',
  },
  nextStepPanel: {
    backgroundColor: publicColors.forest,
    borderColor: publicColors.deepGreen,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space24,
  },
  nextLinks: {
    gap: publicSpacing.space8,
  },
  nextLink: {
    backgroundColor: 'rgba(255, 253, 247, 0.08)',
    borderColor: 'rgba(255, 253, 247, 0.18)',
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    color: publicColors.white,
    fontWeight: '900',
    minHeight: 48,
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
});
