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

runNodeScript('scripts/check_cp29_r02_reference_provenance_repair_plan.mjs');
runNodeScript('scripts/generate_cp29_r03_quality_review_burn_down_plan.mjs');

const planText = readText('data/remediation/cp29/quality-review-burn-down-plan.json');
const plan = planText ? JSON.parse(planText) : null;
const manifestText = readText('data/remediation/cp29/manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const latestText = readText('data/remediation/cp29/latest-remediation.json');
const latest = latestText ? JSON.parse(latestText) : null;
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP29_RETRIEVAL_REMEDIATION_AND_SELECTED_CANDIDATE_UNLOCK_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP29_RETRIEVAL_REMEDIATION_AND_SELECTED_CANDIDATE_UNLOCK_ACCEPTANCE_CHECKLIST.md');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP29_R03_QUALITY_REVIEW_BURN_DOWN_PLAN.md');
const generator = readText('scripts/generate_cp29_r03_quality_review_burn_down_plan.mjs');

expect('CP29-R03 quality plan schema is valid', plan?.schemaVersion === 'cp29.quality-review-burn-down-plan.v1' && plan?.checkpoint === 'CP29-R03', plan?.schemaVersion);
expect('CP29 manifest advances to R03', manifest?.schemaVersion === 'cp29.remediation-manifest.v1' && manifest?.checkpoint === 'CP29-R03', manifest?.checkpoint);
expect('CP29 latest pointer advances to R03', latest?.schemaVersion === 'cp29.latest-remediation-pointer.v1' && latest?.checkpoint === 'CP29-R03', latest?.checkpoint);
expect('Manifest checksum matches R03 plan', manifest?.checksums?.qualityReviewBurnDownPlanSha256 === sha256Text(planText), 'R03 checksum');
expect('Latest checksum matches manifest and R03 plan', latest?.manifestSha256 === sha256Text(manifestText) && latest?.qualityReviewBurnDownPlanSha256 === sha256Text(planText), 'latest checksums');
expect('Quality review candidate count is 38', plan?.baseline?.qualityReviewCandidateCount === 38, JSON.stringify(plan?.baseline));
expect('Quality severity counts are stable', plan?.baseline?.criticalQualityCandidateCount === 15 && plan?.baseline?.highQualityCandidateCount === 23, JSON.stringify(plan?.baseline));
expect('Quality review target count is grouped', plan?.baseline?.reviewTargetCount >= 6 && plan?.reviewTargets?.length === plan?.baseline?.reviewTargetCount, String(plan?.baseline?.reviewTargetCount));
expect('Quality groups include owners', ['knowledge_editor', 'scholar_reviewer', 'technical_reviewer', 'product_owner'].every((owner) => Object.keys(plan?.groupingSummary?.byRecommendedOwner ?? {}).includes(owner)), JSON.stringify(plan?.groupingSummary?.byRecommendedOwner));
expect('Quality groups include severity', plan?.groupingSummary?.bySeverity?.critical === 15 && plan?.groupingSummary?.bySeverity?.high === 23, JSON.stringify(plan?.groupingSummary?.bySeverity));
expect('Quality groups include fixture and source groups', Object.keys(plan?.groupingSummary?.byFixture ?? {}).length === 5 && Object.keys(plan?.groupingSummary?.bySourceGroupKey ?? {}).includes('raw_lineage'), JSON.stringify(plan?.groupingSummary));
expect('Reviewer queues are private handoffs', plan?.reviewerQueues?.length === 4 && plan?.reviewerQueues?.every((queue) => queue.reviewTargetIds?.length > 0 && queue.exitCriteria?.every((criterion) => !criterion.toLowerCase().includes('public release approved'))), JSON.stringify(plan?.reviewerQueues));
expect('Every review target is private and locked', plan?.reviewTargets?.every((target) => target.publicSafe === false && target.publicReleaseApproved === false && target.selectedCandidateUnlockAllowed === false && target.reviewerHandoffRequired === true), 'target locks');
expect('Every review target has operational refs', plan?.reviewTargets?.every((target) => target.candidateIds?.length > 0 && target.graphNodeIds?.length > 0 && target.canonicalRefs?.length > 0 && target.sourceRefs?.length > 0), 'target refs');
expect('Burn-down deltas are measurable but unapplied', plan?.burnDownMetrics?.currentQualityReviewCandidateCount === 38 && plan?.burnDownMetrics?.targetQualityReviewCandidateCountAfterReview === 0 && plan?.burnDownMetrics?.actualDeltaAppliedInR03 === false, JSON.stringify(plan?.burnDownMetrics));
expect('Escalation overlap remains visible', plan?.baseline?.escalationOverlapCandidateCount === 15, JSON.stringify(plan?.baseline));
expect('Unlock remains blocked at R03', plan?.unlockBoundary?.selectedCandidateUnlockAllowed === false && plan?.unlockBoundary?.nextCheckpoint === 'CP29-R04', JSON.stringify(plan?.unlockBoundary));
expect('Public boundary remains zero', plan?.publicBoundary?.publicSafeReviewItemCount === 0 && plan?.publicBoundary?.publicSafeRetrievalCandidateCount === 0 && plan?.publicBoundary?.publicReleaseApproved === false, JSON.stringify(plan?.publicBoundary));
expect('Generator does not read env files', !generator.includes('.env'), 'no .env');
expect('No raw source text bodies are exported', !/(fullText|quranText|hadithText|translationText|tafsirText|draftAnswer|guidedAnswer|snippet)/.test(planText), 'no raw text fields');

for (const term of [
  'Status: Complete. See `CP29_R03_QUALITY_REVIEW_BURN_DOWN_PLAN.md`.',
]) expect(`Sprint plan includes ${term}`, sprintPlan.includes(term), term);
expect('Sprint plan status is R03 or later', [
  'Status: CP29-R03 complete; CP29-R04 next',
  'Status: CP29-R05 complete; CP29-R06 next',
  'Status: CP29-R06 complete; CP29-R07 next',
  'Status: CP29-R07 complete; CP29-R08 next',
  'Status: CP29-R08 complete',
].some((status) => sprintPlan.includes(status)), 'R03 or later');

for (const id of ['CP29-R03-01', 'CP29-R03-02', 'CP29-R03-03', 'CP29-R03-04', 'CP29-R03-05']) {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  expect(`Checklist ${id} passes`, row.includes('| Pass |'), row);
}
expect('Checklist recommends R04 or later next', [
  'Start `CP29-R04 - Escalation Lane Separation`',
  'Start `CP29-R06 - Selected-Candidate Unlock Verification`',
  'Start `CP29-R07 - Private Route Readiness Decision`',
  'Start `CP29-R08 - Combined Verification And Close-Out`',
  'Start `CP30 - Private Guidance Loop Integration`',
].some((nextAction) => checklist.includes(nextAction)), 'R04 or later next');

for (const term of [
  '# CP29-R03 - Quality Review Burn-Down Plan',
  'Status: Complete',
  'Quality Review Scope',
  'Reviewer Queues',
  'Burn-Down Boundary',
  'Public Boundary',
  'Status: complete',
]) expect(`R03 report includes ${term}`, report.includes(term), term);

for (const check of checks) console.log(`${check.status}: ${check.name} - ${check.evidence}`);
const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP29-R03 quality review burn-down verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP29-R03 quality review burn-down verification passed.');
