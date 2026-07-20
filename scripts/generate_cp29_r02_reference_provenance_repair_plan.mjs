#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('data', 'remediation', 'cp29');
const CP29_R01_PLAN_PATH = path.join(OUT_DIR, 'remediation-unlock-plan.json');
const CP28_HANDOFF_PATH = path.join('data', 'retrieval', 'cp28', 'validation-handoff.json');
const CP27_GRAPH_POINTER_PATH = path.join('data', 'graphify', 'cp27-refresh', 'latest-graph.json');
const CP27_VAULT_POINTER_PATH = path.join('data', 'vault', 'cp27-refresh', 'latest-vault.json');
const REPAIR_PLAN_PATH = path.join(OUT_DIR, 'reference-provenance-repair-plan.json');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const LATEST_POINTER_PATH = path.join(OUT_DIR, 'latest-remediation.json');
const GENERATED_AT = '2026-07-18T00:00:00.000Z';
const TARGET_REASONS = ['cp27_unresolved_references_present', 'source_or_provenance_gap_fixture'];

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
      for (const item of route.evidenceRoute?.[bucket] ?? []) {
        byCandidateId.set(item.candidateId, item);
      }
    }
  }
  return byCandidateId;
}

function targetAction(reason) {
  if (reason === 'source_or_provenance_gap_fixture') {
    return [
      'Confirm canonical source group ownership and source registry row mapping.',
      'Repair missing or ambiguous provenance linkage in the private snapshot/source workflow.',
      'Regenerate CP26 snapshot pointers, CP27 graph/vault artifacts, and CP28 retrieval artifacts after the source repair.',
    ];
  }
  return [
    'Confirm each target canonical ref resolves to a refreshed graph node or explicit deferred state.',
    'Repair unresolved CP27 graph/vault reference links in the private refresh workflow.',
    'Regenerate CP27 graph/vault artifacts and rerun CP28 retrieval artifacts after the reference repair.',
  ];
}

function buildRepairTargets(remediationItems, routeItemsByCandidateId) {
  const groups = new Map();
  for (const item of remediationItems) {
    const matchedReasons = (item.issueTypes ?? []).filter((reason) => TARGET_REASONS.includes(reason));
    for (const reason of matchedReasons) {
      const routeItem = routeItemsByCandidateId.get(item.candidateId) ?? {};
      const graphPartition = routeItem.graphPartition ?? 'unknown-partition';
      const sourceGroupKey = routeItem.sourceGroupKey ?? 'unknown-source-group';
      const fixtureId = fixtureIdFromEvidenceRouteId(item.evidenceRouteId);
      const key = [reason, graphPartition, sourceGroupKey, fixtureId].join('|');
      if (!groups.has(key)) {
        groups.set(key, {
          repairTargetId: `cp29:r02:repair-target:${groups.size + 1}`,
          reasonFamily: reason,
          targetCheckpoint: 'CP29-R02',
          fixtureId,
          graphPartition,
          sourceGroupKey,
          recommendedOwner: item.recommendedOwner,
          candidateIds: [],
          remediationIds: [],
          graphNodeIds: [],
          canonicalRefs: [],
          sourceRefs: [],
          graphEdgeIds: [],
          vaultPackIds: [],
          severities: [],
          blockingStatuses: [],
          recommendedActions: targetAction(reason),
          regenerationRequired: true,
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
      group.severities.push(item.severity);
      group.blockingStatuses.push(item.blockingStatus);
    }
  }

  return [...groups.values()].map((target) => ({
    ...target,
    candidateIds: uniqueSorted(target.candidateIds),
    remediationIds: uniqueSorted(target.remediationIds),
    graphNodeIds: uniqueSorted(target.graphNodeIds),
    canonicalRefs: uniqueSorted(target.canonicalRefs),
    sourceRefs: uniqueSorted(target.sourceRefs),
    graphEdgeIds: uniqueSorted(target.graphEdgeIds),
    vaultPackIds: uniqueSorted(target.vaultPackIds),
    severities: uniqueSorted(target.severities),
    blockingStatuses: uniqueSorted(target.blockingStatuses),
    candidateCount: uniqueSorted(target.candidateIds).length,
  })).sort((a, b) => a.reasonFamily.localeCompare(b.reasonFamily) || a.graphPartition.localeCompare(b.graphPartition) || a.fixtureId.localeCompare(b.fixtureId));
}

function countTargets(targets, key) {
  return targets.reduce((counts, target) => {
    const value = target[key] ?? 'unknown';
    counts[value] = (counts[value] ?? 0) + target.candidateCount;
    return counts;
  }, {});
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const r01Plan = readJson(CP29_R01_PLAN_PATH);
  const handoff = readJson(CP28_HANDOFF_PATH);
  const graphPointer = readJson(CP27_GRAPH_POINTER_PATH);
  const vaultPointer = readJson(CP27_VAULT_POINTER_PATH);
  const remediationItems = handoff.remediationItems ?? [];
  const routeItemsByCandidateId = collectRouteItems(handoff);
  const repairTargets = buildRepairTargets(remediationItems, routeItemsByCandidateId);
  const uniqueReferenceCandidateIds = uniqueSorted(repairTargets.filter((target) => target.reasonFamily === 'cp27_unresolved_references_present').flatMap((target) => target.candidateIds));
  const uniqueProvenanceCandidateIds = uniqueSorted(repairTargets.filter((target) => target.reasonFamily === 'source_or_provenance_gap_fixture').flatMap((target) => target.candidateIds));

  const repairPlan = {
    schemaVersion: 'cp29.reference-provenance-repair-plan.v1',
    checkpoint: 'CP29-R02',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r02_reference_provenance_repair_plan.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'reference_and_provenance_repair_plan',
    sourceArtifacts: {
      cp29R01RemediationUnlockPlan: artifactRef(CP29_R01_PLAN_PATH),
      cp28ValidationHandoff: artifactRef(CP28_HANDOFF_PATH),
      cp27LatestGraph: artifactRef(CP27_GRAPH_POINTER_PATH),
      cp27LatestVault: artifactRef(CP27_VAULT_POINTER_PATH),
    },
    baseline: {
      cp27UnresolvedReferenceCount: graphPointer.counts.unresolvedReferenceCount,
      cp27HighOrCriticalBlockerCount: graphPointer.counts.highOrCriticalBlockerCount,
      cp27VaultUnresolvedReferenceCount: vaultPointer.counts.unresolvedReferenceCount,
      cp28RemediationCount: r01Plan.baseline.cp28RemediationCount,
      cp28SelectedCandidateCount: r01Plan.baseline.cp28SelectedCandidateCount,
      cp28SelectedRouteItemCount: r01Plan.baseline.cp28SelectedRouteItemCount,
      referenceRepairCandidateCount: uniqueReferenceCandidateIds.length,
      sourceProvenanceGapCandidateCount: uniqueProvenanceCandidateIds.length,
      repairTargetCount: repairTargets.length,
      publicSafeCandidateCount: 0,
      publicSafeRouteItemCount: 0,
    },
    targetReasonFamilies: TARGET_REASONS,
    groupingSummary: {
      byReasonFamily: countTargets(repairTargets, 'reasonFamily'),
      byGraphPartition: countTargets(repairTargets, 'graphPartition'),
      bySourceGroupKey: countTargets(repairTargets, 'sourceGroupKey'),
      byRecommendedOwner: countTargets(repairTargets, 'recommendedOwner'),
    },
    repairTargets,
    regenerationPlan: [
      {
        order: 1,
        checkpoint: 'CP29-R02',
        command: 'node scripts\\check_cp29_r02_reference_provenance_repair_plan.mjs',
        expectedResult: 'Repair plan and public boundary are verified before source data changes.',
      },
      {
        order: 2,
        checkpoint: 'CP26',
        command: 'Run the CP26 snapshot refresh generators only after source/provenance metadata is repaired.',
        expectedResult: 'Snapshot manifests and checksums reflect repaired references.',
      },
      {
        order: 3,
        checkpoint: 'CP27',
        command: 'Run the CP27 refreshed graph and vault rebuild sequence.',
        expectedResult: 'Unresolved reference and blocker deltas are visible in graph and vault pointers.',
      },
      {
        order: 4,
        checkpoint: 'CP28',
        command: 'Run the CP28 retrieval collection, ranking, evidence route, API/UI proof, and combined verification sequence.',
        expectedResult: 'Candidate selection remains gate-driven and evidence routes carry complete operational refs.',
      },
      {
        order: 5,
        checkpoint: 'CP29-R05',
        command: 'Generate regeneration and diff proof.',
        expectedResult: 'Selected-candidate unlock deltas are measured without escalation leakage.',
      },
    ],
    unlockBoundary: {
      selectedCandidateUnlockAllowed: false,
      selectedRouteItemUnlockAllowed: false,
      reason: 'CP29-R02 is a repair plan only. Actual repair, regeneration, diff proof, quality review, and escalation separation must happen before unlock.',
      nextCheckpoint: 'CP29-R03',
    },
    publicBoundary: publicBoundary('CP29-R02 plans private reference/provenance repair only. Public release remains blocked and public-safe counts remain zero.'),
  };

  const repairPlanArtifact = writeJson(REPAIR_PLAN_PATH, repairPlan);
  const manifest = {
    schemaVersion: 'cp29.remediation-manifest.v1',
    checkpoint: 'CP29-R02',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r02_reference_provenance_repair_plan.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactPaths: {
      remediationUnlockPlan: CP29_R01_PLAN_PATH.replaceAll(path.sep, '/'),
      referenceProvenanceRepairPlan: repairPlanArtifact.path,
    },
    checksums: {
      remediationUnlockPlanSha256: repairPlan.sourceArtifacts.cp29R01RemediationUnlockPlan.checksumSha256,
      referenceProvenanceRepairPlanSha256: repairPlanArtifact.checksumSha256,
      cp28ValidationHandoffSha256: repairPlan.sourceArtifacts.cp28ValidationHandoff.checksumSha256,
      cp27LatestGraphSha256: repairPlan.sourceArtifacts.cp27LatestGraph.checksumSha256,
      cp27LatestVaultSha256: repairPlan.sourceArtifacts.cp27LatestVault.checksumSha256,
    },
    counts: repairPlan.baseline,
    verifier: {
      command: 'node scripts/check_cp29_r02_reference_provenance_repair_plan.mjs',
      status: 'pending',
    },
    publicBoundary: repairPlan.publicBoundary,
  };
  const manifestArtifact = writeJson(MANIFEST_PATH, manifest);
  writeJson(LATEST_POINTER_PATH, {
    schemaVersion: 'cp29.latest-remediation-pointer.v1',
    checkpoint: 'CP29-R02',
    generatedAt: GENERATED_AT,
    remediationDir: OUT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    remediationUnlockPlanPath: CP29_R01_PLAN_PATH.replaceAll(path.sep, '/'),
    remediationUnlockPlanSha256: repairPlan.sourceArtifacts.cp29R01RemediationUnlockPlan.checksumSha256,
    referenceProvenanceRepairPlanPath: repairPlanArtifact.path,
    referenceProvenanceRepairPlanSha256: repairPlanArtifact.checksumSha256,
    counts: repairPlan.baseline,
    publicBoundary: repairPlan.publicBoundary,
  });
  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP29-R02', outputPath: repairPlanArtifact.path, summary: repairPlan.baseline }, null, 2));
}

main();
