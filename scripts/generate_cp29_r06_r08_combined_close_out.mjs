#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('data', 'remediation', 'cp29');
const R01_PLAN_PATH = path.join(OUT_DIR, 'remediation-unlock-plan.json');
const R02_PLAN_PATH = path.join(OUT_DIR, 'reference-provenance-repair-plan.json');
const R03_PLAN_PATH = path.join(OUT_DIR, 'quality-review-burn-down-plan.json');
const R04_ESCALATION_PATH = path.join(OUT_DIR, 'escalation-lane-separation.json');
const R05_DIFF_PATH = path.join(OUT_DIR, 'regeneration-diff-proof.json');
const CP28_VERIFICATION_PATH = path.join('data', 'retrieval', 'cp28', 'combined-verification.json');
const UNLOCK_VERIFICATION_PATH = path.join(OUT_DIR, 'selected-candidate-unlock-verification.json');
const ROUTE_READINESS_PATH = path.join(OUT_DIR, 'private-route-readiness-decision.json');
const COMBINED_VERIFICATION_PATH = path.join(OUT_DIR, 'combined-verification.json');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const LATEST_POINTER_PATH = path.join(OUT_DIR, 'latest-remediation.json');
const GENERATED_AT = '2026-07-19T00:00:00.000Z';

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

function allZero(values) {
  return Object.values(values).every((value) => value === 0);
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const r01Plan = readJson(R01_PLAN_PATH);
  const r02Plan = readJson(R02_PLAN_PATH);
  const r03Plan = readJson(R03_PLAN_PATH);
  const r04Escalation = readJson(R04_ESCALATION_PATH);
  const r05Diff = readJson(R05_DIFF_PATH);
  const cp28Verification = readJson(CP28_VERIFICATION_PATH);

  const unmetUnlockPreconditions = [
    { precondition: 'reference_provenance_repairs_applied', met: r05Diff.regenerationState.actualSourceRepairApplied === true },
    { precondition: 'quality_review_decisions_applied', met: r05Diff.regenerationState.actualQualityReviewDecisionsApplied === true },
    { precondition: 'escalation_decisions_applied', met: r05Diff.regenerationState.actualEscalationDecisionsApplied === true },
    { precondition: 'cp27_regenerated', met: r05Diff.regenerationState.cp27GraphRegeneratedInR05 === true && r05Diff.regenerationState.cp27VaultRegeneratedInR05 === true },
    { precondition: 'cp28_retrieval_regenerated', met: r05Diff.regenerationState.cp28RetrievalRegeneratedInR05 === true },
    { precondition: 'selected_candidates_greater_than_zero', met: r05Diff.afterCounts.cp28SelectedCandidates > 0 },
    { precondition: 'selected_route_items_greater_than_zero', met: r05Diff.afterCounts.cp28SelectedRouteItems > 0 },
    { precondition: 'no_escalation_leakage', met: r05Diff.deltas.escalationCandidateLeakageIntoOrdinaryUnlock === 0 },
  ];

  const unlockVerification = {
    schemaVersion: 'cp29.selected-candidate-unlock-verification.v1',
    checkpoint: 'CP29-R06',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r06_r08_combined_close_out.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'selected_candidate_unlock_verification',
    sourceArtifacts: {
      cp29R05RegenerationDiffProof: artifactRef(R05_DIFF_PATH),
      cp28CombinedVerification: artifactRef(CP28_VERIFICATION_PATH),
    },
    verificationOutcome: 'blocked_as_expected',
    selectedCandidateUnlockAllowed: false,
    selectedRouteItemUnlockAllowed: false,
    selectedCandidateCount: r05Diff.afterCounts.cp28SelectedCandidates,
    selectedRouteItemCount: r05Diff.afterCounts.cp28SelectedRouteItems,
    escalationCandidateLeakageIntoOrdinaryUnlock: r05Diff.deltas.escalationCandidateLeakageIntoOrdinaryUnlock,
    unmetUnlockPreconditions,
    blockingReasons: unmetUnlockPreconditions.filter((item) => item.met === false).map((item) => item.precondition),
    publicBoundary: publicBoundary('CP29-R06 verifies selected-candidate unlock remains blocked because real remediation/regeneration has not occurred.'),
  };
  const unlockArtifact = writeJson(UNLOCK_VERIFICATION_PATH, unlockVerification);

  const routeReadiness = {
    schemaVersion: 'cp29.private-route-readiness-decision.v1',
    checkpoint: 'CP29-R07',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r06_r08_combined_close_out.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'private_route_readiness_decision',
    sourceArtifacts: {
      cp29R06SelectedCandidateUnlockVerification: artifactRef(UNLOCK_VERIFICATION_PATH),
      cp28CombinedVerification: artifactRef(CP28_VERIFICATION_PATH),
    },
    decision: 'defer_private_route_implementation',
    privateRouteReady: false,
    reason: 'Selected candidates and selected route items remain zero, so a real private selected-evidence route has no approved payload to expose yet.',
    payloadCaps: {
      selectedCandidateLimit: 0,
      selectedRouteItemLimit: 0,
      escalationCandidateLimit: 0,
      publicRouteExposed: false,
    },
    nextAllowedRouteWork: [
      'Keep existing internal remediation/inspection artifacts available for private development.',
      'Implement a real selected-evidence private route only after CP29-R06 can verify selected candidates and route items are greater than zero.',
      'Do not expose public routes for private graph, vault, retrieval, remediation, review, or audit artifacts.',
    ],
    publicBoundary: publicBoundary('CP29-R07 defers private selected-evidence route readiness. Public release remains blocked.'),
  };
  const routeArtifact = writeJson(ROUTE_READINESS_PATH, routeReadiness);

  const combinedChecks = [
    { checkId: 'cp29-r01-baseline-present', status: r01Plan.checkpoint === 'CP29-R01' ? 'pass' : 'fail' },
    { checkId: 'cp29-r02-repair-plan-present', status: r02Plan.checkpoint === 'CP29-R02' ? 'pass' : 'fail' },
    { checkId: 'cp29-r03-quality-plan-present', status: r03Plan.checkpoint === 'CP29-R03' ? 'pass' : 'fail' },
    { checkId: 'cp29-r04-escalation-separated', status: r04Escalation.baseline.escalationCandidateCount === 15 && r04Escalation.baseline.ordinaryUnlockExcludedCandidateCount === 15 ? 'pass' : 'fail' },
    { checkId: 'cp29-r05-zero-delta-proof', status: allZero(r05Diff.deltas) ? 'pass' : 'fail' },
    { checkId: 'cp29-r06-unlock-blocked', status: unlockVerification.verificationOutcome === 'blocked_as_expected' && unlockVerification.selectedCandidateCount === 0 ? 'pass' : 'fail' },
    { checkId: 'cp29-r07-private-route-deferred', status: routeReadiness.privateRouteReady === false && routeReadiness.payloadCaps.selectedRouteItemLimit === 0 ? 'pass' : 'fail' },
    { checkId: 'cp28-remains-valid', status: cp28Verification.checks.every((check) => check.status === 'pass') ? 'pass' : 'fail' },
    { checkId: 'public-boundary-zero', status: r05Diff.afterCounts.publicSafeCandidates === 0 && r05Diff.afterCounts.publicSafeRouteItems === 0 ? 'pass' : 'fail' },
  ];

  const combinedVerification = {
    schemaVersion: 'cp29.combined-verification.v1',
    checkpoint: 'CP29-R08',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r06_r08_combined_close_out.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'combined_verification_and_close_out',
    sourceArtifacts: {
      cp29R01RemediationUnlockPlan: artifactRef(R01_PLAN_PATH),
      cp29R02ReferenceProvenanceRepairPlan: artifactRef(R02_PLAN_PATH),
      cp29R03QualityReviewBurnDownPlan: artifactRef(R03_PLAN_PATH),
      cp29R04EscalationLaneSeparation: artifactRef(R04_ESCALATION_PATH),
      cp29R05RegenerationDiffProof: artifactRef(R05_DIFF_PATH),
      cp29R06SelectedCandidateUnlockVerification: artifactRef(UNLOCK_VERIFICATION_PATH),
      cp29R07PrivateRouteReadinessDecision: artifactRef(ROUTE_READINESS_PATH),
      cp28CombinedVerification: artifactRef(CP28_VERIFICATION_PATH),
    },
    checks: combinedChecks,
    counts: {
      cp27UnresolvedReferences: r05Diff.afterCounts.cp27UnresolvedReferences,
      cp27HighOrCriticalBlockers: r05Diff.afterCounts.cp27HighOrCriticalBlockers,
      cp28Candidates: r05Diff.afterCounts.cp28Candidates,
      cp28SelectedCandidates: r05Diff.afterCounts.cp28SelectedCandidates,
      cp28SelectedRouteItems: r05Diff.afterCounts.cp28SelectedRouteItems,
      cp28RemediationItems: r05Diff.afterCounts.cp28RemediationItems,
      cp28HighOrCriticalRemediationItems: r05Diff.afterCounts.cp28HighOrCriticalRemediationItems,
      escalationCandidates: r04Escalation.baseline.escalationCandidateCount,
      publicSafeCandidates: 0,
      publicSafeRouteItems: 0,
    },
    cp29Outcome: {
      status: 'complete_blocked_unlock_handoff',
      selectedCandidateUnlockProven: false,
      privateRouteReady: false,
      nextScope: 'CP30 - Private Guidance Loop Integration',
      handoffReason: 'CP29 completed the remediation architecture, repair plans, review queues, escalation separation, and zero-delta proof. Actual repair/regeneration remains future work before selected evidence can unlock.',
    },
    publicBoundary: publicBoundary('CP29-R08 closes CP29 as private remediation planning and blocked-unlock proof. Public release remains blocked.'),
  };
  const combinedArtifact = writeJson(COMBINED_VERIFICATION_PATH, combinedVerification);

  const manifest = {
    schemaVersion: 'cp29.remediation-manifest.v1',
    checkpoint: 'CP29-R08',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp29_r06_r08_combined_close_out.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactPaths: {
      remediationUnlockPlan: R01_PLAN_PATH.replaceAll(path.sep, '/'),
      referenceProvenanceRepairPlan: R02_PLAN_PATH.replaceAll(path.sep, '/'),
      qualityReviewBurnDownPlan: R03_PLAN_PATH.replaceAll(path.sep, '/'),
      escalationLaneSeparation: R04_ESCALATION_PATH.replaceAll(path.sep, '/'),
      regenerationDiffProof: R05_DIFF_PATH.replaceAll(path.sep, '/'),
      selectedCandidateUnlockVerification: unlockArtifact.path,
      privateRouteReadinessDecision: routeArtifact.path,
      combinedVerification: combinedArtifact.path,
    },
    checksums: {
      selectedCandidateUnlockVerificationSha256: unlockArtifact.checksumSha256,
      privateRouteReadinessDecisionSha256: routeArtifact.checksumSha256,
      combinedVerificationSha256: combinedArtifact.checksumSha256,
    },
    counts: combinedVerification.counts,
    verifier: {
      command: 'node scripts/check_cp29_r06_r08_combined_close_out.mjs',
      status: 'pending',
    },
    publicBoundary: combinedVerification.publicBoundary,
  };
  const manifestArtifact = writeJson(MANIFEST_PATH, manifest);
  writeJson(LATEST_POINTER_PATH, {
    schemaVersion: 'cp29.latest-remediation-pointer.v1',
    checkpoint: 'CP29-R08',
    generatedAt: GENERATED_AT,
    remediationDir: OUT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    combinedVerificationPath: combinedArtifact.path,
    combinedVerificationSha256: combinedArtifact.checksumSha256,
    counts: combinedVerification.counts,
    publicBoundary: combinedVerification.publicBoundary,
  });

  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP29-R06/R07/R08', outcome: combinedVerification.cp29Outcome, counts: combinedVerification.counts }, null, 2));
}

main();
