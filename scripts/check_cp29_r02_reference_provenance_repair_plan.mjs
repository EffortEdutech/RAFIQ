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

runNodeScript('scripts/check_cp29_r01_remediation_unlock_plan.mjs');
runNodeScript('scripts/generate_cp29_r02_reference_provenance_repair_plan.mjs');

const repairPlanText = readText('data/remediation/cp29/reference-provenance-repair-plan.json');
const repairPlan = repairPlanText ? JSON.parse(repairPlanText) : null;
const r01PlanText = readText('data/remediation/cp29/remediation-unlock-plan.json');
const manifestText = readText('data/remediation/cp29/manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const latestText = readText('data/remediation/cp29/latest-remediation.json');
const latest = latestText ? JSON.parse(latestText) : null;
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP29_RETRIEVAL_REMEDIATION_AND_SELECTED_CANDIDATE_UNLOCK_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP29_RETRIEVAL_REMEDIATION_AND_SELECTED_CANDIDATE_UNLOCK_ACCEPTANCE_CHECKLIST.md');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP29_R02_REFERENCE_AND_PROVENANCE_REPAIR_PLAN.md');
const generator = readText('scripts/generate_cp29_r02_reference_provenance_repair_plan.mjs');

expect('CP29-R02 repair plan schema is valid', repairPlan?.schemaVersion === 'cp29.reference-provenance-repair-plan.v1' && repairPlan?.checkpoint === 'CP29-R02', repairPlan?.schemaVersion);
expect('CP29 manifest advances to R02', manifest?.schemaVersion === 'cp29.remediation-manifest.v1' && manifest?.checkpoint === 'CP29-R02', manifest?.checkpoint);
expect('CP29 latest pointer advances to R02', latest?.schemaVersion === 'cp29.latest-remediation-pointer.v1' && latest?.checkpoint === 'CP29-R02', latest?.checkpoint);
expect('Manifest checksum matches R02 repair plan', manifest?.checksums?.referenceProvenanceRepairPlanSha256 === sha256Text(repairPlanText), 'R02 checksum');
expect('Latest checksum matches manifest and R02 repair plan', latest?.manifestSha256 === sha256Text(manifestText) && latest?.referenceProvenanceRepairPlanSha256 === sha256Text(repairPlanText), 'latest checksums');
expect('Manifest preserves R01 baseline checksum', manifest?.checksums?.remediationUnlockPlanSha256 === sha256Text(r01PlanText), 'R01 checksum');
expect('Target reason families are scoped to R02', ['cp27_unresolved_references_present', 'source_or_provenance_gap_fixture'].every((reason) => repairPlan?.targetReasonFamilies?.includes(reason)) && repairPlan?.targetReasonFamilies?.length === 2, JSON.stringify(repairPlan?.targetReasonFamilies));
expect('Reference repair candidate count is 70', repairPlan?.baseline?.referenceRepairCandidateCount === 70, JSON.stringify(repairPlan?.baseline));
expect('Source/provenance gap candidate count is 8', repairPlan?.baseline?.sourceProvenanceGapCandidateCount === 8, JSON.stringify(repairPlan?.baseline));
expect('Repair targets are grouped', repairPlan?.baseline?.repairTargetCount >= 10 && repairPlan?.repairTargets?.length === repairPlan?.baseline?.repairTargetCount, String(repairPlan?.baseline?.repairTargetCount));
expect('Targets include graph partition grouping', Object.keys(repairPlan?.groupingSummary?.byGraphPartition ?? {}).length >= 6, JSON.stringify(repairPlan?.groupingSummary?.byGraphPartition));
expect('Targets include source group grouping', Object.keys(repairPlan?.groupingSummary?.bySourceGroupKey ?? {}).includes('raw_lineage'), JSON.stringify(repairPlan?.groupingSummary?.bySourceGroupKey));
expect('Every repair target is private and locked', repairPlan?.repairTargets?.every((target) => target.publicSafe === false && target.publicReleaseApproved === false && target.selectedCandidateUnlockAllowed === false && target.regenerationRequired === true), 'target locks');
expect('Every repair target has operational refs', repairPlan?.repairTargets?.every((target) => target.candidateIds?.length > 0 && target.graphNodeIds?.length > 0 && target.canonicalRefs?.length > 0 && target.sourceRefs?.length > 0), 'target refs');
expect('Regeneration plan covers CP26 through CP29-R05', ['CP26', 'CP27', 'CP28', 'CP29-R05'].every((checkpoint) => repairPlan?.regenerationPlan?.some((step) => step.checkpoint === checkpoint)), JSON.stringify(repairPlan?.regenerationPlan));
expect('Unlock remains blocked at R02', repairPlan?.unlockBoundary?.selectedCandidateUnlockAllowed === false && repairPlan?.unlockBoundary?.nextCheckpoint === 'CP29-R03', JSON.stringify(repairPlan?.unlockBoundary));
expect('Public boundary remains zero', repairPlan?.publicBoundary?.publicSafeRetrievalCandidateCount === 0 && repairPlan?.publicBoundary?.publicSafeRouteItemCount === 0 && repairPlan?.publicBoundary?.publicReleaseApproved === false, JSON.stringify(repairPlan?.publicBoundary));
expect('Generator does not read env files', !generator.includes('.env'), 'no .env');
expect('No raw source text bodies are exported', !/(fullText|quranText|hadithText|translationText|tafsirText|draftAnswer|guidedAnswer|snippet)/.test(repairPlanText), 'no raw text fields');

for (const term of [
  'Status: Complete. See `CP29_R02_REFERENCE_AND_PROVENANCE_REPAIR_PLAN.md`.',
]) expect(`Sprint plan includes ${term}`, sprintPlan.includes(term), term);
expect('Sprint plan status is R02 or later', [
  'Status: CP29-R02 complete; CP29-R03 next',
  'Status: CP29-R03 complete; CP29-R04 next',
  'Status: CP29-R04 complete; CP29-R05 next',
  'Status: CP29-R05 complete; CP29-R06 next',
  'Status: CP29-R06 complete; CP29-R07 next',
  'Status: CP29-R07 complete; CP29-R08 next',
  'Status: CP29-R08 complete',
].some((status) => sprintPlan.includes(status)), 'R02 or later');

for (const id of ['CP29-R02-01', 'CP29-R02-02', 'CP29-R02-03', 'CP29-R02-04', 'CP29-R02-05']) {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  expect(`Checklist ${id} passes`, row.includes('| Pass |'), row);
}
expect('Checklist recommends R03 or later next', [
  'Start `CP29-R03 - Quality Review Burn-Down Plan`',
  'Start `CP29-R04 - Escalation Lane Separation`',
  'Start `CP29-R05 - Regeneration And Diff Proof`',
  'Start `CP29-R06 - Selected-Candidate Unlock Verification`',
  'Start `CP29-R07 - Private Route Readiness Decision`',
  'Start `CP29-R08 - Combined Verification And Close-Out`',
  'Start `CP30 - Private Guidance Loop Integration`',
].some((nextAction) => checklist.includes(nextAction)), 'R03 or later next');

for (const term of [
  '# CP29-R02 - Reference And Provenance Repair Plan',
  'Status: Complete',
  'Reference Repair Scope',
  'Source And Provenance Gap Scope',
  'Regeneration Boundary',
  'Public Boundary',
  'Status: complete',
]) expect(`R02 report includes ${term}`, report.includes(term), term);

for (const check of checks) console.log(`${check.status}: ${check.name} - ${check.evidence}`);
const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP29-R02 reference/provenance repair verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP29-R02 reference/provenance repair verification passed.');
