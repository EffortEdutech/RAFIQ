#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('data', 'remediation', 'cp29');
const R01_PLAN_PATH = path.join(OUT_DIR, 'remediation-unlock-plan.json');
const R02_PLAN_PATH = path.join(OUT_DIR, 'reference-provenance-repair-plan.json');
const CP28_HANDOFF_PATH = path.join('data', 'retrieval', 'cp28', 'validation-handoff.json');
const CP27_GRAPH_POINTER_PATH = path.join('data', 'graphify', 'cp27-refresh', 'latest-graph.json');
const CP27_VAULT_POINTER_PATH = path.join('data', 'vault', 'cp27-refresh', 'latest-vault.json');
const CP27_QUALITY_PACK_PATH = path.join('data', 'vault', 'cp27-refresh', 'vault', 'cp27-g04-refresh-vault', 'packs', 'quality', 'cp27-refresh-quality-blockers.md');
const QUALITY_PLAN_PATH = path.join(OUT_DIR, 'quality-review-burn-down-plan.json');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const LATEST_POINTER_PATH = path.join(OUT_DIR, 'latest-remediation.json');
const GENERATED_AT = '2026-07-18T00:00:00.000Z';
const QUALITY_REASON = 'cp27_quality_state_review_required';

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

function countBy(items, keyFn) {
  return items.reduce((counts, item) => {
    const key = keyFn(item) ?? 'unknown';
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function fixtureIdFromEvidenceRouteId(evidenceRouteId) {
  return String(evidenceRouteId ?? '').match(/cp28:evidence-route:(.*):r04/)?.[1] ?? 'unknown-fixture';
}

function collectRouteItems(handoff) {
  const byCandidateId = new Map();
  for (const route of handoff.routes ?? []) {
    for (const bucket of ['selectedEvidence', 'reviewEvidence', 'escalationEvidence']) {
      for (const item of route.evidenceRoute?.[bucket] ?? []) {
        byCandidateId.set(item.candidateId, item);
      }
    }
  }
  return byCandidateId;
}

function reviewActionsFor(owner, severity) {
  const base = [
    'Verify the graph node quality state using private source, graph, vault, and validation metadata.',
    'Record a private reviewer outcome before any regeneration or selection-state change.',
    'Keep unresolved references and escalation reasons attached until their own lanes are cleared.',
  ];
  if (owner === 'scholar_reviewer') return ['Review hadith-grade or religious-content quality signals in the private escalation workflow.', ...base];
  if (owner === 'product_owner') return ['Review safety-sensitive quality blockers and keep them outside ordinary unlock until CP29-R04.', ...base];
  if (owner === 'technical_reviewer') return ['Review raw lineage, audit, and internal quality state consistency before regeneration.', ...base];
  if (severity === 'critical') return ['Prioritize this critical quality item before high-severity burn-down.', ...base];
  return base;
}

function buildReviewTargets(qualityItems, routeItemsByCandidateId) {
  const groups = new Map();
  for (const item of qualityItems) {
    const routeItem = routeItemsByCandidateId.get(item.candidateId) ?? {};
    const graphPartition = routeItem.graphPartition ?? 'unknown-partition';
    const sourceGroupKey = routeItem.sourceGroupKey ?? 'unknown-source-group';
    const fixtureId = fixtureIdFromEvidenceRouteId(item.evidenceRouteId);
    const severity = item.severity ?? 'unknown-severity';
    const owner = item.recommendedOwner ?? 'unknown-owner';
    const key = [owner, severity, fixtureId, graphPartition, sourceGroupKey].join('|');
    if (!groups.has(key)) {
      groups.set(key, {
        reviewTargetId: `cp29:r03:quality-target:${groups.size + 1}`,
        reasonFamily: QUALITY_REASON,
        targetCheckpoint: 'CP29-R03',
        recommendedOwner: owner,
        severity,
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
        blockingStatuses: [],
        recommendedActions: reviewActionsFor(owner, severity),
        reviewerHandoffRequired: true,
        regenerationRequiredAfterDecision: true,
        selectedCandidateUnlockAllowed: false,
        publicReleaseApproved: false,
        publicSafe: false,
      });
    }
    const group = groups.get(key);
    group.candidateIds.push(item.candidateId);
    group.remediationIds.push(item.remediationId);
    group.graphNodeIds.push(...(item.targetGraphNodeIds ?? []), routeItem.graphNodeId);
    group.canonicalRefs.push(...(item.targetCanonicalRefs ?? []), ...(routeItem.canonicalRefs ?? []));
    group.sourceRefs.push(...(routeItem.sourceRefs ?? []));
    group.graphEdgeIds.push(...(routeItem.graphEdgeIds ?? []));
    group.vaultPackIds.push(...(routeItem.vaultPackIds ?? []));
    group.overlappingReasonFamilies.push(...(item.issueTypes ?? []).filter((reason) => reason !== QUALITY_REASON));
    group.blockingStatuses.push(item.blockingStatus);
  }

  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...groups.values()].map((target) => ({
    ...target,
    candidateIds: uniqueSorted(target.candidateIds),
    remediationIds: uniqueSorted(target.remediationIds),
    graphNodeIds: uniqueSorted(target.graphNodeIds),
    canonicalRefs: uniqueSorted(target.canonicalRefs),
    sourceRefs: uniqueSorted(target.sourceRefs),
    graphEdgeIds: uniqueSorted(target.graphEdgeIds),
    vaultPackIds: uniqueSorted(target.vaultPackIds),
    overlappingReasonFamilies: uniqueSorted(target.overlappingReasonFamilies),
    blockingStatuses: uniqueSorted(target.blockingStatuses),
    candidateCount: uniqueSorted(target.candidateIds).length,
  })).sort((a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9) || a.recommendedOwner.localeCompare(b.recommendedOwner) || a.fixtureId.localeCompare(b.fixtureId));
}

function targetCandidateCount(targets, key) {
  return targets.reduce((counts, target) => {
    const value = target[key] ?? 'unknown';
    counts[value] = (counts[value] ?? 0) + target.candidateCount;
    return counts;
  }, {});
}

function ownerQueues(reviewTargets) {
  const byOwner = new Map();
  for (const target of reviewTargets) {
    if (!byOwner.has(target.recommendedOwner)) {
      byOwner.set(target.recommendedOwner, {
        owner: target.recommendedOwner,
        targetCount: 0,
        candidateCount: 0,
        criticalCandidateCount: 0,
        highCandidateCount: 0,
        reviewTargetIds: [],
        exitCriteria: [
          'Private reviewer decision is recorded for every target.',
          'Decision outcome does not approve public release.',
          'Regeneration remains blocked until reference/provenance and escalation lanes are handled.',
        ],
      });
    }
    const queue = byOwner.get(target.recommendedOwner);
    queue.targetCount += 1;
    queue.candidateCount += target.candidateCount;
    if (target.severity === 'critical') queue.criticalCandidateCount += target.candidateCount;
    if (target.severity === 'high') queue.highCandidateCount += target.candidateCount;
    queue.reviewTargetIds.push(target.reviewTargetId);
  }
  return [...byOwner.values()].map((queue) => ({
    ...queue,
    reviewTargetIds: uniqueSorted(queue.reviewTargetIds),
  })).sort((a, b) => b.criticalCandidateCount - a.criticalCandidateCount || b.candidateCount - a.candidateCount || a.owner.localeCompare(b.owner));
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const r01Plan = readJson(R01_PLAN_PATH);
  const r02Plan = readJson(R02_PLAN_PATH);
  const handoff = readJson(CP28_HANDOFF_PATH);
  const graphPointer = readJson(CP27_GRAPH_POINTER_PATH);
  const vaultPointer = readJson(CP27_VAULT_POINTER_PATH);
  const routeItemsByCandidateId = collectRouteItems(handoff);
  const remediationItems = handoff.remediationItems ?? [];
  const qualityItems = remediationItems.filter((item) => (item.issueTypes ?? []).includes(QUALITY_REASON));
  const reviewTargets = buildReviewTargets(qualityItems, routeItemsByCandidateId);
  const escalationOverlapCandidateIds = uniqueSorted(qualityItems.filter((item) => (item.issueTypes ?? []).some((reason) => ['grade_uncertainty_requires_escalation_review', 'safety_escalation_required'].includes(reason))).map((item) => item.candidateId));
  const referenceOverlapCandidateIds = uniqueSorted(qualityItems.filter((item) => (item.issueTypes ?? []).includes('cp27_unresolved_references_present')).map((item) => item.candidateId));
  const sourceGapOverlapCandidateIds = uniqueSorted(qualityItems.filter((item) => (item.issueTypes ?? []).includes('source_or_provenance_gap_fixture')).map((item) => item.candidateId));

  const plan = {
    schemaVersion: 'cp29.quality-review-burn-down-plan.v1',
    checkpoint: 'CP29-R03',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r03_quality_review_burn_down_plan.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'quality_review_burn_down_plan',
    sourceArtifacts: {
      cp29R01RemediationUnlockPlan: artifactRef(R01_PLAN_PATH),
      cp29R02ReferenceProvenanceRepairPlan: artifactRef(R02_PLAN_PATH),
      cp28ValidationHandoff: artifactRef(CP28_HANDOFF_PATH),
      cp27LatestGraph: artifactRef(CP27_GRAPH_POINTER_PATH),
      cp27LatestVault: artifactRef(CP27_VAULT_POINTER_PATH),
      cp27QualityBlockerVaultPack: artifactRef(CP27_QUALITY_PACK_PATH),
    },
    baseline: {
      cp27HighOrCriticalBlockerCount: graphPointer.counts.highOrCriticalBlockerCount,
      cp27VaultHighOrCriticalBlockerCount: vaultPointer.counts.highOrCriticalBlockerCount,
      cp28HighOrCriticalRemediationCount: r01Plan.baseline.cp28HighOrCriticalRemediationCount,
      qualityReviewCandidateCount: qualityItems.length,
      criticalQualityCandidateCount: qualityItems.filter((item) => item.severity === 'critical').length,
      highQualityCandidateCount: qualityItems.filter((item) => item.severity === 'high').length,
      referenceOverlapCandidateCount: referenceOverlapCandidateIds.length,
      sourceGapOverlapCandidateCount: sourceGapOverlapCandidateIds.length,
      escalationOverlapCandidateCount: escalationOverlapCandidateIds.length,
      reviewTargetCount: reviewTargets.length,
      r02RepairTargetCount: r02Plan.baseline.repairTargetCount,
      cp28SelectedCandidateCount: r01Plan.baseline.cp28SelectedCandidateCount,
      cp28SelectedRouteItemCount: r01Plan.baseline.cp28SelectedRouteItemCount,
      publicSafeCandidateCount: 0,
      publicSafeRouteItemCount: 0,
    },
    targetReasonFamily: QUALITY_REASON,
    groupingSummary: {
      byRecommendedOwner: targetCandidateCount(reviewTargets, 'recommendedOwner'),
      bySeverity: targetCandidateCount(reviewTargets, 'severity'),
      byFixture: targetCandidateCount(reviewTargets, 'fixtureId'),
      byGraphPartition: targetCandidateCount(reviewTargets, 'graphPartition'),
      bySourceGroupKey: targetCandidateCount(reviewTargets, 'sourceGroupKey'),
    },
    reviewerQueues: ownerQueues(reviewTargets),
    reviewTargets,
    burnDownMetrics: {
      currentQualityReviewCandidateCount: qualityItems.length,
      targetQualityReviewCandidateCountAfterReview: 0,
      currentHighOrCriticalRemediationCount: r01Plan.baseline.cp28HighOrCriticalRemediationCount,
      targetHighOrCriticalRemediationCountAfterReviewAndRegeneration: 0,
      deltaMeasurementCheckpoint: 'CP29-R05',
      measurableNow: true,
      actualDeltaAppliedInR03: false,
    },
    unlockBoundary: {
      selectedCandidateUnlockAllowed: false,
      selectedRouteItemUnlockAllowed: false,
      reason: 'CP29-R03 creates private quality review queues only. Reviewer decisions, escalation separation, regeneration, and diff proof are still required before unlock.',
      nextCheckpoint: 'CP29-R04',
    },
    publicBoundary: publicBoundary('CP29-R03 is a private quality review burn-down plan. Public release remains blocked and public-safe counts remain zero.'),
  };

  const qualityPlanArtifact = writeJson(QUALITY_PLAN_PATH, plan);
  const manifest = {
    schemaVersion: 'cp29.remediation-manifest.v1',
    checkpoint: 'CP29-R03',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r03_quality_review_burn_down_plan.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactPaths: {
      remediationUnlockPlan: R01_PLAN_PATH.replaceAll(path.sep, '/'),
      referenceProvenanceRepairPlan: R02_PLAN_PATH.replaceAll(path.sep, '/'),
      qualityReviewBurnDownPlan: qualityPlanArtifact.path,
    },
    checksums: {
      remediationUnlockPlanSha256: plan.sourceArtifacts.cp29R01RemediationUnlockPlan.checksumSha256,
      referenceProvenanceRepairPlanSha256: plan.sourceArtifacts.cp29R02ReferenceProvenanceRepairPlan.checksumSha256,
      qualityReviewBurnDownPlanSha256: qualityPlanArtifact.checksumSha256,
      cp28ValidationHandoffSha256: plan.sourceArtifacts.cp28ValidationHandoff.checksumSha256,
      cp27QualityBlockerVaultPackSha256: plan.sourceArtifacts.cp27QualityBlockerVaultPack.checksumSha256,
    },
    counts: plan.baseline,
    verifier: {
      command: 'node scripts/check_cp29_r03_quality_review_burn_down_plan.mjs',
      status: 'pending',
    },
    publicBoundary: plan.publicBoundary,
  };
  const manifestArtifact = writeJson(MANIFEST_PATH, manifest);
  writeJson(LATEST_POINTER_PATH, {
    schemaVersion: 'cp29.latest-remediation-pointer.v1',
    checkpoint: 'CP29-R03',
    generatedAt: GENERATED_AT,
    remediationDir: OUT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    remediationUnlockPlanPath: R01_PLAN_PATH.replaceAll(path.sep, '/'),
    remediationUnlockPlanSha256: plan.sourceArtifacts.cp29R01RemediationUnlockPlan.checksumSha256,
    referenceProvenanceRepairPlanPath: R02_PLAN_PATH.replaceAll(path.sep, '/'),
    referenceProvenanceRepairPlanSha256: plan.sourceArtifacts.cp29R02ReferenceProvenanceRepairPlan.checksumSha256,
    qualityReviewBurnDownPlanPath: qualityPlanArtifact.path,
    qualityReviewBurnDownPlanSha256: qualityPlanArtifact.checksumSha256,
    counts: plan.baseline,
    publicBoundary: plan.publicBoundary,
  });
  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP29-R03', outputPath: qualityPlanArtifact.path, summary: plan.baseline }, null, 2));
}

main();
