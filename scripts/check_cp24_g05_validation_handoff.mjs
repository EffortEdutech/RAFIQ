#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [];

function pass(name, evidence) {
  checks.push({ name, status: 'PASS', evidence });
}

function fail(name, evidence) {
  checks.push({ name, status: 'FAIL', evidence });
}

function expect(name, condition, evidence) {
  if (condition) pass(name, evidence);
  else fail(name, evidence);
}

function readText(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    fail(`Read ${filePath}`, error.message);
    return '';
  }
}

function readJson(filePath) {
  const text = readText(filePath);
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`Parse ${filePath}`, error.message);
    return {};
  }
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function runNodeScript(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], { encoding: 'utf8' });
  if (result.status === 0) {
    pass(`Run ${scriptPath}`, result.stdout.trim().split(/\r?\n/).at(-1) || 'ok');
  } else {
    fail(`Run ${scriptPath}`, `${result.stdout}${result.stderr}`);
  }
}

const REQUIRED_GATES = [
  'intent',
  'source_retrieval',
  'quran_reference',
  'translation',
  'tafsir',
  'hadith_reference',
  'grade',
  'fatwa_boundary',
  'medical_legal_crisis',
  'personalization',
  'final_citation',
];

const EXPECTED_SUMMARY = {
  fixtureCount: 10,
  evidenceRouteCount: 10,
  selectedRouteItemCount: 15,
  rejectedRouteItemCount: 59,
  escalationRouteItemCount: 13,
  validationGateResultCount: 110,
  remediationCount: 72,
  highOrCriticalRemediationCount: 18,
  unresolvedReferenceCount: 5,
  missingCitationCount: 59,
  escalationOutcomeCount: 2,
  publicSafeRouteItemCount: 0,
};

const RELIGIOUS_CONTENT_TYPES = new Set([
  'quran_ayah',
  'quran_ayah_text',
  'translation_text',
  'tafsir_passage',
  'hadith_record',
  'hadith_text_version',
  'hadith_grade_assertion',
  'hadith_verification_claim',
]);

runNodeScript('scripts/check_cp24_g04_ranking_selection.mjs');
runNodeScript('scripts/generate_cp24_validation_handoff.mjs');

const handoffText = readText('data/retrieval/cp24/validation-handoff.json');
const handoff = handoffText ? JSON.parse(handoffText) : {};
const manifest = readJson('data/retrieval/cp24/manifest.json');
const rankingText = readText('data/retrieval/cp24/ranking-selection.json');
const ranking = rankingText ? JSON.parse(rankingText) : {};
const g05Doc = readText('docs/09_sprints/resource_audit_import_prototype/CP24_G05_EVIDENCE_ROUTE_AND_VALIDATION_HANDOFF.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_ACCEPTANCE_CHECKLIST.md');
const generator = readText('scripts/generate_cp24_validation_handoff.mjs');

expect('Validation handoff artifact schema is CP24-G05', handoff.schemaVersion === 'cp24.validation-handoff.v1' && handoff.checkpoint === 'CP24-G05', handoff.schemaVersion);
expect('Manifest points to CP24-G05', manifest.checkpoint === 'CP24-G05', manifest.checkpoint);
expect('Manifest includes validation handoff path', String(manifest.artifactPaths?.validationHandoff ?? '').replaceAll('\\', '/') === 'data/retrieval/cp24/validation-handoff.json', manifest.artifactPaths?.validationHandoff);
expect('Manifest validation handoff checksum matches artifact', manifest.checksums?.validationHandoffSha256 === sha256(handoffText), 'checksum match');
expect('Handoff source checksum matches ranking selection', handoff.sourceArtifact?.rankingSelectionSha256 === manifest.checksums?.rankingSelectionSha256 && manifest.checksums?.rankingSelectionSha256 === sha256(rankingText), 'source checksum');

for (const [field, expected] of Object.entries(EXPECTED_SUMMARY)) {
  expect(`Summary ${field} is stable`, handoff.summary?.[field] === expected, `${handoff.summary?.[field]} expected ${expected}`);
}

const routes = handoff.routes ?? [];
const allRouteItems = routes.flatMap((route) => [
  ...(route.evidenceRoute?.selectedEvidence ?? []),
  ...(route.evidenceRoute?.rejectedEvidence ?? []),
  ...(route.evidenceRoute?.escalationEvidence ?? []),
]);
const allGateResults = routes.flatMap((route) => route.evidenceRoute?.validationGateResults ?? []);
const allRouteRemediations = routes.flatMap((route) => route.remediationItems ?? []);
const selectedItems = routes.flatMap((route) => route.evidenceRoute?.selectedEvidence ?? []);
const escalationItems = routes.flatMap((route) => route.evidenceRoute?.escalationEvidence ?? []);
const selectedCandidateIds = new Set(selectedItems.map((item) => item.candidateId));
const rankingCandidatesById = new Map((ranking.fixtures ?? []).flatMap((fixture) => (fixture.rankedCandidates ?? []).map((candidate) => [candidate.candidateId, candidate])));

expect('Route count matches ranking fixture count', routes.length === 10 && routes.length === (ranking.fixtures ?? []).length, String(routes.length));
expect('Every route links route and handoff IDs', routes.every((route) => route.evidenceRoute?.evidenceRouteId && route.evidenceRoute.evidenceRouteId === route.validationHandoff?.evidenceRouteId), 'route IDs linked');
expect('Every route has all required validation gates', routes.every((route) => REQUIRED_GATES.every((gate) => route.validationHandoff?.requiredGates?.includes(gate) && route.evidenceRoute?.validationGateResults?.some((result) => result.gate === gate))), '11 gates per route');
expect('Validation gate total matches route count', allGateResults.length === routes.length * REQUIRED_GATES.length, `${allGateResults.length} gates`);
expect('Gate results include trace fields', allGateResults.every((result) => result.gate && result.status && typeof result.graphLinked === 'boolean' && Array.isArray(result.evidenceRouteItemIds) && Array.isArray(result.remediationIds) && result.notes), 'gate trace fields');
expect('Final citation gate requires review for selected evidence', routes.every((route) => {
  const finalCitation = route.evidenceRoute?.validationGateResults?.find((result) => result.gate === 'final_citation');
  return (route.evidenceRoute?.selectedEvidence?.length ?? 0) > 0 ? finalCitation?.status === 'requires_review' : finalCitation?.status === 'blocked';
}), 'final citation guarded');

expect('Selected route items have source/provenance/release refs', selectedItems.every((item) => item.sourceIds?.length > 0 && item.provenanceIds?.length > 0 && item.releaseStateIds?.length > 0), 'selected refs complete');
expect('Selected route items are graph linked', selectedItems.every((item) => item.graphNodeIds?.length > 0), 'selected graph linked');
expect('Selected route items are operational workflow evidence only', selectedItems.every((item) => !RELIGIOUS_CONTENT_TYPES.has(rankingCandidatesById.get(item.candidateId)?.contentType)), 'no religious selected');
expect('Escalation route items stay separated', escalationItems.length === 13 && escalationItems.every((item) => item.validationImpact === 'escalates' && item.selectionState === 'requires_escalation'), `${escalationItems.length} escalation items`);
expect('Handoff selected IDs match route selected evidence', routes.every((route) => {
  const ids = new Set((route.evidenceRoute?.selectedEvidence ?? []).map((item) => item.routeItemId));
  return (route.validationHandoff?.selectedEvidenceRouteItemIds ?? []).every((id) => ids.has(id));
}), 'selected IDs linked');

const remediationIds = new Set(allRouteRemediations.map((item) => item.remediationId));
expect('Flattened remediation count matches summary', allRouteRemediations.length === handoff.summary?.remediationCount && (handoff.remediationItems ?? []).length === handoff.summary?.remediationCount, String(allRouteRemediations.length));
expect('Remediation IDs are unique', remediationIds.size === allRouteRemediations.length, `${remediationIds.size} unique`);
expect('Every remediation is linked from its route and handoff', routes.every((route) => {
  const routeIds = new Set(route.evidenceRoute?.remediationIds ?? []);
  const handoffIds = new Set(route.validationHandoff?.remediationIds ?? []);
  return (route.remediationItems ?? []).every((item) => routeIds.has(item.remediationId) && handoffIds.has(item.remediationId));
}), 'remediation linked');
expect('Remediation records have owner/action/severity and stay private', allRouteRemediations.every((item) => item.recommendedOwner && item.recommendedAction && item.severity && item.issueType && item.publicReleaseApproved === false), 'remediation fields');
expect('High or critical remediation count matches summary', allRouteRemediations.filter((item) => item.severity === 'high' || item.severity === 'critical').length === handoff.summary?.highOrCriticalRemediationCount, 'severity count');

expect('Private boundary is explicit', handoff.privateOnly === true && handoff.publicReleaseApproved === false && handoff.publicBoundary?.privateOnly === true && handoff.publicBoundary?.publicRouteExposed === false, 'private only');
expect('No public-safe route items are emitted', handoff.publicBoundary?.publicSafeRouteItemCount === 0 && handoff.summary?.publicSafeRouteItemCount === 0, 'zero public-safe');
expect('Route items do not claim public approval', !JSON.stringify(allRouteItems).toLowerCase().includes('public approved'), 'no public approval');
expect('Artifact avoids raw answer/content text fields', !/(fullText|quranText|draftAnswer|guidedAnswer|snippet)/.test(handoffText), 'metadata only');
expect('Generator does not read env files', !generator.includes('.env'), 'no env access');

for (const term of [
  '# CP24-G05 - Evidence Route And Validation Handoff',
  'Status: Complete',
  'Evidence Route Structure',
  'Validation Gates',
  'Current Results',
  'Remediation Rules',
  'Public Boundary',
  'Status: complete',
]) {
  expect(`G05 doc includes: ${term}`, g05Doc.includes(term), term);
}

const sprintHasG05Complete = sprintPlan.includes('Status: CP24-G05 complete; CP24-G06 pending');
const sprintHasG06Complete = sprintPlan.includes('Status: CP24-G06 complete; CP24-G07 pending');
const sprintHasG07Complete = sprintPlan.includes('Status: CP24-G07 complete; CP24-G08 pending');
const sprintHasG08Complete = sprintPlan.includes('Status: CP24-G08 complete; CP24-G09 pending');
const sprintHasCp24Complete = sprintPlan.includes('Status: CP24 complete; recommended next scope CP25');
expect('Sprint plan is at or beyond G05 complete', sprintHasG05Complete || sprintHasG06Complete || sprintHasG07Complete || sprintHasG08Complete || sprintHasCp24Complete, sprintHasCp24Complete ? 'CP24 complete' : sprintHasG08Complete ? 'G08 complete' : sprintHasG07Complete ? 'G07 complete' : sprintHasG06Complete ? 'G06 complete' : 'G05 complete');
expect('Sprint plan points to G05 report', sprintPlan.includes('CP24_G05_EVIDENCE_ROUTE_AND_VALIDATION_HANDOFF.md'), 'G05 report linked');
const checklistHasG05Complete = checklist.includes('Status: CP24-G05 complete; CP24-G06 pending');
const checklistHasG06Complete = checklist.includes('Status: CP24-G06 complete; CP24-G07 pending');
const checklistHasG07Complete = checklist.includes('Status: CP24-G07 complete; CP24-G08 pending');
const checklistHasG08Complete = checklist.includes('Status: CP24-G08 complete; CP24-G09 pending');
const checklistHasCp24Complete = checklist.includes('Status: CP24 complete; recommended next scope CP25');
expect('Checklist is at or beyond G05 complete', checklistHasG05Complete || checklistHasG06Complete || checklistHasG07Complete || checklistHasG08Complete || checklistHasCp24Complete, checklistHasCp24Complete ? 'CP24 complete' : checklistHasG08Complete ? 'G08 complete' : checklistHasG07Complete ? 'G07 complete' : checklistHasG06Complete ? 'G06 complete' : 'G05 complete');
expect('Checklist G05 rows pass', ['CP24-G05-01', 'CP24-G05-02', 'CP24-G05-03', 'CP24-G05-04', 'CP24-G05-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G05 rows pass');
expect('Checklist includes a valid post-G05 next action', checklist.includes('Start `CP24-G06 - Private API Prototype`') || checklist.includes('Start `CP24-G07 - Internal UI Prototype`') || checklist.includes('Start `CP24-G08 - Combined Verification`') || checklist.includes('Start `CP24-G09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP25 - Reviewer Workbench Action Workflow`'), checklistHasCp24Complete ? 'CP25 next' : checklistHasG08Complete ? 'G09 next' : checklistHasG07Complete ? 'G08 next' : checklistHasG06Complete ? 'G07 next' : 'G06 next');
expect('Every selected candidate has a selected route item', Array.from(selectedCandidateIds).every((id) => rankingCandidatesById.get(id)?.selectionState === 'selected'), 'selected candidates linked');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP24-G05 validation handoff verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP24-G05 validation handoff verification passed.');
