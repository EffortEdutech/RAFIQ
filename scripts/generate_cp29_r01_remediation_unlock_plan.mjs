#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('data', 'remediation', 'cp29');
const CP28_VERIFICATION_PATH = path.join('data', 'retrieval', 'cp28', 'combined-verification.json');
const CP28_HANDOFF_PATH = path.join('data', 'retrieval', 'cp28', 'validation-handoff.json');
const CP28_RANKING_PATH = path.join('data', 'retrieval', 'cp28', 'ranking-selection.json');
const CP27_GRAPH_POINTER_PATH = path.join('data', 'graphify', 'cp27-refresh', 'latest-graph.json');
const CP27_VAULT_POINTER_PATH = path.join('data', 'vault', 'cp27-refresh', 'latest-vault.json');
const PLAN_PATH = path.join(OUT_DIR, 'remediation-unlock-plan.json');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const LATEST_POINTER_PATH = path.join(OUT_DIR, 'latest-remediation.json');
const GENERATED_AT = '2026-07-18T00:00:00.000Z';

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

function countBy(items, keyFn) {
  return items.reduce((counts, item) => {
    const key = keyFn(item) ?? 'unknown';
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
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

function reasonAction(reason) {
  if (reason === 'cp27_unresolved_references_present') return 'Resolve CP27 graph/vault unresolved references, regenerate CP27 artifacts, then rerun CP28 retrieval.';
  if (reason === 'cp27_quality_state_review_required') return 'Complete quality review for affected refreshed graph nodes and snapshot source groups.';
  if (reason === 'source_or_provenance_gap_fixture') return 'Repair source/provenance linkage for raw-lineage and source-gap candidates.';
  if (reason === 'grade_uncertainty_requires_escalation_review') return 'Route hadith grade uncertainty to scholar/content escalation before ordinary unlock.';
  if (reason === 'safety_escalation_required') return 'Route safety-sensitive items through product-owner escalation and keep them out of selected ordinary candidates.';
  return 'Assign bounded private remediation action before selected-candidate unlock.';
}

function reasonPhase(reason) {
  if (reason === 'cp27_unresolved_references_present') return 'CP29-R02';
  if (reason === 'cp27_quality_state_review_required') return 'CP29-R03';
  if (reason === 'source_or_provenance_gap_fixture') return 'CP29-R02';
  if (reason === 'grade_uncertainty_requires_escalation_review') return 'CP29-R04';
  if (reason === 'safety_escalation_required') return 'CP29-R04';
  return 'CP29-R03';
}

function phasePlan(reasonCounts) {
  return [
    {
      checkpoint: 'CP29-R01',
      title: 'Remediation Architecture And Unlock Baseline',
      objective: 'Lock blocker taxonomy, input artifacts, unlock gates, and no-public boundary.',
      exitCriteria: ['baseline counts recorded', 'reason families mapped', 'selected candidates remain zero'],
    },
    {
      checkpoint: 'CP29-R02',
      title: 'Reference And Provenance Repair Plan',
      objective: 'Target unresolved references and source/provenance gap candidates first.',
      expectedReasonFamilies: Object.keys(reasonCounts).filter((reason) => ['cp27_unresolved_references_present', 'source_or_provenance_gap_fixture'].includes(reason)),
      exitCriteria: ['repair plan generated', 'rerun command sequence documented', 'public-safe counts remain zero'],
    },
    {
      checkpoint: 'CP29-R03',
      title: 'Quality Review Burn-Down Plan',
      objective: 'Route review_required quality candidates to private reviewer queues.',
      expectedReasonFamilies: Object.keys(reasonCounts).filter((reason) => reason === 'cp27_quality_state_review_required'),
      exitCriteria: ['quality review targets grouped by owner', 'high/critical count can be measured after rerun'],
    },
    {
      checkpoint: 'CP29-R04',
      title: 'Escalation Lane Separation',
      objective: 'Keep hadith-grade and safety escalations out of ordinary selected-candidate unlock.',
      expectedReasonFamilies: Object.keys(reasonCounts).filter((reason) => ['grade_uncertainty_requires_escalation_review', 'safety_escalation_required'].includes(reason)),
      exitCriteria: ['escalation items remain separate', 'ordinary unlock excludes escalation candidates'],
    },
    {
      checkpoint: 'CP29-R05',
      title: 'Regeneration And Diff Proof',
      objective: 'Regenerate CP27/CP28 after remediation and compare selected-candidate unlock deltas.',
      exitCriteria: ['CP27 pointers refreshed', 'CP28 ranking rerun', 'diff proof records selected count delta'],
    },
    {
      checkpoint: 'CP29-R06',
      title: 'Selected-Candidate Unlock Verification',
      objective: 'Prove selected candidates can appear only when validation gates allow them.',
      exitCriteria: ['selected candidates have complete operational refs', 'selected route items have validation handoff', 'public route remains false'],
    },
    {
      checkpoint: 'CP29-R07',
      title: 'Private Route Readiness Decision',
      objective: 'Decide whether CP28 private source route can be implemented after unlock proof.',
      exitCriteria: ['route readiness is approved or deferred', 'payload caps remain bounded'],
    },
    {
      checkpoint: 'CP29-R08',
      title: 'Combined Verification And Close-Out',
      objective: 'Close CP29 and select the next product scope.',
      exitCriteria: ['combined verifier passes', 'next scope selected', 'public release remains blocked'],
    },
  ];
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const verification = readJson(CP28_VERIFICATION_PATH);
  const handoff = readJson(CP28_HANDOFF_PATH);
  const ranking = readJson(CP28_RANKING_PATH);
  const graphPointer = readJson(CP27_GRAPH_POINTER_PATH);
  const vaultPointer = readJson(CP27_VAULT_POINTER_PATH);
  const remediationItems = handoff.remediationItems ?? [];
  const reasonCounts = {};
  for (const item of remediationItems) {
    for (const reason of item.issueTypes ?? []) {
      reasonCounts[reason] = (reasonCounts[reason] ?? 0) + 1;
    }
  }
  const unlockBlockers = Object.entries(reasonCounts).map(([reason, count]) => ({
    reason,
    candidateCount: count,
    targetCheckpoint: reasonPhase(reason),
    recommendedAction: reasonAction(reason),
  })).sort((a, b) => b.candidateCount - a.candidateCount || a.reason.localeCompare(b.reason));

  const plan = {
    schemaVersion: 'cp29.remediation-unlock-plan.v1',
    checkpoint: 'CP29-R01',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r01_remediation_unlock_plan.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'retrieval_remediation_selected_candidate_unlock_baseline',
    sourceArtifacts: {
      cp28CombinedVerification: artifactRef(CP28_VERIFICATION_PATH),
      cp28ValidationHandoff: artifactRef(CP28_HANDOFF_PATH),
      cp28RankingSelection: artifactRef(CP28_RANKING_PATH),
      cp27LatestGraph: artifactRef(CP27_GRAPH_POINTER_PATH),
      cp27LatestVault: artifactRef(CP27_VAULT_POINTER_PATH),
    },
    baseline: {
      cp27GraphNodes: graphPointer.counts.totalNodes,
      cp27GraphEdges: graphPointer.counts.totalEdges,
      cp27VaultArtifacts: vaultPointer.counts.artifacts,
      cp27UnresolvedReferenceCount: graphPointer.counts.unresolvedReferenceCount,
      cp27HighOrCriticalBlockerCount: graphPointer.counts.highOrCriticalBlockerCount,
      cp28CandidateCount: verification.cp28Results.candidateCount,
      cp28SelectedCandidateCount: verification.cp28Results.selectedCandidateCount,
      cp28SelectedRouteItemCount: verification.cp28Results.selectedRouteItemCount,
      cp28RemediationCount: verification.cp28Results.remediationCount,
      cp28HighOrCriticalRemediationCount: verification.cp28Results.highOrCriticalRemediationCount,
      publicSafeCandidateCount: 0,
      publicSafeRouteItemCount: 0,
    },
    blockerTaxonomy: {
      reasonCounts,
      severityCounts: countBy(remediationItems, (item) => item.severity),
      ownerCounts: countBy(remediationItems, (item) => item.recommendedOwner),
      fixtureCounts: countBy(remediationItems, (item) => {
        const match = String(item.evidenceRouteId ?? '').match(/cp28:evidence-route:(.*):r04/);
        return match?.[1];
      }),
    },
    unlockBlockers,
    selectedUnlockPolicy: {
      selectedCandidateBaseline: 0,
      unlockTarget: 'selected_candidates_greater_than_zero_only_after_reference_quality_and_escalation_gates_pass',
      ordinaryUnlockExcludesEscalation: true,
      requiresCp27Regeneration: true,
      requiresCp28Rerun: true,
      publicReleaseApproved: false,
    },
    phasePlan: phasePlan(reasonCounts),
    candidateUnlockPreview: {
      ordinaryCandidateCount: ranking.summary.ordinaryScoredCandidateCount,
      escalationCandidateCount: ranking.summary.requiresEscalationCandidateCount,
      blockedByUnresolvedReferences: reasonCounts.cp27_unresolved_references_present ?? 0,
      blockedByQualityReview: reasonCounts.cp27_quality_state_review_required ?? 0,
      blockedByEscalation: (reasonCounts.grade_uncertainty_requires_escalation_review ?? 0) + (reasonCounts.safety_escalation_required ?? 0),
      selectedCandidatesRemainZero: ranking.summary.selectedCandidateCount === 0,
    },
    publicBoundary: publicBoundary('CP29-R01 is a private remediation/unlock baseline. Public release remains blocked and public-safe counts remain zero.'),
  };

  const planArtifact = writeJson(PLAN_PATH, plan);
  const manifest = {
    schemaVersion: 'cp29.remediation-manifest.v1',
    checkpoint: 'CP29-R01',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r01_remediation_unlock_plan.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactPaths: {
      remediationUnlockPlan: planArtifact.path,
    },
    checksums: {
      remediationUnlockPlanSha256: planArtifact.checksumSha256,
      cp28CombinedVerificationSha256: plan.sourceArtifacts.cp28CombinedVerification.checksumSha256,
      cp28ValidationHandoffSha256: plan.sourceArtifacts.cp28ValidationHandoff.checksumSha256,
    },
    counts: plan.baseline,
    verifier: {
      command: 'node scripts/check_cp29_r01_remediation_unlock_plan.mjs',
      status: 'pending',
    },
    publicBoundary: plan.publicBoundary,
  };
  const manifestArtifact = writeJson(MANIFEST_PATH, manifest);
  writeJson(LATEST_POINTER_PATH, {
    schemaVersion: 'cp29.latest-remediation-pointer.v1',
    checkpoint: 'CP29-R01',
    generatedAt: GENERATED_AT,
    remediationDir: OUT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    remediationUnlockPlanPath: planArtifact.path,
    remediationUnlockPlanSha256: planArtifact.checksumSha256,
    counts: plan.baseline,
    publicBoundary: plan.publicBoundary,
  });
  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP29-R01', outputPath: planArtifact.path, summary: plan.baseline }, null, 2));
}

main();
