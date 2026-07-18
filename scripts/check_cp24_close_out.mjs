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

runNodeScript('scripts/check_cp24_combined_verification.mjs');

const closeOut = readText('docs/09_sprints/resource_audit_import_prototype/CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_ACCEPTANCE_CHECKLIST.md');
const manifest = readJson('data/retrieval/cp24/manifest.json');
const ranking = readJson('data/retrieval/cp24/ranking-selection.json');
const handoff = readJson('data/retrieval/cp24/validation-handoff.json');
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const mobileScreen = readText('apps/mobile/app/graph-aware-retrieval.tsx');

expect('G09 report records pass status', closeOut.includes('Status: Complete'), 'Status: Complete');
expect('G09 report declares CP24 complete', closeOut.includes('CP24 is complete'), 'CP24 complete');
expect('G09 report keeps public release blocked', closeOut.includes('Public release remains blocked'), 'public release blocked');
expect('G09 report chooses CP25 next', closeOut.includes('Recommended next scope: CP25 - Reviewer Workbench Action Workflow'), 'CP25 selected');
expect('G09 report defers CP26/CP27/CP28 sequencing', closeOut.includes('CP26') && closeOut.includes('CP27') && closeOut.includes('CP28'), 'CP26/CP27/CP28 present');
expect('G09 report lists known limitations', closeOut.includes('Known Limitations'), 'Known Limitations');
expect('G09 report lists handoff commands', closeOut.includes('node scripts\\check_cp24_close_out.mjs'), 'close-out verifier command');

expect('Sprint plan marks CP24 complete', sprintPlan.includes('Status: CP24 complete; recommended next scope CP25'), 'sprint status');
expect('Sprint plan marks G09 complete', sprintPlan.includes('Status: Complete. See `CP24_G09_CLOSE_OUT_AND_NEXT_SCOPE_DECISION.md`'), 'G09 status');
expect('Sprint plan recommends CP25', sprintPlan.includes('CP25 - Reviewer Workbench Action Workflow'), 'CP25 next');
expect('Checklist marks CP24 complete', checklist.includes('Status: CP24 complete; recommended next scope CP25'), 'checklist status');
expect('Checklist G09 rows pass', ['CP24-G09-01', 'CP24-G09-02', 'CP24-G09-03', 'CP24-G09-04', 'CP24-G09-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G09 rows pass');
expect('Checklist recommends CP25', checklist.includes('Start `CP25 - Reviewer Workbench Action Workflow`'), 'CP25 next');

expect('CP24 manifest remains private-only', manifest?.privateOnly === true && manifest?.publicReleaseApproved === false, JSON.stringify({ privateOnly: manifest?.privateOnly, publicReleaseApproved: manifest?.publicReleaseApproved }));
expect(
  'CP24 artifact counts remain stable',
  manifest?.counts?.fixtureCount === 10 &&
    manifest?.counts?.rankingSelection?.selectedCandidateCount === 15 &&
    manifest?.counts?.rankingSelection?.publicSafeCandidateCount === 0,
  JSON.stringify(manifest?.counts),
);
expect('CP24 ranking final summary remains stable', ranking?.summary?.ordinaryAverageScore === 62.86 && ranking?.summary?.requiresEscalationCandidateCount === 13 && ranking?.summary?.prohibitedInferenceFindingCount === 0, JSON.stringify(ranking?.summary));
expect('CP24 handoff keeps remediation private', handoff?.summary?.remediationCount === 72 && handoff?.summary?.publicSafeRouteItemCount === 0, JSON.stringify(handoff?.summary));
expect('CP24 handoff public boundary remains blocked', handoff?.publicBoundary?.privateOnly === true && handoff?.publicBoundary?.publicRouteExposed === false && handoff?.publicBoundary?.publicReleaseApproved === false, JSON.stringify(handoff?.publicBoundary));
expect('Private API route remains private POST only', controller.includes("@Controller('private-content')") && controller.includes("@Post('graph-aware-retrieval/cp24')") && !controller.includes("@Get('graph-aware-retrieval/cp24')"), 'private POST only');
expect('Internal UI remains private inspection surface', mobileScreen.includes('PrivateModeRibbon') && mobileScreen.includes('Public release blocked') && mobileScreen.includes('Reviewer Handoff'), 'internal UI boundary');
expect('No env file path access introduced', !/['"]\.env/.test(`${closeOut}\n${sprintPlan}\n${checklist}\n${controller}\n${mobileScreen}`), 'no .env file access');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP24-G09 close-out verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP24-G09 close-out verification passed.');
