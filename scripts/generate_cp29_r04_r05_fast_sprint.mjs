#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('data', 'remediation', 'cp29');
const R01_PLAN_PATH = path.join(OUT_DIR, 'remediation-unlock-plan.json');
const R02_PLAN_PATH = path.join(OUT_DIR, 'reference-provenance-repair-plan.json');
const R03_PLAN_PATH = path.join(OUT_DIR, 'quality-review-burn-down-plan.json');
const CP28_VERIFICATION_PATH = path.join('data', 'retrieval', 'cp28', 'combined-verification.json');
const CP28_HANDOFF_PATH = path.join('data', 'retrieval', 'cp28', 'validation-handoff.json');
const CP28_RANKING_PATH = path.join('data', 'retrieval', 'cp28', 'ranking-selection.json');
const CP27_GRAPH_POINTER_PATH = path.join('data', 'graphify', 'cp27-refresh', 'latest-graph.json');
const CP27_VAULT_POINTER_PATH = path.join('data', 'vault', 'cp27-refresh', 'latest-vault.json');
const ESCALATION_PATH = path.join(OUT_DIR, 'escalation-lane-separation.json');
const DIFF_PROOF_PATH = path.join(OUT_DIR, 'regeneration-diff-proof.json');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const LATEST_POINTER_PATH = path.join(OUT_DIR, 'latest-remediation.json');
const GENERATED_AT = '2026-07-18T00:00:00.000Z';
const ESCALATION_REASONS = ['grade_uncertainty_requires_escalation_review', 'safety_escalation_required'];

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function writeJson(filePath, value) {
  const text = stableJson(value);
  writeFileSync(filePath, text, 'utf8');
  return {
    path: filePath.replaceAll(path.sep, '/'),
    checksumSha256: sha256Text(text),
    byteCount: Buffer.byteLength(text),
  };
}

function artifactRef(filePath) {
  const text = readText(filePath);
  return {
    path: filePath.replaceAll(path.sep, '/'),
    checksumSha256: sha256Text(text),
    byteCount: Buffer.byteLength(text),
  };
}

function publicBoundary(message) {
  return {
    privateOnly: true,
    publicReleaseApproved: false,
    publicRouteExposed: false,
    publicSafeChangeRequested: false,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
    publicSafeRetrievalCandidateCount: 0,
    publicSafeRouteItemCount: 0,
    publicSafeReviewItemCount: 0,
    publicSafeAuditEventCount: 0,
    message,
  };
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function fixtureIdFromEvidenceRouteId(evidenceRouteId) {
  return String(evidenceRouteId ?? '').match(/cp28:evidence-route:(.*):r04/)?.[1] ?? 'unknown-fixture';
}

function collectRouteItems(handoff) {
  const byCandidateId = new Map();
  for (const route of handoff.routes ?? []) {
    for (const bucket of ['selectedEvidence', 'reviewEvidence', 'escalationEvidence']) {
      for (const item of route.evidenceRoute?.[bucket] ?? []) byCandidateId.set(item.candidateId, item);
    }
  }
  return byCandidateId;
}

function escalationAction(reason) {
  if (reason === 'grade_uncertainty_requires_escalation_review') {
    return [
      'Keep hadith-grade uncertainty outside ordinary selected-candidate unlock.',
      'Route to scholar reviewer for private grade/verification review.',
      'Require CP29-R04 escalation decision before CP29-R05 regeneration can affect selection.',
    ];
  }
  return [
    'Keep safety-sensitive candidate outside ordinary selected-candidate unlock.',
    'Route to product owner for private safety and product-boundary review.',
    'Require CP29-R04 escalation decision before CP29-R05 regeneration can affect selection.',
  ];
}

function buildEscalationLanes(remediationItems, routeItemsByCandidateId) {
  const groups = new Map();
  for (const item of remediationItems) {
    const matchedReasons = (item.issueTypes ?? []).filter((reason) => ESCALATION_REASONS.includes(reason));
    for (const reason of matchedReasons) {
      const routeItem = routeItemsByCandidateId.get(item.candidateId) ?? {};
      const fixtureId = fixtureIdFromEvidenceRouteId(item.evidenceRouteId);
      const graphPartition = routeItem.graphPartition ?? 'unknown-partition';
      const sourceGroupKey = routeItem.sourceGroupKey ?? 'unknown-source-group';
      const owner = item.recommendedOwner ?? 'unknown-owner';
      const key = [reason, owner, fixtureId, graphPartition, sourceGroupKey].join('|');
      if (!groups.has(key)) {
        groups.set(key, {
          escalationLaneId: `cp29:r04:escalation-lane:${groups.size + 1}`,
          reasonFamily: reason,
          targetCheckpoint: 'CP29-R04',
          recommendedOwner: owner,
          severity: item.severity,
          fixtureId,
          graphPartition,
          sourceGroupKey,
          candidateIds: [],
          remediationIds: [],
          graphNodeIds: [],
          canonicalRefs: [],
          sourceRefs: [],
          graphEdgeIds: [],
          vaultPackIds: [],
          overlappingReasonFamilies: [],
          recommendedActions: escalationAction(reason),
          ordinaryUnlockExcluded: true,
          escalationDecisionRequired: true,
          selectedCandidateUnlockAllowed: false,
          publicReleaseApproved: false,
          publicSafe: false,
        });
      }
      const lane = groups.get(key);
      lane.candidateIds.push(item.candidateId);
      lane.remediationIds.push(item.remediationId);
      lane.graphNodeIds.push(...(item.targetGraphNodeIds ?? []), routeItem.graphNodeId);
      lane.canonicalRefs.push(...(item.targetCanonicalRefs ?? []), ...(routeItem.canonicalRefs ?? []));
      lane.sourceRefs.push(...(routeItem.sourceRefs ?? []));
      lane.graphEdgeIds.push(...(routeItem.graphEdgeIds ?? []));
      lane.vaultPackIds.push(...(routeItem.vaultPackIds ?? []));
      lane.overlappingReasonFamilies.push(...(item.issueTypes ?? []).filter((reason) => !ESCALATION_REASONS.includes(reason)));
    }
  }
  return [...groups.values()].map((lane) => ({
    ...lane,
    candidateIds: uniqueSorted(lane.candidateIds),
    remediationIds: uniqueSorted(lane.remediationIds),
    graphNodeIds: uniqueSorted(lane.graphNodeIds),
    canonicalRefs: uniqueSorted(lane.canonicalRefs),
    sourceRefs: uniqueSorted(lane.sourceRefs),
    graphEdgeIds: uniqueSorted(lane.graphEdgeIds),
    vaultPackIds: uniqueSorted(lane.vaultPackIds),
    overlappingReasonFamilies: uniqueSorted(lane.overlappingReasonFamilies),
    candidateCount: uniqueSorted(lane.candidateIds).length,
  })).sort((a, b) => a.reasonFamily.localeCompare(b.reasonFamily) || a.recommendedOwner.localeCompare(b.recommendedOwner));
}

function countByCandidate(lanes, key) {
  return lanes.reduce((counts, lane) => {
    const value = lane[key] ?? 'unknown';
    counts[value] = (counts[value] ?? 0) + lane.candidateCount;
    return counts;
  }, {});
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const r01Plan = readJson(R01_PLAN_PATH);
  const r02Plan = readJson(R02_PLAN_PATH);
  const r03Plan = readJson(R03_PLAN_PATH);
  const cp28Verification = readJson(CP28_VERIFICATION_PATH);
  const cp28Handoff = readJson(CP28_HANDOFF_PATH);
  const cp28Ranking = readJson(CP28_RANKING_PATH);
  const graphPointer = readJson(CP27_GRAPH_POINTER_PATH);
  const vaultPointer = readJson(CP27_VAULT_POINTER_PATH);
  const routeItemsByCandidateId = collectRouteItems(cp28Handoff);
  const remediationItems = cp28Handoff.remediationItems ?? [];
  const escalationLanes = buildEscalationLanes(remediationItems, routeItemsByCandidateId);
  const ordinaryEscalationExcludedCandidateIds = uniqueSorted(escalationLanes.flatMap((lane) => lane.candidateIds));
  const cp28Results = cp28Verification.cp28Results;

  const escalationPlan = {
    schemaVersion: 'cp29.escalation-lane-separation.v1',
    checkpoint: 'CP29-R04',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r04_r05_fast_sprint.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'escalation_lane_separation',
    sourceArtifacts: {
      cp29R03QualityReviewBurnDownPlan: artifactRef(R03_PLAN_PATH),
      cp28ValidationHandoff: artifactRef(CP28_HANDOFF_PATH),
      cp28RankingSelection: artifactRef(CP28_RANKING_PATH),
    },
    baseline: {
      escalationCandidateCount: ordinaryEscalationExcludedCandidateIds.length,
      gradeEscalationCandidateCount: countByCandidate(escalationLanes, 'reasonFamily').grade_uncertainty_requires_escalation_review ?? 0,
      safetyEscalationCandidateCount: countByCandidate(escalationLanes, 'reasonFamily').safety_escalation_required ?? 0,
      criticalEscalationCandidateCount: ordinaryEscalationExcludedCandidateIds.length,
      ordinaryUnlockExcludedCandidateCount: ordinaryEscalationExcludedCandidateIds.length,
      selectedCandidateCount: r01Plan.baseline.cp28SelectedCandidateCount,
      selectedRouteItemCount: r01Plan.baseline.cp28SelectedRouteItemCount,
      publicSafeCandidateCount: 0,
      publicSafeRouteItemCount: 0,
    },
    groupingSummary: {
      byReasonFamily: countByCandidate(escalationLanes, 'reasonFamily'),
      byRecommendedOwner: countByCandidate(escalationLanes, 'recommendedOwner'),
      byFixture: countByCandidate(escalationLanes, 'fixtureId'),
      byGraphPartition: countByCandidate(escalationLanes, 'graphPartition'),
      bySourceGroupKey: countByCandidate(escalationLanes, 'sourceGroupKey'),
    },
    escalationLanes,
    ordinaryUnlockPolicy: {
      excludesEscalationCandidateIds: ordinaryEscalationExcludedCandidateIds,
      ordinaryUnlockAllowedForEscalationCandidates: false,
      escalationDecisionRequiredBeforeRegenerationImpact: true,
      nextCheckpoint: 'CP29-R05',
    },
    publicBoundary: publicBoundary('CP29-R04 separates escalation lanes. Public release remains blocked and public-safe counts remain zero.'),
  };
  const escalationArtifact = writeJson(ESCALATION_PATH, escalationPlan);

  const diffProof = {
    schemaVersion: 'cp29.regeneration-diff-proof.v1',
    checkpoint: 'CP29-R05',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r04_r05_fast_sprint.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'regeneration_and_diff_proof',
    sourceArtifacts: {
      cp29R01RemediationUnlockPlan: artifactRef(R01_PLAN_PATH),
      cp29R02ReferenceProvenanceRepairPlan: artifactRef(R02_PLAN_PATH),
      cp29R03QualityReviewBurnDownPlan: artifactRef(R03_PLAN_PATH),
      cp29R04EscalationLaneSeparation: artifactRef(ESCALATION_PATH),
      cp28CombinedVerification: artifactRef(CP28_VERIFICATION_PATH),
      cp27LatestGraph: artifactRef(CP27_GRAPH_POINTER_PATH),
      cp27LatestVault: artifactRef(CP27_VAULT_POINTER_PATH),
    },
    regenerationState: {
      actualSourceRepairApplied: false,
      actualQualityReviewDecisionsApplied: false,
      actualEscalationDecisionsApplied: false,
      cp26SnapshotRegeneratedInR05: false,
      cp27GraphRegeneratedInR05: false,
      cp27VaultRegeneratedInR05: false,
      cp28RetrievalRegeneratedInR05: false,
      reason: 'Fast CP29-R04/R05 records lane separation and diff baseline only. No source, graph, vault, or retrieval regeneration was applied in this checkpoint.',
    },
    beforeCounts: {
      cp27GraphNodes: graphPointer.counts.totalNodes,
      cp27GraphEdges: graphPointer.counts.totalEdges,
      cp27VaultArtifacts: vaultPointer.counts.artifacts,
      cp27UnresolvedReferences: graphPointer.counts.unresolvedReferenceCount,
      cp27HighOrCriticalBlockers: graphPointer.counts.highOrCriticalBlockerCount,
      cp28Candidates: cp28Results.candidateCount,
      cp28SelectedCandidates: cp28Results.selectedCandidateCount,
      cp28SelectedRouteItems: cp28Results.selectedRouteItemCount,
      cp28RemediationItems: cp28Results.remediationCount,
      cp28HighOrCriticalRemediationItems: cp28Results.highOrCriticalRemediationCount,
      cp28EscalationCandidates: cp28Ranking.summary.requiresEscalationCandidateCount,
      publicSafeCandidates: 0,
      publicSafeRouteItems: 0,
    },
    afterCounts: {
      cp27GraphNodes: graphPointer.counts.totalNodes,
      cp27GraphEdges: graphPointer.counts.totalEdges,
      cp27VaultArtifacts: vaultPointer.counts.artifacts,
      cp27UnresolvedReferences: graphPointer.counts.unresolvedReferenceCount,
      cp27HighOrCriticalBlockers: graphPointer.counts.highOrCriticalBlockerCount,
      cp28Candidates: cp28Results.candidateCount,
      cp28SelectedCandidates: cp28Results.selectedCandidateCount,
      cp28SelectedRouteItems: cp28Results.selectedRouteItemCount,
      cp28RemediationItems: cp28Results.remediationCount,
      cp28HighOrCriticalRemediationItems: cp28Results.highOrCriticalRemediationCount,
      cp28EscalationCandidates: cp28Ranking.summary.requiresEscalationCandidateCount,
      publicSafeCandidates: 0,
      publicSafeRouteItems: 0,
    },
    deltas: {
      cp27UnresolvedReferenceDelta: 0,
      cp27HighOrCriticalBlockerDelta: 0,
      cp28SelectedCandidateDelta: 0,
      cp28SelectedRouteItemDelta: 0,
      cp28RemediationDelta: 0,
      cp28HighOrCriticalRemediationDelta: 0,
      escalationCandidateLeakageIntoOrdinaryUnlock: 0,
      publicSafeCandidateDelta: 0,
      publicSafeRouteItemDelta: 0,
    },
    preconditionsForRealRegeneration: [
      'Apply CP29-R02 reference/provenance repairs.',
      'Record CP29-R03 quality review decisions.',
      'Record CP29-R04 escalation decisions for hadith-grade and safety lanes.',
      'Rerun CP26, CP27, and CP28 generation commands.',
      'Regenerate this CP29-R05 diff proof from the new pointers.',
    ],
    unlockBoundary: {
      selectedCandidateUnlockAllowed: false,
      selectedRouteItemUnlockAllowed: false,
      reason: 'R05 has no applied regeneration delta yet, so selected-candidate unlock remains blocked.',
      nextCheckpoint: 'CP29-R06',
    },
    publicBoundary: publicBoundary('CP29-R05 records private regeneration/diff proof baseline only. Public release remains blocked and public-safe counts remain zero.'),
  };
  const diffArtifact = writeJson(DIFF_PROOF_PATH, diffProof);

  const manifest = {
    schemaVersion: 'cp29.remediation-manifest.v1',
    checkpoint: 'CP29-R05',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r04_r05_fast_sprint.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactPaths: {
      remediationUnlockPlan: R01_PLAN_PATH.replaceAll(path.sep, '/'),
      referenceProvenanceRepairPlan: R02_PLAN_PATH.replaceAll(path.sep, '/'),
      qualityReviewBurnDownPlan: R03_PLAN_PATH.replaceAll(path.sep, '/'),
      escalationLaneSeparation: escalationArtifact.path,
      regenerationDiffProof: diffArtifact.path,
    },
    checksums: {
      remediationUnlockPlanSha256: diffProof.sourceArtifacts.cp29R01RemediationUnlockPlan.checksumSha256,
      referenceProvenanceRepairPlanSha256: diffProof.sourceArtifacts.cp29R02ReferenceProvenanceRepairPlan.checksumSha256,
      qualityReviewBurnDownPlanSha256: diffProof.sourceArtifacts.cp29R03QualityReviewBurnDownPlan.checksumSha256,
      escalationLaneSeparationSha256: escalationArtifact.checksumSha256,
      regenerationDiffProofSha256: diffArtifact.checksumSha256,
      cp28CombinedVerificationSha256: diffProof.sourceArtifacts.cp28CombinedVerification.checksumSha256,
    },
    counts: {
      ...diffProof.afterCounts,
      escalationCandidateCount: escalationPlan.baseline.escalationCandidateCount,
      escalationLaneCount: escalationLanes.length,
      publicSafeCandidateCount: 0,
      publicSafeRouteItemCount: 0,
    },
    verifier: {
      command: 'node scripts/check_cp29_r04_r05_fast_sprint.mjs',
      status: 'pending',
    },
    publicBoundary: diffProof.publicBoundary,
  };
  const manifestArtifact = writeJson(MANIFEST_PATH, manifest);
  writeJson(LATEST_POINTER_PATH, {
    schemaVersion: 'cp29.latest-remediation-pointer.v1',
    checkpoint: 'CP29-R05',
    generatedAt: GENERATED_AT,
    remediationDir: OUT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    escalationLaneSeparationPath: escalationArtifact.path,
    escalationLaneSeparationSha256: escalationArtifact.checksumSha256,
    regenerationDiffProofPath: diffArtifact.path,
    regenerationDiffProofSha256: diffArtifact.checksumSha256,
    counts: manifest.counts,
    publicBoundary: diffProof.publicBoundary,
  });
  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP29-R04/R05', escalation: escalationPlan.baseline, diff: diffProof.deltas }, null, 2));
}

main();
