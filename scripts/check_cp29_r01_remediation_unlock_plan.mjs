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

runNodeScript('scripts/generate_cp29_r01_remediation_unlock_plan.mjs');

const planText = readText('data/remediation/cp29/remediation-unlock-plan.json');
const plan = planText ? JSON.parse(planText) : null;
const manifestText = readText('data/remediation/cp29/manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const latestText = readText('data/remediation/cp29/latest-remediation.json');
const latest = latestText ? JSON.parse(latestText) : null;
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP29_RETRIEVAL_REMEDIATION_AND_SELECTED_CANDIDATE_UNLOCK_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP29_RETRIEVAL_REMEDIATION_AND_SELECTED_CANDIDATE_UNLOCK_ACCEPTANCE_CHECKLIST.md');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP29_R01_REMEDIATION_ARCHITECTURE_AND_UNLOCK_BASELINE.md');
const roadmap = readText('docs/09_sprints/resource_audit_import_prototype/RAFIQ_GRAPHIFY_PRODUCT_DEVELOPMENT_ROADMAP_CP26_TO_COMPLETION.md');
const cp28CloseOut = readText('docs/09_sprints/resource_audit_import_prototype/CP28_R07_CLOSE_OUT.md');
const cp28VerificationText = readText('data/retrieval/cp28/combined-verification.json');
const cp28Verification = cp28VerificationText ? JSON.parse(cp28VerificationText) : null;
const generator = readText('scripts/generate_cp29_r01_remediation_unlock_plan.mjs');

expect('CP29-R01 plan schema is valid', plan?.schemaVersion === 'cp29.remediation-unlock-plan.v1' && plan?.checkpoint === 'CP29-R01', plan?.schemaVersion);
expect('CP29 manifest schema is valid', manifest?.schemaVersion === 'cp29.remediation-manifest.v1' && manifest?.checkpoint === 'CP29-R01', manifest?.schemaVersion);
expect('CP29 latest pointer is valid', latest?.schemaVersion === 'cp29.latest-remediation-pointer.v1' && latest?.checkpoint === 'CP29-R01', latest?.schemaVersion);
expect('Manifest checksum matches plan', manifest?.checksums?.remediationUnlockPlanSha256 === sha256Text(planText), 'plan checksum');
expect('Latest checksum matches manifest and plan', latest?.manifestSha256 === sha256Text(manifestText) && latest?.remediationUnlockPlanSha256 === sha256Text(planText), 'latest checksums');
expect('CP28 selected baseline remains zero', plan?.baseline?.cp28SelectedCandidateCount === 0 && plan?.baseline?.cp28SelectedRouteItemCount === 0, JSON.stringify(plan?.baseline));
expect('CP28 close-out selected CP29', cp28CloseOut.includes('Recommended next scope: CP29 - Retrieval Remediation And Selected-Candidate Unlock'), 'CP28 close-out handoff');
expect('CP28 combined verification remains passing', cp28Verification?.checkpoint === 'CP28-R06' && cp28Verification?.checks?.every((check) => check.status === 'pass'), JSON.stringify(cp28Verification?.checks));
expect('CP28 remediation baseline is stable', plan?.baseline?.cp28RemediationCount === 70 && plan?.baseline?.cp28HighOrCriticalRemediationCount === 38, JSON.stringify(plan?.baseline));
expect('CP27 blocker baseline is stable', plan?.baseline?.cp27UnresolvedReferenceCount === 77 && plan?.baseline?.cp27HighOrCriticalBlockerCount === 30, JSON.stringify(plan?.baseline));
expect('Reason taxonomy is complete', plan?.blockerTaxonomy?.reasonCounts?.cp27_unresolved_references_present === 70 && plan?.blockerTaxonomy?.reasonCounts?.cp27_quality_state_review_required === 38 && plan?.blockerTaxonomy?.reasonCounts?.safety_escalation_required === 8 && plan?.blockerTaxonomy?.reasonCounts?.grade_uncertainty_requires_escalation_review === 7, JSON.stringify(plan?.blockerTaxonomy?.reasonCounts));
expect('Phase plan includes R01-R08', ['CP29-R01', 'CP29-R02', 'CP29-R03', 'CP29-R04', 'CP29-R05', 'CP29-R06', 'CP29-R07', 'CP29-R08'].every((id) => plan?.phasePlan?.some((item) => item.checkpoint === id)), 'R01-R08');
expect('Unlock policy requires regeneration and rerun', plan?.selectedUnlockPolicy?.requiresCp27Regeneration === true && plan?.selectedUnlockPolicy?.requiresCp28Rerun === true && plan?.selectedUnlockPolicy?.ordinaryUnlockExcludesEscalation === true, JSON.stringify(plan?.selectedUnlockPolicy));
expect('Public boundary remains zero', plan?.publicBoundary?.publicSafeRetrievalCandidateCount === 0 && plan?.publicBoundary?.publicSafeRouteItemCount === 0 && plan?.publicBoundary?.publicReleaseApproved === false, JSON.stringify(plan?.publicBoundary));
expect('Generator does not read env files', !generator.includes('.env'), 'no .env');

for (const term of [
  '# CP29 - Retrieval Remediation And Selected-Candidate Unlock Sprint Plan',
  'CP29-R08',
]) expect(`Sprint plan includes ${term}`, sprintPlan.includes(term), term);
expect('Sprint plan status is R01 or later', [
  'Status: CP29-R01 complete; CP29-R02 next',
  'Status: CP29-R02 complete; CP29-R03 next',
  'Status: CP29-R03 complete; CP29-R04 next',
  'Status: CP29-R04 complete; CP29-R05 next',
  'Status: CP29-R05 complete; CP29-R06 next',
  'Status: CP29-R06 complete; CP29-R07 next',
  'Status: CP29-R07 complete; CP29-R08 next',
  'Status: CP29-R08 complete',
].some((status) => sprintPlan.includes(status)), 'R01 or later');

for (const term of [
  '# CP29 - Retrieval Remediation And Selected-Candidate Unlock Acceptance Checklist',
  'CP29-R01-01',
]) expect(`Checklist includes ${term}`, checklist.includes(term), term);
expect('Checklist status is R01 or later', [
  'Status: CP29-R01 complete; CP29-R02 next',
  'Status: CP29-R02 complete; CP29-R03 next',
  'Status: CP29-R03 complete; CP29-R04 next',
  'Status: CP29-R04 complete; CP29-R05 next',
  'Status: CP29-R05 complete; CP29-R06 next',
  'Status: CP29-R06 complete; CP29-R07 next',
  'Status: CP29-R07 complete; CP29-R08 next',
  'Status: CP29-R08 complete',
].some((status) => checklist.includes(status)), 'R01 or later');

expect('Checklist R01 rows pass', ['CP29-R01-01', 'CP29-R01-02', 'CP29-R01-03', 'CP29-R01-04', 'CP29-R01-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'R01 rows pass');
expect('Checklist recommends R02 or later next', [
  'Start `CP29-R02 - Reference And Provenance Repair Plan`',
  'Start `CP29-R03 - Quality Review Burn-Down Plan`',
  'Start `CP29-R04 - Escalation Lane Separation`',
  'Start `CP29-R05 - Regeneration And Diff Proof`',
  'Start `CP29-R06 - Selected-Candidate Unlock Verification`',
  'Start `CP29-R07 - Private Route Readiness Decision`',
  'Start `CP29-R08 - Combined Verification And Close-Out`',
  'Start `CP30 - Private Guidance Loop Integration`',
].some((nextAction) => checklist.includes(nextAction)), 'R02 or later next');

for (const term of [
  '# CP29-R01 - Remediation Architecture And Unlock Baseline',
  'Status: Complete',
  'Current Baseline',
  'Blocker Taxonomy',
  'Unlock Policy',
  'Public Boundary',
  'Status: complete',
]) expect(`R01 report includes ${term}`, report.includes(term), term);

expect('Roadmap records CP28 complete', roadmap.includes('| CP28 retrieval integration from refreshed graph | Complete |'), 'CP28 complete in roadmap');
expect('Roadmap records CP29 supersession', roadmap.includes('CP29 - Retrieval Remediation And Selected-Candidate Unlock'), 'CP29 supersession');
expect('No raw source text bodies are exported', !/(fullText|quranText|hadithText|translationText|tafsirText|draftAnswer|guidedAnswer|snippet)/.test(planText), 'no raw text fields');

for (const check of checks) console.log(`${check.status}: ${check.name} - ${check.evidence}`);
const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP29-R01 remediation unlock verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP29-R01 remediation unlock verification passed.');
