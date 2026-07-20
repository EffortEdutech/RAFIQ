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
  const result = spawnSync(process.execPath, [scriptPath], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status === 0) pass(`Run ${scriptPath}`, result.stdout.trim().split(/\r?\n/).at(-1) || 'ok');
  else fail(`Run ${scriptPath}`, `${result.stdout}${result.stderr}`);
}

runNodeScript('scripts/check_cp29_r04_r05_fast_sprint.mjs');
runNodeScript('scripts/generate_cp29_r06_r08_combined_close_out.mjs');

const unlockText = readText('data/remediation/cp29/selected-candidate-unlock-verification.json');
const unlock = unlockText ? JSON.parse(unlockText) : null;
const routeText = readText('data/remediation/cp29/private-route-readiness-decision.json');
const route = routeText ? JSON.parse(routeText) : null;
const combinedText = readText('data/remediation/cp29/combined-verification.json');
const combined = combinedText ? JSON.parse(combinedText) : null;
const manifestText = readText('data/remediation/cp29/manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const latestText = readText('data/remediation/cp29/latest-remediation.json');
const latest = latestText ? JSON.parse(latestText) : null;
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP29_RETRIEVAL_REMEDIATION_AND_SELECTED_CANDIDATE_UNLOCK_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP29_RETRIEVAL_REMEDIATION_AND_SELECTED_CANDIDATE_UNLOCK_ACCEPTANCE_CHECKLIST.md');
const closeOut = readText('docs/09_sprints/resource_audit_import_prototype/CP29_R08_COMBINED_VERIFICATION_AND_CLOSE_OUT.md');
const roadmap = readText('docs/09_sprints/resource_audit_import_prototype/RAFIQ_GRAPHIFY_PRODUCT_DEVELOPMENT_ROADMAP_CP26_TO_COMPLETION.md');
const generator = readText('scripts/generate_cp29_r06_r08_combined_close_out.mjs');

expect('R06 unlock verification schema is valid', unlock?.schemaVersion === 'cp29.selected-candidate-unlock-verification.v1' && unlock?.checkpoint === 'CP29-R06', unlock?.schemaVersion);
expect('R07 route readiness schema is valid', route?.schemaVersion === 'cp29.private-route-readiness-decision.v1' && route?.checkpoint === 'CP29-R07', route?.schemaVersion);
expect('R08 combined verification schema is valid', combined?.schemaVersion === 'cp29.combined-verification.v1' && combined?.checkpoint === 'CP29-R08', combined?.schemaVersion);
expect('Manifest advances to R08', manifest?.schemaVersion === 'cp29.remediation-manifest.v1' && manifest?.checkpoint === 'CP29-R08', manifest?.checkpoint);
expect('Latest pointer advances to R08', latest?.schemaVersion === 'cp29.latest-remediation-pointer.v1' && latest?.checkpoint === 'CP29-R08', latest?.checkpoint);
expect('Manifest/latest checksums match', manifest?.checksums?.combinedVerificationSha256 === sha256Text(combinedText) && latest?.manifestSha256 === sha256Text(manifestText) && latest?.combinedVerificationSha256 === sha256Text(combinedText), 'checksums');
expect('Unlock remains blocked as expected', unlock?.verificationOutcome === 'blocked_as_expected' && unlock?.selectedCandidateCount === 0 && unlock?.selectedRouteItemCount === 0, JSON.stringify(unlock));
expect('No escalation leakage', unlock?.escalationCandidateLeakageIntoOrdinaryUnlock === 0, 'leakage zero');
expect('Private route readiness is deferred', route?.decision === 'defer_private_route_implementation' && route?.privateRouteReady === false && route?.payloadCaps?.selectedRouteItemLimit === 0, JSON.stringify(route));
expect('Combined checks all pass', combined?.checks?.every((check) => check.status === 'pass'), JSON.stringify(combined?.checks));
expect('CP29 close-out outcome is blocked handoff', combined?.cp29Outcome?.status === 'complete_blocked_unlock_handoff' && combined?.cp29Outcome?.nextScope === 'CP30 - Private Guidance Loop Integration', JSON.stringify(combined?.cp29Outcome));
expect('Public boundary remains zero', combined?.counts?.publicSafeCandidates === 0 && combined?.counts?.publicSafeRouteItems === 0 && combined?.publicBoundary?.publicReleaseApproved === false, JSON.stringify(combined?.publicBoundary));
expect('Generator does not read env files', !generator.includes('.env'), 'no .env');
expect('No raw source text bodies are exported', !/(fullText|quranText|hadithText|translationText|tafsirText|draftAnswer|guidedAnswer|snippet)/.test(`${unlockText}\n${routeText}\n${combinedText}`), 'no raw text fields');

for (const term of ['Status: CP29-R08 complete', 'Status: Complete. See `CP29_R08_COMBINED_VERIFICATION_AND_CLOSE_OUT.md`.']) {
  expect(`Sprint plan includes ${term}`, sprintPlan.includes(term), term);
}
for (const id of ['CP29-R06-01', 'CP29-R06-02', 'CP29-R06-03', 'CP29-R06-04', 'CP29-R06-05', 'CP29-R07-01', 'CP29-R07-02', 'CP29-R07-03', 'CP29-R07-04', 'CP29-R07-05', 'CP29-R08-01', 'CP29-R08-02', 'CP29-R08-03', 'CP29-R08-04', 'CP29-R08-05']) {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  expect(`Checklist ${id} passes`, row.includes('| Pass |'), row);
}
for (const term of ['# CP29-R08 - Combined Verification And Close-Out', 'Status: Complete', 'Selected-Candidate Unlock Decision', 'Private Route Readiness Decision', 'Close-Out Outcome', 'Next Scope', 'Status: complete']) {
  expect(`Close-out includes ${term}`, closeOut.includes(term), term);
}
expect('Roadmap records CP29 complete and CP30 next', roadmap.includes('| CP29 retrieval remediation and selected-candidate unlock | Complete |') && roadmap.includes('CP30 - Private Guidance Loop Integration'), 'roadmap');

for (const check of checks) console.log(`${check.status}: ${check.name} - ${check.evidence}`);
const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP29-R06/R07/R08 close-out verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}
console.log('CP29-R06/R07/R08 combined close-out verification passed.');
