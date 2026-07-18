import { readFile } from 'node:fs/promises';

const SUMMARY_PATH = 'data/graphify/cp21c/ranking-summary.json';
const CASES_PATH = 'data/graphify/cp21c/cases.json';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const summary = JSON.parse(await readFile(SUMMARY_PATH, 'utf8'));
const matrix = JSON.parse(await readFile(CASES_PATH, 'utf8'));

const ordinaryMatrixCount = matrix.cases.filter((item) => item.scoringMode !== 'separate_escalation').length;
const escalationMatrixCount = matrix.cases.filter((item) => item.scoringMode === 'separate_escalation').length;

assert(summary.summaryId === 'cp21c-ranking-summary-v1', 'summaryId mismatch');
assert(summary.checkpoint === 'CP21C-G05', 'checkpoint mismatch');
assert(summary.scaleBoundary?.isFullRafiqResourceGraph === false, 'summary must state it is not the full RAFIQ resource graph');
assert(summary.access?.environment === 'private_local', 'summary environment must be private_local');
assert(summary.access?.accessLevel === 'developer_private', 'summary access level must be developer_private');
assert(summary.access?.publicSafe === false, 'summary must not be public safe');
assert(summary.access?.publicReleaseApproved === false, 'summary must not approve public release');

assert(summary.ordinarySummary?.caseCount === ordinaryMatrixCount, 'ordinary case count mismatch');
assert(summary.escalationSummary?.caseCount === escalationMatrixCount, 'escalation case count mismatch');
assert(Array.isArray(summary.caseResults) && summary.caseResults.length === matrix.cases.length, 'caseResults must cover all cases');
assert(Array.isArray(summary.lowScoringCases), 'lowScoringCases must be an array');
assert(Array.isArray(summary.remediationList), 'remediationList must be an array');

assert(summary.gates?.ordinaryAverageScore >= summary.gates?.ordinaryAverageMinimum, 'ordinary average score below threshold');
assert(summary.gates?.ordinaryAveragePass === true, 'ordinary average gate must pass');
assert(summary.gates?.criticalCaseMinimumPass === true, 'critical minimum gate must pass');
assert(summary.gates?.remediationForFailingSignalsPass === true, 'every failing signal must have remediation');
assert(summary.gates?.escalationBoundaryPass === true, 'escalation boundary gate must pass');
assert(summary.gates?.publicReleaseClaimPass === true, 'public release claim gate must pass');

for (const item of summary.lowScoringCases) {
  assert(item.failedSignalCount > 0, `${item.caseId} must have failed signals`);
  const remediations = summary.remediationList.filter((remediation) => remediation.caseId === item.caseId);
  assert(remediations.length >= item.failedSignalCount, `${item.caseId} missing remediation entries`);
}

for (const outcome of summary.escalationSummary.outcomes) {
  assert(outcome.preservedEscalationBoundary === true, `${outcome.caseId} did not preserve escalation boundary`);
  assert(outcome.ordinaryEvidenceRanked === false, `${outcome.caseId} ranked ordinary evidence`);
}

console.log(JSON.stringify({
  status: 'pass',
  summaryPath: SUMMARY_PATH,
  ordinaryAverageScore: summary.ordinarySummary.averageScore,
  ordinaryCaseCount: summary.ordinarySummary.caseCount,
  escalationCaseCount: summary.escalationSummary.caseCount,
  lowScoringCaseCount: summary.lowScoringCases.length,
  remediationCount: summary.remediationList.length,
}, null, 2));
