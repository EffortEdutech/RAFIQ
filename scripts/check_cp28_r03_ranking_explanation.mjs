#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
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
  if (!existsSync(filePath)) {
    fail(`File exists: ${filePath}`, 'Missing.');
    return '';
  }
  pass(`File exists: ${filePath}`, 'Found.');
  return readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  const text = readText(filePath);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`Parse JSON: ${filePath}`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

function sha256Text(value) {
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

runNodeScript('scripts/check_cp28_r02_candidate_collection.mjs');
runNodeScript('scripts/generate_cp28_r03_ranking_explanation.mjs');

const collectionText = readText('data/retrieval/cp28/candidate-collection.json');
const collection = collectionText ? JSON.parse(collectionText) : null;
const rankingText = readText('data/retrieval/cp28/ranking-selection.json');
const ranking = rankingText ? JSON.parse(rankingText) : null;
const manifestText = readText('data/retrieval/cp28/manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const latest = readJson('data/retrieval/cp28/latest-retrieval.json');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP28_R03_RANKING_AND_EXPLANATION_USING_ALLOWED_OPERATIONAL_SIGNALS.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_ACCEPTANCE_CHECKLIST.md');
const generator = readText('scripts/generate_cp28_r03_ranking_explanation.mjs');

expect('Ranking schema is CP28-R03', ranking?.schemaVersion === 'cp28.ranking-explanation.v1' && ranking?.checkpoint === 'CP28-R03', ranking?.schemaVersion);
expect('Manifest is advanced to CP28-R03', manifest?.schemaVersion === 'cp28.retrieval-artifact-manifest.v1' && manifest?.checkpoint === 'CP28-R03', manifest?.checkpoint);
expect('Latest pointer is advanced to CP28-R03', latest?.schemaVersion === 'cp28.latest-retrieval-pointer.v1' && latest?.checkpoint === 'CP28-R03', latest?.checkpoint);
expect('Manifest points to ranking artifact', manifest?.artifactPaths?.rankingSelection === 'data/retrieval/cp28/ranking-selection.json', manifest?.artifactPaths?.rankingSelection);
expect('Manifest ranking checksum matches artifact', manifest?.checksums?.rankingSelectionSha256 === sha256Text(rankingText), 'ranking checksum');
expect('Manifest candidate checksum remains valid', manifest?.checksums?.candidateCollectionSha256 === sha256Text(collectionText), 'candidate checksum');
expect('Latest pointer checksums match', latest?.manifestSha256 === sha256Text(manifestText) && latest?.rankingSelectionSha256 === sha256Text(rankingText), 'latest pointer checksums');
expect('Ranking source artifact checksum matches collection', ranking?.sourceArtifact?.candidateCollectionSha256 === sha256Text(collectionText), 'source checksum');

const fixtures = ranking?.fixtures ?? [];
const candidates = fixtures.flatMap((fixture) => fixture.rankedCandidates ?? []);
const selected = candidates.filter((candidate) => candidate.selectionState === 'selected');
const held = candidates.filter((candidate) => candidate.selectionState === 'held');
const escalated = candidates.filter((candidate) => candidate.selectionState === 'requires_escalation');
const ordinary = candidates.filter((candidate) => candidate.ordinaryScore !== null);

expect('Ranking keeps all CP28 fixtures', fixtures.length === collection?.summary?.fixtureCount && fixtures.length === 10, String(fixtures.length));
expect('Ranking keeps all CP28 candidates', candidates.length === collection?.summary?.candidateCount && candidates.length === 70, String(candidates.length));
expect('Ranking selects zero final candidates while CP27 blockers remain', selected.length === 0 && ranking?.summary?.selectedCandidateCount === 0, String(selected.length));
expect('Ranking has held candidates', held.length === 55 && ranking?.summary?.heldCandidateCount === 55, String(held.length));
expect('Ranking has escalation candidates', escalated.length === 15 && ranking?.summary?.requiresEscalationCandidateCount === 15, String(escalated.length));
expect('Escalation candidates are outside ordinary averages', ordinary.length === 55 && escalated.every((candidate) => candidate.ordinaryScore === null), `${ordinary.length}/${escalated.length}`);
expect('Ordinary average is stable', ranking?.summary?.ordinaryAverageScore === 15.4, String(ranking?.summary?.ordinaryAverageScore));
expect('CP27 blockers remain visible in ranking summary', ranking?.summary?.cp27UnresolvedReferenceCount === 77 && ranking?.summary?.cp27HighOrCriticalBlockerCount === 30, JSON.stringify(ranking?.summary));
expect('Public-safe candidate count remains zero', ranking?.summary?.publicSafeCandidateCount === 0 && ranking?.publicBoundary?.publicSafeRetrievalCandidateCount === 0, 'zero public-safe candidates');
expect('Prohibited inference scan passes', ranking?.prohibitedInferenceScan?.status === 'pass' && ranking?.summary?.prohibitedInferenceFindingCount === 0, ranking?.prohibitedInferenceScan?.status);

const requiredSignals = [
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
expect('Allowed operational signals are declared', requiredSignals.every((signal) => ranking?.scoringModel?.allowedSignals?.includes(signal)), 'allowed signals');
expect('Candidate scoring only uses allowed signals', candidates.every((candidate) => (candidate.scoringComponents ?? []).every((component) => ranking?.scoringModel?.allowedSignals?.includes(component.signal))), 'scoring signals');
expect('Candidate ranking boundary is operational metadata only', candidates.every((candidate) => candidate.rankingAuthorityBoundary === 'operational_metadata_only' && (candidate.scoringComponents ?? []).every((component) => component.authorityBoundary === 'operational_metadata_only')), 'operational metadata only');
expect('No raw source text bodies are exported', !/(fullText|quranText|hadithText|translationText|tafsirText|draftAnswer|guidedAnswer|snippet)/.test(rankingText), 'no raw text fields');
expect('Selected IDs array is empty', Array.isArray(ranking?.selectedCandidateIds) && ranking.selectedCandidateIds.length === 0, 'zero selected IDs');
expect('Held and escalation IDs resolve', ranking?.heldCandidateIds?.every((id) => candidates.some((candidate) => candidate.candidateId === id)) && ranking?.requiresEscalationCandidateIds?.every((id) => candidates.some((candidate) => candidate.candidateId === id)), 'IDs resolve');
expect('Remediation summary includes CP27 unresolved refs', ranking?.remediationSummary?.some((item) => item.reason === 'cp27_unresolved_references_present' && item.candidateCount === 70), JSON.stringify(ranking?.remediationSummary));

const fixtureText = JSON.stringify(ranking?.fixtures ?? []).toLowerCase();
for (const prohibited of ['authentic because of graph', 'graph centrality proves', 'religious approval', 'religious content approved', 'public approved', 'scholarly approval']) {
  expect(`No prohibited inference term in candidate explanations: ${prohibited}`, !fixtureText.includes(prohibited), prohibited);
}

expect('Generator separates escalation with null ordinary score', generator.includes("candidate.selectionState === 'requires_escalation' ? null") && generator.includes('excluded from ordinary averages'), 'escalation null');
expect('Generator enforces CP27 blocker hold', generator.includes('cp27UnresolvedReferenceCount') && generator.includes('cp27HighOrCriticalBlockerCount') && generator.includes("return 'held'"), 'blocker hold');
expect('Generator does not read env files', !generator.includes('.env'), 'no .env');

for (const term of [
  '# CP28-R03 - Ranking And Explanation Using Allowed Operational Signals',
  'Status: Complete',
  'Generated Artifacts',
  'Allowed Operational Signals',
  'Current Results',
  'Why Zero Candidates Are Selected',
  'Public Boundary',
  'Status: complete',
]) {
  expect(`R03 report includes ${term}`, report.includes(term), term);
}

expect('R03 report records zero selected candidates', report.includes('| Selected candidates | 0 |'), 'zero selected doc');
expect('R03 report records ordinary average', report.includes('| Ordinary average score | 15.4 |'), 'ordinary average doc');
expect('R03 report records public-safe zero', report.includes('| Public-safe candidates | 0 |'), 'public-safe doc');
const acceptedPostR03Statuses = [
  'Status: CP28-R03 complete; CP28-R04 next',
  'Status: CP28-R04 complete; CP28-R05 next',
  'Status: CP28-R05 complete; CP28-R06 next',
  'Status: CP28-R06 complete; CP28-R07 next',
  'Status: CP28 complete; recommended next scope',
];
const acceptedPostR03NextActions = [
  'Start `CP28-R04 - Evidence Route Rebuild And Validation Handoff`',
  'Start `CP28-R05 - Retrieval API And Private UI Integration`',
  'Start `CP28-R06 - Retrieval Regression Suite And Public-Boundary Verifier`',
  'Start `CP28-R07 - Close-Out`',
  'Start `CP29 - Retrieval Remediation And Selected-Candidate Unlock`',
];
expect('Sprint plan marks R03 complete or later', acceptedPostR03Statuses.some((status) => sprintPlan.includes(status)), 'sprint status');
expect('Checklist marks R03 complete or later', acceptedPostR03Statuses.some((status) => checklist.includes(status)), 'checklist status');
expect('Checklist R03 rows pass', ['CP28-R03-01', 'CP28-R03-02', 'CP28-R03-03', 'CP28-R03-04', 'CP28-R03-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'R03 rows pass');
expect('Checklist recommends a valid post-R03 next checkpoint', acceptedPostR03NextActions.some((action) => checklist.includes(action)), 'post-R03 next');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP28-R03 ranking explanation verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP28-R03 ranking explanation verification passed.');
