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

runNodeScript('scripts/check_cp23_internal_ux_proof.mjs');

const closeOut = readText('docs/09_sprints/resource_audit_import_prototype/CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP23_RETRIEVAL_INTEGRATION_AND_REVIEWER_WORKFLOW_ACCEPTANCE_CHECKLIST.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP23_RETRIEVAL_INTEGRATION_AND_REVIEWER_WORKFLOW_SPRINT_PLAN.md');
const cp22CloseOut = readText('docs/09_sprints/resource_audit_import_prototype/CP22_G10_CLOSE_OUT_REPORT.md');
const a09Evidence = readJson('docs/09_sprints/resource_audit_import_prototype/artifacts/cp23_a09_ux_evidence.json');
const reviewerManifest = readJson('data/review/cp23/manifest.json');

expect('A10 report records pass status', closeOut.includes('Status: Complete'), 'Status: Complete');
expect('A10 report declares CP23 complete', closeOut.includes('CP23 is complete'), 'CP23 complete');
expect('A10 report keeps public release blocked', closeOut.includes('Public release remains blocked'), 'public release blocked');
expect('A10 report chooses CP24 next', closeOut.includes('Recommended next scope: CP24 - Graph-Aware Retrieval Prototype'), 'CP24 selected');
expect('A10 report defers CP25/CP26 sequencing', closeOut.includes('CP25') && closeOut.includes('CP26'), 'CP25/CP26 present');
expect('A10 report lists known limitations', closeOut.includes('Known Limitations'), 'Known Limitations');
expect('A10 report lists handoff commands', closeOut.includes('node scripts\\check_cp23_close_out.mjs'), 'close-out verifier command');

expect('Checklist marks A10 pass', checklist.includes('| CP23-A10 | Close-out and next scope decision are complete. | Pass |'), 'CP23-A10 Pass');
expect('Checklist marks full CP23 complete', checklist.includes('Status: CP23 complete; recommended next scope CP24'), 'CP23 complete status');
expect('Checklist recommends CP24', checklist.includes('Proceed to CP24 - Graph-Aware Retrieval Prototype'), 'CP24 next');
expect('Sprint plan marks CP23 complete', sprintPlan.includes('Status: CP23 complete; recommended next scope CP24'), 'sprint plan complete');
expect('Sprint plan marks A10 complete', sprintPlan.includes('Status: Complete. See `CP23_A10_CLOSE_OUT_AND_NEXT_SCOPE_DECISION_REPORT.md`'), 'A10 status');
expect(
  'CP22 baseline remains private',
  (cp22CloseOut.includes('Graph public-safe nodes | 0') || cp22CloseOut.includes('zero public-safe graph nodes')) &&
    (cp22CloseOut.includes('Vault public-safe artifacts | 0') || cp22CloseOut.includes('zero public-safe vault artifacts')),
  'CP22 zero public-safe',
);
expect('A09 browser evidence still passes', a09Evidence?.acceptance?.pass === true, JSON.stringify(a09Evidence?.acceptance));
expect('Reviewer exports remain private-only', reviewerManifest?.privateOnly === true && reviewerManifest?.publicReleaseApproved === false, JSON.stringify({ privateOnly: reviewerManifest?.privateOnly, publicReleaseApproved: reviewerManifest?.publicReleaseApproved }));
expect('Reviewer export blockers remain visible', Number(reviewerManifest?.counts?.openBlockingRemediationItems ?? 0) > 0, String(reviewerManifest?.counts?.openBlockingRemediationItems));

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP23-A10 close-out verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP23-A10 close-out verification passed.');
