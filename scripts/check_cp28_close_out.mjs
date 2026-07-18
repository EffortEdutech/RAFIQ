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
  if (result.status === 0) pass(`Run ${scriptPath}`, result.stdout.trim().split(/\r?\n/).at(-1) || 'ok');
  else fail(`Run ${scriptPath}`, `${result.stdout}${result.stderr}`);
}

runNodeScript('scripts/check_cp28_combined_verification.mjs');

const closeOut = readText('docs/09_sprints/resource_audit_import_prototype/CP28_R07_CLOSE_OUT.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP28_RETRIEVAL_ENGINE_INTEGRATION_FROM_REFRESHED_GRAPH_ACCEPTANCE_CHECKLIST.md');
const manifest = readJson('data/retrieval/cp28/manifest.json');
const verification = readJson('data/retrieval/cp28/combined-verification.json');

expect('Close-out report records complete status', closeOut.includes('Status: Complete') && closeOut.includes('CP28 is complete'), 'complete status');
expect('Close-out keeps public release blocked', closeOut.includes('Public release remains blocked'), 'public blocked');
expect('Close-out records known limitations', closeOut.includes('Known Limitations'), 'known limitations');
expect('Close-out selects CP29 next', closeOut.includes('Recommended next scope: CP29 - Retrieval Remediation And Selected-Candidate Unlock'), 'CP29 selected');
expect('Close-out records final proof command', closeOut.includes('node scripts\\check_cp28_close_out.mjs'), 'proof command');
expect('Sprint plan marks CP28 complete', sprintPlan.includes('Status: CP28 complete; recommended next scope CP29'), 'sprint status');
expect('Checklist marks CP28 complete', checklist.includes('Status: CP28 complete; recommended next scope CP29'), 'checklist status');
expect('Checklist R07 rows pass', ['CP28-R07-01', 'CP28-R07-02', 'CP28-R07-03', 'CP28-R07-04', 'CP28-R07-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'R07 rows pass');
expect('Checklist recommends CP29 next', checklist.includes('Start `CP29 - Retrieval Remediation And Selected-Candidate Unlock`'), 'CP29 next');
expect('Manifest remains private-only and at R06 artifact state', manifest?.checkpoint === 'CP28-R06' && manifest?.privateOnly === true && manifest?.publicReleaseApproved === false, JSON.stringify({ checkpoint: manifest?.checkpoint, privateOnly: manifest?.privateOnly }));
expect('Combined verification remains passing', verification?.checkpoint === 'CP28-R06' && verification?.checks?.every((check) => check.status === 'pass'), JSON.stringify(verification?.checks));
expect('Final counts remain stable', verification?.cp28Results?.candidateCount === 70 && verification?.cp28Results?.selectedCandidateCount === 0 && verification?.cp28Results?.selectedRouteItemCount === 0 && verification?.cp28Results?.remediationCount === 70, JSON.stringify(verification?.cp28Results));
expect('Public boundary remains zero', verification?.cp28Results?.publicSafeCandidateCount === 0 && verification?.cp28Results?.publicSafeRouteItemCount === 0 && verification?.publicBoundary?.publicRouteExposed === false, JSON.stringify(verification?.publicBoundary));
expect('No env file path access introduced', !/['"]\.env/.test(`${closeOut}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) console.log(`${check.status}: ${check.name} - ${check.evidence}`);
const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP28-R07 close-out verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP28-R07 close-out verification passed.');
