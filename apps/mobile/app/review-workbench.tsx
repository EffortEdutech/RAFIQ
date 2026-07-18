import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type {
  PrivateCp23EvidenceCandidate,
  PrivateCp23EvidenceRoute,
  PrivateCp23ReviewQueueItem,
  PrivateCp25ReviewerAction,
  PrivateCp25ReviewerActionResponse,
  PrivateCp25ReviewQueueItem,
  PrivateCp25WorkbenchStateResponse,
  PrivateCp26SnapshotStatusResponse,
  PrivateReviewWorkbenchCp23Response,
} from '@rafiq/shared';
import { PrivateModeRibbon } from '../src/components/PrivateModeRibbon';
import { PrivateWorkspaceShell } from '../src/components/PrivateWorkspaceShell';
import {
  createReviewerWorkbenchCp25Action,
  getCp26SnapshotStatus,
  getReviewerWorkbenchCp25,
  getReviewWorkbenchCp23,
} from '../src/services/privateContentApi';
import {
  publicColors,
  publicRadii,
  publicShadows,
  publicSpacing,
} from '../src/theme/publicDesignSystem';

type Tone = 'default' | 'pass' | 'warn' | 'block';

const ACTION_LABELS: Record<PrivateCp25ReviewerAction, string> = {
  claim: 'Claim',
  request_technical_review: 'Technical review',
  request_content_review: 'Content review',
  request_scholar_review: 'Scholar review',
  request_product_owner_review: 'Product Owner',
  request_remediation: 'Remediation',
  approve_private: 'Approve private',
  mark_public_candidate: 'Public candidate',
  reject: 'Reject',
  defer: 'Defer',
  retire: 'Retire',
};

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
    <View style={[styles.statCard, tone === 'block' ? styles.blockCard : tone === 'pass' ? styles.passCard : null]}>
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

function candidateTone(candidate: PrivateCp23EvidenceCandidate): Tone {
  if (candidate.selectionState === 'selected') return 'pass';
  if (candidate.selectionState === 'requires_escalation') return 'block';
  if (candidate.selectionState === 'requires_review') return 'warn';
  return 'default';
}

function QueueItemCard({ item }: { item: PrivateCp23ReviewQueueItem }) {
  return (
    <View style={styles.queueCard}>
      <View style={styles.rowWrap}>
        <Pill label={item.queueType} tone={item.severity === 'high' || item.severity === 'critical' ? 'block' : 'warn'} />
        <Pill label={item.assignedRole} />
        <Pill label={item.reviewStatus} tone="warn" />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.body}>{item.summary}</Text>
      <View style={styles.compactGrid}>
        <KeyValue label="Subject" value={`${item.subjectType} / ${item.subjectId}`} />
        <KeyValue label="Graph nodes" value={item.graphNodeIds.length} />
        <KeyValue label="Vault packs" value={item.vaultPackIds.length} />
        <KeyValue label="Remediation" value={item.remediationIds.length} />
      </View>
    </View>
  );
}

function cp25Tone(item: Pick<PrivateCp25ReviewQueueItem, 'severity' | 'reviewStatus'>): Tone {
  if (item.severity === 'critical' || item.severity === 'high') return 'block';
  if (item.reviewStatus === 'remediation_required' || item.reviewStatus.includes('review')) return 'warn';
  return 'default';
}

function defaultCp25Action(item: PrivateCp25ReviewQueueItem | null): PrivateCp25ReviewerAction {
  if (!item) return 'request_remediation';
  if (item.reviewStatus === 'remediation_required') {
    return item.requiredActions.find((action) => action !== 'request_remediation') ?? 'reject';
  }
  return item.requiredActions.includes('request_remediation') ? 'request_remediation' : item.requiredActions[0] ?? 'defer';
}

function Cp25QueueCard({
  item,
  onPress,
  selected,
}: {
  item: PrivateCp25ReviewQueueItem;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.cp25QueueCard, selected ? styles.cp25QueueCardSelected : null]}>
      <View style={styles.rowWrap}>
        <Pill label={item.queueType} tone={cp25Tone(item)} />
        <Pill label={item.assignedRole} />
        <Pill label={item.reviewStatus} tone="warn" />
      </View>
      <Text style={[styles.cardTitle, selected ? styles.cardTitleSelected : null]}>{item.title}</Text>
      <Text style={[styles.body, selected ? styles.bodySelected : null]}>{item.summary}</Text>
      <View style={styles.compactGrid}>
        <KeyValue label="Severity" value={item.severity} />
        <KeyValue label="Graph nodes" value={item.graphNodeIds.length} />
        <KeyValue label="Route refs" value={item.routeItemIds.length} />
        <KeyValue label="Notes required" value={item.notesRequired} />
      </View>
    </Pressable>
  );
}

function Cp25ActionPanel({
  actionResult,
  cp25Payload,
  notes,
  onActionChange,
  onNotesChange,
  onSubmit,
  selectedAction,
  selectedQueueItem,
  submitting,
}: {
  actionResult: PrivateCp25ReviewerActionResponse | null;
  cp25Payload: PrivateCp25WorkbenchStateResponse;
  notes: string;
  onActionChange: (action: PrivateCp25ReviewerAction) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
  selectedAction: PrivateCp25ReviewerAction;
  selectedQueueItem: PrivateCp25ReviewQueueItem | null;
  submitting: boolean;
}) {
  if (!selectedQueueItem) return null;
  const remediationState =
    cp25Payload.remediationStates.find((item) => item.queueItemId === selectedQueueItem.queueItemId) ?? null;
  const notesMissing = selectedQueueItem.notesRequired && notes.trim().length === 0;
  const availableActions = [...new Set([...selectedQueueItem.requiredActions, 'reject', 'defer'] as PrivateCp25ReviewerAction[])];

  return (
    <View style={[styles.section, publicShadows.card]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleBlock}>
          <Text style={styles.kicker}>CP25 Action Controls</Text>
          <Text style={styles.sectionTitle}>Private action preview</Text>
        </View>
        <Pill label={selectedQueueItem.assignedRole} tone="warn" />
      </View>

      <View style={styles.boundaryMini}>
        <View style={styles.rowWrap}>
          <Pill label={cp25Payload.checkpoint} tone="pass" />
          <Pill label="Private only" tone="warn" />
          <Pill label="Public release blocked" tone="block" />
        </View>
        <Text style={styles.body}>{cp25Payload.publicBoundary.message}</Text>
      </View>

      <View style={styles.compactGrid}>
        <KeyValue label="Queue item" value={selectedQueueItem.queueItemId} />
        <KeyValue label="Current status" value={selectedQueueItem.reviewStatus} />
        <KeyValue label="Subject" value={`${selectedQueueItem.subjectType} / ${selectedQueueItem.subjectId}`} />
        <KeyValue label="Remediation" value={remediationState?.status ?? 'none'} />
        <KeyValue label="Blocking" value={remediationState?.blockingStatus ?? 'none'} />
        <KeyValue label="Public approved" value={selectedQueueItem.publicReleaseApproved} />
      </View>

      <View style={styles.actionGrid}>
        {availableActions.map((action) => {
          const selected = selectedAction === action;
          return (
            <Pressable
              key={action}
              onPress={() => onActionChange(action)}
              style={[styles.actionButton, selected ? styles.actionButtonSelected : null]}
            >
              <Text style={[styles.actionLabel, selected ? styles.actionLabelSelected : null]}>{ACTION_LABELS[action]}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.notesBox}>
        <View style={styles.rowWrap}>
          <Pill label="Notes required" tone={selectedQueueItem.notesRequired ? 'block' : 'default'} />
          {notesMissing ? <Pill label="Missing notes" tone="block" /> : <Pill label="Ready to preview" tone="pass" />}
        </View>
        <TextInput
          multiline
          onChangeText={onNotesChange}
          placeholder="Record reviewer notes for this private action preview."
          placeholderTextColor={publicColors.muted}
          style={styles.notesInput}
          value={notes}
        />
      </View>

      <Pressable
        disabled={notesMissing || submitting}
        onPress={onSubmit}
        style={[styles.submitButton, notesMissing || submitting ? styles.submitButtonDisabled : null]}
      >
        <Text style={styles.submitLabel}>{submitting ? 'Checking action...' : 'Preview audit event'}</Text>
      </Pressable>

      {actionResult ? (
        <View style={styles.auditPreview}>
          <View style={styles.rowWrap}>
            <Pill label={actionResult.validation.allowed ? 'Allowed' : 'Blocked'} tone={actionResult.validation.allowed ? 'pass' : 'block'} />
            <Pill label={`${actionResult.auditEvent.fromStatus} -> ${actionResult.auditEvent.toStatus}`} tone="warn" />
            <Pill label="No persistence" />
          </View>
          <Text style={styles.cardTitle}>Audit preview</Text>
          <Text style={styles.body}>{actionResult.auditEvent.notes}</Text>
          {actionResult.validation.blockedReasons.length > 0 ? (
            <View style={styles.auditList}>
              {actionResult.validation.blockedReasons.map((reason) => (
                <Text key={reason} style={styles.auditLine}>{reason}</Text>
              ))}
            </View>
          ) : null}
          <Text style={styles.monoText}>{actionResult.auditEvent.auditEventId}</Text>
        </View>
      ) : null}
    </View>
  );
}

function EvidenceRoutePanel({ route }: { route: PrivateCp23EvidenceRoute | null }) {
  if (!route) return null;
  return (
    <View style={[styles.section, publicShadows.card]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleBlock}>
          <Text style={styles.kicker}>Evidence Route</Text>
          <Text style={styles.sectionTitle}>{route.evidenceRouteId}</Text>
        </View>
        <Pill label={route.graphMode} tone="pass" />
      </View>
      <Text style={styles.body}>{route.queryText}</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Selected" value={route.selectedEvidence.length} tone="pass" />
        <StatCard label="Held" value={route.rejectedEvidence.length} tone="warn" />
        <StatCard label="Escalation" value={route.escalationEvidence.length} tone="block" />
        <StatCard label="Queue items" value={route.reviewQueueItemIds.length} tone="warn" />
      </View>
      <View style={styles.routeGrid}>
        {[...route.selectedEvidence, ...route.rejectedEvidence, ...route.escalationEvidence].map((item) => (
          <View key={item.routeItemId} style={styles.routeItem}>
            <View style={styles.rowWrap}>
              <Pill label={item.validationImpact} tone={item.validationImpact === 'supports' ? 'pass' : item.validationImpact === 'escalates' ? 'block' : 'warn'} />
              <Pill label={item.role} />
            </View>
            <Text style={styles.cardTitle}>{item.canonicalRef}</Text>
            <Text style={styles.body}>{item.selectionReason}</Text>
            <Text style={styles.monoText}>{item.graphNodeIds.join(', ')}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Cp26SnapshotStatusPanel({ status }: { status: PrivateCp26SnapshotStatusResponse | null }) {
  if (!status) return null;
  return (
    <View style={[styles.section, publicShadows.card]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleBlock}>
          <Text style={styles.kicker}>CP26 Snapshot Status</Text>
          <Text style={styles.sectionTitle}>Live snapshot and refresh proof</Text>
        </View>
        <View style={styles.rowWrap}>
          <Pill label={status.checkpoint} tone="pass" />
          <Pill label="Private only" tone="warn" />
          <Pill label="Public release blocked" tone="block" />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Source groups" value={status.snapshot.sourceGroupCount} />
        <StatCard label="Snapshot artifacts" value={status.snapshot.snapshotArtifactCount} />
        <StatCard label="Refresh outputs" value={status.refresh.refreshedOutputCount} tone="pass" />
        <StatCard label="Checksum entries" value={status.diff.totalChecksumEntryCount} />
        <StatCard label="Unresolved refs" value={status.unresolved.total} tone="block" />
        <StatCard label="High/critical" value={status.refresh.highOrCriticalBlockerCount} tone="block" />
        <StatCard label="Rollback steps" value={status.rollback.restoreStepCount} tone="warn" />
        <StatCard label="Public-safe rows" value={status.snapshot.publicSafeSnapshotRowCount} tone="block" />
      </View>

      <View style={styles.compactGrid}>
        <KeyValue label="Snapshot batch" value={status.snapshot.snapshotBatchId} />
        <KeyValue label="Refresh run" value={status.refresh.refreshRunId} />
        <KeyValue label="Refresh status" value={status.refresh.status} />
        <KeyValue label="Diff proof" value={status.diff.proofId} />
        <KeyValue label="Rollback target" value={status.rollback.rollbackTarget} />
        <KeyValue label="Mismatch probes" value={status.diff.detectedMismatchProbeCount} />
        <KeyValue label="Stale artifacts" value={status.diff.staleArtifactCount} />
        <KeyValue label="Mismatched artifacts" value={status.diff.mismatchedArtifactCount} />
      </View>

      <View style={styles.exportPathBox}>
        <Text style={styles.monoText}>{status.snapshot.manifestPath}</Text>
        <Text style={styles.monoText}>{status.refresh.refreshRunPath}</Text>
        <Text style={styles.monoText}>{status.diff.manifestPath}</Text>
        <Text style={styles.monoText}>{status.rollback.manifestPath}</Text>
      </View>

      <View style={styles.routeGrid}>
        {status.unresolved.samples.map((item) => (
          <View key={item.referenceId} style={styles.routeItem}>
            <View style={styles.rowWrap}>
              <Pill label={item.severity} tone={item.severity === 'critical' || item.severity === 'high' ? 'block' : 'warn'} />
              <Pill label={item.blockingStatus} tone={item.blockingStatus === 'blocking' ? 'block' : 'warn'} />
            </View>
            <Text style={styles.cardTitle}>{item.sourceGroupKey}</Text>
            <Text style={styles.body}>{item.message}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.body}>{status.publicBoundary.message}</Text>
    </View>
  );
}

export default function ReviewWorkbenchScreen() {
  const [payload, setPayload] = useState<PrivateReviewWorkbenchCp23Response | null>(null);
  const [cp25Payload, setCp25Payload] = useState<PrivateCp25WorkbenchStateResponse | null>(null);
  const [cp26Status, setCp26Status] = useState<PrivateCp26SnapshotStatusResponse | null>(null);
  const [actionResult, setActionResult] = useState<PrivateCp25ReviewerActionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedCp25QueueItemId, setSelectedCp25QueueItemId] = useState<string | null>(null);
  const [selectedCp25Action, setSelectedCp25Action] = useState<PrivateCp25ReviewerAction>('request_remediation');
  const [cp25Notes, setCp25Notes] = useState('');
  const [submittingCp25Action, setSubmittingCp25Action] = useState(false);

  useEffect(() => {
    setPayload(null);
    setCp25Payload(null);
    setCp26Status(null);
    setActionResult(null);
    setError(null);
    void Promise.all([getReviewWorkbenchCp23(), getReviewerWorkbenchCp25(), getCp26SnapshotStatus()])
      .then(([cp23Response, cp25Response, cp26Response]) => {
        setPayload(cp23Response);
        setCp25Payload(cp25Response);
        setCp26Status(cp26Response);
        setSelectedCandidateId(cp23Response.retrieval.candidates[0]?.candidateId ?? null);
        const firstQueueItem = cp25Response.queueItems[0] ?? null;
        setSelectedCp25QueueItemId(firstQueueItem?.queueItemId ?? null);
        setSelectedCp25Action(defaultCp25Action(firstQueueItem));
      })
      .catch((workbenchError: unknown) => {
        setError(workbenchError instanceof Error ? workbenchError.message : 'Review workbench failed');
      });
  }, []);

  const selectedCandidate = useMemo(() => {
    return (
      payload?.retrieval.candidates.find((candidate) => candidate.candidateId === selectedCandidateId) ??
      payload?.retrieval.candidates[0] ??
      null
    );
  }, [payload, selectedCandidateId]);

  const evidenceRoute = payload?.evidenceRoutes[0] ?? null;
  const selectedCp25QueueItem = useMemo(() => {
    return (
      cp25Payload?.queueItems.find((item) => item.queueItemId === selectedCp25QueueItemId) ??
      cp25Payload?.queueItems[0] ??
      null
    );
  }, [cp25Payload, selectedCp25QueueItemId]);

  const selectCp25QueueItem = (item: PrivateCp25ReviewQueueItem) => {
    setSelectedCp25QueueItemId(item.queueItemId);
    setSelectedCp25Action(defaultCp25Action(item));
    setCp25Notes('');
    setActionResult(null);
  };

  const submitCp25ActionPreview = () => {
    if (!selectedCp25QueueItem) return;
    if (selectedCp25QueueItem.notesRequired && !cp25Notes.trim()) return;
    setSubmittingCp25Action(true);
    setActionResult(null);
    void createReviewerWorkbenchCp25Action({
      queueItemId: selectedCp25QueueItem.queueItemId,
      remediationId: cp25Payload?.remediationStates.find((item) => item.queueItemId === selectedCp25QueueItem.queueItemId)?.remediationId ?? null,
      subjectType: selectedCp25QueueItem.subjectType,
      subjectId: selectedCp25QueueItem.subjectId,
      action: selectedCp25Action,
      fromStatus: selectedCp25QueueItem.reviewStatus,
      reviewerRole: selectedCp25QueueItem.assignedRole,
      reviewerId: null,
      notes: cp25Notes,
      affectedSourceIds: selectedCp25QueueItem.sourceIds,
      affectedGraphNodeIds: selectedCp25QueueItem.graphNodeIds,
      affectedGraphEdgeIds: selectedCp25QueueItem.graphEdgeIds,
      affectedVaultPackIds: selectedCp25QueueItem.vaultPackIds,
      affectedEvidenceRouteIds: selectedCp25QueueItem.evidenceRouteIds,
      affectedRouteItemIds: selectedCp25QueueItem.routeItemIds,
      affectedCandidateIds: selectedCp25QueueItem.candidateIds,
      affectedRemediationIds: selectedCp25QueueItem.remediationIds,
      boundaryAcknowledgement: {
        privateOnly: true,
        publicReleaseApproved: false,
        publicSafeChangeRequested: false,
      },
    })
      .then(setActionResult)
      .catch((actionError: unknown) => {
        setError(actionError instanceof Error ? actionError.message : 'CP25 action preview failed');
      })
      .finally(() => setSubmittingCp25Action(false));
  };

  return (
    <PrivateWorkspaceShell
      action={{ href: '/knowledge-graphify', label: 'Graphify cockpit' }}
      eyebrow="CP23 Private Workbench"
      includeReviewNav
      subtitle="Internal graph-aware retrieval and reviewer workflow prototype. Not a public RAFIQ surface."
      title="Reviewer workbench"
    >
      <PrivateModeRibbon notice={payload?.notice} />

      <View style={[styles.boundaryBand, publicShadows.card]}>
        <View style={styles.rowWrap}>
          <Pill label="CP23-A06" tone="pass" />
          <Pill label="Read-only prototype" tone="warn" />
          <Pill label="Public release blocked" tone="block" />
        </View>
        <Text style={styles.boundaryTitle}>Graph-aware retrieval is visible here only as a private reviewer workflow.</Text>
        <Text style={styles.boundaryBody}>
          The workbench shows bounded candidates, evidence routes, review queues, remediation, and audit-preview records
          derived from CP22 private graph and vault artifacts.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!payload && !error ? <ActivityIndicator style={styles.loading} /> : null}

      {payload ? (
        <ScrollView contentContainerStyle={styles.contentStack}>
          <View style={styles.statsGrid}>
            <StatCard label="Graph nodes" value={payload.retrieval.graphProof.graphNodeCount} />
            <StatCard label="Graph edges" value={payload.retrieval.graphProof.graphEdgeCount} />
            <StatCard label="Vault packs" value={payload.retrieval.graphProof.vaultPackCount} />
            <StatCard label="Candidates" value={payload.retrieval.candidates.length} tone="pass" />
            <StatCard label="Queue items" value={payload.reviewWorkbench.items.length} tone="warn" />
            <StatCard label="Remediation" value={payload.remediationItems.length} tone="warn" />
            <StatCard label="Public-safe nodes" value={payload.retrieval.graphProof.publicSafeNodeCount} tone="block" />
            <StatCard label="Public-safe artifacts" value={payload.retrieval.graphProof.publicSafeArtifactCount} tone="block" />
          </View>

          <Cp26SnapshotStatusPanel status={cp26Status} />

          {cp25Payload ? (
            <View style={[styles.section, publicShadows.card]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleBlock}>
                  <Text style={styles.kicker}>CP25 Reviewer Actions</Text>
                  <Text style={styles.sectionTitle}>Private action workflow</Text>
                </View>
                <Pill label={`${cp25Payload.counts.openBlockingCount} blockers`} tone="block" />
              </View>
              <View style={styles.statsGrid}>
                <StatCard label="Queue items" value={cp25Payload.counts.queueItemCount} tone="warn" />
                <StatCard label="Remediation" value={cp25Payload.counts.remediationStateCount} tone="warn" />
                <StatCard label="Audit previews" value={cp25Payload.counts.auditEventCount} />
                <StatCard label="High/critical" value={cp25Payload.counts.highOrCriticalCount} tone="block" />
                <StatCard label="Public-safe candidates" value={cp25Payload.counts.publicSafeCandidateCount} tone="block" />
                <StatCard label="Public-safe route items" value={cp25Payload.counts.publicSafeRouteItemCount} tone="block" />
              </View>
              <View style={styles.cp25Layout}>
                <View style={styles.cp25QueueList}>
                  {cp25Payload.queueItems.slice(0, 8).map((item) => (
                    <Cp25QueueCard
                      item={item}
                      key={item.queueItemId}
                      onPress={() => selectCp25QueueItem(item)}
                      selected={item.queueItemId === selectedCp25QueueItem?.queueItemId}
                    />
                  ))}
                </View>
                <View style={styles.cp25ActionColumn}>
                  <Cp25ActionPanel
                    actionResult={actionResult}
                    cp25Payload={cp25Payload}
                    notes={cp25Notes}
                    onActionChange={(action) => {
                      setSelectedCp25Action(action);
                      setActionResult(null);
                    }}
                    onNotesChange={setCp25Notes}
                    onSubmit={submitCp25ActionPreview}
                    selectedAction={selectedCp25Action}
                    selectedQueueItem={selectedCp25QueueItem}
                    submitting={submittingCp25Action}
                  />
                </View>
              </View>
            </View>
          ) : null}

          <View style={[styles.section, publicShadows.card]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.kicker}>Verifier Proof</Text>
                <Text style={styles.sectionTitle}>{payload.verifier.command}</Text>
              </View>
              <Pill label={`${payload.verifier.status} / ${payload.verifier.checkpoint}`} tone="pass" />
            </View>
            <View style={styles.compactGrid}>
              <KeyValue label="API route" value={payload.prototype.apiRoute} />
              <KeyValue label="UI route" value={payload.prototype.uiRoute} />
              <KeyValue label="Graph" value={payload.prototype.graphId} />
              <KeyValue label="Checksum" value={payload.prototype.graphChecksumSha256?.slice(0, 16)} />
              <KeyValue label="Mutates content" value={payload.prototype.codeMutatesCanonicalContent} />
              <KeyValue label="Public approved" value={payload.prototype.publicReleaseApproved} />
            </View>
            <Text style={styles.body}>{payload.publicSafeBoundary.message}</Text>
          </View>

          <View style={[styles.section, publicShadows.card]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.kicker}>Graph-Aware Candidates</Text>
                <Text style={styles.sectionTitle}>Ranking and selection proof</Text>
              </View>
              <Pill label={payload.retrieval.graphMode} tone="pass" />
            </View>
            <View style={styles.candidateGrid}>
              {payload.retrieval.candidates.map((candidate) => {
                const selected = candidate.candidateId === selectedCandidate?.candidateId;
                return (
                  <Pressable
                    key={candidate.candidateId}
                    onPress={() => setSelectedCandidateId(candidate.candidateId)}
                    style={[styles.candidateButton, selected ? styles.candidateButtonSelected : null]}
                  >
                    <View style={styles.rowWrap}>
                      <Pill label={candidate.selectionState} tone={candidateTone(candidate)} />
                      <Pill label={candidate.contentType} />
                    </View>
                    <Text style={[styles.cardTitle, selected ? styles.cardTitleSelected : null]}>{candidate.canonicalRef}</Text>
                    <Text style={[styles.body, selected ? styles.bodySelected : null]}>{candidate.selectionReason}</Text>
                  </Pressable>
                );
              })}
            </View>
            {selectedCandidate ? (
              <View style={styles.detailPanel}>
                <Text style={styles.cardTitle}>Selected candidate detail</Text>
                <View style={styles.compactGrid}>
                  <KeyValue label="Candidate" value={selectedCandidate.candidateId} />
                  <KeyValue label="Quality" value={selectedCandidate.qualityState} />
                  <KeyValue label="Review" value={selectedCandidate.reviewState} />
                  <KeyValue label="Public safe" value={selectedCandidate.publicSafe} />
                  <KeyValue label="Sources" value={selectedCandidate.sourceIds.length} />
                  <KeyValue label="Vault packs" value={selectedCandidate.vaultPackIds.length} />
                </View>
                <Text style={styles.monoText}>{selectedCandidate.graphNodeIds.join(', ')}</Text>
                <Text style={styles.body}>{selectedCandidate.rankingSignals.join(' / ')}</Text>
              </View>
            ) : null}
          </View>

          <EvidenceRoutePanel route={evidenceRoute} />

          <View style={[styles.section, publicShadows.card]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.kicker}>Reviewer Queue</Text>
                <Text style={styles.sectionTitle}>Prototype reviewer workload</Text>
              </View>
              <Pill label={`${payload.reviewWorkbench.items.length} items`} tone="warn" />
            </View>
            <View style={styles.queueGrid}>
              {payload.reviewWorkbench.items.map((item) => (
                <QueueItemCard key={item.queueItemId} item={item} />
              ))}
            </View>
          </View>

          <View style={[styles.section, publicShadows.card]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.kicker}>Remediation and Audit</Text>
                <Text style={styles.sectionTitle}>Handoff proof</Text>
              </View>
              <Pill label={`${payload.auditEvents.length} audit preview`} tone="warn" />
            </View>
            <View style={styles.routeGrid}>
              {payload.remediationItems.map((item) => (
                <View key={item.remediationId} style={styles.routeItem}>
                  <Pill label={item.ownerRole} tone={item.severity === 'high' || item.severity === 'critical' ? 'block' : 'warn'} />
                  <Text style={styles.cardTitle}>{item.remediationId}</Text>
                  <Text style={styles.body}>{item.requiredAction}</Text>
                  <Text style={styles.body}>{item.verificationMethod ?? 'Reviewer verification required'}</Text>
                  <Text style={styles.monoText}>{item.graphNodeIds.join(', ')}</Text>
                </View>
              ))}
            </View>
            <View style={styles.auditList}>
              {payload.auditEvents.map((event) => (
                <Text key={event.auditEventId} style={styles.auditLine}>
                  {event.eventType} / {event.subjectType} / {event.queueItemId}
                </Text>
              ))}
            </View>
          </View>

          {payload.reviewerExports ? (
            <View style={[styles.section, publicShadows.card]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleBlock}>
                  <Text style={styles.kicker}>A07 Export Proof</Text>
                  <Text style={styles.sectionTitle}>{payload.reviewerExports.manifest.exportId}</Text>
                </View>
                <Pill label={payload.reviewerExports.manifest.checkpoint} tone="pass" />
              </View>
              <View style={styles.compactGrid}>
                <KeyValue label="Audit events" value={payload.reviewerExports.manifest.counts.auditEvents} />
                <KeyValue label="Remediation items" value={payload.reviewerExports.manifest.counts.remediationItems} />
                <KeyValue label="High/critical" value={payload.reviewerExports.manifest.counts.highOrCriticalRemediationItems} />
                <KeyValue label="Open blockers" value={payload.reviewerExports.manifest.counts.openBlockingRemediationItems} />
                <KeyValue label="Private only" value={payload.reviewerExports.manifest.privateOnly} />
                <KeyValue label="Public approved" value={payload.reviewerExports.manifest.publicReleaseApproved} />
              </View>
              <View style={styles.exportPathBox}>
                <Text style={styles.monoText}>{payload.reviewerExports.manifest.artifactPaths.manifest}</Text>
                <Text style={styles.monoText}>{payload.reviewerExports.manifest.artifactPaths.auditTrail}</Text>
                <Text style={styles.monoText}>{payload.reviewerExports.manifest.artifactPaths.remediation}</Text>
              </View>
              <View style={styles.routeGrid}>
                {payload.reviewerExports.remediation.map((item) => (
                  <View key={item.remediationId} style={styles.routeItem}>
                    <View style={styles.rowWrap}>
                      <Pill label={item.issueType ?? 'remediation'} tone={item.severity === 'high' || item.severity === 'critical' ? 'block' : 'warn'} />
                      <Pill label={item.status} />
                    </View>
                    <Text style={styles.cardTitle}>{item.canonicalRefs?.[0] ?? item.subjectId}</Text>
                    <Text style={styles.body}>{item.closurePath ?? item.requiredAction}</Text>
                    <Text style={styles.monoText}>{item.remediationId}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      ) : null}
    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  auditLine: {
    color: publicColors.slate,
    fontSize: 12,
    fontWeight: '800',
  },
  auditList: {
    gap: publicSpacing.space8,
  },
  auditPreview: {
    backgroundColor: publicColors.mintSoft,
    borderColor: '#99f6e4',
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    gap: publicSpacing.space10,
    padding: publicSpacing.space16,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: publicSpacing.space12,
    paddingVertical: publicSpacing.space10,
  },
  actionButtonSelected: {
    backgroundColor: publicColors.deepGreen,
    borderColor: publicColors.deepGreen,
  },
  actionGrid: {
    display: 'grid',
    gap: publicSpacing.space10,
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  },
  actionLabel: {
    color: publicColors.ink,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  actionLabelSelected: {
    color: '#ffffff',
  },
  blockCard: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  blockPill: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  body: {
    color: publicColors.slate,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  bodySelected: {
    color: '#f8fafc',
  },
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
  boundaryMini: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    gap: publicSpacing.space8,
    padding: publicSpacing.space14,
  },
  boundaryTitle: {
    color: publicColors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  candidateButton: {
    backgroundColor: '#fffdf7',
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    gap: publicSpacing.space8,
    padding: publicSpacing.space16,
  },
  candidateButtonSelected: {
    backgroundColor: publicColors.deepGreen,
    borderColor: publicColors.deepGreen,
  },
  candidateGrid: {
    display: 'grid',
    gap: publicSpacing.space12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  },
  cardTitle: {
    color: publicColors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  cardTitleSelected: {
    color: '#ffffff',
  },
  compactGrid: {
    display: 'grid',
    gap: publicSpacing.space12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
  },
  contentStack: {
    gap: publicSpacing.space20,
  },
  cp25ActionColumn: {
    minWidth: 300,
  },
  cp25Layout: {
    display: 'grid',
    gap: publicSpacing.space16,
    gridTemplateColumns: 'minmax(260px, 0.9fr) minmax(320px, 1.1fr)',
  },
  cp25QueueCard: {
    backgroundColor: '#fffdf7',
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    gap: publicSpacing.space10,
    padding: publicSpacing.space14,
  },
  cp25QueueCardSelected: {
    backgroundColor: publicColors.deepGreen,
    borderColor: publicColors.deepGreen,
  },
  cp25QueueList: {
    gap: publicSpacing.space12,
  },
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
  exportPathBox: {
    backgroundColor: publicColors.pearl,
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    gap: publicSpacing.space8,
    padding: publicSpacing.space16,
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
  },
  keyValue: {
    backgroundColor: '#ffffff',
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    gap: publicSpacing.space4,
    padding: publicSpacing.space12,
  },
  kicker: {
    color: publicColors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  loading: {
    padding: publicSpacing.space24,
  },
  monoText: {
    color: publicColors.slate,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
  },
  notesBox: {
    backgroundColor: publicColors.pearl,
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    gap: publicSpacing.space10,
    padding: publicSpacing.space14,
  },
  notesInput: {
    backgroundColor: '#ffffff',
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    color: publicColors.ink,
    fontSize: 14,
    fontWeight: '700',
    minHeight: 96,
    padding: publicSpacing.space12,
    textAlignVertical: 'top',
  },
  passCard: {
    backgroundColor: publicColors.mintSoft,
    borderColor: '#99f6e4',
  },
  passPill: {
    backgroundColor: publicColors.mintSoft,
    color: publicColors.deepGreen,
  },
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
  queueCard: {
    backgroundColor: '#fffdf7',
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    gap: publicSpacing.space10,
    padding: publicSpacing.space16,
  },
  queueGrid: {
    display: 'grid',
    gap: publicSpacing.space12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  },
  routeGrid: {
    display: 'grid',
    gap: publicSpacing.space12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  },
  routeItem: {
    backgroundColor: '#fffdf7',
    borderColor: publicColors.line,
    borderRadius: publicRadii.medium,
    borderWidth: 1,
    gap: publicSpacing.space10,
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
    gap: publicSpacing.space4,
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
    display: 'grid',
    gap: publicSpacing.space12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: publicColors.deepGreen,
    borderRadius: publicRadii.medium,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: publicSpacing.space16,
    paddingVertical: publicSpacing.space12,
  },
  submitButtonDisabled: {
    backgroundColor: publicColors.muted,
  },
  submitLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  warnPill: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
});
