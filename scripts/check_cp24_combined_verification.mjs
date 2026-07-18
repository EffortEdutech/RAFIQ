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

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
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

function allPublicSafeFalse(items) {
  return items.every((item) => item?.publicSafe === false);
}

runNodeScript('scripts/check_cp22_combined_verification.mjs');
runNodeScript('scripts/check_cp23_close_out.mjs');
runNodeScript('scripts/check_cp23_combined_verification.mjs');
runNodeScript('scripts/check_cp24_g07_internal_ui_prototype.mjs');
runNodeScript('scripts/check_cp24_graph_aware_retrieval_plan.mjs');

const manifestText = readText('data/retrieval/cp24/manifest.json');
const rankingText = readText('data/retrieval/cp24/ranking-selection.json');
const handoffText = readText('data/retrieval/cp24/validation-handoff.json');
const cp22GraphManifest = readJson('data/graphify/full-private/manifest.json');
const cp22VaultManifest = readJson('data/vault/full-private/manifest.json');
const manifest = manifestText ? JSON.parse(manifestText) : null;
const ranking = rankingText ? JSON.parse(rankingText) : null;
const handoff = handoffText ? JSON.parse(handoffText) : null;
const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const service = readText('apps/api/src/modules/private-content/private-content.service.ts');
const openapi = readText('apps/api/src/modules/private-content/private-content.openapi.ts');
const mobileApi = readText('apps/mobile/src/services/privateContentApi.ts');
const mobileScreen = readText('apps/mobile/app/graph-aware-retrieval.tsx');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_ACCEPTANCE_CHECKLIST.md');
const g08Doc = readText('docs/09_sprints/resource_audit_import_prototype/CP24_G08_COMBINED_VERIFICATION.md');

expect('CP24 manifest remains private', manifest?.privateOnly === true && manifest?.publicReleaseApproved === false, 'private manifest');
expect('CP24 manifest points to G05 artifacts', manifest?.artifactPaths?.rankingSelection === 'data/retrieval/cp24/ranking-selection.json' && manifest?.artifactPaths?.validationHandoff === 'data/retrieval/cp24/validation-handoff.json', 'artifact paths');
expect('CP24 ranking checksum matches manifest', manifest?.checksums?.rankingSelectionSha256 === sha256(rankingText), 'ranking checksum');
expect('CP24 handoff checksum matches manifest', manifest?.checksums?.validationHandoffSha256 === sha256(handoffText), 'handoff checksum');
expect('CP24 fixture and route counts are stable', ranking?.summary?.fixtureCount === 10 && handoff?.summary?.evidenceRouteCount === 10, `${ranking?.summary?.fixtureCount}/${handoff?.summary?.evidenceRouteCount}`);
expect('CP24 selected evidence remains bounded', ranking?.summary?.selectedCandidateCount === 15 && handoff?.summary?.selectedRouteItemCount === 15, `${ranking?.summary?.selectedCandidateCount}/${handoff?.summary?.selectedRouteItemCount}`);
expect('CP24 escalation remains separated', ranking?.summary?.requiresEscalationCandidateCount === 13 && ranking?.summary?.escalationOutcomeCount === 13 && handoff?.summary?.escalationOutcomeCount === 2, 'escalation split');
expect('CP24 ordinary average remains stable', ranking?.summary?.ordinaryAverageScore === 62.86, String(ranking?.summary?.ordinaryAverageScore));
expect('CP24 public-safe counts remain zero', manifest?.counts?.publicSafeCandidateCount === 0 && ranking?.summary?.publicSafeCandidateCount === 0 && handoff?.summary?.publicSafeRouteItemCount === 0, 'zero CP24 public-safe');
expect('CP24 prohibited inference scan remains clean', ranking?.summary?.prohibitedInferenceFindingCount === 0 && ranking?.prohibitedInferenceScan?.status === 'pass', 'prohibited inference pass');

const candidates = (ranking?.fixtures ?? []).flatMap((fixture) => fixture.rankedCandidates ?? []);
const selectedCandidates = candidates.filter((candidate) => candidate.selectionState === 'selected');
const routeItems = (handoff?.routes ?? []).flatMap((route) => [
  ...(route.evidenceRoute?.selectedEvidence ?? []),
  ...(route.evidenceRoute?.rejectedEvidence ?? []),
  ...(route.evidenceRoute?.escalationEvidence ?? []),
]);
expect('Selected candidates have source/provenance/release refs', selectedCandidates.every((candidate) => candidate.sourceIds?.length > 0 && candidate.provenanceIds?.length > 0 && candidate.releaseStateIds?.length > 0), 'selected refs complete');
expect('Route items remain graph/vault bounded', routeItems.length === 87 && routeItems.every((item) => item.graphNodeIds?.length <= 40 && item.graphEdgeIds?.length <= 80 && item.vaultPackIds?.length <= 8), `${routeItems.length} route items`);
expect('Validation handoff gates are complete', (handoff?.routes ?? []).every((route) => route.evidenceRoute?.validationGateResults?.length === 11), '11 gates per route');
expect('Remediation items remain private', (handoff?.remediationItems ?? []).length === 72 && (handoff?.remediationItems ?? []).every((item) => item.publicReleaseApproved === false), '72 private remediation items');
expect('CP22 graph/vault IDs match CP24 source proof', cp22GraphManifest?.graphId === manifest?.sourceGraph?.graphId && cp22VaultManifest?.vaultId === manifest?.sourceVault?.vaultId, 'source graph/vault IDs');
expect('CP22 graph/vault public-safe counts remain zero', cp22GraphManifest?.counts?.publicSafeNodes === 0 && cp22GraphManifest?.counts?.publicSafeEdges === 0 && cp22VaultManifest?.counts?.publicSafeArtifacts === 0, 'zero CP22 public-safe');
expect('CP24 API route is private POST only', controller.includes("@Post('graph-aware-retrieval/cp24')") && controller.includes("@Controller('private-content')") && !controller.includes("@Get('graph-aware-retrieval/cp24')"), 'private POST only');
expect('No public CP24 route exists', !controller.includes("@Controller('public") && !controller.includes('public-content/graph-aware-retrieval') && !mobileApi.includes('/api/public/graph-aware-retrieval'), 'no public route');
expect('CP24 service preserves bounded response', service.includes('CP24_DEFAULT_OUTPUT_CAPS') && service.includes('slice(offset, offset + candidateLimit)') && service.includes('publicRouteExposed: false'), 'bounded service');
expect('CP24 OpenAPI and mobile client exist', openapi.includes('PrivateCp24GraphAwareRetrievalResponseDto') && mobileApi.includes('createGraphAwareRetrievalCp24'), 'OpenAPI/mobile client');
expect('CP24 UI exposes internal inspection panels', mobileScreen.includes('Fixture Selector') && mobileScreen.includes('Candidate Ranking') && mobileScreen.includes('Evidence Route') && mobileScreen.includes('Validation Handoff') && mobileScreen.includes('Reviewer Handoff'), 'UI panels');
expect('CP24 UI shows public boundary', mobileScreen.includes('Public release blocked') && mobileScreen.includes('publicBoundary.publicRouteExposed'), 'UI public boundary');
expect('No env file path access introduced', !/['"]\.env/.test(`${controller}\n${service}\n${openapi}\n${mobileApi}\n${mobileScreen}`), 'no .env file access');
expect('CP24 generated candidates are not public safe', allPublicSafeFalse(candidates), 'candidate publicSafe false');
expect('CP24 public boundary artifact remains false', handoff?.publicBoundary?.privateOnly === true && handoff?.publicBoundary?.publicRouteExposed === false && handoff?.publicBoundary?.publicReleaseApproved === false, 'handoff public boundary');

for (const term of [
  '# CP24-G08 - Combined Verification',
  'Status: Complete',
  'Combined Verifier',
  'Inherited Checks',
  'Boundary Checks',
  'Current Results',
  'Public Boundary',
  'Status: complete',
]) {
  expect(`G08 doc includes: ${term}`, g08Doc.includes(term), term);
}

const sprintHasG08Complete = sprintPlan.includes('Status: CP24-G08 complete; CP24-G09 pending');
const sprintHasCp24Complete = sprintPlan.includes('Status: CP24 complete; recommended next scope CP25');
expect('Sprint plan is at or beyond G08 complete', sprintHasG08Complete || sprintHasCp24Complete, sprintHasCp24Complete ? 'CP24 complete' : 'G08 complete');
expect('Sprint plan points to G08 report', sprintPlan.includes('CP24_G08_COMBINED_VERIFICATION.md'), 'G08 report linked');
const checklistHasG08Complete = checklist.includes('Status: CP24-G08 complete; CP24-G09 pending');
const checklistHasCp24Complete = checklist.includes('Status: CP24 complete; recommended next scope CP25');
expect('Checklist is at or beyond G08 complete', checklistHasG08Complete || checklistHasCp24Complete, checklistHasCp24Complete ? 'CP24 complete' : 'G08 complete');
expect('Checklist G08 rows pass', ['CP24-G08-01', 'CP24-G08-02', 'CP24-G08-03', 'CP24-G08-04', 'CP24-G08-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G08 rows pass');
expect('Checklist includes a valid post-G08 next action', checklist.includes('Start `CP24-G09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP25 - Reviewer Workbench Action Workflow`'), checklistHasCp24Complete ? 'CP25 next' : 'G09 next');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP24-G08 combined verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP24-G08 combined verification passed.');
