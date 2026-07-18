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

function requireFile(path) {
  if (!existsSync(path)) {
    fail(`File exists: ${path}`, 'Missing required CP23-A06 file.');
    return '';
  }
  pass(`File exists: ${path}`, 'Found.');
  return readFileSync(path, 'utf8');
}

function expectIncludes(name, content, needle) {
  if (content.includes(needle)) {
    pass(name, needle);
  } else {
    fail(name, `Missing: ${needle}`);
  }
}

function expectNotIncludes(name, content, needle) {
  if (!content.includes(needle)) {
    pass(name, `Absent: ${needle}`);
  } else {
    fail(name, `Unexpected: ${needle}`);
  }
}

const cp22 = spawnSync(process.execPath, ['scripts/check_cp22_combined_verification.mjs'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});
if (cp22.status === 0) {
  pass('Inherited CP22 combined verifier passes', 'scripts/check_cp22_combined_verification.mjs');
} else {
  fail('Inherited CP22 combined verifier passes', cp22.stdout + cp22.stderr);
}

const shared = requireFile('packages/shared/src/private-content.ts');
const controller = requireFile('apps/api/src/modules/private-content/private-content.controller.ts');
const service = requireFile('apps/api/src/modules/private-content/private-content.service.ts');
const openapi = requireFile('apps/api/src/modules/private-content/private-content.openapi.ts');
const mobileApi = requireFile('apps/mobile/src/services/privateContentApi.ts');
const mobileScreen = requireFile('apps/mobile/app/review-workbench.tsx');
const nav = requireFile('apps/mobile/src/components/RafiqNavigationBar.tsx');
const checklist = requireFile('docs/09_sprints/resource_audit_import_prototype/CP23_RETRIEVAL_INTEGRATION_AND_REVIEWER_WORKFLOW_ACCEPTANCE_CHECKLIST.md');
const report = requireFile('docs/09_sprints/resource_audit_import_prototype/CP23_A06_PRIVATE_PROTOTYPE_IMPLEMENTATION_REPORT.md');

expectIncludes('Shared CP23 response contract exists', shared, 'PrivateReviewWorkbenchCp23Response');
expectIncludes('Shared evidence route contract exists', shared, 'PrivateCp23EvidenceRoute');
expectIncludes('Private controller exposes CP23 route', controller, "@Get('review-workbench/cp23')");
expectIncludes('Controller route returns CP23 response type', controller, 'PrivateReviewWorkbenchCp23Response');
expectIncludes('Service implementation exists', service, 'getReviewWorkbenchCp23()');
expectIncludes('Service reads CP22 graph manifest', service, 'CP22_GRAPH_MANIFEST_PATH');
expectIncludes('Service reads CP22 vault manifest', service, 'CP22_VAULT_MANIFEST_PATH');
expectIncludes('Service limits candidates', service, '].slice(0, 8)');
expectIncludes('Service caps UI payload candidates', service, 'maxCandidates: 8');
expectIncludes('Service marks read-only prototype', service, "implementationMode: 'bounded_private_read_only'");
expectIncludes('Service blocks public release', service, 'publicReleaseApproved: false');
expectIncludes('Service reports public-safe candidate count zero', service, 'publicSafeCandidateCount: 0');
expectIncludes('OpenAPI DTO exists', openapi, 'PrivateReviewWorkbenchCp23ResponseDto');
expectIncludes('Mobile API function exists', mobileApi, 'getReviewWorkbenchCp23');
expectIncludes('Mobile screen calls CP23 API', mobileScreen, 'getReviewWorkbenchCp23');
expectIncludes('Mobile screen shows evidence route panel', mobileScreen, 'EvidenceRoutePanel');
expectIncludes('Mobile nav links workbench', nav, "/review-workbench");
expectIncludes('Checklist marks CP23-A06 Pass', checklist, '| CP23-A06 | Private prototype implementation is complete. | Pass |');
expectIncludes('Implementation report exists and names boundary', report, 'bounded private read-only');
expectNotIncludes('No public API route is introduced for CP23 workbench', controller, "@Controller('public");

const failures = checks.filter((check) => check.status === 'FAIL');
for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

if (failures.length > 0) {
  console.error(`CP23-A06 private prototype verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP23-A06 private prototype verification passed.');
