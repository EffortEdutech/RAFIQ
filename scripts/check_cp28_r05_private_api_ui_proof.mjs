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

runNodeScript('scripts/check_cp28_r04_validation_handoff.mjs');
runNodeScript('scripts/generate_cp28_r05_private_api_ui_proof.mjs');

const proofText = readText('data/retrieval/cp28/private-api-ui-proof.json');
const proof = proofText ? JSON.parse(proofText) : null;
const manifestText = readText('data/retrieval/cp28/manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const latestText = readText('data/retrieval/cp28/latest-retrieval.json');
const latest = latestText ? JSON.parse(latestText) : null;
const handoffText = readText('data/retrieval/cp28/validation-handoff.json');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP28_R05_RETRIEVAL_API_AND_PRIVATE_UI_INTEGRATION.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_ACCEPTANCE_CHECKLIST.md');
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const mobileApi = readText('apps/mobile/src/services/privateContentApi.ts');
const mobileScreen = readText('apps/mobile/app/graph-aware-retrieval.tsx');

expect('R05 proof schema is valid', proof?.schemaVersion === 'cp28.private-api-ui-proof.v1' && proof?.checkpoint === 'CP28-R05', proof?.schemaVersion);
expect('Manifest is advanced to CP28-R05', manifest?.checkpoint === 'CP28-R05', manifest?.checkpoint);
expect('Latest pointer is advanced to CP28-R05', latest?.checkpoint === 'CP28-R05', latest?.checkpoint);
expect('Manifest proof checksum matches artifact', manifest?.checksums?.privateApiUiProofSha256 === sha256Text(proofText), 'proof checksum');
expect('Latest proof checksum matches artifact', latest?.privateApiUiProofSha256 === sha256Text(proofText), 'latest checksum');
expect('Proof source handoff checksum matches', proof?.sourceArtifacts?.validationHandoffSha256 === sha256Text(handoffText), 'handoff checksum');
expect('Proof has 10 bounded fixture payloads', proof?.summary?.fixturePayloadCount === 10 && proof?.fixturePayloads?.length === 10, String(proof?.summary?.fixturePayloadCount));
expect('Proof keeps zero selected route items', proof?.summary?.selectedRouteItemCount === 0, String(proof?.summary?.selectedRouteItemCount));
expect('Proof keeps review and escalation split', proof?.summary?.reviewRouteItemCount === 55 && proof?.summary?.escalationRouteItemCount === 15, JSON.stringify(proof?.summary));
expect('Proof is bounded', proof?.outputCaps?.fullGraphDump === false && proof?.outputCaps?.fullVaultDump === false && proof?.outputCaps?.rawTextBodies === 0, JSON.stringify(proof?.outputCaps));
expect('Fixture payloads are bounded', proof?.fixturePayloads?.every((item) => item.candidates.length <= 8 && item.counts.routeItemsShown <= 8 && item.reviewerHandoff.remediationIds.length <= 8), 'payload caps');
expect('No source CP28 route is introduced yet', proof?.integrationDecision?.privateApiSourceRouteImplemented === false && !controller.includes("graph-aware-retrieval/cp28") && !mobileApi.includes('graph-aware-retrieval/cp28'), 'source route deferred');
expect('Existing CP24 internal UI remains available', mobileScreen.includes('CP24 Internal Retrieval') && mobileScreen.includes('Graph-aware retrieval'), 'existing internal UI');
expect('No public CP28 route exists', !controller.includes('public-content/graph-aware-retrieval/cp28') && proof?.summary?.publicRouteExposed === false, 'no public route');
expect('Public-safe counts remain zero', proof?.summary?.publicSafeCandidateCount === 0 && proof?.summary?.publicSafeRouteItemCount === 0 && proof?.publicBoundary?.publicSafeRouteItemCount === 0, 'zero public-safe');
expect('No raw source text bodies are exported', !/(fullText|quranText|hadithText|translationText|tafsirText|draftAnswer|guidedAnswer|snippet)/.test(proofText), 'no raw text fields');

for (const term of [
  '# CP28-R05 - Retrieval API And Private UI Integration',
  'Status: Complete',
  'Generated Artifacts',
  'Integration Decision',
  'Bounded Payload Proof',
  'Current Results',
  'Public Boundary',
  'Status: complete',
]) {
  expect(`R05 report includes ${term}`, report.includes(term), term);
}

const acceptedPostR05Statuses = [
  'Status: CP28-R05 complete; CP28-R06 next',
  'Status: CP28-R06 complete; CP28-R07 next',
  'Status: CP28 complete; recommended next scope',
];
const acceptedPostR05NextActions = [
  'Start `CP28-R06 - Retrieval Regression Suite And Public-Boundary Verifier`',
  'Start `CP28-R07 - Close-Out`',
  'Start `CP29 - Retrieval Remediation And Selected-Candidate Unlock`',
];
expect('Sprint plan marks R05 complete or later', acceptedPostR05Statuses.some((status) => sprintPlan.includes(status)), 'sprint status');
expect('Checklist marks R05 complete or later', acceptedPostR05Statuses.some((status) => checklist.includes(status)), 'checklist status');
expect('Checklist R05 rows pass', ['CP28-R05-01', 'CP28-R05-02', 'CP28-R05-03', 'CP28-R05-04', 'CP28-R05-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'R05 rows pass');
expect('Checklist recommends a valid post-R05 next checkpoint', acceptedPostR05NextActions.some((action) => checklist.includes(action)), 'post-R05 next');

for (const check of checks) console.log(`${check.status}: ${check.name} - ${check.evidence}`);
const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP28-R05 private API/UI proof verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP28-R05 private API/UI proof verification passed.');
