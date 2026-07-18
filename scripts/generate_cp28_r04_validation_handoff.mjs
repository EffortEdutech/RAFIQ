#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('data', 'retrieval', 'cp28');
const RANKING_SELECTION_PATH = path.join(OUT_DIR, 'ranking-selection.json');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const LATEST_POINTER_PATH = path.join(OUT_DIR, 'latest-retrieval.json');
const VALIDATION_HANDOFF_PATH = path.join(OUT_DIR, 'validation-handoff.json');
const GENERATED_AT = '2026-07-18T00:00:00.000Z';

const REQUIRED_GATES = [
  'intent',
  'source_retrieval',
  'quran_reference',
  'translation',
  'tafsir',
  'hadith_reference',
  'grade',
  'authority_boundary',
  'medical_legal_crisis',
  'personalization',
  'final_citation',
];

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
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

function routeRole(candidate) {
  if (candidate.selectionState === 'requires_escalation') return 'escalation_context';
  if (candidate.graphPartition === 'quran') return 'quran_anchor';
  if (candidate.graphPartition === 'translations') return 'translation_context';
  if (candidate.graphPartition === 'tafsir') return 'tafsir_context';
  if (candidate.graphPartition === 'hadith') return 'hadith_support';
  if (candidate.graphPartition === 'hadith-grades') return 'hadith_grade_context';
  if (candidate.graphPartition === 'topics') return 'topic_context';
  if (candidate.graphPartition === 'product-evidence') return 'validation_context';
  if (candidate.graphPartition === 'quality') return 'quality_context';
  return 'source_context';
}

function validationImpact(candidate) {
  if (candidate.selectionState === 'selected') return 'supports';
  if (candidate.selectionState === 'requires_escalation') return 'escalates';
  return 'warns';
}

function routeItem(candidate) {
  return {
    routeItemId: `cp28:route-item:${candidate.candidateId}`,
    candidateId: candidate.candidateId,
    role: routeRole(candidate),
    graphNodeId: candidate.graphNodeId,
    graphNodeType: candidate.graphNodeType,
    graphPartition: candidate.graphPartition,
    sourceGroupKey: candidate.sourceGroupKey,
    canonicalRefs: candidate.canonicalRefs ?? [],
    sourceRefs: candidate.sourceRefs ?? [],
    graphEdgeIds: candidate.graphEdgeIds ?? [],
    vaultPackIds: candidate.vaultPackIds ?? [],
    selectionState: candidate.selectionState === 'held' ? 'requires_review' : candidate.selectionState,
    selectionReason: candidate.selectionReason,
    validationImpact: validationImpact(candidate),
    remediationReasons: candidate.remediationReasons ?? [],
    authorityBoundary: 'operational_metadata_only',
    publicSafe: false,
  };
}

function remediationSeverity(candidate) {
  if (candidate.selectionState === 'requires_escalation') return 'critical';
  if (candidate.qualityState === 'review_required') return 'high';
  if ((candidate.remediationReasons ?? []).includes('source_or_provenance_gap_fixture')) return 'high';
  return 'medium';
}

function remediationOwner(candidate) {
  if ((candidate.remediationReasons ?? []).includes('safety_escalation_required')) return 'product_owner';
  if ((candidate.remediationReasons ?? []).includes('grade_uncertainty_requires_escalation_review')) return 'scholar_reviewer';
  if (['quran', 'translations', 'tafsir', 'hadith', 'hadith-grades'].includes(candidate.graphPartition)) return 'knowledge_editor';
  return 'technical_reviewer';
}

function remediationAction(reason) {
  if (reason === 'cp27_unresolved_references_present') return 'Resolve refreshed graph/vault references and rerun CP27/CP28 artifacts.';
  if (reason === 'cp27_quality_state_review_required') return 'Complete private quality review before candidate can move into validation selection.';
  if (reason === 'source_or_provenance_gap_fixture') return 'Repair source/provenance linkage before evidence route promotion.';
  if (reason === 'grade_uncertainty_requires_escalation_review') return 'Route hadith grade uncertainty to escalation review.';
  if (reason === 'safety_escalation_required') return 'Route safety-sensitive case through product-owner escalation.';
  return 'Review remediation reason and assign bounded private reviewer action.';
}

function remediationFor(candidate, evidenceRouteId) {
  const reasons = candidate.remediationReasons?.length ? candidate.remediationReasons : ['cp28_candidate_not_selected'];
  const severity = remediationSeverity(candidate);
  return {
    remediationId: `cp28:remediation:${candidate.candidateId}`,
    evidenceRouteId,
    candidateId: candidate.candidateId,
    severity,
    issueTypes: reasons,
    targetGraphNodeIds: [candidate.graphNodeId].filter(Boolean),
    targetCanonicalRefs: candidate.canonicalRefs ?? [],
    recommendedOwner: remediationOwner(candidate),
    recommendedActions: reasons.map(remediationAction),
    blockingStatus: severity === 'critical' || severity === 'high' ? 'blocking' : 'review_required',
    publicReleaseApproved: false,
    publicSafe: false,
  };
}

function gateStatus(gate, fixture, items) {
  if (gate === 'final_citation') return 'blocked';
  if (items.some((item) => item.validationImpact === 'escalates')) return gate === 'personalization' ? 'pass' : 'escalated';
  if (items.some((item) => item.selectionState === 'requires_review')) return 'requires_review';
  return 'pass';
}

function gateItems(gate, items) {
  if (gate === 'quran_reference') return items.filter((item) => item.role === 'quran_anchor');
  if (gate === 'translation') return items.filter((item) => item.role === 'translation_context');
  if (gate === 'tafsir') return items.filter((item) => item.role === 'tafsir_context');
  if (gate === 'hadith_reference') return items.filter((item) => item.role === 'hadith_support');
  if (gate === 'grade') return items.filter((item) => item.role === 'hadith_grade_context');
  if (gate === 'medical_legal_crisis') return items.filter((item) => item.remediationReasons.includes('safety_escalation_required'));
  return items;
}

function gateNotes(gate) {
  if (gate === 'final_citation') return 'Blocked because CP28-R03 selected zero candidates while CP27 blockers remain.';
  if (gate === 'authority_boundary') return 'Operational metadata may route review work but cannot create religious authority or public approval.';
  if (gate === 'personalization') return 'No user personalization is allowed to override source, validation, or reviewer gates.';
  return `Gate ${gate} preserves private validation handoff and remediation visibility.`;
}

function buildGateResults(fixture, items, remediations) {
  return REQUIRED_GATES.map((gate) => {
    const scopedItems = gateItems(gate, items);
    return {
      gate,
      status: gateStatus(gate, fixture, scopedItems.length > 0 ? scopedItems : items),
      graphLinked: scopedItems.some((item) => Boolean(item.graphNodeId)),
      evidenceRouteItemIds: scopedItems.map((item) => item.routeItemId),
      remediationIds: remediations.map((item) => item.remediationId),
      authorityBoundary: 'operational_metadata_only',
      notes: gateNotes(gate),
    };
  });
}

function buildRoute(fixture) {
  const evidenceRouteId = `cp28:evidence-route:${fixture.fixtureId}:r04`;
  const items = (fixture.rankedCandidates ?? []).map(routeItem);
  const selectedEvidence = items.filter((item) => item.selectionState === 'selected');
  const reviewEvidence = items.filter((item) => item.selectionState === 'requires_review');
  const escalationEvidence = items.filter((item) => item.selectionState === 'requires_escalation');
  const remediations = (fixture.rankedCandidates ?? []).map((candidate) => remediationFor(candidate, evidenceRouteId));
  const validationGateResults = buildGateResults(fixture, items, remediations);
  const validationHandoff = {
    evidenceRouteId,
    requiredGates: REQUIRED_GATES,
    selectedEvidenceRouteItemIds: selectedEvidence.map((item) => item.routeItemId),
    selectedCanonicalRefs: unique(selectedEvidence.flatMap((item) => item.canonicalRefs)),
    selectedGraphNodeIds: unique(selectedEvidence.map((item) => item.graphNodeId)),
    citedSourceRefs: unique(selectedEvidence.flatMap((item) => item.sourceRefs)),
    missingCitationIds: reviewEvidence.map((item) => item.routeItemId),
    unresolvedReferenceIds: items.filter((item) => item.remediationReasons.includes('cp27_unresolved_references_present')).map((item) => item.candidateId),
    escalationCandidateIds: escalationEvidence.map((item) => item.candidateId),
    remediationIds: remediations.map((item) => item.remediationId),
    publicReleaseApproved: false,
    authorityBoundary: 'operational_metadata_only',
  };
  return {
    fixtureId: fixture.fixtureId,
    regressionFixtureId: fixture.regressionFixtureId,
    evidenceRoute: {
      evidenceRouteId,
      retrievalTraceId: `cp28:retrieval-trace:${fixture.fixtureId}`,
      intent: fixture.intent,
      domain: fixture.domain,
      selectedEvidence,
      reviewEvidence,
      escalationEvidence,
      validationGateResults,
      remediationIds: remediations.map((item) => item.remediationId),
      createdAt: GENERATED_AT,
      authorityBoundary: 'operational_metadata_only',
      publicSafe: false,
    },
    validationHandoff,
    remediationItems: remediations,
    citationCoverage: {
      selectedEvidenceRouteItemCount: selectedEvidence.length,
      citedSourceRefCount: validationHandoff.citedSourceRefs.length,
      missingCitationCount: validationHandoff.missingCitationIds.length,
      unresolvedReferenceCount: validationHandoff.unresolvedReferenceIds.length,
      escalationCandidateCount: validationHandoff.escalationCandidateIds.length,
    },
  };
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const rankingText = readFileSync(RANKING_SELECTION_PATH, 'utf8');
  const ranking = JSON.parse(rankingText);
  const manifest = readJson(MANIFEST_PATH);
  const routes = ranking.fixtures.map(buildRoute);
  const remediationItems = routes.flatMap((route) => route.remediationItems);
  const validationGateResults = routes.flatMap((route) => route.evidenceRoute.validationGateResults);
  const handoff = {
    schemaVersion: 'cp28.validation-handoff.v1',
    checkpoint: 'CP28-R04',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp28_r04_validation_handoff.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    artifactKind: 'snapshot_backed_evidence_route_validation_handoff',
    sourceArtifact: {
      rankingSelectionPath: RANKING_SELECTION_PATH.replaceAll(path.sep, '/'),
      rankingSelectionSha256: sha256Text(rankingText),
    },
    routes,
    summary: {
      fixtureCount: routes.length,
      evidenceRouteCount: routes.length,
      selectedRouteItemCount: routes.reduce((sum, route) => sum + route.evidenceRoute.selectedEvidence.length, 0),
      reviewRouteItemCount: routes.reduce((sum, route) => sum + route.evidenceRoute.reviewEvidence.length, 0),
      escalationRouteItemCount: routes.reduce((sum, route) => sum + route.evidenceRoute.escalationEvidence.length, 0),
      validationGateResultCount: validationGateResults.length,
      remediationCount: remediationItems.length,
      highOrCriticalRemediationCount: remediationItems.filter((item) => item.severity === 'high' || item.severity === 'critical').length,
      unresolvedReferenceCount: routes.reduce((sum, route) => sum + route.validationHandoff.unresolvedReferenceIds.length, 0),
      missingCitationCount: routes.reduce((sum, route) => sum + route.validationHandoff.missingCitationIds.length, 0),
      escalationCandidateCount: routes.reduce((sum, route) => sum + route.validationHandoff.escalationCandidateIds.length, 0),
      publicSafeRouteItemCount: 0,
    },
    remediationItems,
    publicBoundary: publicBoundary('CP28-R04 evidence routes are private validation handoff metadata only. Public release remains blocked and public-safe route item count is zero.'),
    warnings: [
      'CP28-R04 produces no raw Quran, translation, tafsir, or hadith text bodies.',
      'CP28-R04 has zero selected evidence route items because CP28-R03 selected zero candidates.',
      'Validation handoff is remediation-first until CP27 unresolved references and high/critical blockers are resolved.',
    ],
  };
  const handoffArtifact = writeJson(VALIDATION_HANDOFF_PATH, handoff);
  const updatedManifest = {
    ...manifest,
    checkpoint: 'CP28-R04',
    generatedAt: GENERATED_AT,
    generatedBy: 'scripts/generate_cp28_r04_validation_handoff.mjs',
    artifactPaths: {
      ...manifest.artifactPaths,
      validationHandoff: handoffArtifact.path,
    },
    checksums: {
      ...manifest.checksums,
      rankingSelectionSha256: sha256Text(rankingText),
      validationHandoffSha256: handoffArtifact.checksumSha256,
    },
    counts: {
      ...manifest.counts,
      validationHandoff: handoff.summary,
    },
    verifier: {
      command: 'node scripts/check_cp28_r04_validation_handoff.mjs',
      status: 'pending',
    },
    publicBoundary: handoff.publicBoundary,
  };
  const manifestArtifact = writeJson(MANIFEST_PATH, updatedManifest);
  writeJson(LATEST_POINTER_PATH, {
    schemaVersion: 'cp28.latest-retrieval-pointer.v1',
    checkpoint: 'CP28-R04',
    generatedAt: GENERATED_AT,
    retrievalDir: OUT_DIR.replaceAll(path.sep, '/'),
    manifestPath: manifestArtifact.path,
    manifestSha256: manifestArtifact.checksumSha256,
    candidateCollectionPath: manifest.artifactPaths.candidateCollection,
    candidateCollectionSha256: updatedManifest.checksums.candidateCollectionSha256,
    rankingSelectionPath: manifest.artifactPaths.rankingSelection,
    rankingSelectionSha256: updatedManifest.checksums.rankingSelectionSha256,
    validationHandoffPath: handoffArtifact.path,
    validationHandoffSha256: handoffArtifact.checksumSha256,
    counts: updatedManifest.counts,
    publicBoundary: handoff.publicBoundary,
  });
  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP28-R04', outputPath: handoffArtifact.path, summary: handoff.summary }, null, 2));
}

main();
