#!/usr/bin/env node
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

runNodeScript('scripts/check_cp25_a08_combined_verification.mjs');

const closeOut = readText('docs/09_sprints/resource_audit_import_prototype/CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md');
const a07Manifest = readJson('data/review/cp25/a07-export-manifest.json');
const a03Manifest = readJson('data/review/cp25/manifest.json');
const a04Manifest = readJson('data/review/cp25/audit-decision-ledger-manifest.json');
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const reviewWorkbench = readText('apps/mobile/app/review-workbench.tsx');

expect('A09 report records complete status', closeOut.includes('Status: Complete'), 'Status: Complete');
expect('A09 report declares CP25 complete', closeOut.includes('CP25 is complete'), 'CP25 complete');
expect('A09 report keeps public release blocked', closeOut.includes('Public release remains blocked'), 'public release blocked');
expect('A09 report chooses CP26 next', closeOut.includes('Recommended next scope: CP26 - Live Snapshot Export And Refresh'), 'CP26 selected');
expect('A09 report defers CP27 and CP28', closeOut.includes('CP27 - Public Release Gate Simulation') && closeOut.includes('CP28 - Approved Public Study Pack Track'), 'CP27/CP28 deferred');
expect('A09 report lists known limitations', closeOut.includes('Known Limitations') && closeOut.includes('does not persist reviewer actions into a database'), 'Known Limitations');
expect('A09 report lists handoff commands', closeOut.includes('node scripts\\check_cp25_a09_close_out.mjs') && closeOut.includes('node scripts\\check_cp25_a08_combined_verification.mjs'), 'handoff commands');

for (const term of [
  'CP25-A01 - Action Workflow Architecture And Case Matrix',
  'CP25-A02 - Request, Response, And State Contracts',
  'CP25-A03 - Review Queue And Remediation State Export',
  'CP25-A04 - Audit Event And Decision Ledger',
  'CP25-A05 - Private API Prototype',
  'CP25-A06 - Internal UI Action Controls',
  'CP25-A07 - Audit Export And Remediation Review Proof',
  'CP25-A08 - Combined Verification',
  'CP25-A09 - Close-Out And Next Scope Decision',
]) {
  expect(`A09 report includes delivered checkpoint ${term}`, closeOut.includes(term), term);
}

expect('Sprint plan marks CP25 complete and CP26 next', sprintPlan.includes('Status: CP25 complete; recommended next scope CP26'), 'sprint status');
expect('Sprint plan marks A09 complete', sprintPlan.includes('Status: Complete. See `CP25_A09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`'), 'A09 status');
expect('Sprint plan recommends CP26', sprintPlan.includes('CP26 - Live Snapshot Export And Refresh'), 'CP26 next');
expect('Checklist marks CP25 complete and CP26 next', checklist.includes('Status: CP25 complete; recommended next scope CP26'), 'checklist status');
expect('Checklist A09 rows pass', ['CP25-A09-01', 'CP25-A09-02', 'CP25-A09-03', 'CP25-A09-04', 'CP25-A09-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'A09 rows pass');
expect('Checklist recommends CP26', checklist.includes('Start `CP26 - Live Snapshot Export And Refresh`'), 'CP26 next');

expect('CP25 A03 counts stable', a03Manifest?.counts?.queueItemCount === 72 && a03Manifest?.counts?.remediationStateCount === 72 && a03Manifest?.counts?.publicSafeCandidateCount === 0, JSON.stringify(a03Manifest?.counts));
expect('CP25 A04 counts stable', a04Manifest?.counts?.auditEventCount === 72 && a04Manifest?.counts?.decisionLedgerEntryCount === 72 && a04Manifest?.counts?.publicReleaseApprovedEventCount === 0, JSON.stringify(a04Manifest?.counts));
expect('CP25 A07 final counts stable', a07Manifest?.counts?.auditExportEventCount === 72 && a07Manifest?.counts?.remediationTransitionCount === 72 && a07Manifest?.counts?.unresolvedActionCount === 66 && a07Manifest?.counts?.openBlockingCount === 12, JSON.stringify(a07Manifest?.counts));
expect('CP25 public-safe counts remain zero', ['publicSafeCandidateCount', 'publicSafeRouteItemCount', 'publicSafeGraphNodeCount', 'publicSafeGraphEdgeCount', 'publicSafeVaultArtifactCount'].every((key) => a07Manifest?.counts?.[key] === 0), JSON.stringify(a07Manifest?.counts));
expect('CP25 API remains private only', controller.includes("@Controller('private-content')") && controller.includes("@Get('reviewer-workbench/cp25')") && controller.includes("@Post('reviewer-workbench/cp25/actions')") && !controller.includes('public-content/reviewer-workbench/cp25'), 'private CP25 routes');
expect('CP25 UI remains private workbench surface', reviewWorkbench.includes('PrivateModeRibbon') && reviewWorkbench.includes('Public release blocked') && reviewWorkbench.includes('CP25 Reviewer Actions'), 'private UI');
expect('No env file path access introduced', !/['"]\.env/.test(`${closeOut}\n${sprintPlan}\n${checklist}\n${controller}\n${reviewWorkbench}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP25-A09 close-out verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP25-A09 close-out verification passed.');
