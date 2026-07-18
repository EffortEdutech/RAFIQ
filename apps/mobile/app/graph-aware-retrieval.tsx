import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type {
  PrivateCp23RemediationItem,
  PrivateCp24EvidenceCandidate,
  PrivateCp24EvidenceRouteItem,
  PrivateCp24GraphAwareRetrievalResponse,
  PrivateCp24ValidationGateResult,
} from '@rafiq/shared';
import { PrivateModeRibbon } from '../src/components/PrivateModeRibbon';
import { PrivateWorkspaceShell } from '../src/components/PrivateWorkspaceShell';
import { createGraphAwareRetrievalCp24 } from '../src/services/privateContentApi';
import {
  publicColors,
  publicRadii,
  publicShadows,
  publicSpacing,
} from '../src/theme/publicDesignSystem';

type Tone = 'default' | 'pass' | 'warn' | 'block';

const FIXTURES = [
  ['Quran anchor', 'cp24-fixture-quran-anchor-001'],
  ['Translation', 'cp24-fixture-translation-001'],
  ['Tafsir', 'cp24-fixture-tafsir-001'],
  ['Hadith', 'cp24-fixture-hadith-001'],
  ['Topic', 'cp24-fixture-topic-001'],
  ['Validation', 'cp24-fixture-validation-001'],
  ['Scholar', 'cp24-fixture-scholar-escalation-001'],
  ['Safety', 'cp24-fixture-safety-escalation-001'],
  ['Source gap', 'cp24-fixture-source-gap-001'],
  ['Public gate', 'cp24-fixture-public-boundary-001'],
] as const;

function Pill({ label, tone = 'default' }: { label: string; tone?: Tone }) {
  return (
    <Text
      style={[
        styles.pill,
        tone === 'pass' ? styles.passPill : null,
        tone === 'warn' ? styles.warnPill : null,
        tone === 'block' ? styles.blockPill : null,
      ]}
    >
      {label}
    </Text>
  );
}

function StatCard({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: Tone }) {
  return (
    <View style={[styles.statCard, tone === 'pass' ? styles.passCard : tone === 'warn' ? styles.warnCard : tone === 'block' ? styles.blockCard : null]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function KeyValue({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  return (
    <View style={styles.keyValue}>
      <Text style={styles.keyLabel}>{label}</Text>
      <Text style={styles.keyText}>{String(value ?? 'none')}</Text>
    </View>
  );
}

function candidateTone(candidate: PrivateCp24EvidenceCandidate): Tone {
  if (candidate.selectionState === 'selected') return 'pass';
  if (candidate.selectionState === 'requires_escalation' || candidate.selectionState === 'rejected') return 'block';
  if (candidate.selectionState === 'held' || candidate.selectionState === 'requires_review') return 'warn';
  return 'default';
}

function gateTone(gate: PrivateCp24ValidationGateResult): Tone {
  if (gate.status === 'pass') return 'pass';
  if (gate.status === 'escalated' || gate.status === 'blocked' || gate.status === 'fail') return 'block';
  return 'warn';
}

function routeItemTone(item: PrivateCp24EvidenceRouteItem): Tone {
  if (item.validationImpact === 'supports') return 'pass';
  if (item.validationImpact === 'escalates' || item.validationImpact === 'blocks') return 'block';
  return 'warn';
}

function CandidateCard({
  candidate,
  onPress,
  selected,
}: {
  candidate: PrivateCp24EvidenceCandidate;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.candidateCard, selected ? styles.candidateCardSelected : null]}>
      <View style={styles.rowWrap}>
        <Pill label={candidate.selectionState} tone={candidateTone(candidate)} />
        <Pill label={candidate.contentType} />
        {candidate.ordinaryScore !== null ? <Pill label={`score ${candidate.ordinaryScore}`} tone="pass" /> : <Pill label="escalation split" tone="block" />}
      </View>
      <Text style={[styles.cardTitle, selected ? styles.cardTitleSelected : null]}>{candidate.canonicalRef}</Text>
      <Text style={[styles.body, selected ? styles.bodySelected : null]}>{candidate.selectionReason}</Text>
      <Text style={[styles.monoText, selected ? styles.monoTextSelected : null]}>{candidate.graphNodeIds.slice(0, 3).join(', ')}</Text>
    </Pressable>
  );
}

function RouteItemCard({ item }: { item: PrivateCp24EvidenceRouteItem }) {
  return (
    <View style={styles.routeItem}>
      <View style={styles.rowWrap}>
        <Pill label={item.validationImpact} tone={routeItemTone(item)} />
        <Pill label={item.role} />
        <Pill label={item.selectionState} tone={item.selectionState === 'selected' ? 'pass' : item.selectionState === 'requires_escalation' ? 'block' : 'warn'} />
      </View>
      <Text style={styles.cardTitle}>{item.canonicalRef}</Text>
      <Text style={styles.body}>{item.selectionReason}</Text>
      <View style={styles.compactGrid}>
        <KeyValue label="Graph nodes" value={item.graphNodeIds.length} />
        <KeyValue label="Graph edges" value={item.graphEdgeIds.length} />
        <KeyValue label="Sources" value={item.sourceIds.length} />
        <KeyValue label="Vault packs" value={item.vaultPackIds.length} />
      </View>
      <Text style={styles.monoText}>{item.graphNodeIds.slice(0, 4).join(', ')}</Text>
    </View>
  );
}

function RemediationCard({ item }: { item: PrivateCp23RemediationItem }) {
  return (
    <View style={styles.routeItem}>
      <View style={styles.rowWrap}>
        <Pill label={item.severity} tone={item.severity === 'high' || item.severity === 'critical' ? 'block' : 'warn'} />
        <Pill label={item.ownerRole} />
        <Pill label={item.status} tone="warn" />
      </View>
      <Text style={styles.cardTitle}>{item.remediationId}</Text>
      <Text style={styles.body}>{item.requiredAction}</Text>
      <Text style={styles.monoText}>{item.graphNodeIds.slice(0, 4).join(', ')}</Text>
    </View>
  );
}

export default function GraphAwareRetrievalScreen() {
  const [fixtureId, setFixtureId] = useState(FIXTURES[0][1]);
  const [payload, setPayload] = useState<PrivateCp24GraphAwareRetrievalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  useEffect(() => {
    setPayload(null);
    setError(null);
    setSelectedCandidateId(null);
    void createGraphAwareRetrievalCp24({
      queryText: `internal CP24 fixture ${fixtureId}`,
      fixtureId,
      graphMode: 'rank_and_explain',
      limit: 8,
      maxDepth: 2,
    })
      .then((response) => {
        setPayload(response);
        setSelectedCandidateId(response.candidates[0]?.candidateId ?? null);
      })
      .catch((retrievalError: unknown) => {
        setError(retrievalError instanceof Error ? retrievalError.message : 'CP24 retrieval failed');
      });
  }, [fixtureId]);

  const selectedCandidate = useMemo(() => {
    return payload?.candidates.find((candidate) => candidate.candidateId === selectedCandidateId) ?? payload?.candidates[0] ?? null;
  }, [payload, selectedCandidateId]);

  const routeItems = useMemo(() => {
    if (!payload) return [];
    return [
      ...payload.evidenceRoute.selectedEvidence,
      ...payload.evidenceRoute.escalationEvidence,
      ...payload.evidenceRoute.rejectedEvidence,
    ];
  }, [payload]);

  return (
    <PrivateWorkspaceShell
      action={{ href: '/review-workbench', label: 'Review workbench' }}
      eyebrow="CP24 Internal Retrieval"
      includeReviewNav
      subtitle="Private graph-aware retrieval inspector for ranking, evidence routes, validation handoff, and reviewer remediation."
      title="Graph-aware retrieval"
    >
      <PrivateModeRibbon notice={payload?.notice} />

      <View style={[styles.boundaryBand, publicShadows.card]}>
        <View style={styles.rowWrap}>
          <Pill label="CP24-G07" tone="pass" />
          <Pill label="Private UI" tone="warn" />
          <Pill label="Public release blocked" tone="block" />
        </View>
        <Text style={styles.boundaryTitle}>Inspect bounded CP24 retrieval output without exposing the resource graph.</Text>
        <Text style={styles.boundaryBody}>
          This screen calls only the private CP24 API route and shows candidates, route items, validation gates, graph/vault IDs, and remediation handoff.
        </Text>
      </View>

      <View style={[styles.section, publicShadows.card]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleBlock}>
            <Text style={styles.kicker}>Fixture Selector</Text>
            <Text style={styles.sectionTitle}>Prototype query routes</Text>
          </View>
          {payload ? <Pill label={payload.checkpoint} tone="pass" /> : null}
        </View>
        <View style={styles.fixtureGrid}>
          {FIXTURES.map(([label, id]) => {
            const selected = fixtureId === id;
            return (
              <Pressable key={id} onPress={() => setFixtureId(id)} style={[styles.fixtureButton, selected ? styles.fixtureButtonSelected : null]}>
                <Text style={[styles.fixtureLabel, selected ? styles.fixtureLabelSelected : null]}>{label}</Text>
                <Text style={[styles.fixtureId, selected ? styles.fixtureIdSelected : null]}>{id}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!payload && !error ? <ActivityIndicator style={styles.loading} /> : null}

      {payload ? (
        <ScrollView contentContainerStyle={styles.contentStack}>
          <View style={styles.statsGrid}>
            <StatCard label="Candidates" value={payload.candidates.length} tone="pass" />
            <StatCard label="Selected" value={payload.selectedCandidateIds.length} tone="pass" />
            <StatCard label="Held" value={payload.heldCandidateIds.length} tone="warn" />
            <StatCard label="Escalation" value={payload.requiresEscalationCandidateIds.length} tone="block" />
            <StatCard label="Route items" value={routeItems.length} tone="warn" />
            <StatCard label="Gate results" value={payload.evidenceRoute.validationGateResults.length} />
            <StatCard label="Remediation" value={payload.reviewerHandoff.remediationItems.length} tone="warn" />
            <StatCard label="Public-safe" value={payload.publicBoundary.publicSafeCandidateCount} tone="block" />
          </View>

          <View style={[styles.section, publicShadows.card]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.kicker}>Private Route Proof</Text>
                <Text style={styles.sectionTitle}>{payload.route}</Text>
              </View>
              <Pill label={payload.graphMode} tone="pass" />
            </View>
            <View style={styles.compactGrid}>
              <KeyValue label="Fixture" value={payload.query.fixtureId} />
              <KeyValue label="Intent" value={payload.query.intent} />
              <KeyValue label="Domain" value={payload.query.domain} />
              <KeyValue label="Trace" value={payload.retrievalTraceId} />
              <KeyValue label="Graph nodes shown" value={payload.graphProof.resolvedGraphNodeCount} />
              <KeyValue label="Graph edges shown" value={payload.graphProof.resolvedGraphEdgeCount} />
              <KeyValue label="Vault packs shown" value={payload.graphProof.resolvedVaultPackCount} />
              <KeyValue label="Public route exposed" value={payload.publicBoundary.publicRouteExposed} />
            </View>
            <Text style={styles.body}>{payload.publicBoundary.message}</Text>
          </View>

          <View style={[styles.section, publicShadows.card]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.kicker}>Candidate Ranking</Text>
                <Text style={styles.sectionTitle}>Operational relevance only</Text>
              </View>
              <Pill label={`${payload.outputCaps.maxExpandedCandidates} candidate cap`} />
            </View>
            <View style={styles.cardGrid}>
              {payload.candidates.map((candidate) => (
                <CandidateCard
                  candidate={candidate}
                  key={candidate.candidateId}
                  onPress={() => setSelectedCandidateId(candidate.candidateId)}
                  selected={candidate.candidateId === selectedCandidate?.candidateId}
                />
              ))}
            </View>
            {selectedCandidate ? (
              <View style={styles.detailPanel}>
                <Text style={styles.cardTitle}>Candidate detail</Text>
                <View style={styles.compactGrid}>
                  <KeyValue label="Candidate" value={selectedCandidate.candidateId} />
                  <KeyValue label="Quality" value={selectedCandidate.qualityState} />
                  <KeyValue label="Review" value={selectedCandidate.reviewState} />
                  <KeyValue label="Public safe" value={selectedCandidate.publicSafe} />
                  <KeyValue label="Sources" value={selectedCandidate.sourceIds.length} />
                  <KeyValue label="Provenance" value={selectedCandidate.provenanceIds.length} />
                  <KeyValue label="Release refs" value={selectedCandidate.releaseStateIds.length} />
                  <KeyValue label="Vault packs" value={selectedCandidate.vaultPackIds.length} />
                </View>
                <Text style={styles.body}>{selectedCandidate.rankingExplanations.map((item) => item.explanation).slice(0, 3).join(' ')}</Text>
                <Text style={styles.monoText}>{selectedCandidate.graphNodeIds.slice(0, 6).join(', ')}</Text>
              </View>
            ) : null}
          </View>

          <View style={[styles.section, publicShadows.card]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.kicker}>Evidence Route</Text>
                <Text style={styles.sectionTitle}>{payload.evidenceRoute.evidenceRouteId}</Text>
              </View>
              <Pill label={`${routeItems.length} bounded items`} tone="warn" />
            </View>
            <View style={styles.cardGrid}>
              {routeItems.map((item) => (
                <RouteItemCard item={item} key={item.routeItemId} />
              ))}
            </View>
          </View>

          <View style={[styles.section, publicShadows.card]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.kicker}>Validation Handoff</Text>
                <Text style={styles.sectionTitle}>Gate and citation coverage</Text>
              </View>
              <Pill label={`${payload.validationHandoff.requiredGates.length} gates`} tone="pass" />
            </View>
            <View style={styles.compactGrid}>
              <KeyValue label="Selected route IDs" value={payload.validationHandoff.selectedEvidenceRouteItemIds.length} />
              <KeyValue label="Selected refs" value={payload.validationHandoff.selectedCanonicalRefs.length} />
              <KeyValue label="Cited sources" value={payload.validationHandoff.citedSourceIds.length} />
              <KeyValue label="Missing citations" value={payload.validationHandoff.missingCitationIds.length} />
              <KeyValue label="Unresolved refs" value={payload.validationHandoff.unresolvedReferenceIds.length} />
              <KeyValue label="Public approved" value={payload.validationHandoff.publicReleaseApproved} />
            </View>
            <View style={styles.gateGrid}>
              {payload.evidenceRoute.validationGateResults.map((gate) => (
                <View key={gate.gate} style={styles.gateCard}>
                  <View style={styles.rowWrap}>
                    <Pill label={gate.status} tone={gateTone(gate)} />
                    <Pill label={gate.graphLinked ? 'graph linked' : 'no graph link'} tone={gate.graphLinked ? 'pass' : 'warn'} />
                  </View>
                  <Text style={styles.cardTitle}>{gate.gate}</Text>
                  <Text style={styles.body}>{gate.notes}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.section, publicShadows.card]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.kicker}>Reviewer Handoff</Text>
                <Text style={styles.sectionTitle}>Remediation and audit preview</Text>
              </View>
              <Pill label={`${payload.reviewerHandoff.openBlockingRemediationCount} blockers`} tone="block" />
            </View>
            <View style={styles.compactGrid}>
              <KeyValue label="Queue items" value={payload.reviewerHandoff.queueItems.length} />
              <KeyValue label="Remediation items" value={payload.reviewerHandoff.remediationItems.length} />
              <KeyValue label="Audit events" value={payload.reviewerHandoff.auditEvents.length} />
              <KeyValue label="Reviewer roles" value={payload.reviewerHandoff.requiredReviewerRoles.join(', ')} />
            </View>
            <View style={styles.cardGrid}>
              {payload.reviewerHandoff.remediationItems.map((item) => (
                <RemediationCard item={item} key={item.remediationId} />
              ))}
            </View>
          </View>
        </ScrollView>
      ) : null}
    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  blockCard: { backgroundColor: '#fee2e2', borderColor: '#fecaca' },
  blockPill: { backgroundColor: '#fee2e2', color: '#991b1b' },
  body: {
    color: publicColors.slate,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  bodySelected: { color: '#f8fafc' },
  boundaryBand: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space20,
  },
  boundaryBody: {
    color: publicColors.slate,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 23,
  },
  boundaryTitle: {
    color: publicColors.ink,
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 29,
  },
  candidateCard: {
    backgroundColor: '#fffdf7',
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    flexBasis: 280,
    flexGrow: 1,
    gap: publicSpacing.space8,
    minWidth: 0,
    padding: publicSpacing.space16,
  },
  candidateCardSelected: {
    backgroundColor: publicColors.deepGreen,
    borderColor: publicColors.deepGreen,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space12,
  },
  cardTitle: {
    color: publicColors.ink,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  cardTitleSelected: { color: '#ffffff' },
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space12,
  },
  contentStack: { gap: publicSpacing.space20 },
  detailPanel: {
    backgroundColor: publicColors.mintSoft,
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    gap: publicSpacing.space12,
    padding: publicSpacing.space16,
  },
  error: {
    backgroundColor: '#fee2e2',
    borderRadius: publicRadii.medium,
    color: '#991b1b',
    fontWeight: '900',
    padding: publicSpacing.space16,
  },
  fixtureButton: {
    backgroundColor: publicColors.pearl,
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    flexBasis: 190,
    flexGrow: 1,
    gap: publicSpacing.space4,
    minWidth: 0,
    padding: publicSpacing.space12,
  },
  fixtureButtonSelected: {
    backgroundColor: publicColors.deepGreen,
    borderColor: publicColors.deepGreen,
  },
  fixtureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space10,
  },
  fixtureId: {
    color: publicColors.muted,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '800',
  },
  fixtureIdSelected: { color: publicColors.mint },
  fixtureLabel: {
    color: publicColors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  fixtureLabelSelected: { color: publicColors.white },
  gateCard: {
    backgroundColor: publicColors.pearl,
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    flexBasis: 240,
    flexGrow: 1,
    gap: publicSpacing.space8,
    minWidth: 0,
    padding: publicSpacing.space14,
  },
  gateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space10,
  },
  keyLabel: {
    color: publicColors.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  keyText: {
    color: publicColors.ink,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  keyValue: {
    backgroundColor: '#ffffff',
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    flexBasis: 180,
    flexGrow: 1,
    gap: publicSpacing.space4,
    minWidth: 0,
    padding: publicSpacing.space12,
  },
  kicker: {
    color: publicColors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  loading: { padding: publicSpacing.space24 },
  monoText: {
    color: publicColors.slate,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  monoTextSelected: { color: '#d9f99d' },
  passCard: { backgroundColor: publicColors.mintSoft, borderColor: '#99f6e4' },
  passPill: { backgroundColor: publicColors.mintSoft, color: publicColors.deepGreen },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: publicColors.pearl,
    borderRadius: publicRadii.pill,
    color: publicColors.ink,
    fontSize: 11,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: publicSpacing.space10,
    paddingVertical: publicSpacing.space6,
    textTransform: 'uppercase',
  },
  routeItem: {
    backgroundColor: '#fffdf7',
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    flexBasis: 300,
    flexGrow: 1,
    gap: publicSpacing.space10,
    minWidth: 0,
    padding: publicSpacing.space16,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space8,
  },
  section: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.large,
    borderWidth: 1,
    gap: publicSpacing.space16,
    padding: publicSpacing.space20,
  },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space12,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: publicColors.ink,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
  },
  sectionTitleBlock: {
    flex: 1,
    gap: publicSpacing.space4,
    minWidth: 220,
  },
  statCard: {
    backgroundColor: publicColors.paper,
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    flexBasis: 145,
    flexGrow: 1,
    gap: publicSpacing.space4,
    minWidth: 0,
    padding: publicSpacing.space16,
  },
  statLabel: {
    color: publicColors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statValue: {
    color: publicColors.ink,
    fontSize: 28,
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: publicSpacing.space12,
  },
  warnCard: { backgroundColor: '#fef3c7', borderColor: '#facc15' },
  warnPill: { backgroundColor: '#fef3c7', color: '#92400e' },
});
