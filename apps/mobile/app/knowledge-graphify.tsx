import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { PrivateModeRibbon } from '../src/components/PrivateModeRibbon';
import { PrivateWorkspaceShell } from '../src/components/PrivateWorkspaceShell';
import { getKnowledgeGraphifyCp27 } from '../src/services/privateContentApi';
import type { PrivateCp27InternalUiInspectionResponse } from '@rafiq/shared';
import {
  publicColors,
  publicRadii,
  publicShadows,
  publicSpacing,
} from '../src/theme/publicDesignSystem';

type Tone = 'default' | 'pass' | 'warn' | 'block';

function toneStyle(tone: Tone) {
  if (tone === 'pass') return styles.passPill;
  if (tone === 'warn') return styles.warnPill;
  if (tone === 'block') return styles.blockPill;
  return null;
}

function StatCard({ label, tone = 'default', value }: { label: string; value: string | number; tone?: Tone }) {
  return (
    <View style={[styles.statCard, tone === 'pass' ? styles.passCard : tone === 'warn' ? styles.warnCard : tone === 'block' ? styles.blockCard : null]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Pill({ label, tone = 'default' }: { label: string; tone?: Tone }) {
  return <Text style={[styles.pill, toneStyle(tone)]}>{label}</Text>;
}

function KeyValue({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  return (
    <View style={styles.keyValue}>
      <Text style={styles.keyLabel}>{label}</Text>
      <Text style={styles.keyText}>{String(value ?? 'none')}</Text>
    </View>
  );
}

function Section({ children, kicker, title }: { children: ReactNode; kicker: string; title: string }) {
  return (
    <View style={[styles.section, publicShadows.card]}>
      <Text style={styles.kicker}>{kicker}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function KnowledgeGraphifyScreen() {
  const [payload, setPayload] = useState<PrivateCp27InternalUiInspectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPayload(null);
    setError(null);
    void getKnowledgeGraphifyCp27()
      .then(setPayload)
      .catch((graphifyError: unknown) => {
        setError(graphifyError instanceof Error ? graphifyError.message : 'Knowledge Graphify failed');
      });
  }, []);

  const diffStatus = useMemo(() => {
    if (!payload) return [];
    return [
      ['matched', payload.diff.matchedCount, 'pass' as Tone],
      ['added', payload.diff.addedCount, 'warn' as Tone],
      ['removed', payload.diff.removedCount, 'warn' as Tone],
      ['changed', payload.diff.changedCount, 'warn' as Tone],
      ['deferred', payload.diff.deferredCount, 'block' as Tone],
      ['blocked', payload.diff.blockedCount, 'block' as Tone],
    ];
  }, [payload]);

  return (
    <PrivateWorkspaceShell
      action={{ href: '/review-workbench', label: 'Review workbench' }}
      eyebrow="Private Knowledge Graphify"
      includeReviewNav
      subtitle="Internal CP27 refreshed graph and vault inspection. This is not a public RAFIQ surface."
      title="Graph and vault inspection"
    >
      <PrivateModeRibbon notice={payload?.notice} />

      <View style={[styles.boundaryBand, publicShadows.card]}>
        <View style={styles.rowWrap}>
          <Pill label="CP27-G06 internal proof" tone="pass" />
          <Pill label="Summary-only payload" tone="warn" />
          <Pill label="Public release blocked" tone="block" />
        </View>
        <Text style={styles.boundaryTitle}>Refresh-backed graph and vault status, without full private dumps.</Text>
        <Text style={styles.boundaryBody}>
          This screen reads the CP27 private inspection endpoint. It shows counts, checksums, diff status, and public-boundary proof only.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!payload && !error ? <ActivityIndicator style={styles.loading} /> : null}

      {payload ? (
        <>
          <View style={styles.statsGrid}>
            <StatCard label="Refreshed nodes" value={payload.graph.nodeCount} tone="pass" />
            <StatCard label="Refreshed edges" value={payload.graph.edgeCount} tone="pass" />
            <StatCard label="Partitions" value={payload.graph.partitionCount} />
            <StatCard label="Indexes" value={payload.graph.indexCount} />
            <StatCard label="Vault packs" value={payload.vault.artifactCount} />
            <StatCard label="Referenced nodes" value={payload.vault.graphNodesReferenced} />
            <StatCard label="Unresolved refs" value={payload.graph.unresolvedReferenceCount} tone="block" />
            <StatCard label="High/critical blockers" value={payload.graph.highOrCriticalBlockerCount} tone="block" />
            <StatCard label="Public-safe nodes" value={payload.graph.publicSafeNodeCount} tone="block" />
            <StatCard label="Public-safe packs" value={payload.vault.publicSafeArtifactCount} tone="block" />
          </View>

          <Section kicker="Verifier Proof" title={payload.verifier.command}>
            <View style={styles.rowWrap}>
              <Pill label={`${payload.verifier.status} / ${payload.verifier.checkpoint}`} tone="pass" />
              <Pill label={payload.sourceCheckpoints.graph} tone="warn" />
              <Pill label={payload.sourceCheckpoints.vault} tone="warn" />
              <Pill label={payload.sourceCheckpoints.diff} tone="warn" />
            </View>
            <Text style={styles.body}>{payload.responseBoundary.message}</Text>
            <View style={styles.keyGrid}>
              <KeyValue label="Full graph dump included" value={payload.responseBoundary.fullGraphDumpIncluded} />
              <KeyValue label="Full vault dump included" value={payload.responseBoundary.fullVaultDumpIncluded} />
              <KeyValue label="Raw source text included" value={payload.responseBoundary.rawSourceTextIncluded} />
            </View>
          </Section>

          <Section kicker="CP22 Baseline Diff" title={payload.diff.proofId}>
            <View style={styles.compareGrid}>
              <KeyValue label="Graph nodes CP22 -> CP27" value={`${payload.diff.graphBaselineNodes} -> ${payload.diff.graphRefreshedNodes}`} />
              <KeyValue label="Graph edges CP22 -> CP27" value={`${payload.diff.graphBaselineEdges} -> ${payload.diff.graphRefreshedEdges}`} />
              <KeyValue label="Vault packs CP22 -> CP27" value={`${payload.diff.vaultBaselineArtifacts} -> ${payload.diff.vaultRefreshedArtifacts}`} />
            </View>
            <View style={styles.rowWrap}>
              {diffStatus.map(([label, count, tone]) => (
                <Pill key={label} label={`${label}: ${count}`} tone={tone} />
              ))}
            </View>
          </Section>

          <Section kicker="Graph Partitions" title={payload.graph.graphId}>
            <View style={styles.table}>
              {payload.graph.partitions.map((partition) => (
                <View key={partition.name} style={styles.tableRow}>
                  <View style={styles.tablePrimary}>
                    <Text style={styles.tableTitle}>{partition.name}</Text>
                    <Text style={styles.tableMeta}>{partition.path}</Text>
                  </View>
                  <Text style={styles.tableCount}>{partition.nodeCount} / {partition.edgeCount}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section kicker="Graph Indexes" title={`${payload.graph.indexCount} bounded index summaries`}>
            <View style={styles.table}>
              {payload.graph.indexes.map((index) => (
                <View key={index.name} style={styles.tableRow}>
                  <View style={styles.tablePrimary}>
                    <Text style={styles.tableTitle}>{index.name}</Text>
                    <Text style={styles.tableMeta}>{index.path}</Text>
                  </View>
                  <Text style={styles.tableCount}>{index.entryCount}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section kicker="Vault Categories" title={payload.vault.vaultId}>
            <View style={styles.rowWrap}>
              {Object.entries(payload.vault.categoryCounts).map(([category, count]) => (
                <Pill key={category} label={`${category}: ${count}`} />
              ))}
            </View>
            <View style={styles.keyGrid}>
              <KeyValue label="Vault manifest" value={payload.vault.manifest.path} />
              <KeyValue label="Vault checksum" value={payload.vault.checksumLedger.sha256?.slice(0, 16)} />
              <KeyValue label="Graph checksum" value={payload.graph.manifest.sha256?.slice(0, 16)} />
            </View>
          </Section>

          <Section kicker="Public Boundary" title="Blocked for public release">
            <Text style={styles.body}>{payload.publicBoundary.message}</Text>
            <View style={styles.rowWrap}>
              <Pill label={`snapshot rows: ${payload.publicBoundary.publicSafeSnapshotRowCount}`} tone="block" />
              <Pill label={`graph nodes: ${payload.publicBoundary.publicSafeGraphNodeCount}`} tone="block" />
              <Pill label={`graph edges: ${payload.publicBoundary.publicSafeGraphEdgeCount}`} tone="block" />
              <Pill label={`vault packs: ${payload.publicBoundary.publicSafeVaultArtifactCount}`} tone="block" />
            </View>
          </Section>

          <Section kicker="Artifact Paths" title="Generated proof inputs">
            <View style={styles.keyGrid}>
              <KeyValue label="Latest graph" value={payload.artifactPaths.latestGraphPointer} />
              <KeyValue label="Latest vault" value={payload.artifactPaths.latestVaultPointer} />
              <KeyValue label="Latest diff" value={payload.artifactPaths.latestDiffPointer} />
              <KeyValue label="UI proof" value={payload.artifactPaths.internalUiProof} />
            </View>
          </Section>
        </>
      ) : null}
    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  boundaryBand: {
    backgroundColor: '#fff8e1',
    borderColor: '#f0c36a',
    borderRadius: publicRadii.md,
    borderWidth: 1,
    gap: publicSpacing.sm,
    padding: publicSpacing.lg,
  },
  boundaryBody: {
    color: publicColors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  boundaryTitle: {
    color: publicColors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  blockCard: {
    borderColor: '#ef4444',
  },
  blockPill: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
    color: '#991b1b',
  },
  body: {
    color: publicColors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  compareGrid: {
    gap: publicSpacing.sm,
  },
  error: {
    color: '#991b1b',
    fontSize: 14,
    fontWeight: '700',
  },
  keyGrid: {
    gap: publicSpacing.sm,
  },
  keyLabel: {
    color: publicColors.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  keyText: {
    color: publicColors.text,
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  keyValue: {
    backgroundColor: publicColors.surface,
    borderColor: publicColors.border,
    borderRadius: publicRadii.sm,
    borderWidth: 1,
    gap: 4,
    padding: publicSpacing.sm,
  },
  kicker: {
    color: publicColors.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  loading: {
    marginVertical: publicSpacing.xl,
  },
  passCard: {
    borderColor: '#16a34a',
  },
  passPill: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
    color: '#166534',
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: publicColors.surface,
    borderColor: publicColors.border,
    borderRadius: publicRadii.sm,
    borderWidth: 1,
    color: publicColors.text,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.sm,
  },
  section: {
    backgroundColor: publicColors.card,
    borderColor: publicColors.border,
    borderRadius: publicRadii.md,
    borderWidth: 1,
    gap: publicSpacing.md,
    padding: publicSpacing.lg,
  },
  sectionTitle: {
    color: publicColors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  statCard: {
    backgroundColor: publicColors.card,
    borderColor: publicColors.border,
    borderRadius: publicRadii.md,
    borderWidth: 1,
    flexBasis: 150,
    flexGrow: 1,
    gap: 4,
    minWidth: 140,
    padding: publicSpacing.md,
  },
  statLabel: {
    color: publicColors.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.md,
  },
  statValue: {
    color: publicColors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  table: {
    borderColor: publicColors.border,
    borderRadius: publicRadii.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableCount: {
    color: publicColors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  tableMeta: {
    color: publicColors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  tablePrimary: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  tableRow: {
    alignItems: 'center',
    borderBottomColor: publicColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: publicSpacing.md,
    justifyContent: 'space-between',
    padding: publicSpacing.sm,
  },
  tableTitle: {
    color: publicColors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  warnCard: {
    borderColor: '#f59e0b',
  },
  warnPill: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    color: '#92400e',
  },
});
