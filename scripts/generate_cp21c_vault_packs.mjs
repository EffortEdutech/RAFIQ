import { mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const EVIDENCE_PATH = 'data/graphify/cp21c/evidence.json';
const CASES_PATH = 'data/graphify/cp21c/cases.json';
const GRAPH_PATH = 'data/graphify/cp21c/resource-graph.json';
const OUTPUT_DIR = 'data/vault/cp21c/ranking-cases';

const GENERATED_BY = 'scripts/generate_cp21c_vault_packs.mjs';

function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function yamlArray(values) {
  if (!Array.isArray(values) || values.length === 0) return '[]';
  return `[${values.map((value) => yamlString(value)).join(', ')}]`;
}

function safeFileName(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function caseNodeId(caseId) {
  return `ranking_case:${caseId}`;
}

function nodeLinksForCase(graph, caseId) {
  const caseNode = caseNodeId(caseId);
  const outgoing = graph.edges.filter((edge) => edge.from === caseNode);
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
  return outgoing.map((edge) => ({
    edgeType: edge.type,
    nodeId: edge.to,
    nodeType: nodesById.get(edge.to)?.type ?? 'Unknown',
    label: nodesById.get(edge.to)?.label ?? edge.to,
  }));
}

function inputLabel(evidenceCase) {
  const sourceQuery = evidenceCase.sourceSearch?.query;
  if (sourceQuery) return `${sourceQuery.mode}:${sourceQuery.text}`;
  const need = evidenceCase.session?.need;
  if (need?.detectedIntent) return need.detectedIntent;
  return evidenceCase.endpoint ?? evidenceCase.caseId;
}

function selectedQuranAnchor(evidenceCase) {
  const anchor = evidenceCase.session?.quranAnchor;
  return anchor?.verseKey ?? null;
}

function selectedTafsir(evidenceCase) {
  return evidenceCase.supplemental?.tafsir?.passageId
    ?? evidenceCase.session?.tafsirStep?.sourceDetailTarget?.entityId
    ?? null;
}

function selectedHadith(evidenceCase) {
  return evidenceCase.supplemental?.hadith?.hadithRecordId
    ?? evidenceCase.session?.sunnahSupport?.[0]?.hadithRecordId
    ?? null;
}

function candidateEvidence(evidenceCase) {
  const sessionEvidence = evidenceCase.session?.verification?.evidence ?? [];
  const searchResults = evidenceCase.sourceSearch?.groups?.flatMap((group) => group.firstResults ?? []) ?? [];
  return [...sessionEvidence, ...searchResults];
}

function releaseBlockers(evidenceCase) {
  const blockers = [];
  if (evidenceCase.notice?.publicationStatus !== 'public_ready') blockers.push('private_only_publication_status');
  if (evidenceCase.notice?.rightsStatus === 'pending') blockers.push('rights_pending');
  if (evidenceCase.notice?.attributionStatus === 'pending') blockers.push('attribution_pending');
  if (evidenceCase.notice?.editorialStatus === 'unreviewed') blockers.push('editorial_unreviewed');
  if (evidenceCase.notice?.scholarContentStatus === 'unreviewed') blockers.push('scholar_content_unreviewed');
  return blockers;
}

function qualityBlockers(evidenceCase) {
  const blockers = [];
  const qualitySummary = evidenceCase.supplemental?.hadith?.qualitySummary;
  if (qualitySummary?.withheldTextVersionCount > 0) blockers.push('withheld_hadith_text_version');
  if (qualitySummary?.flaggedTextVersionCount > 0) blockers.push('flagged_hadith_text_version');
  if (evidenceCase.session?.riskAssessment?.riskClass === 'weak_or_unverified_hadith') blockers.push('weak_or_unverified_hadith');
  if (evidenceCase.session?.verification?.status === 'source_unavailable') blockers.push('source_unavailable');
  return blockers;
}

function duplicateExactRows(evidenceCase) {
  const seen = new Set();
  let duplicateCount = 0;
  for (const result of evidenceCase.sourceSearch?.groups?.flatMap((group) => group.firstResults ?? []) ?? []) {
    const key = `${result.domain}:${result.reference?.verseKey ?? ''}:${result.target?.route ?? ''}`;
    if (seen.has(key)) duplicateCount += 1;
    seen.add(key);
  }
  return duplicateCount;
}

function scoreCase(evidenceCase) {
  const expected = evidenceCase.expectedBehavior ?? {};
  const session = evidenceCase.session;
  const search = evidenceCase.sourceSearch;
  const isEscalation = evidenceCase.scoringMode === 'separate_escalation';
  const blockers = qualityBlockers(evidenceCase);
  const breakdown = [];

  const add = (label, points, max, passed, remediation) => {
    breakdown.push({ label, points, max, passed, remediation: passed ? null : remediation });
  };

  if (isEscalation) {
    const stateOk = session?.status === expected.status || session?.riskAssessment?.riskClass === expected.riskClass;
    const noEvidence = (session?.verification?.evidenceCount ?? 0) === 0;
    const noQuranAdvice = !session?.quranAnchor;
    const noSunnahAdvice = (session?.sunnahSupport?.length ?? 0) === 0;
    add('Escalation state preserved', stateOk ? 40 : 0, 40, stateOk, 'Preserve expected scholar/safety/medical escalation state.');
    add('No ordinary evidence ranked', noEvidence ? 25 : 0, 25, noEvidence, 'Do not rank ordinary evidence for escalation cases.');
    add('No Quran anchor as advice', noQuranAdvice ? 15 : 0, 15, noQuranAdvice, 'Avoid presenting Quran anchors as direct advice in escalation cases.');
    add('No Sunnah support as advice', noSunnahAdvice ? 15 : 0, 15, noSunnahAdvice, 'Avoid presenting Sunnah support as direct advice in escalation cases.');
    add('Public release remains blocked', releaseBlockers(evidenceCase).length > 0 ? 5 : 0, 5, releaseBlockers(evidenceCase).length > 0, 'Keep escalation artifacts private.');
  } else if (evidenceCase.caseType === 'source_search') {
    const hasResults = (search?.pagination?.total ?? 0) > 0;
    const hasRoutes = (search?.groups ?? []).some((group) => (group.firstResults ?? []).some((result) => result.target?.route));
    const duplicates = duplicateExactRows(evidenceCase);
    const exactQuranOk = !expected.requiresExactQuranRows || (search?.facets?.quran ?? 0) >= expected.requiresExactQuranRows;
    const groupsOk = Array.isArray(expected.requiresGroups)
      ? expected.requiresGroups.every((group) => (search?.groups ?? []).some((item) => item.groupKey === group))
      : hasResults;
    add('Correct response state', hasResults ? 20 : 0, 20, hasResults, 'Return private source-search results for this research query.');
    add('Required groups available', groupsOk ? 25 : 0, 25, groupsOk, 'Surface required Quran/translation/tafsir or source groups.');
    add('Exact Quran route preserved', exactQuranOk ? 15 : 0, 15, exactQuranOk, 'Preserve exact ayah result and route where required.');
    add('Study routes available', hasRoutes ? 20 : 0, 20, hasRoutes, 'Every leading source result should route to a study room or source view.');
    add('No duplicate exact rows crowd results', duplicates === 0 ? 10 : 0, 10, duplicates === 0, 'Deduplicate identical leading rows.');
    add('Public release remains blocked', releaseBlockers(evidenceCase).length > 0 ? 10 : 0, 10, releaseBlockers(evidenceCase).length > 0, 'Keep private source-search artifacts out of public release.');
  } else {
    const responseOk = session?.status === expected.status
      || session?.riskAssessment?.riskClass === expected.riskClass
      || session?.verification?.status === expected.responseState;
    const quranOk = expected.requiresNoQuranAnchor ? !session?.quranAnchor
      : expected.requiresExactQuranAnchor ? selectedQuranAnchor(evidenceCase) === expected.requiresExactQuranAnchor
      : expected.requiresNoForcedQuranAnchor ? true
      : expected.requiresQuranAnchor ? Boolean(session?.quranAnchor)
      : true;
    const tafsirOk = expected.requiresTafsirRoute ? Boolean(session?.tafsirStep?.available || selectedTafsir(evidenceCase)) : true;
    const hadithOk = expected.requiresNoSunnahSupport ? (session?.sunnahSupport?.length ?? 0) === 0
      : expected.requiresOpenedHadithFirst ? selectedHadith(evidenceCase) === expected.requiresOpenedHadithFirst
      : expected.requiresSunnahSupport || expected.requiresSunnahWhenRelevant ? Boolean(selectedHadith(evidenceCase) || (session?.sunnahSupport?.length ?? 0) >= 0)
      : true;
    const reflectionOk = expected.requiresReflection ? Boolean(session?.guidance?.hasReflection) : true;
    const actionOk = expected.requiresOneAction ? Boolean(session?.guidance?.hasAction) : true;
    const sourceRoutesOk = Boolean(session?.sourceMap?.sourceSearchRoute || session?.learningPath?.steps?.some((step) => step.route));
    add('Correct response state', responseOk ? 20 : 0, 20, responseOk, 'Align session status/risk/verification state with the case expectation.');
    add('Quran anchor behavior', quranOk ? 20 : 0, 20, quranOk, 'Select the required Quran anchor, preserve direct ayah anchors, or omit anchors for no-evidence cases.');
    add('Tafsir route behavior', tafsirOk ? 15 : 0, 15, tafsirOk, 'Attach a tafsir route when the case requires tafsir support.');
    add('Hadith support behavior', hadithOk ? 15 : 0, 15, hadithOk, 'Preserve opened hadith first or omit Sunnah support when no evidence is expected.');
    add('Reflection present', reflectionOk ? 5 : 0, 5, reflectionOk, 'Provide a reflection only for allowed ordinary guidance states.');
    add('One action present', actionOk ? 5 : 0, 5, actionOk, 'Provide one safe action only for allowed guidance states.');
    add('Study/source route available', sourceRoutesOk ? 10 : 0, 10, sourceRoutesOk, 'Keep source/search/study room routing available.');
    add('No quality blocker on primary evidence', blockers.length === 0 ? 5 : 0, 5, blockers.length === 0, `Resolve quality blockers: ${blockers.join(', ')}.`);
    add('Public release remains blocked', releaseBlockers(evidenceCase).length > 0 ? 5 : 0, 5, releaseBlockers(evidenceCase).length > 0, 'Keep private artifacts blocked from public release.');
  }

  const score = breakdown.reduce((sum, item) => sum + item.points, 0);
  const max = breakdown.reduce((sum, item) => sum + item.max, 0);
  const normalizedScore = max === 100 ? score : Math.round((score / max) * 100);
  const remediation = breakdown.filter((item) => !item.passed).map((item) => item.remediation);

  return {
    score: normalizedScore,
    pass: isEscalation ? remediation.length === 0 : normalizedScore >= (evidenceCase.critical ? 75 : 85),
    breakdown,
    remediation,
  };
}

function table(rows, headers) {
  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
  ];
  for (const row of rows) lines.push(`| ${row.map((value) => String(value ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  return lines.join('\n');
}

function bulletList(values, empty = 'None recorded.') {
  if (!values?.length) return empty;
  return values.map((value) => `- ${value}`).join('\n');
}

function buildPack(evidence, graph, evidenceCase, generatedAt) {
  const links = nodeLinksForCase(graph, evidenceCase.caseId);
  const score = scoreCase(evidenceCase);
  const candidates = candidateEvidence(evidenceCase);
  const release = releaseBlockers(evidenceCase);
  const quality = qualityBlockers(evidenceCase);
  const sourceRefs = [
    `case_matrix:${evidence.matrixId}`,
    `evidence:${evidence.evidenceId}`,
    `graph:${graph.manifest.graphId}`,
  ];
  const canonicalRefs = [
    `data/graphify/cp21c/cases.json#${evidenceCase.caseId}`,
    `data/graphify/cp21c/evidence.json#${evidenceCase.caseId}`,
    `data/graphify/cp21c/resource-graph.json#${caseNodeId(evidenceCase.caseId)}`,
  ];
  const yaml = [
    '---',
    `artifact_id: ${yamlString(`vault:ranking_case:${evidenceCase.caseId}`)}`,
    'artifact_type: "ranking_case_pack"',
    `title: ${yamlString(`CP21C Ranking Case ${evidenceCase.caseId}`)}`,
    'status: "generated"',
    'environment: "private_local"',
    'access_level: "developer_private"',
    'public_safe: false',
    `generated_at: ${yamlString(generatedAt)}`,
    `generated_by: ${yamlString(GENERATED_BY)}`,
    `source_graph_id: ${yamlString(graph.manifest.graphId)}`,
    `canonical_refs: ${yamlArray(canonicalRefs)}`,
    `source_refs: ${yamlArray(sourceRefs)}`,
    'release_state: "private_available_public_blocked"',
    `review_state: ${yamlString(evidenceCase.session?.verification?.reviewStatus ?? evidenceCase.sourceSearch?.retrievalTrace?.reviewStatus ?? 'unreviewed')}`,
    `quality_state: ${yamlString(quality.length ? 'review_needed' : 'unverified')}`,
    `case_id: ${yamlString(evidenceCase.caseId)}`,
    `case_group: ${yamlString(evidenceCase.caseGroup)}`,
    `case_type: ${yamlString(evidenceCase.caseType)}`,
    `scoring_mode: ${yamlString(evidenceCase.scoringMode)}`,
    `score: ${score.score}`,
    `pass: ${score.pass}`,
    '---',
  ].join('\n');

  const candidateRows = candidates.slice(0, 12).map((candidate, index) => [
    index + 1,
    candidate.domain ?? 'unknown',
    candidate.title ?? candidate.citationId ?? candidate.resultId ?? 'unknown',
    candidate.reference?.verseKey ?? candidate.reference?.hadithRecordId ?? '',
    candidate.target?.route ?? '',
  ]);
  const graphRows = links.map((link) => [link.edgeType, link.nodeType, link.label, link.nodeId]);
  const scoreRows = score.breakdown.map((item) => [
    item.label,
    `${item.points}/${item.max}`,
    item.passed ? 'Pass' : 'Fail',
    item.remediation ?? '',
  ]);

  return `${yaml}

# CP21C Ranking Case ${evidenceCase.caseId}

## Summary

This is a generated private RAFIQ Knowledge Vault ranking case pack for
CP21C. It explains the current selected, candidate, blocked, and release-state
evidence for one ranking test case.

This artifact is not the full RAFIQ resource graph and is not public release
approval.

## Prompt Or Sanitized Case Label

- Case ID: \`${evidenceCase.caseId}\`
- Case group: \`${evidenceCase.caseGroup}\`
- Case type: \`${evidenceCase.caseType}\`
- Scoring mode: \`${evidenceCase.scoringMode}\`
- Input label: \`${inputLabel(evidenceCase)}\`
- Endpoint: \`${evidenceCase.endpoint ?? 'n/a'}\`

## Expected Case Type

\`\`\`json
${JSON.stringify(evidenceCase.expectedBehavior ?? {}, null, 2)}
\`\`\`

## Selected Quran Anchor

${selectedQuranAnchor(evidenceCase) ? `- ${selectedQuranAnchor(evidenceCase)}` : 'None selected.'}

## Candidate Quran Anchors

${bulletList(candidates.filter((candidate) => candidate.reference?.verseKey).map((candidate) => `${candidate.reference.verseKey} (${candidate.domain ?? 'unknown'})`))}

## Selected Tafsir Passage

${selectedTafsir(evidenceCase) ? `- ${selectedTafsir(evidenceCase)}` : 'None selected.'}

## Candidate Tafsir Passages

${bulletList(candidates.filter((candidate) => candidate.domain === 'tafsir').map((candidate) => `${candidate.title ?? candidate.citationId ?? candidate.resultId} -> ${candidate.target?.passageId ?? 'unknown'}`))}

## Selected Hadith Support

${selectedHadith(evidenceCase) ? `- ${selectedHadith(evidenceCase)}` : 'None selected.'}

## Rejected Hadith Candidates And Reasons

${quality.includes('withheld_hadith_text_version') ? '- Withheld hadith text version: cannot use withheld meaning text as primary evidence.' : 'None recorded in the CP21C evidence slice.'}

## Score Breakdown

${table(scoreRows, ['Signal', 'Points', 'Status', 'Remediation'])}

## Quality/Release Blockers

Quality blockers:

${bulletList(quality)}

Release blockers:

${bulletList(release)}

## Remediation If Score Is Low

${bulletList(score.remediation, score.pass ? 'No score remediation required for this generated pack.' : 'No remediation recorded.')}

## Canonical References

${bulletList(canonicalRefs)}

## Source And Attribution

${bulletList(sourceRefs)}

Notice:

${evidenceCase.notice?.label ?? 'No notice captured.'}

## Evidence Graph

${graphRows.length ? table(graphRows, ['Edge', 'Node Type', 'Label', 'Node ID']) : 'No graph links recorded for this case.'}

## Candidate Summary

${candidateRows.length ? table(candidateRows, ['#', 'Domain', 'Title', 'Reference', 'Route']) : 'No candidate evidence recorded.'}

## Quality And Review State

- Review state: \`${evidenceCase.session?.verification?.reviewStatus ?? evidenceCase.sourceSearch?.retrievalTrace?.reviewStatus ?? 'unreviewed'}\`
- Quality state: \`${quality.length ? 'review_needed' : 'unverified'}\`
- Public safe: \`false\`

## Release Boundary

This pack is private-local and developer-private. It must not be exposed through
public RAFIQ routes or treated as public release readiness.

## Open Questions Or Blockers

${bulletList([...quality, ...release], 'No additional blockers recorded beyond CP21C private/public boundary.')}
`;
}

async function main() {
  const evidence = JSON.parse(await readFile(EVIDENCE_PATH, 'utf8'));
  const matrix = JSON.parse(await readFile(CASES_PATH, 'utf8'));
  const graph = JSON.parse(await readFile(GRAPH_PATH, 'utf8'));
  const generatedAt = new Date().toISOString();
  const casesById = new Map(matrix.cases.map((item) => [item.caseId, item]));

  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  const outputs = [];
  for (const evidenceCase of evidence.cases) {
    const matrixCase = casesById.get(evidenceCase.caseId);
    if (!matrixCase) throw new Error(`Missing matrix case for ${evidenceCase.caseId}`);
    const mergedCase = {
      ...matrixCase,
      ...evidenceCase,
      expectedBehavior: matrixCase.expectedBehavior,
      rankingFocus: matrixCase.rankingFocus,
      graphExpectations: matrixCase.graphExpectations,
      input: matrixCase.input,
      critical: matrixCase.critical,
    };
    const fileName = `${safeFileName(evidenceCase.caseId)}.md`;
    const outputPath = path.join(OUTPUT_DIR, fileName);
    const content = buildPack(evidence, graph, mergedCase, generatedAt);
    await writeFile(outputPath, content, 'utf8');
    outputs.push(outputPath);
  }

  console.log(JSON.stringify({
    status: 'pass',
    outputDir: OUTPUT_DIR,
    packCount: outputs.length,
    generatedAt,
  }, null, 2));
}

await main();
