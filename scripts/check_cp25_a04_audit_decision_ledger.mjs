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
    fail(`Parse JSON: ${filePath}`, error.message);
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
    fail(`Run ${scriptPath}`, `${result.stdout}${result.stderr}`);
  }
}

runNodeScript('scripts/check_cp25_a03_review_queue_exports.mjs');

const reviewQueue = readJson('data/review/cp25/review-queue.json') || [];
const remediationState = readJson('data/review/cp25/remediation-state.json') || [];
const a04Manifest = readJson('data/review/cp25/audit-decision-ledger-manifest.json');
const auditEvents = readJson('data/review/cp25/audit-events.json') || [];
const decisionLedger = readJson('data/review/cp25/decision-ledger.json') || [];
const invalidFixtures = readJson('data/review/cp25/invalid-action-fixtures.json') || [];
const transitionRules = readJson('data/review/cp25/transition-rules.json');
const generator = readText('scripts/generate_cp25_audit_decision_ledger.mjs');
const report = readText('docs/09_sprints/resource_audit_import_prototype/CP25_A04_AUDIT_EVENT_AND_DECISION_LEDGER.md');
const sprintPlan = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_SPRINT_PLAN.md');
const checklist = readText('docs/09_sprints/resource_audit_import_prototype/CP25_REVIEWER_WORKBENCH_ACTION_WORKFLOW_ACCEPTANCE_CHECKLIST.md');

const queueById = new Map(reviewQueue.map((item) => [item.queueItemId, item]));
const remediationByStateId = new Map(remediationState.map((item) => [item.remediationId, item]));
const remediationByQueueId = new Map(remediationState.map((item) => [item.queueItemId, item]));
const eventById = new Map(auditEvents.map((event) => [event.auditEventId, event]));

expect('A04 manifest schema is correct', a04Manifest?.schemaVersion === 'cp25.audit-decision-ledger-manifest.v1' && a04Manifest?.checkpoint === 'CP25-A04', a04Manifest?.schemaVersion);
expect('Transition rules schema is correct', transitionRules?.schemaVersion === 'cp25.transition-rules.v1' && transitionRules?.checkpoint === 'CP25-A04', transitionRules?.schemaVersion);
expect('A04 remains private only', a04Manifest?.privateOnly === true && a04Manifest?.publicReleaseApproved === false && a04Manifest?.publicBoundary?.publicRouteExposed === false, 'private/public false');
expect('Public safe counts remain zero', a04Manifest?.counts?.publicSafeCandidateCount === 0 && a04Manifest?.counts?.publicSafeRouteItemCount === 0 && a04Manifest?.publicBoundary?.publicSafeGraphNodeCount === 0 && a04Manifest?.publicBoundary?.publicSafeVaultArtifactCount === 0, 'all zero');

expect('Audit events cover all queue items', auditEvents.length === reviewQueue.length && auditEvents.length === 72, `${auditEvents.length}/${reviewQueue.length}`);
expect('Decision ledger covers all queue items', decisionLedger.length === reviewQueue.length && decisionLedger.length === 72, `${decisionLedger.length}/${reviewQueue.length}`);
expect('Manifest counts match A04 artifacts', a04Manifest?.counts?.auditEventCount === auditEvents.length && a04Manifest?.counts?.decisionLedgerEntryCount === decisionLedger.length && a04Manifest?.counts?.validActionCount === decisionLedger.length, 'counts match');

const uniqueEventIds = new Set(auditEvents.map((event) => event.auditEventId));
const uniqueLedgerIds = new Set(decisionLedger.map((entry) => entry.ledgerEntryId));
expect('Audit event IDs are unique', uniqueEventIds.size === auditEvents.length, `${uniqueEventIds.size}/${auditEvents.length}`);
expect('Ledger entry IDs are unique', uniqueLedgerIds.size === decisionLedger.length, `${uniqueLedgerIds.size}/${decisionLedger.length}`);
expect('Event sequence is contiguous', auditEvents.every((event, index) => event.eventSequence === index + 1), '1..N');
expect('Ledger immutable order is contiguous', decisionLedger.every((entry, index) =>
  entry.eventSequence === index + 1 &&
  entry.immutableEventOrder?.appendOnly === true &&
  entry.immutableEventOrder?.previousEventSequence === (index === 0 ? null : index) &&
  entry.immutableEventOrder?.nextEventSequence === (index + 2 <= decisionLedger.length ? index + 2 : null)
), 'append-only order');

const ledgerEventsMatch = decisionLedger.every((entry) => {
  const event = eventById.get(entry.auditEventId);
  return event &&
    event.queueItemId === entry.queueItemId &&
    event.action === entry.action &&
    event.fromStatus === entry.previousState.queueStatus &&
    event.toStatus === entry.newState.queueStatus &&
    event.reviewerRole === entry.reviewerRole;
});
expect('Every ledger entry has a matching audit event', ledgerEventsMatch, 'ledger/event refs');

const eventRefsValid = auditEvents.every((event) => {
  const queueItem = queueById.get(event.queueItemId);
  const remediation = remediationByQueueId.get(event.queueItemId);
  return queueItem &&
    event.remediationId === remediation?.remediationId &&
    event.evidenceRouteIds.every((id) => queueItem.evidenceRouteIds.includes(id)) &&
    event.routeItemIds.every((id) => queueItem.routeItemIds.includes(id)) &&
    event.candidateIds.every((id) => queueItem.candidateIds.includes(id)) &&
    event.remediationIds.every((id) => queueItem.remediationIds.includes(id));
});
expect('Audit events preserve affected refs from queue/remediation state', eventRefsValid, 'affected refs');

const validTransitions = decisionLedger.every((entry) => {
  const allowed = transitionRules?.allowedTransitions?.[entry.previousState.queueStatus] || [];
  return entry.validation.allowed === true &&
    entry.validation.invalidTransition === false &&
    entry.validation.missingRequiredNotes === false &&
    allowed.includes(entry.newState.queueStatus);
});
expect('Decision ledger transitions are allowed', validTransitions, 'allowed transitions');
expect('Every valid action has required notes', auditEvents.every((event) => typeof event.notes === 'string' && event.notes.includes('private workflow audit evidence only')), 'notes present');
expect('Every audit event records actor, action, from, to, timestamp, and refs', auditEvents.every((event) =>
  event.reviewerRole &&
  event.action &&
  event.fromStatus &&
  event.toStatus &&
  event.createdAt &&
  Array.isArray(event.sourceIds) &&
  Array.isArray(event.graphNodeIds) &&
  Array.isArray(event.graphEdgeIds) &&
  Array.isArray(event.vaultPackIds) &&
  Array.isArray(event.evidenceRouteIds) &&
  Array.isArray(event.routeItemIds) &&
  Array.isArray(event.candidateIds) &&
  Array.isArray(event.remediationIds)
), 'event required fields');
expect('No audit event publishes content', auditEvents.every((event) => event.publicReleaseApproved === false), 'event public false');
expect('No ledger entry requests public-safe changes', decisionLedger.every((entry) => entry.newState.publicReleaseApproved === false && entry.newState.publicSafeChangeRequested === false && entry.publicBoundary.publicSafeChangeRequested === false), 'ledger public false');
expect('Remediation states in ledger resolve to A03 state IDs', decisionLedger.every((entry) => entry.remediationStateId === null || remediationByStateId.has(entry.remediationStateId)), 'remediation state refs');

expect('Invalid fixture set is present', invalidFixtures.length >= 4 && a04Manifest?.counts?.invalidActionFixtureCount === invalidFixtures.length, `${invalidFixtures.length}`);
expect('Invalid transition fixtures fail validation', invalidFixtures.some((fixture) => fixture.validation.invalidTransition === true && fixture.validation.allowed === false), 'invalid transition');
expect('Missing notes fixture fails validation', invalidFixtures.some((fixture) => fixture.validation.missingRequiredNotes === true && fixture.validation.allowed === false), 'missing notes');
expect('Public-safe fixture fails validation', invalidFixtures.some((fixture) => fixture.validation.blockedReasons.some((reason) => reason.includes('Public-safe')) && fixture.validation.allowed === false), 'public-safe blocked');
expect('Transition rules include immutable ordering', transitionRules?.immutableEventOrdering?.appendOnly === true && transitionRules?.immutableEventOrdering?.eventSequenceMustBeContiguous === true, 'immutable ordering');

expect('Audit events checksum matches manifest', a04Manifest?.checksums?.auditEventsSha256 === sha256(JSON.stringify(auditEvents)), 'audit checksum');
expect('Decision ledger checksum matches manifest', a04Manifest?.checksums?.decisionLedgerSha256 === sha256(JSON.stringify(decisionLedger)), 'ledger checksum');
expect('Invalid fixtures checksum matches manifest', a04Manifest?.checksums?.invalidActionFixturesSha256 === sha256(JSON.stringify(invalidFixtures)), 'invalid checksum');
expect('Transition rules checksum matches manifest', a04Manifest?.checksums?.transitionRulesSha256 === sha256(JSON.stringify(transitionRules)), 'rules checksum');
expect('Generator documents A04 artifacts', generator.includes('audit-events.json') && generator.includes('decision-ledger.json') && generator.includes('invalid-action-fixtures.json'), 'generator paths');

for (const term of [
  '# CP25-A04 - Audit Event And Decision Ledger',
  'Status: Complete',
  '72 audit events',
  'append-only',
  'invalid transitions fail verification',
  'missing required notes fail verification',
  'public-safe counts remain zero',
  'node scripts\\check_cp25_a04_audit_decision_ledger.mjs',
]) {
  expect(`A04 report includes ${term}`, report.includes(term), term);
}

expect('Sprint plan marks A04 complete or later', sprintPlan.includes('Status: CP25-A04 complete; CP25-A05 pending') || sprintPlan.includes('Status: CP25-A05 complete; CP25-A06 pending') || sprintPlan.includes('Status: CP25-A06 complete; CP25-A07 pending') || sprintPlan.includes('Status: CP25-A07 complete; CP25-A08 pending') || sprintPlan.includes('Status: CP25-A08 complete; CP25-A09 pending') || sprintPlan.includes('Status: CP25 complete; recommended next scope CP26'), 'sprint status');
expect('Checklist marks A04 complete or later', checklist.includes('Status: CP25-A04 complete; CP25-A05 pending') || checklist.includes('Status: CP25-A05 complete; CP25-A06 pending') || checklist.includes('Status: CP25-A06 complete; CP25-A07 pending') || checklist.includes('Status: CP25-A07 complete; CP25-A08 pending') || checklist.includes('Status: CP25-A08 complete; CP25-A09 pending') || checklist.includes('Status: CP25 complete; recommended next scope CP26'), 'checklist status');
expect('Checklist A04 rows pass', ['CP25-A04-01', 'CP25-A04-02', 'CP25-A04-03', 'CP25-A04-04', 'CP25-A04-05'].every((id) => {
  const row = checklist.split(/\r?\n/).find((line) => line.includes(`| ${id} |`)) || '';
  return row.includes('| Pass |');
}), 'A04 rows pass');
expect('Checklist recommends A05 through CP26 next', checklist.includes('Start `CP25-A05 - Private API Prototype`') || checklist.includes('Start `CP25-A06 - Internal UI Action Controls`') || checklist.includes('Start `CP25-A07 - Audit Export And Remediation Review Proof`') || checklist.includes('Start `CP25-A08 - Combined Verification`') || checklist.includes('Start `CP25-A09 - Close-Out And Next Scope Decision`') || checklist.includes('Start `CP26 - Live Snapshot Export And Refresh`'), 'next checkpoint');
expect('No env file path access introduced', !/['"]\.env/.test(`${generator}\n${report}\n${sprintPlan}\n${checklist}`), 'no .env path');

for (const check of checks) {
  console.log(`${check.status}: ${check.name} - ${check.evidence}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  console.error(`CP25-A04 audit decision ledger verification failed: ${failures.length} failing checks.`);
  process.exit(1);
}

console.log('CP25-A04 audit decision ledger verification passed.');
