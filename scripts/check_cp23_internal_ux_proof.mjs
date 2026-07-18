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

function readText(path) {
  if (!existsSync(path)) {
    fail(`File exists: ${path}`, 'Missing.');
    return '';
  }
  pass(`File exists: ${path}`, 'Found.');
  return readFileSync(path, 'utf8');
}

function readJson(path) {
  const text = readText(path);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`Parse JSON: ${path}`, error instanceof Error ? error.message : String(error));
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
    fail(`Run ${scriptPath}`, result.stdout + result.stderr);
  }
}

function viewportPass(viewport) {
  return Boolean(
    viewport?.privateRibbon &&
      viewport?.reviewerWorkbench &&
      viewport?.compactNav &&
      viewport?.boundaryBand &&
      viewport?.verifierPanel &&
      viewport?.candidatesPanel &&
      viewport?.evidenceRoutePanel &&
      viewport?.reviewerQueuePanel &&
      viewport?.remediationAuditPanel &&
      viewport?.exportPanel &&
      viewport?.publicBlocked &&
      viewport?.apiRouteProof &&
      viewport?.uiRouteProof &&
      viewport?.verifierProof &&
      viewport?.errorOverlay === false &&
      viewport?.horizontalOverflow === false &&
      Array.isArray(viewport?.protruding) &&
      viewport.protruding.length === 0 &&
      Array.isArray(viewport?.consoleErrors) &&
      viewport.consoleErrors.length === 0
  );
}

runNodeScript('scripts/check_cp23_combined_verification.mjs');

const evidence = readJson('docs/09_sprints/resource_audit_import_prototype/artifacts/cp23_a09_ux_evidence.json');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP23_A09_INTERNAL_UX_PROOF_REPORT.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP23_RETRIEVAL_INTEGRATION_AND_REVIEWER_WORKFLOW_ACCEPTANCE_CHECKLIST.md');
const nav = readText('apps/mobile/src/components/RafiqNavigationBar.tsx');
const shell = readText('apps/mobile/src/components/PrivateWorkspaceShell.tsx');
const workbench = readText('apps/mobile/app/review-workbench.tsx');

expect('A09 evidence checkpoint is correct', evidence?.checkpoint === 'CP23-A09', evidence?.checkpoint);
expect('A09 evidence overall pass', evidence?.acceptance?.pass === true, JSON.stringify(evidence?.acceptance));
expect('A09 desktop browser proof passes', viewportPass(evidence?.desktop), JSON.stringify(evidence?.desktop?.viewport));
expect('A09 mobile browser proof passes', viewportPass(evidence?.mobile), JSON.stringify(evidence?.mobile?.viewport));
expect(
  'A09 public exposure check blocks route',
  evidence?.publicExposure?.routeType === 'unmatched-route' &&
    evidence?.publicExposure?.exposesReviewerWorkbench === false &&
    evidence?.publicExposure?.publicBlockedBannerVisible === false,
  JSON.stringify(evidence?.publicExposure),
);
expect(
  'A09 screenshots exist',
  existsSync('docs/09_sprints/resource_audit_import_prototype/artifacts/cp23_a09_review_workbench_desktop.png') &&
    existsSync('docs/09_sprints/resource_audit_import_prototype/artifacts/cp23_a09_review_workbench_mobile.png'),
  'desktop and mobile screenshots',
);
expect('A09 report records pass status', report.includes('Status: Pass'), 'Status: Pass');
expect('A09 report records private-only boundary', report.includes('No public CP23 review-workbench route is exposed'), 'public route blocked');
expect('A09 checklist pass row exists', checklist.includes('| CP23-A09 | Internal UX proof is complete. | Pass |'), 'CP23-A09 Pass');
expect(
  'A09 overall checklist status updated',
  checklist.includes('CP23-A02 through CP23-A09 complete; CP23-A10 pending') ||
    checklist.includes('Status: CP23 complete; recommended next scope CP24'),
  'A09 complete or CP23 complete',
);
expect('Internal nav uses compact labels', nav.includes("['Work', '/review-workbench']") && nav.includes("['Graph', '/knowledge-graphify']"), 'Work/Graph labels');
expect('Internal nav brand stacks tagline separately', nav.includes('<View style={styles.brandBlock}>') && nav.includes('<Text style={styles.brandTagline}>{subtitle}</Text>'), 'brand/tagline separation');
expect('Private shell hero action can wrap safely', shell.includes('flexBasis: 0') && shell.includes('flexShrink: 0'), 'hero flex constraints');
expect('Workbench still renders CP23 panels', workbench.includes('Graph-Aware Candidates') && workbench.includes('A07 Export Proof'), 'CP23 panels');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP23-A09 internal UX proof failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP23-A09 internal UX proof passed.');
