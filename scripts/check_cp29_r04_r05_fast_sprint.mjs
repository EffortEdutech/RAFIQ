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

runNodeScript('scripts/check_cp29_r03_quality_review_burn_down_plan.mjs');
runNodeScript('scripts/generate_cp29_r04_r05_fast_sprint.mjs');

const escalationText = readText('data/remediation/cp29/escalation-lane-separation.json');
const escalation = escalationText ? JSON.parse(escalationText) : null;
const diffText = readText('data/remediation/cp29/regeneration-diff-proof.json');
const diff = diffText ? JSON.parse(diffText) : null;
const manifestText = readText('data/remediation/cp29/manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const latestText = readText('data/remediation/cp29/latest-remediation.json');
const latest = latestText ? JSON.parse(latestText) : null;
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP29_RETRIEVAL_REMEDIATION_AND_SELECTED_CANDIDATE_UNLOCK_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP29_RETRIEVAL_REMEDIATION_AND_SELECTED_CANDIDATE_UNLOCK_ACCEPTANCE_CHECKLIST.md');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP29_R04_R05_FAST_SPRINT_ESCALATION_AND_DIFF_PROOF.md');
const generator = readText('scripts/generate_cp29_r04_r05_fast_sprint.mjs');

expect('CP29-R04 escalation schema is valid', escalation?.schemaVersion === 'cp29.escalation-lane-separation.v1' && escalation?.checkpoint === 'CP29-R04', escalation?.schemaVersion);
expect('CP29-R05 diff schema is valid', diff?.schemaVersion === 'cp29.regeneration-diff-proof.v1' && diff?.checkpoint === 'CP29-R05', diff?.schemaVersion);
expect('Manifest advances to R05', manifest?.schemaVersion === 'cp29.remediation-manifest.v1' && manifest?.checkpoint === 'CP29-R05', manifest?.checkpoint);
expect('Latest pointer advances to R05', latest?.schemaVersion === 'cp29.latest-remediation-pointer.v1' && latest?.checkpoint === 'CP29-R05', latest?.checkpoint);
expect('Manifest checksums match fast sprint artifacts', manifest?.checksums?.escalationLaneSeparationSha256 === sha256Text(escalationText) && manifest?.checksums?.regenerationDiffProofSha256 === sha256Text(diffText), 'artifact checksums');
expect('Latest checksums match manifest and artifacts', latest?.manifestSha256 === sha256Text(manifestText) && latest?.escalationLaneSeparationSha256 === sha256Text(escalationText) && latest?.regenerationDiffProofSha256 === sha256Text(diffText), 'latest checksums');
expect('Escalation counts are stable', escalation?.baseline?.escalationCandidateCount === 15 && escalation?.baseline?.gradeEscalationCandidateCount === 7 && escalation?.baseline?.safetyEscalationCandidateCount === 8, JSON.stringify(escalation?.baseline));
expect('Escalation lanes are separated by owner', escalation?.groupingSummary?.byRecommendedOwner?.scholar_reviewer === 7 && escalation?.groupingSummary?.byRecommendedOwner?.product_owner === 8, JSON.stringify(escalation?.groupingSummary?.byRecommendedOwner));
expect('Escalation candidates excluded from ordinary unlock', escalation?.escalationLanes?.every((lane) => lane.ordinaryUnlockExcluded === true && lane.escalationDecisionRequired === true && lane.selectedCandidateUnlockAllowed === false), 'lane locks');
expect('R05 records no actual regeneration', Object.values(diff?.regenerationState ?? {}).filter((value) => value === true).length === 0, JSON.stringify(diff?.regenerationState));
expect('R05 deltas remain zero', Object.values(diff?.deltas ?? {}).every((value) => value === 0), JSON.stringify(diff?.deltas));
expect('Before and after selected counts remain zero', diff?.beforeCounts?.cp28SelectedCandidates === 0 && diff?.afterCounts?.cp28SelectedCandidates === 0 && diff?.afterCounts?.cp28SelectedRouteItems === 0, JSON.stringify({ before: diff?.beforeCounts, after: diff?.afterCounts }));
expect('Unlock remains blocked at R05', diff?.unlockBoundary?.selectedCandidateUnlockAllowed === false && diff?.unlockBoundary?.nextCheckpoint === 'CP29-R06', JSON.stringify(diff?.unlockBoundary));
expect('Public boundary remains zero', diff?.publicBoundary?.publicSafeRetrievalCandidateCount === 0 && diff?.publicBoundary?.publicSafeRouteItemCount === 0 && diff?.publicBoundary?.publicReleaseApproved === false, JSON.stringify(diff?.publicBoundary));
expect('Generator does not read env files', !generator.includes('.env'), 'no .env');
expect('No raw source text bodies are exported', !/(fullText|quranText|hadithText|translationText|tafsirText|draftAnswer|guidedAnswer|snippet)/.test(`${escalationText}\n${diffText}`), 'no raw text fields');

for (const term of ['Status: Complete. See `CP29_R04_R05_FAST_SPRINT_ESCALATION_AND_DIFF_PROOF.md`.']) {
  expect(`Sprint plan includes ${term}`, sprintPlan.includes(term), term);
}
expect('Sprint plan status is R05 or later', [
  'Status: CP29-R05 complete; CP29-R06 next',
  'Status: CP29-R08 complete',
].some((status) => sprintPlan.includes(status)), 'R05 or later');
for (const id of ['CP29-R04-01', 'CP29-R04-02', 'CP29-R04-03', 'CP29-R04-04', 'CP29-R04-05', 'CP29-R05-01', 'CP29-R05-02', 'CP29-R05-03', 'CP29-R05-04', 'CP29-R05-05']) {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  expect(`Checklist ${id} passes`, row.includes('| Pass |'), row);
}
expect('Checklist recommends R06 or later next', [
  'Start `CP29-R06 - Selected-Candidate Unlock Verification`',
  'Start `CP30 - Private Guidance Loop Integration`',
].some((nextAction) => checklist.includes(nextAction)), 'R06 or later next');
for (const term of ['# CP29-R04/R05 Fast Sprint - Escalation And Diff Proof', 'Status: Complete', 'Escalation Lane Separation', 'Regeneration And Diff Proof', 'Unlock Boundary', 'Public Boundary', 'Status: complete']) {
  expect(`Fast sprint report includes ${term}`, report.includes(term), term);
}

for (const check of checks) console.log(`${check.status}: ${check.name} - ${check.evidence}`);
const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP29-R04/R05 fast sprint verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}
console.log('CP29-R04/R05 fast sprint verification passed.');
