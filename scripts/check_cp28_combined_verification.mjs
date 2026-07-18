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

runNodeScript('scripts/check_cp28_r05_private_api_ui_proof.mjs');
runNodeScript('scripts/generate_cp28_r06_combined_verification.mjs');

const verificationText = readText('data/retrieval/cp28/combined-verification.json');
const verification = verificationText ? JSON.parse(verificationText) : null;
const manifestText = readText('data/retrieval/cp28/manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const latestText = readText('data/retrieval/cp28/latest-retrieval.json');
const latest = latestText ? JSON.parse(latestText) : null;
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP28_R06_RETRIEVAL_REGRESSION_SUITE_AND_PUBLIC_BOUNDARY_VERIFIER.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_ACCEPTANCE_CHECKLIST.md');

expect('Combined verification schema is CP28-R06', verification?.schemaVersion === 'cp28.combined-verification.v1' && verification?.checkpoint === 'CP28-R06', verification?.schemaVersion);
expect('Manifest is advanced to CP28-R06', manifest?.checkpoint === 'CP28-R06', manifest?.checkpoint);
expect('Latest pointer is advanced to CP28-R06', latest?.checkpoint === 'CP28-R06', latest?.checkpoint);
expect('Manifest combined checksum matches artifact', manifest?.checksums?.combinedVerificationSha256 === sha256Text(verificationText), 'combined checksum');
expect('Latest combined checksum matches artifact', latest?.combinedVerificationSha256 === sha256Text(verificationText), 'latest checksum');
expect('All combined checks pass', verification?.checks?.length === 7 && verification.checks.every((check) => check.status === 'pass'), JSON.stringify(verification?.checks));
expect('CP24 regression baseline is stable', verification?.regressionBaseline?.cp24CandidateCount === 87 && verification?.regressionBaseline?.cp24SelectedCandidateCount === 15 && verification?.regressionBaseline?.cp24PublicSafeCandidateCount === 0, JSON.stringify(verification?.regressionBaseline));
expect('CP27 refreshed blocker state is visible', verification?.refreshedInputs?.cp27GraphNodes === 147 && verification?.refreshedInputs?.cp27UnresolvedReferenceCount === 77 && verification?.refreshedInputs?.cp27HighOrCriticalBlockerCount === 30, JSON.stringify(verification?.refreshedInputs));
expect('CP28 result counts are stable', verification?.cp28Results?.candidateCount === 70 && verification?.cp28Results?.selectedCandidateCount === 0 && verification?.cp28Results?.remediationCount === 70, JSON.stringify(verification?.cp28Results));
expect('Public boundary remains blocked', verification?.publicBoundary?.publicReleaseApproved === false && verification?.publicBoundary?.publicRouteExposed === false && verification?.cp28Results?.publicSafeCandidateCount === 0 && verification?.cp28Results?.publicSafeRouteItemCount === 0, JSON.stringify(verification?.publicBoundary));
expect('No raw source text bodies are exported', !/(fullText|quranText|hadithText|translationText|tafsirText|draftAnswer|guidedAnswer|snippet)/.test(verificationText), 'no raw text fields');

for (const term of [
  '# CP28-R06 - Retrieval Regression Suite And Public-Boundary Verifier',
  'Status: Complete',
  'Combined Verifier',
  'Inherited Checks',
  'Current Results',
  'Public Boundary',
  'Status: complete',
]) {
  expect(`R06 report includes ${term}`, report.includes(term), term);
}

expect('Sprint plan marks R06 complete or later', sprintPlan.includes('Status: CP28-R06 complete; CP28-R07 next') || sprintPlan.includes('Status: CP28 complete; recommended next scope'), 'sprint status');
expect('Checklist marks R06 complete or later', checklist.includes('Status: CP28-R06 complete; CP28-R07 next') || checklist.includes('Status: CP28 complete; recommended next scope'), 'checklist status');
expect('Checklist R06 rows pass', ['CP28-R06-01', 'CP28-R06-02', 'CP28-R06-03', 'CP28-R06-04', 'CP28-R06-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'R06 rows pass');
expect('Checklist recommends a valid post-R06 next checkpoint', checklist.includes('Start `CP28-R07 - Close-Out`') || checklist.includes('Start `CP29 - Retrieval Remediation And Selected-Candidate Unlock`'), 'post-R06 next');

for (const check of checks) console.log(`${check.status}: ${check.name} - ${check.evidence}`);
const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP28-R06 combined verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP28-R06 combined verification passed.');
