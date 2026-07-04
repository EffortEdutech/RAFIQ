import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PrivateModeRibbon } from '../src/components/PrivateModeRibbon';
import { PrivateWorkspaceShell } from '../src/components/PrivateWorkspaceShell';
import { ToggleChip } from '../src/components/ToggleChip';
import {
  listReviewQueue,
  type PrivateReviewQueueResponse,
  type PrivateReviewQueueType,
} from '../src/services/privateContentApi';
import { publicColors, publicRadii, publicShadows, publicSpacing } from '../src/theme/publicDesignSystem';

const PAGE_SIZE = 15;
const QUEUE_TYPES: Array<{ value: PrivateReviewQueueType | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'retrieval_trace', label: 'Traces' },
  { value: 'source_gap', label: 'Gaps' },
  { value: 'grade_assertion', label: 'Grades' },
  { value: 'verification_claim', label: 'Claims' },
  { value: 'answer_validation', label: 'Answers' },
];

function formatQueueType(queueType: string) {
  return queueType.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function severityStyle(severity: 'low' | 'medium' | 'high') {
  if (severity === 'high') return styles.high;
  if (severity === 'medium') return styles.medium;
  return styles.low;
}

export default function ReviewQueueScreen() {
  const [queueType, setQueueType] = useState<PrivateReviewQueueType | 'all'>('all');
  const [offset, setOffset] = useState(0);
  const [payload, setPayload] = useState<PrivateReviewQueueResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPayload(null);
    setError(null);
    void listReviewQueue({
      status: 'all',
      queueType: queueType === 'all' ? undefined : queueType,
      limit: PAGE_SIZE,
      offset,
    })
      .then(setPayload)
      .catch((reviewError: unknown) => {
        setError(reviewError instanceof Error ? reviewError.message : 'Review queue failed');
      });
  }, [offset, queueType]);

  const canGoBack = offset > 0;
  const canGoNext = payload ? offset + PAGE_SIZE < payload.pagination.total : false;
  const facetSummary = useMemo(() => {
    if (!payload) return 'Loading queue facets';
    const entries = Object.entries(payload.facets);
    return entries.length
      ? entries.map(([key, value]) => `${key}: ${value}`).join(' | ')
      : 'No queue items for this filter';
  }, [payload]);

  return (
    <PrivateWorkspaceShell
      eyebrow="Internal Review"
      includeReviewNav
      title="Protect the guidance before it reaches people."
      subtitle="Review is not a user journey. It is RAFIQ's internal amanah layer: source gaps, retrieval traces, grades, verification claims, and answer checks are handled here so Companion stays calm."
      action={{ href: '/', label: 'Return to Today' }}
    >
      <PrivateModeRibbon notice={payload?.notice} />

      <View style={[styles.boundaryCard, publicShadows.card]}>
        <Text style={styles.boundaryLabel}>Internal Workspace Boundary</Text>
        <Text style={styles.boundaryTitle}>This route is intentionally outside the normal RAFIQ journey.</Text>
        <Text style={styles.boundaryBody}>
          Users should receive calm guidance in Today, Companion, Quran, Library, and Profile.
          Review stays here for developers and reviewers to inspect source gaps, retrieval traces,
          grade assertions, verification claims, and answer validation.
        </Text>
        <Text style={styles.boundaryNote}>
          Source trust details stay behind specific evidence and source-context links, not as a normal product destination.
        </Text>
        <View style={styles.boundaryLinks}>
          <Link href="/hadith" style={styles.secondaryLink}>Sunnah Support Surface</Link>
        </View>
      </View>

      <View style={[styles.headerCard, publicShadows.raised]}>
        <Text style={styles.kicker}>Quality Gate</Text>
        <Text style={styles.title}>Every guidance path needs trustworthy evidence behind it.</Text>
        <Text style={styles.body}>
          This queue exists for reviewers and developers, not everyday users. It
          keeps the Companion experience free from raw technical notes while
          preserving the checks RAFIQ needs before public release.
        </Text>
      </View>

      <View style={styles.controls}>
        {QUEUE_TYPES.map((item) => (
          <ToggleChip
            active={queueType === item.value}
            key={item.value}
            label={item.label}
            onPress={() => {
              setQueueType(item.value);
              setOffset(0);
            }}
          />
        ))}
      </View>

      <View style={[styles.summaryCard, publicShadows.card]}>
        <Text style={styles.subtitle}>Queue Summary</Text>
        <Text style={styles.meta}>Filter: {queueType}</Text>
        <Text style={styles.meta}>{facetSummary}</Text>
        {payload ? (
          <Text style={styles.meta}>
            Showing {payload.items.length ? offset + 1 : 0}-
            {Math.min(offset + PAGE_SIZE, payload.pagination.total)} of {payload.pagination.total}
          </Text>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!payload && !error ? <ActivityIndicator style={styles.loading} /> : null}

      {payload?.items.map((item) => (
        <View key={item.queueItemId} style={[styles.itemCard, publicShadows.card]}>
          <View style={styles.badges}>
            <Text style={[styles.badge, severityStyle(item.severity)]}>{item.severity}</Text>
            <Text style={styles.badge}>{formatQueueType(item.queueType)}</Text>
            <Text style={styles.badge}>{item.reviewStatus}</Text>
          </View>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.summary ? <Text style={styles.body}>{item.summary}</Text> : null}
          <Text style={styles.meta}>Source: {item.source}</Text>
          <Text style={styles.meta}>Subject: {item.subjectType}</Text>
          <Link
            href={{
              pathname: '/review/[queueItemId]',
              params: { queueItemId: item.queueItemId },
            } as never}
            style={styles.link}
          >
            Open evidence
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
    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: publicSpacing.space40 },
  headerCard: {
    backgroundColor: publicColors.pearl,
    borderColor: publicColors.gold,
    borderRadius: 36,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space24,
  },
  kicker: { color: publicColors.gold, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: publicColors.ink, fontSize: 30, fontWeight: '900', lineHeight: 36 },
  subtitle: { color: publicColors.ink, fontSize: 20, fontWeight: '900' },
  body: { color: publicColors.inkSoft, fontSize: 16, lineHeight: 25 },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: publicSpacing.space8 },
  summaryCard: {
    backgroundColor: publicColors.goldWash,
    borderColor: publicColors.lineStrong,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space8,
    padding: publicSpacing.space20,
  },
  boundaryCard: {
    backgroundColor: publicColors.forest,
    borderColor: publicColors.gold,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  boundaryLabel: { color: publicColors.goldSoft, fontWeight: '900', textTransform: 'uppercase' },
  boundaryTitle: { color: publicColors.white, fontSize: 24, fontWeight: '900', lineHeight: 30 },
  boundaryBody: { color: publicColors.mint, fontSize: 16, lineHeight: 25 },
  boundaryNote: { color: publicColors.mint, fontSize: 15, fontWeight: '800', lineHeight: 23 },
  boundaryLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: publicSpacing.space8 },
  secondaryLink: {
    backgroundColor: 'rgba(255, 253, 247, 0.1)',
    borderColor: 'rgba(255, 253, 247, 0.2)',
    borderRadius: publicRadii.pill,
    borderWidth: 1,
    color: publicColors.white,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
  itemCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space8,
    padding: publicSpacing.space20,
  },
  itemTitle: { color: publicColors.ink, fontSize: 18, fontWeight: '900' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: publicSpacing.space8 },
  badge: {
    backgroundColor: publicColors.mintSoft,
    borderRadius: 999,
    color: publicColors.deepGreen,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textTransform: 'uppercase',
  },
  high: { backgroundColor: '#fee2e2', color: '#991b1b' },
  medium: { backgroundColor: '#fef3c7', color: '#92400e' },
  low: { backgroundColor: '#dcfce7', color: '#166534' },
  meta: { color: publicColors.muted },
  link: { color: publicColors.deepGreen, fontWeight: '900', marginTop: 4 },
  error: { color: publicColors.danger, fontWeight: '900' },
  pager: { flexDirection: 'row', gap: publicSpacing.space8, justifyContent: 'space-between' },
  pageButton: {
    backgroundColor: publicColors.deepGreen,
    borderRadius: publicRadii.pill,
    flex: 1,
    padding: publicSpacing.space16,
  },
  disabledButton: { backgroundColor: publicColors.muted },
  pageButtonText: { color: publicColors.white, fontWeight: '900', textAlign: 'center' },
});
