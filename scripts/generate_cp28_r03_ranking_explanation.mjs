#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('data', 'retrieval', 'cp28');
const CANDIDATE_COLLECTION_PATH = path.join(OUT_DIR, 'candidate-collection.json');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const LATEST_POINTER_PATH = path.join(OUT_DIR, 'latest-retrieval.json');
const RANKING_SELECTION_PATH = path.join(OUT_DIR, 'ranking-selection.json');
const GENERATED_AT = '2026-07-18T00:00:00.000Z';

const PROHIBITED_INFERENCE_TERMS = [
  'religious approval',
  'authentic because of graph',
  'graph centrality proves',
  'fatwa',
  'public approved',
  'public-safe',
  'scholarly approval',
];

const ALLOWED_SIGNALS = [
  'source_refs_available',
  'canonical_refs_available',
  'graph_neighbor_available',
  'vault_context_available',
  'private_reviewed_quality',
  'review_required_quality',
  'private_blocked_release',
  'cp27_unresolved_references_present',
  'cp27_high_or_critical_blockers_present',
  'remediation_reason_count',
  'regression_fixture_coverage',
  'direct_index_seed',
  'escalation_required',
];

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
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

function average(values) {
  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, value));
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
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

function addComponent(components, signal, points, explanation) {
  components.push({
    signal,
    points,
    explanation,
    authorityBoundary: 'operational_metadata_only',
  });
}

function scoreCandidate(candidate, collection) {
  const components = [];
  let score = 25;

  if ((candidate.sourceRefs ?? []).length > 0) {
    score += 10;
    addComponent(components, 'source_refs_available', 10, 'Candidate has source references available for private reviewer navigation.');
  }
  if ((candidate.canonicalRefs ?? []).length > 0) {
    score += 10;
    addComponent(components, 'canonical_refs_available', 10, 'Candidate has canonical reference handles available for traceability.');
  }
  if ((candidate.graphEdgeIds ?? []).length > 0) {
    score += 8;
    addComponent(components, 'graph_neighbor_available', 8, 'Candidate has bounded graph-neighbor metadata for retrieval expansion review.');
  }
  if ((candidate.vaultPackIds ?? []).length > 0) {
    score += 8;
    addComponent(components, 'vault_context_available', 8, 'Candidate has bounded vault pack references for internal inspection.');
  }
  if (candidate.qualityState === 'private_reviewed') {
    score += 6;
    addComponent(components, 'private_reviewed_quality', 6, 'Candidate carries private reviewed quality metadata.');
  }
  if (candidate.qualityState === 'review_required') {
    score -= 15;
    addComponent(components, 'review_required_quality', -15, 'Candidate still requires quality or reviewer action.');
  }
  if (candidate.releaseState === 'private_blocked') {
    score -= 20;
    addComponent(components, 'private_blocked_release', -20, 'Candidate remains blocked from public release.');
  }
  if (collection.summary.cp27UnresolvedReferenceCount > 0) {
    score -= 15;
    addComponent(components, 'cp27_unresolved_references_present', -15, 'CP27 refreshed graph still exposes unresolved references.');
  }
  if (collection.summary.cp27HighOrCriticalBlockerCount > 0) {
    score -= 10;
    addComponent(components, 'cp27_high_or_critical_blockers_present', -10, 'CP27 refreshed graph still exposes high or critical blockers.');
  }
  const remediationPenalty = Math.min(20, (candidate.remediationReasons ?? []).length * 4);
  if (remediationPenalty > 0) {
    score -= remediationPenalty;
    addComponent(components, 'remediation_reason_count', -remediationPenalty, 'Candidate remediation reasons reduce reviewer-ready rank.');
  }
  if (candidate.regressionFixtureId?.startsWith('cp24-fixture-')) {
    score += 4;
    addComponent(components, 'regression_fixture_coverage', 4, 'Candidate remains connected to a CP24 regression fixture label.');
  }
  if (candidate.collectionMethod === 'direct_index_seed') {
    score += 4;
    addComponent(components, 'direct_index_seed', 4, 'Candidate came directly from a snapshot-backed CP27 index entry.');
  }
  if (candidate.selectionState === 'requires_escalation') {
    addComponent(components, 'escalation_required', 0, 'Candidate is separated from ordinary ranking because it requires escalation handling.');
  }

  return {
    ordinaryScore: candidate.selectionState === 'requires_escalation' ? null : clampScore(score),
    scoringComponents: components,
  };
}

function rankingState(candidate, ordinaryScore, collection) {
  if (candidate.selectionState === 'requires_escalation') return 'requires_escalation';
  if (candidate.publicSafe !== false) return 'held';
  if (candidate.releaseState !== 'private_blocked') return 'held';
  if (candidate.qualityState === 'review_required') return 'held';
  if ((candidate.remediationReasons ?? []).length > 0) return 'held';
  if (collection.summary.cp27UnresolvedReferenceCount > 0 || collection.summary.cp27HighOrCriticalBlockerCount > 0) return 'held';
  return ordinaryScore >= 70 ? 'selected' : 'held';
}

function selectionReason(candidate, state, ordinaryScore, collection) {
  if (state === 'requires_escalation') {
    return 'Separated from ordinary ranking because escalation handling is required before any validation handoff.';
  }
  if (state === 'selected') {
    return `Selected for private validation handoff with score ${ordinaryScore}; this is operational reviewer triage only.`;
  }
  if (candidate.qualityState === 'review_required') {
    return 'Held because quality metadata requires reviewer action before validation handoff.';
  }
  if ((candidate.remediationReasons ?? []).length > 0) {
    return 'Held because remediation reasons remain attached to the candidate.';
  }
  if (collection.summary.cp27UnresolvedReferenceCount > 0 || collection.summary.cp27HighOrCriticalBlockerCount > 0) {
    return 'Held because CP27 unresolved references or high/critical blockers remain visible.';
  }
  return 'Held for private reviewer triage; CP28-R03 does not publish, authorize, or expose content.';
}

function rankFixture(fixture, collection) {
  const rankedCandidates = (fixture.candidates ?? []).map((candidate) => {
    const scoring = scoreCandidate(candidate, collection);
    const state = rankingState(candidate, scoring.ordinaryScore ?? 0, collection);
    return {
      ...candidate,
      inputSelectionState: candidate.selectionState,
      selectionState: state,
      ordinaryScore: scoring.ordinaryScore,
      scoringComponents: scoring.scoringComponents,
      selectionReason: selectionReason(candidate, state, scoring.ordinaryScore, collection),
      rankingAuthorityBoundary: 'operational_metadata_only',
      publicSafe: false,
    };
  }).sort((a, b) => {
    const stateRank = { selected: 0, held: 1, requires_escalation: 2 };
    return (stateRank[a.selectionState] ?? 3) - (stateRank[b.selectionState] ?? 3) || (b.ordinaryScore ?? -1) - (a.ordinaryScore ?? -1) || a.candidateId.localeCompare(b.candidateId);
  });

  return {
    fixtureId: fixture.fixtureId,
    regressionFixtureId: fixture.regressionFixtureId,
    domain: fixture.domain,
    intent: fixture.intent,
    expectedBoundary: fixture.expectedBoundary,
    rankedCandidates,
    selectedCandidateIds: rankedCandidates.filter((candidate) => candidate.selectionState === 'selected').map((candidate) => candidate.candidateId),
    heldCandidateIds: rankedCandidates.filter((candidate) => candidate.selectionState === 'held').map((candidate) => candidate.candidateId),
    requiresEscalationCandidateIds: rankedCandidates.filter((candidate) => candidate.selectionState === 'requires_escalation').map((candidate) => candidate.candidateId),
    ordinaryAverageScore: average(rankedCandidates.filter((candidate) => candidate.ordinaryScore !== null).map((candidate) => candidate.ordinaryScore)),
    escalationReasonFamilies: unique(rankedCandidates.filter((candidate) => candidate.selectionState === 'requires_escalation').flatMap((candidate) => candidate.remediationReasons ?? [])),
  };
}

function scanProhibitedInferences(fixtures) {
  const text = JSON.stringify(fixtures).toLowerCase();
  return PROHIBITED_INFERENCE_TERMS.filter((term) => text.includes(term.toLowerCase()));
}

function remediationSummary(candidates) {
  const reasonCounts = new Map();
  for (const candidate of candidates) {
    for (const reason of candidate.remediationReasons ?? []) {
      reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1);
    }
  }
  return Array.from(reasonCounts.entries())
    .map(([reason, candidateCount]) => ({ reason, candidateCount, action: actionForReason(reason) }))
    .sort((a, b) => b.candidateCount - a.candidateCount || a.reason.localeCompare(b.reason));
}

function actionForReason(reason) {
  if (reason === 'cp27_unresolved_references_present') return 'Resolve CP27 graph/vault references before promoting candidates into validation handoff.';
  if (reason === 'cp27_quality_state_review_required') return 'Complete private reviewer quality checks for the affected source group or node family.';
  if (reason === 'source_or_provenance_gap_fixture') return 'Repair source/provenance linkage and rerun snapshot-backed graph refresh.';
  if (reason === 'grade_uncertainty_requires_escalation_review') return 'Route hadith grade uncertainty to escalation review before ordinary scoring.';
  if (reason === 'safety_escalation_required') return 'Route safety-sensitive request handling through escalation workflow before retrieval use.';
  if (reason === 'public_release_blocked') return 'Keep public release blocked until product-owner approval and public-safe export gates exist.';
  return 'Review the candidate remediation reason and add a bounded reviewer action.';
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const collectionText = readFileSync(CANDIDATE_COLLECTION_PATH, 'utf8');
  const collection = JSON.parse(collectionText);
  const manifest = readJson(MANIFEST_PATH);

  const fixtures = collection.fixtures.map((fixture) => rankFixture(fixture, collection));
  const candidates = fixtures.flatMap((fixture) => fixture.rankedCandidates);
  const ordinaryCandidates = candidates.filter((candidate) => candidate.ordinaryScore !== null);
  const escalatedCandidates = candidates.filter((candidate) => candidate.selectionState === 'requires_escalation');
  const selectedCandidates = candidates.filter((candidate) => candidate.selectionState === 'selected');
  const heldCandidates = candidates.filter((candidate) => candidate.selectionState === 'held');
  const prohibitedInferenceFindings = scanProhibitedInferences(fixtures);

  const ranking = {
    schemaVersion: 'cp28.ranking-explanation.v1',
    checkpoint: 'CP28-R03',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp28_r03_ranking_explanation.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'snapshot_backed_operational_ranking_explanation',
    sourceArtifact: {
      candidateCollectionPath: CANDIDATE_COLLECTION_PATH.replaceAll(path.sep, '/'),
      candidateCollectionSha256: sha256Text(collectionText),
    },
    scoringModel: {
      modelId: 'cp28-operational-ranking-v1',
      authorityBoundary: 'operational_metadata_only',
      allowedSignals: ALLOWED_SIGNALS,
      prohibitedInferences: PROHIBITED_INFERENCE_TERMS,
      selectionRules: [
        'ranking uses operational metadata only',
        'escalation candidates receive null ordinary scores and are excluded from ordinary averages',
        'candidates with unresolved CP27 references or high/critical blockers remain held',
        'review_required quality candidates remain held',
        'private_blocked release state remains blocked from public use',
        'public-safe candidate count must remain zero',
      ],
    },
    sourceGraph: collection.sourceGraph,
    sourceVault: collection.sourceVault,
    regressionBaseline: collection.regressionBaseline,
    fixtures,
    remediationSummary: remediationSummary(candidates),
    summary: {
      fixtureCount: fixtures.length,
      candidateCount: candidates.length,
      selectedCandidateCount: selectedCandidates.length,
      heldCandidateCount: heldCandidates.length,
      requiresEscalationCandidateCount: escalatedCandidates.length,
      ordinaryScoredCandidateCount: ordinaryCandidates.length,
      ordinaryAverageScore: average(ordinaryCandidates.map((candidate) => candidate.ordinaryScore)),
      escalationOutcomeCount: escalatedCandidates.length,
      remediationReasonCount: remediationSummary(candidates).length,
      cp27UnresolvedReferenceCount: collection.summary.cp27UnresolvedReferenceCount,
      cp27HighOrCriticalBlockerCount: collection.summary.cp27HighOrCriticalBlockerCount,
      publicSafeCandidateCount: 0,
      prohibitedInferenceFindingCount: prohibitedInferenceFindings.length,
    },
    selectedCandidateIds: selectedCandidates.map((candidate) => candidate.candidateId),
    heldCandidateIds: heldCandidates.map((candidate) => candidate.candidateId),
    requiresEscalationCandidateIds: escalatedCandidates.map((candidate) => candidate.candidateId),
    prohibitedInferenceScan: {
      status: prohibitedInferenceFindings.length === 0 ? 'pass' : 'fail',
      scannedScope: 'fixtures_and_candidate_explanations_only',
      findings: prohibitedInferenceFindings,
    },
    publicBoundary: publicBoundary('CP28-R03 ranking is private operational reviewer triage only. Public release remains blocked and public-safe candidate count is zero.'),
    warnings: [
      'CP28-R03 ranks metadata candidates only and exports no raw Quran, translation, tafsir, or hadith text bodies.',
      'CP28-R03 ranking score is not a religious authority, authenticity, or public-release decision.',
      'Because CP27 unresolved references and high/critical blockers remain visible, CP28-R03 selects zero final candidates.',
    ],
  };

  const rankingArtifact = writeJson(RANKING_SELECTION_PATH, ranking);
  const updatedManifest = {
    ...manifest,
    checkpoint: 'CP28-R03',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp28_r03_ranking_explanation.mjs',
    artifactPaths: {
      ...manifest.artifactPaths,
      rankingSelection: rankingArtifact.path,
    },
    checksums: {
      ...manifest.checksums,
      candidateCollectionSha256: sha256Text(collectionText),
      rankingSelectionSha256: rankingArtifact.checksumSha256,
    },
    counts: {
      ...manifest.counts,
      rankingSelection: ranking.summary,
    },
    verifier: {
      command: 'node scripts/check_cp28_r03_ranking_explanation.mjs',
      status: 'pending',
    },
    publicBoundary: ranking.publicBoundary,
  };
  const manifestArtifact = writeJson(MANIFEST_PATH, updatedManifest);
  const latestPointer = {
    schemaVersion: 'cp28.latest-retrieval-pointer.v1',
    checkpoint: 'CP28-R03',
    generatedAt: GENERATED_AT,
    retrievalDir: OUT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    candidateCollectionPath: CANDIDATE_COLLECTION_PATH.replaceAll(path.sep, '/'),
    candidateCollectionSha256: sha256Text(collectionText),
    rankingSelectionPath: rankingArtifact.path,
    rankingSelectionSha256: rankingArtifact.checksumSha256,
    counts: updatedManifest.counts,
    publicBoundary: ranking.publicBoundary,
  };
  writeJson(LATEST_POINTER_PATH, latestPointer);

  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP28-R03', outputPath: rankingArtifact.path, summary: ranking.summary }, null, 2));
}

main();
