import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CASES_PATH = 'data/graphify/cp21c/cases.json';
const EVIDENCE_PATH = 'data/graphify/cp21c/evidence.json';
const GRAPH_PATH = 'data/graphify/cp21c/resource-graph.json';
const PACK_DIR = 'data/vault/cp21c/ranking-cases';
const OUTPUT_PATH = 'data/graphify/cp21c/ranking-summary.json';

const ORDINARY_AVERAGE_MINIMUM = 85;
const CRITICAL_CASE_MINIMUM = 75;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseFrontMatter(content, file) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert(match, `${file} missing front matter`);
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const index = line.indexOf(':');
    if (index === -1) continue;
    data[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return data;
}

function scalar(value) {
  return String(value ?? '').trim().replace(/^"|"$/g, '');
}

function extractSection(content, heading) {
  const start = content.indexOf(`## ${heading}`);
  if (start === -1) return '';
  const afterHeading = content.slice(start + `## ${heading}`.length);
  const next = afterHeading.search(/\r?\n## /);
  return (next === -1 ? afterHeading : afterHeading.slice(0, next)).trim();
}

function parseScoreBreakdown(content) {
  const section = extractSection(content, 'Score Breakdown');
  const rows = [];
  for (const line of section.split(/\r?\n/)) {
    if (!line.startsWith('|') || line.includes('---') || line.includes('Signal |')) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 4) continue;
    const [points, max] = cells[1].split('/').map((part) => Number(part));
    rows.push({
      signal: cells[0],
      points,
      max,
      status: cells[2],
      remediation: cells[3] || null,
    });
  }
  return rows;
}

function average(values) {
  if (values.length === 0) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function percentile(values, percentileValue) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentileValue / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, index))];
}

function caseEvidenceState(evidenceCase) {
  return {
    sessionStatus: evidenceCase.session?.status ?? null,
    riskClass: evidenceCase.session?.riskAssessment?.riskClass ?? null,
    verificationStatus: evidenceCase.session?.verification?.status ?? null,
    evidenceCount: evidenceCase.session?.verification?.evidenceCount ?? evidenceCase.sourceSearch?.pagination?.total ?? 0,
    quranEvidenceCount: evidenceCase.session?.verification?.quranEvidenceCount ?? null,
    sunnahEvidenceCount: evidenceCase.session?.verification?.sunnahEvidenceCount ?? null,
  };
}

function escalationPreserved(evidenceCase) {
  if (evidenceCase.scoringMode !== 'separate_escalation') return true;
  const expected = evidenceCase.expectedBehavior ?? {};
  const session = evidenceCase.session;
  const stateOk = session?.status === expected.status || session?.riskAssessment?.riskClass === expected.riskClass;
  const noOrdinaryEvidence = (session?.verification?.evidenceCount ?? 0) === 0;
  const noQuranAnchor = !session?.quranAnchor;
  const noSunnahSupport = (session?.sunnahSupport?.length ?? 0) === 0;
  return stateOk && noOrdinaryEvidence && noQuranAnchor && noSunnahSupport;
}

async function main() {
  const matrix = JSON.parse(await readFile(CASES_PATH, 'utf8'));
  const evidence = JSON.parse(await readFile(EVIDENCE_PATH, 'utf8'));
  const graph = JSON.parse(await readFile(GRAPH_PATH, 'utf8'));
  const casesById = new Map(matrix.cases.map((item) => [item.caseId, item]));
  const evidenceById = new Map(evidence.cases.map((item) => [item.caseId, item]));
  const files = (await readdir(PACK_DIR)).filter((file) => file.endsWith('.md')).sort();

  const caseResults = [];
  const remediationList = [];

  for (const file of files) {
    const packPath = path.join(PACK_DIR, file);
    const content = await readFile(packPath, 'utf8');
    const frontMatter = parseFrontMatter(content, file);
    const caseId = scalar(frontMatter.case_id);
    const matrixCase = casesById.get(caseId);
    const evidenceCase = evidenceById.get(caseId);
    assert(matrixCase, `missing matrix case ${caseId}`);
    assert(evidenceCase, `missing evidence case ${caseId}`);

    const score = Number(frontMatter.score);
    const pass = frontMatter.pass === 'true';
    const scoringMode = scalar(frontMatter.scoring_mode);
    const critical = Boolean(matrixCase.critical);
    const threshold = scoringMode === 'separate_escalation' ? 100 : critical ? CRITICAL_CASE_MINIMUM : ORDINARY_AVERAGE_MINIMUM;
    const breakdown = parseScoreBreakdown(content);
    const failedSignals = breakdown.filter((item) => item.status === 'Fail');

    const result = {
      caseId,
      file: packPath.replaceAll('\\', '/'),
      caseGroup: scalar(frontMatter.case_group),
      caseType: scalar(frontMatter.case_type),
      scoringMode,
      critical,
      score,
      pass,
      threshold,
      evidenceState: caseEvidenceState(evidenceCase),
      failedSignals,
    };
    caseResults.push(result);

    for (const failedSignal of failedSignals) {
      remediationList.push({
        caseId,
        caseGroup: result.caseGroup,
        scoringMode,
        score,
        signal: failedSignal.signal,
        remediation: failedSignal.remediation,
        severity: critical || score < CRITICAL_CASE_MINIMUM ? 'high' : 'medium',
      });
    }
  }

  const ordinaryCases = caseResults.filter((item) => item.scoringMode !== 'separate_escalation');
  const escalationCases = caseResults.filter((item) => item.scoringMode === 'separate_escalation');
  const ordinaryScores = ordinaryCases.map((item) => item.score);
  const criticalBelowMinimum = ordinaryCases.filter((item) => item.critical && item.score < CRITICAL_CASE_MINIMUM);
  const lowScoringOrdinaryCases = ordinaryCases.filter((item) => item.score < (item.critical ? CRITICAL_CASE_MINIMUM : ORDINARY_AVERAGE_MINIMUM));
  const escalationOutcomes = escalationCases.map((item) => {
    const evidenceCase = evidenceById.get(item.caseId);
    return {
      caseId: item.caseId,
      score: item.score,
      pass: item.pass,
      expectedStatus: casesById.get(item.caseId)?.expectedBehavior?.status ?? null,
      observedStatus: evidenceCase?.session?.status ?? null,
      observedRiskClass: evidenceCase?.session?.riskAssessment?.riskClass ?? null,
      ordinaryEvidenceRanked: (evidenceCase?.session?.verification?.evidenceCount ?? 0) > 0,
      preservedEscalationBoundary: escalationPreserved({ ...casesById.get(item.caseId), ...evidenceCase, expectedBehavior: casesById.get(item.caseId)?.expectedBehavior }),
    };
  });

  const publicSafePacks = caseResults.filter((item) => {
    const content = item;
    return content.publicSafe === true;
  });
  const averageScore = average(ordinaryScores);
  const gates = {
    ordinaryAverageMinimum: ORDINARY_AVERAGE_MINIMUM,
    ordinaryAverageScore: averageScore,
    ordinaryAveragePass: averageScore >= ORDINARY_AVERAGE_MINIMUM,
    criticalCaseMinimum: CRITICAL_CASE_MINIMUM,
    criticalCaseMinimumPass: criticalBelowMinimum.length === 0,
    remediationForFailingSignalsPass: remediationList.every((item) => Boolean(item.remediation)),
    escalationBoundaryPass: escalationOutcomes.every((item) => item.preservedEscalationBoundary && !item.ordinaryEvidenceRanked),
    publicReleaseClaimPass: publicSafePacks.length === 0 && graph.manifest?.publicSafe === false,
    summaryPublicSafe: false,
  };
  const allGatesPass = gates.ordinaryAveragePass
    && gates.criticalCaseMinimumPass
    && gates.remediationForFailingSignalsPass
    && gates.escalationBoundaryPass
    && gates.publicReleaseClaimPass
    && gates.summaryPublicSafe === false;

  const summary = {
    summaryId: 'cp21c-ranking-summary-v1',
    checkpoint: 'CP21C-G05',
    status: allGatesPass ? 'pass_private_summary' : 'review_required',
    generatedAt: new Date().toISOString(),
    generatedBy: 'scripts/generate_cp21c_ranking_summary.mjs',
    sourceMatrixId: matrix.matrixId,
    sourceEvidenceId: evidence.evidenceId,
    sourceGraphId: graph.manifest?.graphId,
    sourcePackDirectory: PACK_DIR,
    scaleBoundary: {
      isFullRafiqResourceGraph: false,
      description: 'CP21C ranking-summary over 23 prototype cases only; not the full RAFIQ Quran, tafsir, translation, hadith, topic, provenance, review, and release graph.',
    },
    access: {
      environment: 'private_local',
      accessLevel: 'developer_private',
      publicSafe: false,
      publicReleaseApproved: false,
    },
    gates,
    ordinarySummary: {
      caseCount: ordinaryCases.length,
      passingCaseCount: ordinaryCases.filter((item) => item.pass).length,
      lowScoringCaseCount: lowScoringOrdinaryCases.length,
      criticalCaseCount: ordinaryCases.filter((item) => item.critical).length,
      criticalBelowMinimumCount: criticalBelowMinimum.length,
      averageScore,
      minScore: Math.min(...ordinaryScores),
      p50Score: percentile(ordinaryScores, 50),
      p90Score: percentile(ordinaryScores, 90),
      maxScore: Math.max(...ordinaryScores),
      byGroup: Object.fromEntries(
        Array.from(new Set(ordinaryCases.map((item) => item.caseGroup))).sort().map((caseGroup) => {
          const groupCases = ordinaryCases.filter((item) => item.caseGroup === caseGroup);
          return [caseGroup, {
            caseCount: groupCases.length,
            averageScore: average(groupCases.map((item) => item.score)),
            minScore: Math.min(...groupCases.map((item) => item.score)),
            maxScore: Math.max(...groupCases.map((item) => item.score)),
            lowScoringCaseIds: groupCases
              .filter((item) => item.score < (item.critical ? CRITICAL_CASE_MINIMUM : ORDINARY_AVERAGE_MINIMUM))
              .map((item) => item.caseId),
          }];
        }),
      ),
    },
    escalationSummary: {
      caseCount: escalationCases.length,
      passingCaseCount: escalationOutcomes.filter((item) => item.pass).length,
      boundaryPassCount: escalationOutcomes.filter((item) => item.preservedEscalationBoundary && !item.ordinaryEvidenceRanked).length,
      outcomes: escalationOutcomes,
    },
    lowScoringCases: lowScoringOrdinaryCases.map((item) => ({
      caseId: item.caseId,
      caseGroup: item.caseGroup,
      critical: item.critical,
      score: item.score,
      threshold: item.threshold,
      failedSignalCount: item.failedSignals.length,
      failedSignals: item.failedSignals.map((signal) => signal.signal),
    })),
    remediationList,
    caseResults,
  };

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify({
    status: 'pass',
    outputPath: OUTPUT_PATH,
    ordinaryAverageScore: summary.ordinarySummary.averageScore,
    ordinaryCaseCount: summary.ordinarySummary.caseCount,
    escalationCaseCount: summary.escalationSummary.caseCount,
    lowScoringCaseCount: summary.ordinarySummary.lowScoringCaseCount,
    remediationCount: summary.remediationList.length,
  }, null, 2));
}

await main();
