#!/usr/bin/env node
import { readFileSync } from 'node:fs';
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
  try {
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    fail(`Read ${filePath}`, error.message);
    return '';
  }
}

function runCommand(name, command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  if (result.status === 0) {
    pass(name, result.stdout.trim().split(/\r?\n/).at(-1) || 'ok');
  } else {
    fail(name, `${result.stdout}${result.stderr}`);
  }
}

runCommand('Run scripts/check_cp24_g05_validation_handoff.mjs', process.execPath, ['scripts/check_cp24_g05_validation_handoff.mjs']);

const controller = readText('apps/api/src/modules/private-content/private-content.controller.ts');
const service = readText('apps/api/src/modules/private-content/private-content.service.ts');
const dto = readText('apps/api/src/modules/private-content/private-content.dto.ts');
const openapi = readText('apps/api/src/modules/private-content/private-content.openapi.ts');
const mobileApi = readText('apps/mobile/src/services/privateContentApi.ts');
const shared = readText('packages/shared/src/private-content.ts');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP24_GRAPH_AWARE_RETRIEVAL_PROTOTYPE_ACCEPTANCE_CHECKLIST.md');
const g06Doc = readText('docs/09_sprints/resource_audit_import_prototype/CP24_G06_PRIVATE_API_PROTOTYPE.md');

expect('Controller imports POST and Body', controller.includes('Post') && controller.includes('Body'), 'POST/Body imports');
expect('Private CP24 route is POST under private-content namespace', controller.includes("@Post('graph-aware-retrieval/cp24')") && controller.includes("@Controller('private-content')"), 'private POST route');
expect('Controller does not expose GET CP24 retrieval route', !controller.includes("@Get('graph-aware-retrieval/cp24')"), 'no private GET route');
expect('Controller returns shared CP24 response type', controller.includes('PrivateCp24GraphAwareRetrievalResponse') && controller.includes('PrivateCp24GraphAwareRetrievalResponseDto'), 'shared response');
expect('DTO validates required query text', dto.includes('PrivateCp24GraphAwareRetrievalRequestDto') && dto.includes('queryText') && dto.includes('@IsNotEmpty()'), 'queryText validated');
expect('DTO validates graph mode and max depth', dto.includes("@IsIn(['off', 'explain_only', 'expand_candidates', 'rank_and_explain'])") && dto.includes('@Max(2)'), 'graph mode/maxDepth');
expect('OpenAPI documents CP24 private response DTO', openapi.includes('PrivateCp24GraphAwareRetrievalResponseDto') && openapi.includes('POST /api/private-content/graph-aware-retrieval/cp24'), 'OpenAPI DTO');
expect('Service implements CP24 method', service.includes('async createGraphAwareRetrievalCp24') && service.includes('CP24_RANKING_SELECTION_PATH') && service.includes('CP24_VALIDATION_HANDOFF_PATH'), 'service method');
expect('Service rejects invalid/missing request safely', service.includes('BadRequestException') && service.includes('queryText is required') && service.includes('Unknown CP24 fixtureId'), 'safe failures');
expect('Service returns checkpoint and route contract', service.includes("checkpoint: 'CP24-G06'") && service.includes("route: 'POST /api/private-content/graph-aware-retrieval/cp24'"), 'checkpoint/route');
expect('Service enforces bounded output caps', service.includes('CP24_DEFAULT_OUTPUT_CAPS') && service.includes('maxExpandedCandidates') && service.includes('maxEvidenceRouteItems'), 'bounded caps');
expect('Service preserves public boundary false', service.includes('publicRouteExposed: false') && service.includes('publicReleaseApproved: false') && service.includes('publicSafeCandidateCount: 0'), 'public boundary false');
expect('Service builds reviewer handoff from remediation', service.includes('cp24ReviewerHandoff') && service.includes('remediationItems') && service.includes('auditEvents'), 'reviewer handoff');
expect('Mobile client has CP24 private API helper', mobileApi.includes('createGraphAwareRetrievalCp24') && mobileApi.includes('/api/private-content/graph-aware-retrieval/cp24') && mobileApi.includes("method: 'POST'"), 'mobile helper');
expect('Shared contract keeps CP24 route private POST', shared.includes("route: 'POST /api/private-content/graph-aware-retrieval/cp24'") && shared.includes('PrivateCp24GraphAwareRetrievalResponse'), 'shared contract');
expect('No public API controller route introduced', !controller.includes("@Controller('public") && !controller.includes('/api/public') && !service.includes('public-content/graph-aware-retrieval'), 'no public route');
expect('No env file path access introduced', !/['"]\.env/.test(`${controller}\n${service}\n${dto}\n${openapi}\n${mobileApi}`), 'no .env file access');
expect('Build command is documented for proof', g06Doc.includes('corepack pnpm build:api'), 'build command documented');

for (const term of [
  '# CP24-G06 - Private API Prototype',
  'Status: Complete',
  'Private Route',
  'Bounded Response',
  'Invalid Request Handling',
  'Public Boundary',
  'Verification',
  'Status: complete',
]) {
  expect(`G06 doc includes: ${term}`, g06Doc.includes(term), term);
}

const sprintHasG06Complete = sprintPlan.includes('Status: CP24-G06 complete; CP24-G07 pending');
const sprintHasG07Complete = sprintPlan.includes('Status: CP24-G07 complete; CP24-G08 pending');
const sprintHasG08Complete = sprintPlan.includes('Status: CP24-G08 complete; CP24-G09 pending');
const sprintHasCp24Complete = sprintPlan.includes('Status: CP24 complete; recommended next scope CP25');
expect('Sprint plan is at or beyond G06 complete', sprintHasG06Complete || sprintHasG07Complete || sprintHasG08Complete || sprintHasCp24Complete, sprintHasCp24Complete ? 'CP24 complete' : sprintHasG08Complete ? 'G08 complete' : sprintHasG07Complete ? 'G07 complete' : 'G06 complete');
expect('Sprint plan points to G06 report', sprintPlan.includes('CP24_G06_PRIVATE_API_PROTOTYPE.md'), 'G06 report linked');
const checklistHasG06Complete = checklist.includes('Status: CP24-G06 complete; CP24-G07 pending');
const checklistHasG07Complete = checklist.includes('Status: CP24-G07 complete; CP24-G08 pending');
const checklistHasG08Complete = checklist.includes('Status: CP24-G08 complete; CP24-G09 pending');
const checklistHasCp24Complete = checklist.includes('Status: CP24 complete; recommended next scope CP25');
expect('Checklist is at or beyond G06 complete', checklistHasG06Complete || checklistHasG07Complete || checklistHasG08Complete || checklistHasCp24Complete, checklistHasCp24Complete ? 'CP24 complete' : checklistHasG08Complete ? 'G08 complete' : checklistHasG07Complete ? 'G07 complete' : 'G06 complete');
expect('Checklist G06 rows pass', ['CP24-G06-01', 'CP24-G06-02', 'CP24-G06-03', 'CP24-G06-04', 'CP24-G06-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'G06 rows pass');
expect('Checklist includes a valid post-G06 next action', checklist.includes('Start `CP24-G07 - Internal UI Prototype`') || checklist.includes('Start `CP24-G08 - Combined Verification`') || checklist.includes('Start `CP24-G09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP25 - Reviewer Workbench Action Workflow`'), checklistHasCp24Complete ? 'CP25 next' : checklistHasG08Complete ? 'G09 next' : checklistHasG07Complete ? 'G08 next' : 'G07 next');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP24-G06 private API prototype verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP24-G06 private API prototype verification passed.');
