import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { PrivateModeRibbon } from '../../src/components/PrivateModeRibbon';
import { PrivateWorkspaceShell } from '../../src/components/PrivateWorkspaceShell';
import { SourceStatusPanel } from '../../src/components/SourceStatusPanel';
import {
  getReviewQueueItem,
  type PrivateReviewQueueItemResponse,
} from '../../src/services/privateContentApi';
import { publicColors, publicRadii, publicShadows, publicSpacing } from '../../src/theme/publicDesignSystem';

function asText(value: unknown) {
  if (value === null || value === undefined || value === '') return 'Not recorded';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value, null, 2);
}

function evidenceRoute(evidence: Record<string, unknown>) {
  const route = evidence.route;
  if (typeof route === 'string' && route.startsWith('/hadith/')) {
    return {
      pathname: '/hadith/[hadithRecordId]',
      params: { hadithRecordId: route.replace('/hadith/', '') },
    } as never;
  }
  if (typeof route === 'string' && route.startsWith('/quran/')) {
    return {
      pathname: '/quran/[surahNumber]',
      params: { surahNumber: route.replace('/quran/', '') },
    } as never;
  }
  return null;
}

function severityStyle(severity: 'low' | 'medium' | 'high') {
  if (severity === 'high') return styles.high;
  if (severity === 'medium') return styles.medium;
  return styles.low;
}

export default function ReviewQueueItemScreen() {
  const params = useLocalSearchParams<{ queueItemId?: string }>();
  const queueItemId = Array.isArray(params.queueItemId)
    ? params.queueItemId[0]
    : params.queueItemId;
  const [payload, setPayload] = useState<PrivateReviewQueueItemResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!queueItemId) return;
    setPayload(null);
    setError(null);
    void getReviewQueueItem(queueItemId)
      .then(setPayload)
      .catch((reviewError: unknown) => {
        setError(reviewError instanceof Error ? reviewError.message : 'Evidence request failed');
      });
  }, [queueItemId]);

  const sourceHref = useMemo(() => {
    if (!payload?.item) return null;
    return evidenceRoute(payload.item.evidence);
  }, [payload]);

  const evidenceEntries = payload?.item
    ? Object.entries(payload.item.evidence).filter(([, value]) => value !== null && value !== undefined)
    : [];

  return (
    <PrivateWorkspaceShell
      action={{ href: '/review', label: 'Back to queue' }}
      eyebrow="Internal Review Evidence"
      includeReviewNav
      subtitle="This detail screen is for reviewer decision-making only. It stays outside the normal RAFIQ guidance journey."
      title="Inspect the evidence behind one queue item."
    >
      <PrivateModeRibbon notice={payload?.notice} />
      <SourceStatusPanel notice={payload?.notice} />

      <View style={[styles.headerCard, publicShadows.raised]}>
        <Text style={styles.kicker}>Internal Evidence Boundary</Text>
        <Text style={styles.title}>Reviewer notes stay separate from user guidance.</Text>
        <Text style={styles.headerBody}>
          Private evidence screen for internal reviewer decision-making. This
          page is not a public content approval.
        </Text>
        <Link href="/review" style={styles.link}>Back to review queue</Link>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!payload && !error ? <ActivityIndicator style={styles.loading} /> : null}

      {payload?.item ? (
        <>
          <View style={[styles.itemCard, publicShadows.card]}>
            <View style={styles.badges}>
              <Text style={[styles.badge, severityStyle(payload.item.severity)]}>
                {payload.item.severity}
              </Text>
              <Text style={styles.badge}>{payload.item.queueType.replace(/_/g, ' ')}</Text>
              <Text style={styles.badge}>{payload.item.reviewStatus}</Text>
            </View>
            <Text style={styles.itemTitle}>{payload.item.title}</Text>
            {payload.item.summary ? <Text style={styles.body}>{payload.item.summary}</Text> : null}
            <Text style={styles.trace}>Queue item: {payload.item.queueItemId}</Text>
            <Text style={styles.meta}>Source: {payload.item.source}</Text>
            <Text style={styles.meta}>Subject: {payload.item.subjectType}</Text>
            {sourceHref ? (
              <Link href={sourceHref} style={styles.link}>Open source context</Link>
            ) : null}
          </View>

          {payload.retrievalTrace ? (
            <View style={[styles.itemCard, publicShadows.card]}>
              <Text style={styles.subtitle}>Retrieval Trace</Text>
              <Text style={styles.meta}>Trace: {payload.retrievalTrace.traceId}</Text>
              <Text style={styles.meta}>Query: {payload.retrievalTrace.queryText ?? 'Not recorded'}</Text>
              <Text style={styles.meta}>Domain: {payload.retrievalTrace.domainFilter}</Text>
              <Text style={styles.meta}>Total results: {payload.retrievalTrace.totalResults}</Text>
              <Text style={styles.meta}>Review status: {payload.retrievalTrace.reviewStatus}</Text>
              <Text style={styles.code}>
                Returned IDs: {payload.retrievalTrace.returnedResultIds.join(', ') || 'None'}
              </Text>
            </View>
          ) : null}

          <View style={[styles.itemCard, publicShadows.card]}>
            <Text style={styles.subtitle}>Evidence Fields</Text>
            {evidenceEntries.map(([key, value]) => (
              <View key={key} style={styles.evidenceRow}>
                <Text style={styles.evidenceKey}>{key}</Text>
                <Text style={styles.evidenceValue}>{asText(value)}</Text>
              </View>
            ))}
          </View>
        </>
      ) : payload ? (
        <Text style={styles.error}>Review queue item was not found.</Text>
      ) : null}
    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: publicSpacing.space40 },
  headerCard: {
    backgroundColor: publicColors.forest,
    borderColor: publicColors.gold,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space24,
  },
  itemCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.xlarge,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  kicker: { color: publicColors.goldSoft, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: publicColors.white, fontSize: 28, fontWeight: '900', lineHeight: 34 },
  headerBody: { color: publicColors.mint, lineHeight: 22 },
  subtitle: { color: publicColors.ink, fontSize: 20, fontWeight: '900' },
  itemTitle: { color: publicColors.ink, fontSize: 18, fontWeight: '900' },
  body: { color: publicColors.inkSoft, lineHeight: 22 },
  meta: { color: publicColors.muted },
  trace: { color: publicColors.warning, fontFamily: 'monospace', fontSize: 12 },
  code: { color: publicColors.warning, fontFamily: 'monospace', fontSize: 12 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: publicSpacing.space8 },
  badge: {
    backgroundColor: publicColors.mintSoft,
    borderRadius: publicRadii.pill,
    color: publicColors.deepGreen,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space12,
    paddingVertical: publicSpacing.space8,
    textTransform: 'uppercase',
  },
  high: { backgroundColor: '#fee2e2', color: '#991b1b' },
  medium: { backgroundColor: '#fef3c7', color: '#92400e' },
  low: { backgroundColor: '#dcfce7', color: '#166534' },
  evidenceRow: { borderTopColor: publicColors.line, borderTopWidth: 1, gap: publicSpacing.space4, paddingTop: publicSpacing.space12 },
  evidenceKey: { color: publicColors.deepGreen, fontWeight: '900' },
  evidenceValue: { color: publicColors.ink, fontFamily: 'monospace', fontSize: 12 },
  link: { color: publicColors.deepGreen, fontWeight: '900', marginTop: publicSpacing.space4 },
  error: { color: publicColors.danger, fontWeight: '900' },
});
