#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = 'data/retrieval/cp24';
const CANDIDATE_EXPANSION_PATH = path.join(OUT_DIR, 'candidate-expansion.json');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const RANKING_SELECTION_PATH = path.join(OUT_DIR, 'ranking-selection.json');
const RANKING_SELECTION_ARTIFACT_PATH = 'data/retrieval/cp24/ranking-selection.json';

const RELIGIOUS_CONTENT_TYPES = new Set([
  'quran_ayah',
  'quran_ayah_text',
  'translation_text',
  'tafsir_passage',
  'hadith_record',
  'hadith_text_version',
  'hadith_grade_assertion',
  'hadith_verification_claim',
  'source_topic',
]);

const PROHIBITED_INFERENCE_TERMS = [
  'religious approval',
  'authentic because of graph',
  'graph centrality proves',
  'fatwa',
  'public approved',
  'public-safe',
  'scholarly approval',
];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  const body = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(filePath, body, 'utf8');
  return sha256(body);
}

function clampScore(value) {
  return Math.max(0, Math.min(100, value));
}

function hasCompleteRefs(candidate) {
  return candidate.sourceIds.length > 0 && candidate.provenanceIds.length > 0 && candidate.releaseStateIds.length > 0;
}

function scoreCandidate(candidate) {
  const components = [];
  let score = 30;

  function add(signal, points, explanation) {
    components.push({
      signal,
      points,
      explanation,
      authorityBoundary: 'operational_relevance_only',
    });
    score += points;
  }

  if (candidate.rankingSignals.includes('text_match')) add('text_match', 5, 'Private query/fixture matched the candidate retrieval context.');
  if (candidate.rankingSignals.includes('graph_neighbor_available')) add('graph_neighbor_available', 8, 'Candidate has bounded graph neighbors available for review.');
  if (candidate.sourceIds.length > 0) add('source_refs_complete', 12, 'Candidate has source references for private review.');
  else add('missing_source_ref', -30, 'Candidate is missing source references and cannot be selected.');
  if (candidate.provenanceIds.length > 0) add('provenance_refs_complete', 12, 'Candidate has provenance references for private review.');
  else add('missing_provenance_ref', -30, 'Candidate is missing provenance references and cannot be selected.');
  if (candidate.releaseStateIds.length > 0) add('release_refs_complete', 12, 'Candidate has release-state references for private review.');
  else add('missing_release_ref', -30, 'Candidate is missing release-state references and cannot be selected.');
  if (candidate.vaultPackIds.length > 0) add('vault_context_available', 8, 'Candidate links to bounded vault context for reviewer navigation.');
  if (candidate.rankingSignals.includes('validation_history')) add('validation_history', 8, 'Candidate has prior validation history available for review.');
  if (candidate.rankingSignals.includes('ayah_tafsir_adjacency')) add('ayah_tafsir_adjacency', 5, 'Candidate has an ayah-tafsir adjacency relation.');
  if (candidate.rankingSignals.includes('translation_edition_available')) add('translation_edition_available', 5, 'Candidate has translation edition context available.');
  if (candidate.rankingSignals.includes('hadith_grade_context')) add('hadith_grade_context', 5, 'Candidate has hadith grade or verification context available.');
  if (candidate.rankingSignals.includes('topic_candidate_match')) add('topic_candidate_match', 4, 'Candidate has topic metadata relation available.');
  if (candidate.qualityState === 'warning') add('quality_warning', -25, 'Candidate has a quality warning and must remain held for review.');
  if (candidate.qualityState === 'unverified') add('unverified_quality_state', -20, 'Candidate is unverified and must remain held for review.');
  if (candidate.qualityState === 'withheld') add('withheld_quality_state', -100, 'Candidate is withheld and cannot be selected.');
  if (candidate.reviewState === 'pending') add('pending_review_state', -15, 'Candidate has pending review state.');
  if (['content_review', 'scholar_review', 'product_owner_review', 'remediation_required'].includes(candidate.reviewState)) {
    add('review_required_state', -25, 'Candidate requires reviewer action before selection.');
  }
  if (candidate.reviewState === 'rejected') add('rejected_review_state', -100, 'Candidate is rejected and cannot be selected.');
  if (candidate.rankingSignals.includes('release_blocker')) add('release_blocker', -10, 'Candidate remains private/public-blocked and cannot be used publicly.');
  if (candidate.rankingSignals.includes('escalation_sensitive_intent')) add('escalation_sensitive_intent', -100, 'Escalation-sensitive candidate is separated from ordinary scoring.');

  return {
    ordinaryScore: candidate.escalationOutcome ? null : clampScore(score),
    components,
  };
}

function isSelectable(candidate, score) {
  if (candidate.escalationOutcome) return false;
  if (!hasCompleteRefs(candidate)) return false;
  if (candidate.publicSafe !== false) return false;
  if (['withheld'].includes(candidate.qualityState)) return false;
  if (candidate.reviewState === 'rejected') return false;
  if (candidate.qualityState !== 'clean') return false;
  if (['pending', 'content_review', 'scholar_review', 'product_owner_review', 'remediation_required'].includes(candidate.reviewState)) return false;
  if (RELIGIOUS_CONTENT_TYPES.has(candidate.contentType)) return false;
  return score >= 55;
}

function selectionReason(candidate, state, score) {
  if (state === 'selected') {
    return `Selected for private workflow review with score ${score}; the decision uses operational metadata only and does not approve religious content.`;
  }
  if (state === 'requires_escalation') {
    return 'Separated from ordinary ranking because the candidate carries an escalation outcome or escalation-sensitive intent.';
  }
  if (state === 'rejected') {
    return 'Rejected from the G04 ranked set because the candidate has no resolved graph node or no usable review basis.';
  }
  if (!hasCompleteRefs(candidate)) {
    return 'Held because source, provenance, or release references are incomplete.';
  }
  if (RELIGIOUS_CONTENT_TYPES.has(candidate.contentType)) {
    return 'Held because religious evidence requires later validation/reviewer handoff before selection.';
  }
  if (candidate.qualityState !== 'clean' || candidate.reviewState === 'pending') {
    return 'Held because quality or review state requires reviewer attention.';
  }
  return 'Held for later validation handoff; G04 ranking does not publish or approve content.';
}

function rankFixture(fixture) {
  const rankedCandidates = fixture.candidates.map((candidate) => {
    const scoring = scoreCandidate(candidate);
    let selectionState = 'held';
    if (candidate.escalationOutcome || candidate.rankingSignals.includes('escalation_sensitive_intent')) selectionState = 'requires_escalation';
    else if (candidate.graphNodeIds.length === 0) selectionState = 'rejected';
    else if (isSelectable(candidate, scoring.ordinaryScore ?? 0)) selectionState = 'selected';

    return {
      ...candidate,
      ordinaryScore: scoring.ordinaryScore,
      scoringComponents: scoring.components,
      selectionState,
      selectionReason: selectionReason(candidate, selectionState, scoring.ordinaryScore),
      rankingAuthorityBoundary: 'operational_relevance_only',
    };
  }).sort((a, b) => {
    const stateRank = { selected: 0, held: 1, rejected: 2, requires_escalation: 3 };
    return (stateRank[a.selectionState] ?? 4) - (stateRank[b.selectionState] ?? 4) || (b.ordinaryScore ?? -1) - (a.ordinaryScore ?? -1) || a.candidateId.localeCompare(b.candidateId);
  });

  const selectedCandidateIds = rankedCandidates.filter((candidate) => candidate.selectionState === 'selected').slice(0, 3).map((candidate) => candidate.candidateId);
  const normalizedCandidates = rankedCandidates.map((candidate) => {
    if (candidate.selectionState === 'selected' && !selectedCandidateIds.includes(candidate.candidateId)) {
      return {
        ...candidate,
        selectionState: 'held',
        selectionReason: 'Held because the fixture selected-candidate cap was reached.',
      };
    }
    return candidate;
  });

  return {
    fixtureId: fixture.fixtureId,
    query: fixture.request,
    rankedCandidates: normalizedCandidates,
    selectedCandidateIds,
    heldCandidateIds: normalizedCandidates.filter((candidate) => candidate.selectionState === 'held').map((candidate) => candidate.candidateId),
    rejectedCandidateIds: normalizedCandidates.filter((candidate) => candidate.selectionState === 'rejected').map((candidate) => candidate.candidateId),
    requiresEscalationCandidateIds: normalizedCandidates.filter((candidate) => candidate.selectionState === 'requires_escalation').map((candidate) => candidate.candidateId),
    ordinaryAverageScore: average(normalizedCandidates.filter((candidate) => candidate.ordinaryScore !== null).map((candidate) => candidate.ordinaryScore)),
    escalationOutcomes: unique(normalizedCandidates.map((candidate) => candidate.escalationOutcome).filter(Boolean)),
  };
}

function average(values) {
  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100;
}

function unique(values) {
  return Array.from(new Set(values));
}

function scanProhibitedInferences(value) {
  const text = JSON.stringify(value).toLowerCase();
  return PROHIBITED_INFERENCE_TERMS.filter((term) => text.includes(term.toLowerCase()));
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const candidateExpansion = await readJson(CANDIDATE_EXPANSION_PATH);
  const manifest = await readJson(MANIFEST_PATH);
  const generatedAt = new Date().toISOString();
  const fixtures = candidateExpansion.fixtures.map(rankFixture);
  const allRankedCandidates = fixtures.flatMap((fixture) => fixture.rankedCandidates);
  const ordinaryCandidates = allRankedCandidates.filter((candidate) => candidate.ordinaryScore !== null);
  const selectedCandidates = allRankedCandidates.filter((candidate) => candidate.selectionState === 'selected');
  const prohibitedInferenceFindings = scanProhibitedInferences(fixtures);
  const artifact = {
    schemaVersion: 'cp24.ranking-selection.v1',
    checkpoint: 'CP24-G04',
    generatedAt,
    generatedBy: 'scripts/generate_cp24_ranking_selection.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    sourceArtifact: {
      candidateExpansionPath: CANDIDATE_EXPANSION_PATH,
      candidateExpansionSha256: manifest.checksums.candidateExpansionSha256,
    },
    scoringModel: {
      modelId: 'cp24-operational-ranking-v1',
      authorityBoundary: 'operational_relevance_only',
      allowedSignals: [
        'text_match',
        'source_refs_complete',
        'provenance_refs_complete',
        'release_refs_complete',
        'graph_neighbor_available',
        'validation_history',
        'vault_context_available',
        'quality_warning',
        'release_blocker',
        'review_state',
        'escalation_sensitive_intent',
      ],
      prohibitedInferences: PROHIBITED_INFERENCE_TERMS,
      selectionRules: [
        'missing source/provenance/release refs cannot be selected',
        'religious content-bearing candidates remain held until validation/reviewer handoff',
        'escalation outcomes are separated from ordinary scores',
        'public-safe candidate count must remain zero',
      ],
    },
    fixtures,
    summary: {
      fixtureCount: fixtures.length,
      candidateCount: allRankedCandidates.length,
      selectedCandidateCount: selectedCandidates.length,
      heldCandidateCount: allRankedCandidates.filter((candidate) => candidate.selectionState === 'held').length,
      rejectedCandidateCount: allRankedCandidates.filter((candidate) => candidate.selectionState === 'rejected').length,
      requiresEscalationCandidateCount: allRankedCandidates.filter((candidate) => candidate.selectionState === 'requires_escalation').length,
      ordinaryScoredCandidateCount: ordinaryCandidates.length,
      ordinaryAverageScore: average(ordinaryCandidates.map((candidate) => candidate.ordinaryScore)),
      escalationOutcomeCount: allRankedCandidates.filter((candidate) => candidate.escalationOutcome).length,
      publicSafeCandidateCount: 0,
      prohibitedInferenceFindingCount: prohibitedInferenceFindings.length,
    },
    selectedCandidateIds: selectedCandidates.map((candidate) => candidate.candidateId),
    heldCandidateIds: allRankedCandidates.filter((candidate) => candidate.selectionState === 'held').map((candidate) => candidate.candidateId),
    rejectedCandidateIds: allRankedCandidates.filter((candidate) => candidate.selectionState === 'rejected').map((candidate) => candidate.candidateId),
    requiresEscalationCandidateIds: allRankedCandidates.filter((candidate) => candidate.selectionState === 'requires_escalation').map((candidate) => candidate.candidateId),
    prohibitedInferenceScan: {
      status: prohibitedInferenceFindings.length === 0 ? 'pass' : 'fail',
      findings: prohibitedInferenceFindings,
    },
    publicBoundary: {
      privateOnly: true,
      publicSafeCandidateCount: 0,
      publicReleaseApproved: false,
      publicRouteExposed: false,
    },
  };
  const rankingSelectionSha256 = await writeJson(RANKING_SELECTION_PATH, artifact);
  const updatedManifest = {
    ...manifest,
    checkpoint: 'CP24-G04',
    artifactPaths: {
      ...manifest.artifactPaths,
      rankingSelection: RANKING_SELECTION_ARTIFACT_PATH,
    },
    checksums: {
      ...manifest.checksums,
      rankingSelectionSha256,
    },
    counts: {
      ...manifest.counts,
      rankingSelection: artifact.summary,
    },
    verifier: {
      command: 'node scripts/check_cp24_g04_ranking_selection.mjs',
      status: 'pending',
    },
  };
  await writeJson(MANIFEST_PATH, updatedManifest);
  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP24-G04', outputPath: RANKING_SELECTION_PATH, summary: artifact.summary }, null, 2));
}

await main();
