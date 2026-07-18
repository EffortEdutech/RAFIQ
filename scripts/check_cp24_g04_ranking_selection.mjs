#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [];
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

function readText(path) {
  if (!existsSync(path)) {
    fail(`File exists: ${path}`, 'Missing.');
    return '';
  }
  pass(`File exists: ${path}`, 'Found.');
  return readFileSync(path, 'utf8');
}

function readJson(path) {
  const text = readText(path);
  if (!text) return {};
  try {
    const value = JSON.parse(text);
    pass(`Parse JSON: ${path}`, 'Valid JSON.');
    return value;
  } catch (error) {
    fail(`Parse JSON: ${path}`, error.message);
    return {};
  }
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function runNodeScript(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status === 0) {
    pass(`Run ${scriptPath}`, result.stdout.trim().split(/\r?\n/).at(-1) || 'ok');
  } else {
    fail(`Run ${scriptPath}`, `${result.stdout}${result.stderr}`);
  }
}

runNodeScript('scripts/check_cp24_g03_candidate_graph_expansion.mjs');
runNodeScript('scripts/generate_cp24_ranking_selection.mjs');

const rankingText = readText('data/retrieval/cp24/ranking-selection.json');
const ranking = rankingText ? JSON.parse(rankingText) : {};
const manifest = readJson('data/retrieval/cp24/manifest.json');
const candidateExpansion = readJson('data/retrieval/cp24/candidate-expansion.json');
const g04Doc = readText('docs/09_sprints/resource_audit_import_prototype/CP24_G04_RANKING_EXPLANATION_AND_SELECTION.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_ACCEPTANCE_CHECKLIST.md');
const generator = readText('scripts/generate_cp24_ranking_selection.mjs');

expect('Ranking artifact schema is CP24-G04', ranking.schemaVersion === 'cp24.ranking-selection.v1' && ranking.checkpoint === 'CP24-G04', ranking.schemaVersion);
expect('Manifest points to CP24-G04', manifest.checkpoint === 'CP24-G04', manifest.checkpoint);
expect('Manifest includes ranking selection path', String(manifest.artifactPaths?.rankingSelection ?? '').replaceAll('\\', '/') === 'data/retrieval/cp24/ranking-selection.json', manifest.artifactPaths?.rankingSelection);
expect('Manifest ranking checksum matches artifact', manifest.checksums?.rankingSelectionSha256 === sha256(rankingText), 'checksum match');
expect('Ranking source checksum matches candidate expansion', ranking.sourceArtifact?.candidateExpansionSha256 === manifest.checksums?.candidateExpansionSha256, 'source checksum');
expect('Candidate fixture count is inherited', ranking.summary?.fixtureCount === candidateExpansion.summary?.fixtureCount, String(ranking.summary?.fixtureCount));
expect('Candidate count is inherited', ranking.summary?.candidateCount === candidateExpansion.summary?.candidateCount, String(ranking.summary?.candidateCount));

expect('Scoring model is operational only', ranking.scoringModel?.authorityBoundary === 'operational_relevance_only', ranking.scoringModel?.authorityBoundary);
expect('Scoring model includes allowed signals', ['source_refs_complete', 'provenance_refs_complete', 'release_refs_complete', 'graph_neighbor_available', 'validation_history', 'vault_context_available', 'quality_warning', 'release_blocker', 'escalation_sensitive_intent'].every((signal) => ranking.scoringModel?.allowedSignals?.includes(signal)), 'allowed signals');
expect('Selection rules include missing ref block', ranking.scoringModel?.selectionRules?.some((rule) => rule.includes('missing source/provenance/release refs cannot be selected')), 'missing ref rule');
expect('Selection rules include escalation separation', ranking.scoringModel?.selectionRules?.some((rule) => rule.includes('escalation outcomes are separated')), 'escalation rule');

const fixtures = ranking.fixtures ?? [];
const allCandidates = fixtures.flatMap((fixture) => fixture.rankedCandidates ?? []);
const selected = allCandidates.filter((candidate) => candidate.selectionState === 'selected');
const held = allCandidates.filter((candidate) => candidate.selectionState === 'held');
const rejected = allCandidates.filter((candidate) => candidate.selectionState === 'rejected');
const escalated = allCandidates.filter((candidate) => candidate.selectionState === 'requires_escalation');
const ordinary = allCandidates.filter((candidate) => candidate.ordinaryScore !== null);

expect('Ranking has all 10 fixtures', fixtures.length === 10, String(fixtures.length));
expect('Ranking has selected candidates', selected.length === 15, String(selected.length));
expect('Ranking has held candidates', held.length === 58, String(held.length));
expect('Ranking has rejected candidates', rejected.length === 1, String(rejected.length));
expect('Ranking has escalation candidates', escalated.length === 13, String(escalated.length));
expect('Ordinary scored count excludes escalation', ordinary.length === 74 && escalated.every((candidate) => candidate.ordinaryScore === null), `${ordinary.length}/${escalated.length}`);
expect('Ordinary average is stable', ranking.summary?.ordinaryAverageScore === 62.86, String(ranking.summary?.ordinaryAverageScore));
expect('Public-safe candidate count remains zero', ranking.summary?.publicSafeCandidateCount === 0 && ranking.publicBoundary?.publicSafeCandidateCount === 0, 'zero public-safe');
expect('Prohibited inference scan passes', ranking.prohibitedInferenceScan?.status === 'pass' && ranking.summary?.prohibitedInferenceFindingCount === 0, ranking.prohibitedInferenceScan?.status);

expect('Selected candidates have complete refs', selected.every((candidate) => candidate.sourceIds.length > 0 && candidate.provenanceIds.length > 0 && candidate.releaseStateIds.length > 0), 'complete refs');
expect('Selected candidates are private workflow/validation only', selected.every((candidate) => !RELIGIOUS_CONTENT_TYPES.has(candidate.contentType)), 'no religious selected');
expect('Selected candidates are clean and private', selected.every((candidate) => candidate.qualityState === 'clean' && candidate.publicSafe === false), 'clean/private');
expect('Selected candidate reasons stay operational', selected.every((candidate) => candidate.selectionReason.includes('operational metadata only') && !candidate.selectionReason.toLowerCase().includes('religious content approved')), 'operational reasons');
expect('Religious content remains held or escalated', allCandidates.filter((candidate) => RELIGIOUS_CONTENT_TYPES.has(candidate.contentType)).every((candidate) => candidate.selectionState !== 'selected'), 'religious held');
expect('Missing-ref candidates are not selected', allCandidates.every((candidate) => {
  const completeRefs = candidate.sourceIds.length > 0 && candidate.provenanceIds.length > 0 && candidate.releaseStateIds.length > 0;
  return completeRefs || candidate.selectionState !== 'selected';
}), 'missing refs held');
expect('Escalation outcomes are separated', escalated.length === ranking.summary?.escalationOutcomeCount && escalated.every((candidate) => candidate.escalationOutcome !== null), 'escalation split');
expect('Ranking explanations are operational only', allCandidates.every((candidate) => candidate.rankingAuthorityBoundary === 'operational_relevance_only' && candidate.scoringComponents.every((item) => item.authorityBoundary === 'operational_relevance_only')), 'operational only');

for (const fixture of fixtures) {
  const ids = fixture.rankedCandidates.map((candidate) => candidate.candidateId);
  expect(`Fixture ${fixture.fixtureId} selected IDs resolve`, fixture.selectedCandidateIds.every((id) => ids.includes(id)), 'selected IDs');
  expect(`Fixture ${fixture.fixtureId} held IDs resolve`, fixture.heldCandidateIds.every((id) => ids.includes(id)), 'held IDs');
  expect(`Fixture ${fixture.fixtureId} rejected IDs resolve`, fixture.rejectedCandidateIds.every((id) => ids.includes(id)), 'rejected IDs');
  expect(`Fixture ${fixture.fixtureId} escalation IDs resolve`, fixture.requiresEscalationCandidateIds.every((id) => ids.includes(id)), 'escalation IDs');
}

const artifactLower = JSON.stringify(ranking.fixtures ?? []).toLowerCase();
for (const prohibited of ['authentic because of graph', 'graph centrality proves', 'religious content approved', 'public approved']) {
  expect(`No prohibited inference term: ${prohibited}`, !artifactLower.includes(prohibited), prohibited);
}

expect('Generator separates escalation from ordinary scoring', generator.includes('candidate.escalationOutcome ? null') && generator.includes('escalation outcomes are separated from ordinary scores'), 'separate escalation');
expect('Generator blocks missing refs from selection', generator.includes('if (!hasCompleteRefs(candidate)) return false'), 'missing refs blocked');
expect('Generator blocks religious content selection', generator.includes('RELIGIOUS_CONTENT_TYPES.has(candidate.contentType)') && generator.includes('religious content-bearing candidates remain held'), 'religious held');
expect('Generator does not read env files', !generator.includes('.env'), 'no .env');

const requiredDocTerms = [
  '# CP24-G04 - Ranking, Explanation, And Selection',
  'Status: Complete',
  'Scoring Model',
  'Selection Rules',
  'Current Results',
  'Public Boundary',
  'Status: complete',
];
for (const term of requiredDocTerms) {
  expect(`G04 doc includes: ${term}`, g04Doc.includes(term), term);
}

expect('G04 doc records selected split', g04Doc.includes('| Selected candidates | 15 |') && g04Doc.includes('| Held candidates | 58 |'), 'selection split');
expect('G04 doc records ordinary average', g04Doc.includes('| Ordinary average score | 62.86 |'), 'ordinary average');
expect('G04 doc records prohibited inference zero', g04Doc.includes('| Prohibited inference findings | 0 |'), 'prohibited zero');

const sprintHasG04Complete = sprintPlan.includes('Status: CP24-G04 complete; CP24-G05 pending');
const sprintHasG05Complete = sprintPlan.includes('Status: CP24-G05 complete; CP24-G06 pending');
const sprintHasG06Complete = sprintPlan.includes('Status: CP24-G06 complete; CP24-G07 pending');
const sprintHasG07Complete = sprintPlan.includes('Status: CP24-G07 complete; CP24-G08 pending');
const sprintHasG08Complete = sprintPlan.includes('Status: CP24-G08 complete; CP24-G09 pending');
const sprintHasCp24Complete = sprintPlan.includes('Status: CP24 complete; recommended next scope CP25');
expect('Sprint plan is at or beyond G04 complete', sprintHasG04Complete || sprintHasG05Complete || sprintHasG06Complete || sprintHasG07Complete || sprintHasG08Complete || sprintHasCp24Complete, sprintHasCp24Complete ? 'CP24 complete' : sprintHasG08Complete ? 'G08 complete' : sprintHasG07Complete ? 'G07 complete' : sprintHasG06Complete ? 'G06 complete' : sprintHasG05Complete ? 'G05 complete' : 'G04 complete');
expect('Sprint plan points to G04 report', sprintPlan.includes('CP24_G04_RANKING_EXPLANATION_AND_SELECTION.md'), 'G04 report linked');
const checklistHasG04Complete = checklist.includes('Status: CP24-G04 complete; CP24-G05 pending');
const checklistHasG05Complete = checklist.includes('Status: CP24-G05 complete; CP24-G06 pending');
const checklistHasG06Complete = checklist.includes('Status: CP24-G06 complete; CP24-G07 pending');
const checklistHasG07Complete = checklist.includes('Status: CP24-G07 complete; CP24-G08 pending');
const checklistHasG08Complete = checklist.includes('Status: CP24-G08 complete; CP24-G09 pending');
const checklistHasCp24Complete = checklist.includes('Status: CP24 complete; recommended next scope CP25');
expect('Checklist is at or beyond G04 complete', checklistHasG04Complete || checklistHasG05Complete || checklistHasG06Complete || checklistHasG07Complete || checklistHasG08Complete || checklistHasCp24Complete, checklistHasCp24Complete ? 'CP24 complete' : checklistHasG08Complete ? 'G08 complete' : checklistHasG07Complete ? 'G07 complete' : checklistHasG06Complete ? 'G06 complete' : checklistHasG05Complete ? 'G05 complete' : 'G04 complete');
expect('Checklist G04 rows pass', ['CP24-G04-01', 'CP24-G04-02', 'CP24-G04-03', 'CP24-G04-04', 'CP24-G04-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G04 rows pass');
expect('Checklist includes a valid post-G04 next action', checklist.includes('Start `CP24-G05 - Evidence Route And Validation Handoff`') || checklist.includes('Start `CP24-G06 - Private API Prototype`') || checklist.includes('Start `CP24-G07 - Internal UI Prototype`') || checklist.includes('Start `CP24-G08 - Combined Verification`') || checklist.includes('Start `CP24-G09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP25 - Reviewer Workbench Action Workflow`'), checklistHasCp24Complete ? 'CP25 next' : checklistHasG08Complete ? 'G09 next' : checklistHasG07Complete ? 'G08 next' : checklistHasG06Complete ? 'G07 next' : checklistHasG05Complete ? 'G06 next' : 'G05 next');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP24-G04 ranking selection verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP24-G04 ranking selection verification passed.');
