#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = 'data/retrieval/cp24';
const RANKING_SELECTION_PATH = 'data/retrieval/cp24/ranking-selection.json';
const MANIFEST_PATH = 'data/retrieval/cp24/manifest.json';
const VALIDATION_HANDOFF_PATH = 'data/retrieval/cp24/validation-handoff.json';

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

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function routeRole(candidate) {
  if (candidate.selectionState === 'requires_escalation') return 'escalation_context';
  if (candidate.contentType === 'quran_ayah' || candidate.contentType === 'quran_ayah_text') return 'quran_anchor';
  if (candidate.contentType === 'translation_text') return 'translation_context';
  if (candidate.contentType === 'tafsir_passage') return 'tafsir_context';
  if (candidate.contentType === 'hadith_record' || candidate.contentType === 'hadith_text_version') return 'hadith_support';
  if (candidate.contentType === 'hadith_grade_assertion' || candidate.contentType === 'hadith_verification_claim') return 'hadith_grade_context';
  if (candidate.contentType === 'source_topic') return 'topic_context';
  if (candidate.contentType === 'source') return 'source_context';
  if (candidate.contentType === 'validation_finding') return 'validation_context';
  return 'quality_context';
}

function validationImpact(candidate) {
  if (candidate.selectionState === 'selected') return 'supports';
  if (candidate.selectionState === 'requires_escalation') return 'escalates';
  if (candidate.selectionState === 'rejected') return 'blocks';
  return 'warns';
}

function toRouteItem(candidate) {
  return {
    routeItemId: `route-item:${candidate.candidateId}`,
    candidateId: candidate.candidateId,
    role: routeRole(candidate),
    canonicalRef: candidate.canonicalRef,
    graphNodeIds: candidate.graphNodeIds,
    graphEdgeIds: candidate.graphEdgeIds,
    sourceIds: candidate.sourceIds,
    provenanceIds: candidate.provenanceIds,
    releaseStateIds: candidate.releaseStateIds,
    vaultPackIds: candidate.vaultPackIds,
    selectionState: candidate.selectionState === 'held' ? 'requires_review' : candidate.selectionState,
    selectionReason: candidate.selectionReason,
    validationImpact: validationImpact(candidate),
  };
}

function issueType(candidate) {
  if (candidate.selectionState === 'requires_escalation') return 'escalation_required';
  if (candidate.sourceIds.length === 0) return 'missing_source';
  if (candidate.provenanceIds.length === 0) return 'missing_provenance';
  if (candidate.releaseStateIds.length === 0) return 'missing_release_state';
  if (candidate.selectionState === 'rejected') return 'invalid_reference';
  if (candidate.qualityState === 'withheld') return 'withheld_content';
  if (candidate.reviewState === 'rejected') return 'rejected_content';
  return 'missing_citation';
}

function severity(candidate) {
  if (candidate.selectionState === 'requires_escalation') return 'critical';
  if (candidate.selectionState === 'rejected') return 'high';
  if (candidate.sourceIds.length === 0 || candidate.provenanceIds.length === 0 || candidate.releaseStateIds.length === 0) return 'high';
  if (candidate.qualityState === 'warning' || candidate.reviewState === 'pending') return 'medium';
  return 'low';
}

function owner(candidate) {
  if (candidate.selectionState === 'requires_escalation') {
    return candidate.escalationOutcome === 'safety_escalation' ? 'product_owner' : 'scholar_reviewer';
  }
  if (candidate.contentType.includes('hadith')) return 'scholar_reviewer';
  if (['quran_ayah', 'quran_ayah_text', 'translation_text', 'tafsir_passage', 'source_topic'].includes(candidate.contentType)) return 'knowledge_editor';
  return 'technical_reviewer';
}

function remediationFor(candidate, evidenceRouteId) {
  const type = issueType(candidate);
  return {
    remediationId: `remediation:${candidate.candidateId}`,
    evidenceRouteId,
    severity: severity(candidate),
    issueType: type,
    targetGraphNodeIds: candidate.graphNodeIds,
    targetCanonicalRefs: [candidate.canonicalRef],
    recommendedOwner: owner(candidate),
    recommendedAction: actionFor(type, candidate),
    blockingStatus: ['critical', 'high'].includes(severity(candidate)) ? 'blocking' : 'review_required',
    publicReleaseApproved: false,
  };
}

function actionFor(type, candidate) {
  if (type === 'missing_source') return 'Attach source reference before validation can select this candidate.';
  if (type === 'missing_provenance') return 'Attach provenance reference before validation can select this candidate.';
  if (type === 'missing_release_state') return 'Attach release-state reference before validation can select this candidate.';
  if (type === 'escalation_required') return `Route ${candidate.escalationOutcome ?? 'escalation'} to the required reviewer path before ordinary guidance.`;
  if (type === 'invalid_reference') return 'Resolve or remove the unresolved graph/canonical reference.';
  if (type === 'withheld_content') return 'Do not use withheld content; replace or retire the candidate.';
  if (type === 'rejected_content') return 'Do not use rejected content; replace or retire the candidate.';
  return 'Review citation coverage and decide whether the candidate can proceed to validation.';
}

function gateResult(gate, status, routeItems, remediationIds, notes) {
  return {
    gate,
    status,
    graphLinked: routeItems.some((item) => item.graphNodeIds.length > 0),
    evidenceRouteItemIds: routeItems.map((item) => item.routeItemId),
    remediationIds,
    notes,
  };
}

function buildGateResults(fixture, routeItems, remediations) {
  const byRole = (role) => routeItems.filter((item) => item.role === role);
  const byCandidateType = (predicate) => routeItems.filter((item) => {
    const candidate = fixture.rankedCandidates.find((entry) => entry.candidateId === item.candidateId);
    return candidate && predicate(candidate);
  });
  const selected = routeItems.filter((item) => item.selectionState === 'selected');
  const escalation = routeItems.filter((item) => item.selectionState === 'requires_escalation');
  const review = routeItems.filter((item) => item.selectionState === 'requires_review');
  const rejected = routeItems.filter((item) => item.selectionState === 'rejected');
  const remediationIds = remediations.map((item) => item.remediationId);
  const gates = [];

  gates.push(gateResult('intent', escalation.length > 0 ? 'escalated' : 'pass', routeItems, escalation.length > 0 ? remediationIds : [], escalation.length > 0 ? 'Intent or candidate state requires escalation path.' : 'Intent remains inside private retrieval workflow.'));
  gates.push(gateResult('source_retrieval', review.length > 0 || rejected.length > 0 ? 'requires_review' : 'pass', routeItems, remediationIds, 'Checks source, provenance, and release refs for selected and held evidence.'));
  gates.push(gateResult('quran_reference', byRole('quran_anchor').length > 0 ? 'requires_review' : 'pass', byRole('quran_anchor'), remediationIds, 'Quran candidates require canonical ayah/source validation before answer use.'));
  gates.push(gateResult('translation', byRole('translation_context').length > 0 ? 'requires_review' : 'pass', byRole('translation_context'), remediationIds, 'Translation candidates require edition/source validation before answer use.'));
  gates.push(gateResult('tafsir', byRole('tafsir_context').length > 0 ? 'requires_review' : 'pass', byRole('tafsir_context'), remediationIds, 'Tafsir candidates require passage/source validation before answer use.'));
  gates.push(gateResult('hadith_reference', byCandidateType((candidate) => candidate.contentType.startsWith('hadith_')).length > 0 ? 'requires_review' : 'pass', byCandidateType((candidate) => candidate.contentType.startsWith('hadith_')), remediationIds, 'Hadith candidates require reference, text, grade, and verification validation before answer use.'));
  gates.push(gateResult('grade', byRole('hadith_grade_context').length > 0 ? 'escalated' : 'pass', byRole('hadith_grade_context'), remediationIds, 'Hadith grade candidates stay separate for reviewer escalation.'));
  gates.push(gateResult('fatwa_boundary', fixture.escalationOutcomes.includes('scholar_escalation') ? 'escalated' : 'pass', escalation, remediationIds, 'Scholar-sensitive outcomes are separated from ordinary scoring.'));
  gates.push(gateResult('medical_legal_crisis', fixture.escalationOutcomes.includes('safety_escalation') ? 'escalated' : 'pass', escalation, remediationIds, 'Safety-sensitive outcomes are separated from ordinary guidance.'));
  gates.push(gateResult('personalization', 'pass', selected, [], 'No user memory or personalization is used to override source authority.'));
  gates.push(gateResult('final_citation', selected.length > 0 ? 'requires_review' : 'blocked', selected, remediationIds, 'Final citation coverage must be checked in CP24-G06/G07 before answer use.'));
  return gates;
}

function buildRoute(fixture) {
  const evidenceRouteId = `evidence-route:${fixture.fixtureId}:cp24-g05`;
  const routeItems = fixture.rankedCandidates.map(toRouteItem);
  const selectedEvidence = routeItems.filter((item) => item.selectionState === 'selected');
  const rejectedEvidence = routeItems.filter((item) => item.selectionState === 'requires_review' || item.selectionState === 'rejected');
  const escalationEvidence = routeItems.filter((item) => item.selectionState === 'requires_escalation');
  const remediationItems = fixture.rankedCandidates
    .filter((candidate) => candidate.selectionState !== 'selected')
    .map((candidate) => remediationFor(candidate, evidenceRouteId));
  const validationGateResults = buildGateResults(fixture, routeItems, remediationItems);
  const validationHandoff = {
    evidenceRouteId,
    requiredGates: validationGateResults.map((item) => item.gate),
    selectedEvidenceRouteItemIds: selectedEvidence.map((item) => item.routeItemId),
    selectedCanonicalRefs: selectedEvidence.map((item) => item.canonicalRef),
    selectedGraphNodeIds: unique(selectedEvidence.flatMap((item) => item.graphNodeIds)),
    citedSourceIds: unique(selectedEvidence.flatMap((item) => item.sourceIds)),
    missingCitationIds: rejectedEvidence.map((item) => item.routeItemId),
    unresolvedReferenceIds: rejectedEvidence.filter((item) => item.graphNodeIds.length === 0 || item.sourceIds.length === 0 || item.provenanceIds.length === 0 || item.releaseStateIds.length === 0).map((item) => item.candidateId),
    escalationOutcomes: fixture.escalationOutcomes,
    remediationIds: remediationItems.map((item) => item.remediationId),
    publicReleaseApproved: false,
  };
  return {
    fixtureId: fixture.fixtureId,
    evidenceRoute: {
      evidenceRouteId,
      retrievalTraceId: `retrieval-trace:${fixture.fixtureId}`,
      queryText: fixture.query.queryText,
      intent: fixture.query.intent,
      domain: fixture.query.domain,
      graphMode: fixture.query.graphMode,
      selectedEvidence,
      rejectedEvidence,
      escalationEvidence,
      validationGateResults,
      escalationOutcomes: fixture.escalationOutcomes,
      reviewQueueItemIds: remediationItems.map((item) => `review-queue:${item.remediationId}`),
      remediationIds: remediationItems.map((item) => item.remediationId),
      createdAt: new Date().toISOString(),
    },
    validationHandoff,
    remediationItems,
    citationCoverage: {
      selectedEvidenceRouteItemCount: selectedEvidence.length,
      citedSourceIdCount: validationHandoff.citedSourceIds.length,
      missingCitationCount: validationHandoff.missingCitationIds.length,
      unresolvedReferenceCount: validationHandoff.unresolvedReferenceIds.length,
      escalationOutcomeCount: validationHandoff.escalationOutcomes.length,
    },
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const ranking = await readJson(RANKING_SELECTION_PATH);
  const manifest = await readJson(MANIFEST_PATH);
  const generatedAt = new Date().toISOString();
  const routes = ranking.fixtures.map(buildRoute);
  const remediationItems = routes.flatMap((item) => item.remediationItems);
  const validationGateResults = routes.flatMap((item) => item.evidenceRoute.validationGateResults);
  const artifact = {
    schemaVersion: 'cp24.validation-handoff.v1',
    checkpoint: 'CP24-G05',
    generatedAt,
    generatedBy: 'scripts/generate_cp24_validation_handoff.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    sourceArtifact: {
      rankingSelectionPath: RANKING_SELECTION_PATH,
      rankingSelectionSha256: manifest.checksums.rankingSelectionSha256,
    },
    routes,
    summary: {
      fixtureCount: routes.length,
      evidenceRouteCount: routes.length,
      selectedRouteItemCount: routes.reduce((sum, item) => sum + item.evidenceRoute.selectedEvidence.length, 0),
      rejectedRouteItemCount: routes.reduce((sum, item) => sum + item.evidenceRoute.rejectedEvidence.length, 0),
      escalationRouteItemCount: routes.reduce((sum, item) => sum + item.evidenceRoute.escalationEvidence.length, 0),
      validationGateResultCount: validationGateResults.length,
      remediationCount: remediationItems.length,
      highOrCriticalRemediationCount: remediationItems.filter((item) => item.severity === 'high' || item.severity === 'critical').length,
      unresolvedReferenceCount: routes.reduce((sum, item) => sum + item.validationHandoff.unresolvedReferenceIds.length, 0),
      missingCitationCount: routes.reduce((sum, item) => sum + item.validationHandoff.missingCitationIds.length, 0),
      escalationOutcomeCount: routes.reduce((sum, item) => sum + item.validationHandoff.escalationOutcomes.length, 0),
      publicSafeRouteItemCount: 0,
    },
    remediationItems,
    publicBoundary: {
      privateOnly: true,
      publicSafeRouteItemCount: 0,
      publicReleaseApproved: false,
      publicRouteExposed: false,
    },
  };
  const validationHandoffSha256 = await writeJson(VALIDATION_HANDOFF_PATH, artifact);
  const updatedManifest = {
    ...manifest,
    checkpoint: 'CP24-G05',
    artifactPaths: {
      ...manifest.artifactPaths,
      validationHandoff: VALIDATION_HANDOFF_PATH,
    },
    checksums: {
      ...manifest.checksums,
      validationHandoffSha256,
    },
    counts: {
      ...manifest.counts,
      validationHandoff: artifact.summary,
    },
    verifier: {
      command: 'node scripts/check_cp24_g05_validation_handoff.mjs',
      status: 'pending',
    },
  };
  await writeJson(MANIFEST_PATH, updatedManifest);
  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP24-G05', outputPath: VALIDATION_HANDOFF_PATH, summary: artifact.summary }, null, 2));
}

await main();
