#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [];
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
  if (result.status === 0) pass(`Run ${scriptPath}`, result.stdout.trim().split(/\r?\n/).at(-1) || 'ok');
  else fail(`Run ${scriptPath}`, `${result.stdout}${result.stderr}`);
}

runNodeScript('scripts/check_cp28_r03_ranking_explanation.mjs');
runNodeScript('scripts/generate_cp28_r04_validation_handoff.mjs');

const rankingText = readText('data/retrieval/cp28/ranking-selection.json');
const ranking = rankingText ? JSON.parse(rankingText) : null;
const handoffText = readText('data/retrieval/cp28/validation-handoff.json');
const handoff = handoffText ? JSON.parse(handoffText) : null;
const manifestText = readText('data/retrieval/cp28/manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const latest = readJson('data/retrieval/cp28/latest-retrieval.json');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP28_R04_EVIDENCE_ROUTE_REBUILD_AND_VALIDATION_HANDOFF.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_ACCEPTANCE_CHECKLIST.md');
const generator = readText('scripts/generate_cp28_r04_validation_handoff.mjs');

expect('Handoff schema is CP28-R04', handoff?.schemaVersion === 'cp28.validation-handoff.v1' && handoff?.checkpoint === 'CP28-R04', handoff?.schemaVersion);
expect('Manifest is advanced to CP28-R04', manifest?.checkpoint === 'CP28-R04', manifest?.checkpoint);
expect('Latest pointer is advanced to CP28-R04', latest?.checkpoint === 'CP28-R04', latest?.checkpoint);
expect('Manifest validation checksum matches artifact', manifest?.checksums?.validationHandoffSha256 === sha256Text(handoffText), 'handoff checksum');
expect('Handoff source ranking checksum matches', handoff?.sourceArtifact?.rankingSelectionSha256 === sha256Text(rankingText), 'ranking checksum');
expect('Latest pointer validation checksum matches', latest?.validationHandoffSha256 === sha256Text(handoffText), 'latest checksum');

const routes = handoff?.routes ?? [];
const allItems = routes.flatMap((route) => [
  ...(route.evidenceRoute?.selectedEvidence ?? []),
  ...(route.evidenceRoute?.reviewEvidence ?? []),
  ...(route.evidenceRoute?.escalationEvidence ?? []),
]);
const allGates = routes.flatMap((route) => route.evidenceRoute?.validationGateResults ?? []);
const remediations = handoff?.remediationItems ?? [];

expect('R04 route count matches fixtures', routes.length === 10 && routes.length === ranking?.summary?.fixtureCount, String(routes.length));
expect('R04 route item count matches ranking candidates', allItems.length === ranking?.summary?.candidateCount && allItems.length === 70, String(allItems.length));
expect('R04 keeps zero selected route items', handoff?.summary?.selectedRouteItemCount === 0 && routes.every((route) => route.evidenceRoute?.selectedEvidence?.length === 0), 'zero selected route items');
expect('R04 review and escalation split is stable', handoff?.summary?.reviewRouteItemCount === 55 && handoff?.summary?.escalationRouteItemCount === 15, JSON.stringify(handoff?.summary));
expect('R04 validation gates are complete', allGates.length === 110 && routes.every((route) => REQUIRED_GATES.every((gate) => route.validationHandoff?.requiredGates?.includes(gate))), `${allGates.length} gates`);
expect('Every route has linked IDs', routes.every((route) => route.evidenceRoute?.evidenceRouteId === route.validationHandoff?.evidenceRouteId), 'route IDs linked');
expect('Every gate is operational metadata only', allGates.every((gate) => gate.authorityBoundary === 'operational_metadata_only' && gate.status), 'gate boundary');
expect('Final citation gates are blocked', routes.every((route) => route.evidenceRoute?.validationGateResults?.find((gate) => gate.gate === 'final_citation')?.status === 'blocked'), 'final citation blocked');
expect('Remediation count is stable', remediations.length === 70 && handoff?.summary?.remediationCount === 70, String(remediations.length));
expect('High or critical remediation count is stable', remediations.filter((item) => item.severity === 'high' || item.severity === 'critical').length === 38 && handoff?.summary?.highOrCriticalRemediationCount === 38, '38 high/critical');
expect('All remediations remain private', remediations.every((item) => item.publicReleaseApproved === false && item.publicSafe === false), 'private remediation');
expect('Every route links remediation IDs', routes.every((route) => (route.remediationItems ?? []).every((item) => route.validationHandoff?.remediationIds?.includes(item.remediationId))), 'remediation linked');
expect('Unresolved references remain visible', handoff?.summary?.unresolvedReferenceCount === 70, String(handoff?.summary?.unresolvedReferenceCount));
expect('Public-safe route item count remains zero', handoff?.summary?.publicSafeRouteItemCount === 0 && handoff?.publicBoundary?.publicSafeRouteItemCount === 0, 'zero public-safe route items');
expect('No raw source text bodies are exported', !/(fullText|quranText|hadithText|translationText|tafsirText|draftAnswer|guidedAnswer|snippet)/.test(handoffText), 'no raw text fields');
expect('Generator does not read env files', !generator.includes('.env'), 'no .env');

for (const term of [
  '# CP28-R04 - Evidence Route Rebuild And Validation Handoff',
  'Status: Complete',
  'Generated Artifacts',
  'Evidence Route Structure',
  'Validation Gates',
  'Current Results',
  'Public Boundary',
  'Status: complete',
]) {
  expect(`R04 report includes ${term}`, report.includes(term), term);
}

expect('R04 report records zero selected route items', report.includes('| Selected route items | 0 |'), 'zero selected doc');
expect('R04 report records remediation count', report.includes('| Remediation items | 70 |'), 'remediation doc');
const acceptedPostR04Statuses = [
  'Status: CP28-R04 complete; CP28-R05 next',
  'Status: CP28-R05 complete; CP28-R06 next',
  'Status: CP28-R06 complete; CP28-R07 next',
  'Status: CP28 complete; recommended next scope',
];
const acceptedPostR04NextActions = [
  'Start `CP28-R05 - Retrieval API And Private UI Integration`',
  'Start `CP28-R06 - Retrieval Regression Suite And Public-Boundary Verifier`',
  'Start `CP28-R07 - Close-Out`',
  'Start `CP29 - Retrieval Remediation And Selected-Candidate Unlock`',
];
expect('Sprint plan marks R04 complete or later', acceptedPostR04Statuses.some((status) => sprintPlan.includes(status)), 'sprint status');
expect('Checklist marks R04 complete or later', acceptedPostR04Statuses.some((status) => checklist.includes(status)), 'checklist status');
expect('Checklist R04 rows pass', ['CP28-R04-01', 'CP28-R04-02', 'CP28-R04-03', 'CP28-R04-04', 'CP28-R04-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'R04 rows pass');
expect('Checklist recommends a valid post-R04 next checkpoint', acceptedPostR04NextActions.some((action) => checklist.includes(action)), 'post-R04 next');

for (const check of checks) console.log(`${check.status}: ${check.name} - ${check.evidence}`);
const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP28-R04 validation handoff verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP28-R04 validation handoff verification passed.');
