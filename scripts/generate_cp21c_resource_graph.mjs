import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const EVIDENCE_PATH = 'data/graphify/cp21c/evidence.json';
const OUTPUT_PATH = 'data/graphify/cp21c/resource-graph.json';

const ACCESS_LEVEL = 'developer_private';
const RELEASE_STATE = 'private_available';
const REVIEW_STATE = 'pending';
const QUALITY_STATE = 'unverified';

function canonicalRef(schema, table, id) {
  return id ? { schema, table, id: String(id) } : null;
}

function sourceRefsFromNotice(notice) {
  if (!notice) return [];
  return [
    {
      type: 'private_content_notice',
      label: notice.label ?? null,
      publicationStatus: notice.publicationStatus ?? null,
      rightsStatus: notice.rightsStatus ?? null,
      attributionStatus: notice.attributionStatus ?? null,
      editorialStatus: notice.editorialStatus ?? null,
      scholarContentStatus: notice.scholarContentStatus ?? null,
    },
  ];
}

function baseNode({ id, type, label, canonical = null, sourceRefs = [], releaseState = RELEASE_STATE, reviewState = REVIEW_STATE, qualityState = QUALITY_STATE, metadata = {} }) {
  return {
    id,
    type,
    label,
    canonicalRef: canonical,
    sourceRefs,
    releaseState,
    reviewState,
    qualityState,
    accessLevel: ACCESS_LEVEL,
    publicSafe: false,
    metadata,
  };
}

function baseEdge({ id, type, from, to, status = 'imported', confidence = null, sourceRefs = [], evidenceRefs = [], releaseState = RELEASE_STATE, reviewState = REVIEW_STATE, metadata = {} }) {
  return {
    id,
    type,
    from,
    to,
    status,
    confidence,
    sourceRefs,
    evidenceRefs,
    releaseState,
    reviewState,
    accessLevel: ACCESS_LEVEL,
    publicSafe: false,
    metadata,
  };
}

function addNode(nodes, node) {
  if (!node?.id || nodes.has(node.id)) return;
  nodes.set(node.id, node);
}

function addEdge(edges, edge) {
  if (!edge?.id || edges.has(edge.id)) return;
  edges.set(edge.id, edge);
}

function safeId(value) {
  return String(value ?? 'unknown')
    .trim()
    .replace(/[^A-Za-z0-9:_\-.]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'unknown';
}

function guidanceNodeId(sessionId) {
  return `guidance_session:${sessionId}`;
}

function caseNodeId(caseId) {
  return `ranking_case:${caseId}`;
}

function ayahNodeId(verseKey) {
  const [surah, ayah] = String(verseKey).split(':');
  return `ayah:${surah}:${ayah}`;
}

function tafsirNodeId(passageId) {
  return `tafsir_passage:${passageId}`;
}

function hadithNodeId(hadithRecordId) {
  return `hadith_record:${hadithRecordId}`;
}

function themeNodeId(theme) {
  return `rafiq_theme:${safeId(String(theme).toLowerCase())}`;
}

function validationNodeId(sessionId, gateName) {
  return `validation_gate:${sessionId}:${safeId(gateName)}`;
}

function releaseNodeId(entityType, entityId) {
  return `release_state:${safeId(entityType)}:${safeId(entityId)}`;
}

function qualityNodeId(entityType, entityId, findingType) {
  return `quality_finding:${safeId(entityType)}:${safeId(entityId)}:${safeId(findingType)}`;
}

function sourceNodeId(entityType, entityId) {
  return `source:${safeId(entityType)}:${safeId(entityId)}`;
}

function addReleaseState(nodes, edges, entityNodeId, entityType, entityId, sourceRefs = []) {
  const id = releaseNodeId(entityType, entityId);
  addNode(nodes, baseNode({
    id,
    type: 'ReleaseState',
    label: `${entityType} release state`,
    canonical: canonicalRef('content', 'entity_release_states', `${entityType}:${entityId}`),
    sourceRefs,
    releaseState: 'public_blocked',
    reviewState: REVIEW_STATE,
    qualityState: QUALITY_STATE,
    metadata: {
      entityType,
      entityId,
      privateState: 'private_available',
      publicState: 'public_blocked',
      reason: 'CP21C private graph evidence; public release remains blocked.',
    },
  }));
  addEdge(edges, baseEdge({
    id: `edge:${entityNodeId}:entity_has_release_state:${id}`,
    type: 'entity_has_release_state',
    from: entityNodeId,
    to: id,
    status: 'imported',
    sourceRefs,
    releaseState: 'public_blocked',
    metadata: { entityType, entityId },
  }));
}

function addSourceDetail(nodes, edges, entityNodeId, target, sourceRefs = []) {
  if (!target?.entityType || !target?.entityId) return;
  const sourceId = sourceNodeId(target.entityType, target.entityId);
  addNode(nodes, baseNode({
    id: sourceId,
    type: 'Source',
    label: `${target.entityType}:${target.entityId}`,
    canonical: canonicalRef('content', 'entity_provenance', `${target.entityType}:${target.entityId}`),
    sourceRefs,
    releaseState: 'public_blocked',
    reviewState: REVIEW_STATE,
    qualityState: QUALITY_STATE,
    metadata: {
      name: `${target.entityType} source detail`,
      domain: target.entityType,
      provider: 'RAFIQ private source detail',
      rightsStatus: 'pending',
      attributionStatus: 'pending',
    },
  }));
  addEdge(edges, baseEdge({
    id: `edge:${sourceId}:source_provides:${entityNodeId}`,
    type: 'source_provides',
    from: sourceId,
    to: entityNodeId,
    status: 'imported',
    sourceRefs,
    releaseState: 'public_blocked',
  }));
  addReleaseState(nodes, edges, entityNodeId, target.entityType, target.entityId, sourceRefs);
}

function addValidation(nodes, edges, sessionNodeId, session, gateName, state, reason) {
  const id = validationNodeId(session.sessionId, gateName);
  addNode(nodes, baseNode({
    id,
    type: 'ValidationGateResult',
    label: `${gateName}: ${state}`,
    canonical: canonicalRef('content', 'private_answer_validation_runs', `${session.sessionId}:${gateName}`),
    releaseState: RELEASE_STATE,
    reviewState: session.verification?.reviewStatus ?? REVIEW_STATE,
    qualityState: QUALITY_STATE,
    metadata: {
      gateName,
      gateState: state,
      responseState: session.verification?.status ?? session.status,
      reason,
    },
  }));
  addEdge(edges, baseEdge({
    id: `edge:${sessionNodeId}:guidance_has_validation_gate:${id}`,
    type: 'guidance_has_validation_gate',
    from: sessionNodeId,
    to: id,
    status: 'imported',
    evidenceRefs: [{ type: 'session', id: session.sessionId }],
    metadata: { gateName },
  }));
}

function addQualityFinding(nodes, edges, entityNodeId, entityType, entityId, findingType, severity, metadata = {}) {
  const id = qualityNodeId(entityType, entityId, findingType);
  addNode(nodes, baseNode({
    id,
    type: 'QualityFinding',
    label: `${findingType} (${severity})`,
    canonical: canonicalRef('content', 'private_review_queue_items', `${entityType}:${entityId}:${findingType}`),
    releaseState: RELEASE_STATE,
    reviewState: 'technical_review',
    qualityState: severity === 'withheld' ? 'withheld' : 'warning',
    metadata: {
      entityType,
      entityId,
      findingType,
      severity,
      ...metadata,
    },
  }));
  addEdge(edges, baseEdge({
    id: `edge:${entityNodeId}:entity_has_quality_finding:${id}`,
    type: 'entity_has_quality_finding',
    from: entityNodeId,
    to: id,
    status: 'technical_verified',
    reviewState: 'technical_review',
    metadata: { findingType, severity },
  }));
}

function addQuranAnchor(nodes, edges, caseNode, sessionNode, evidenceCase) {
  const anchor = evidenceCase.session?.quranAnchor;
  if (!anchor?.verseKey) return null;
  const id = ayahNodeId(anchor.verseKey);
  addNode(nodes, baseNode({
    id,
    type: 'QuranAyah',
    label: `Quran ${anchor.verseKey}`,
    canonical: canonicalRef('content', 'quran_ayahs', anchor.verseKey),
    sourceRefs: sourceRefsFromNotice(evidenceCase.notice),
    releaseState: 'public_blocked',
    reviewState: REVIEW_STATE,
    qualityState: 'clean',
    metadata: {
      surahNumber: anchor.surahNumber,
      ayahNumber: anchor.ayahNumber,
      verseKey: anchor.verseKey,
      hasTranslation: anchor.hasTranslation,
      hasTafsirSummary: anchor.hasTafsirSummary,
    },
  }));
  addEdge(edges, baseEdge({
    id: `edge:${caseNode}:case_selected_quran_anchor:${id}`,
    type: 'case_selected_quran_anchor',
    from: caseNode,
    to: id,
    status: 'derived_candidate',
    evidenceRefs: [{ type: 'case', id: evidenceCase.caseId }, { type: 'session', id: evidenceCase.session.sessionId }],
    releaseState: 'public_blocked',
  }));
  addEdge(edges, baseEdge({
    id: `edge:${sessionNode}:guidance_cites:${id}`,
    type: 'guidance_cites',
    from: sessionNode,
    to: id,
    status: 'imported',
    evidenceRefs: [{ type: 'session', id: evidenceCase.session.sessionId }],
    releaseState: 'public_blocked',
  }));
  addSourceDetail(nodes, edges, id, anchor.sourceDetailTarget, sourceRefsFromNotice(evidenceCase.notice));
  return id;
}

function addTafsir(nodes, edges, caseNode, sessionNode, evidenceCase) {
  const tafsir = evidenceCase.supplemental?.tafsir;
  if (!tafsir?.passageId) return null;
  const id = tafsirNodeId(tafsir.passageId);
  addNode(nodes, baseNode({
    id,
    type: 'TafsirPassage',
    label: `Tafsir ${tafsir.ayahKeys?.join(', ') || tafsir.passageId}`,
    canonical: canonicalRef('content', 'tafsir_passages', tafsir.passageId),
    sourceRefs: sourceRefsFromNotice(evidenceCase.notice),
    releaseState: 'public_blocked',
    reviewState: REVIEW_STATE,
    qualityState: tafsir.blankText ? 'blank' : 'clean',
    metadata: {
      sourceId: tafsir.sourceDetailTarget?.entityId ?? null,
      language: 'en',
      coveredAyahs: tafsir.ayahKeys ?? [],
      passageType: 'study_passage',
      comparisonCount: tafsir.comparisonCount ?? 0,
      blankText: tafsir.blankText,
    },
  }));
  addEdge(edges, baseEdge({
    id: `edge:${caseNode}:case_selected_tafsir:${id}`,
    type: 'case_selected_tafsir',
    from: caseNode,
    to: id,
    status: 'derived_candidate',
    evidenceRefs: [{ type: 'case', id: evidenceCase.caseId }],
    releaseState: 'public_blocked',
  }));
  if (sessionNode) {
    addEdge(edges, baseEdge({
      id: `edge:${sessionNode}:guidance_cites:${id}`,
      type: 'guidance_cites',
      from: sessionNode,
      to: id,
      status: 'imported',
      evidenceRefs: [{ type: 'case', id: evidenceCase.caseId }],
      releaseState: 'public_blocked',
    }));
  }
  for (const verseKey of tafsir.ayahKeys ?? []) {
    const ayahId = ayahNodeId(verseKey);
    if (nodes.has(ayahId)) {
      addEdge(edges, baseEdge({
        id: `edge:${id}:tafsir_explains_ayah:${ayahId}`,
        type: 'tafsir_explains_ayah',
        from: id,
        to: ayahId,
        status: 'imported',
        releaseState: 'public_blocked',
      }));
    }
  }
  addSourceDetail(nodes, edges, id, tafsir.sourceDetailTarget, sourceRefsFromNotice(evidenceCase.notice));
  return id;
}

function addHadith(nodes, edges, caseNode, sessionNode, evidenceCase) {
  const hadith = evidenceCase.supplemental?.hadith;
  const support = evidenceCase.session?.sunnahSupport?.[0];
  const hadithRecordId = hadith?.hadithRecordId ?? support?.hadithRecordId;
  if (!hadithRecordId) return null;
  const id = hadithNodeId(hadithRecordId);
  const qualitySummary = hadith?.qualitySummary ?? null;
  const qualityState = qualitySummary?.withheldTextVersionCount > 0 ? 'withheld' : 'clean';
  addNode(nodes, baseNode({
    id,
    type: 'HadithRecord',
    label: support?.reference ?? hadith?.record?.printedReference ?? `Hadith ${hadithRecordId}`,
    canonical: canonicalRef('content', 'hadith_records', hadithRecordId),
    sourceRefs: sourceRefsFromNotice(evidenceCase.notice),
    releaseState: 'public_blocked',
    reviewState: REVIEW_STATE,
    qualityState,
    metadata: {
      sourceId: hadith?.record?.sourceDetailTarget?.entityId ?? null,
      collection: support?.collectionKey ?? hadith?.record?.collectionKey ?? null,
      reference: support?.reference ?? hadith?.record?.printedReference ?? null,
      recordNumber: hadithRecordId,
      gradeLabel: support?.gradeLabel ?? null,
      verificationSummary: support?.verificationSummary ?? null,
      verificationClaimCount: hadith?.verificationClaimCount ?? 0,
    },
  }));
  addEdge(edges, baseEdge({
    id: `edge:${caseNode}:case_selected_hadith:${id}`,
    type: 'case_selected_hadith',
    from: caseNode,
    to: id,
    status: evidenceCase.session?.riskAssessment?.riskClass === 'weak_or_unverified_hadith' ? 'technical_verified' : 'derived_candidate',
    evidenceRefs: [{ type: 'case', id: evidenceCase.caseId }],
    releaseState: 'public_blocked',
  }));
  if (sessionNode) {
    addEdge(edges, baseEdge({
      id: `edge:${sessionNode}:guidance_cites:${id}`,
      type: 'guidance_cites',
      from: sessionNode,
      to: id,
      status: 'imported',
      evidenceRefs: [{ type: 'case', id: evidenceCase.caseId }],
      releaseState: 'public_blocked',
    }));
  }
  addSourceDetail(nodes, edges, id, hadith?.record?.sourceDetailTarget ?? support?.sourceDetailTarget, sourceRefsFromNotice(evidenceCase.notice));

  for (const version of hadith?.textVersions ?? []) {
    const textNodeId = `hadith_text:${version.textVersionId}`;
    addNode(nodes, baseNode({
      id: textNodeId,
      type: 'HadithTextVersion',
      label: `${version.languageCode} hadith text`,
      canonical: canonicalRef('content', 'hadith_text_versions', version.textVersionId),
      sourceRefs: sourceRefsFromNotice(evidenceCase.notice),
      releaseState: 'public_blocked',
      reviewState: REVIEW_STATE,
      qualityState: version.qualitySeverity === 'withheld' ? 'withheld' : version.qualitySeverity === 'review' ? 'warning' : 'clean',
      metadata: {
        hadithRecordId,
        language: version.languageCode,
        textType: version.languageCode === 'ar' ? 'arabic' : 'meaning',
        qualityState: version.qualitySeverity ?? 'unverified',
        qualityFlags: version.qualityFlags ?? [],
      },
    }));
    addEdge(edges, baseEdge({
      id: `edge:${id}:hadith_has_text_version:${textNodeId}`,
      type: 'hadith_has_text_version',
      from: id,
      to: textNodeId,
      status: 'imported',
      releaseState: 'public_blocked',
    }));
    addSourceDetail(nodes, edges, textNodeId, version.sourceDetailTarget, sourceRefsFromNotice(evidenceCase.notice));
    if (version.qualitySeverity === 'withheld' || (version.qualityFlags?.length ?? 0) > 0) {
      addQualityFinding(nodes, edges, textNodeId, 'hadith_text_version', version.textVersionId, version.qualityFlags?.[0] ?? 'quality_review', version.qualitySeverity ?? 'review', {
        qualityFlags: version.qualityFlags ?? [],
      });
    }
  }

  for (const grade of hadith?.gradeAssertions ?? []) {
    const gradeNodeId = `grade_assertion:${grade.assertionId}`;
    addNode(nodes, baseNode({
      id: gradeNodeId,
      type: 'GradeAssertion',
      label: grade.normalizedLabel ?? grade.rawGrade ?? 'Grade assertion',
      canonical: canonicalRef('content', 'hadith_grade_assertions', grade.assertionId),
      sourceRefs: sourceRefsFromNotice(evidenceCase.notice),
      releaseState: 'public_blocked',
      reviewState: grade.reviewStatus ?? REVIEW_STATE,
      qualityState: QUALITY_STATE,
      metadata: {
        hadithRecordId,
        grade: grade.normalizedLabel ?? grade.rawGrade ?? null,
        grader: null,
        sourceId: grade.sourceDetailTarget?.entityId ?? null,
        claimScope: null,
      },
    }));
    addEdge(edges, baseEdge({
      id: `edge:${id}:hadith_has_grade_assertion:${gradeNodeId}`,
      type: 'hadith_has_grade_assertion',
      from: id,
      to: gradeNodeId,
      status: 'imported',
      releaseState: 'public_blocked',
    }));
    addSourceDetail(nodes, edges, gradeNodeId, grade.sourceDetailTarget, sourceRefsFromNotice(evidenceCase.notice));
  }

  if (qualitySummary?.withheldTextVersionCount > 0) {
    addQualityFinding(nodes, edges, id, 'hadith_record', hadithRecordId, 'withheld_meaning_text', 'withheld', qualitySummary);
  }

  return id;
}

function addSearchEvidence(nodes, edges, caseNode, evidenceCase) {
  const results = evidenceCase.sourceSearch?.firstResults ?? [];
  for (const result of results) {
    let nodeId = null;
    let nodeType = null;
    let label = result.title;
    let canonical = null;
    let metadata = {};

    if (result.domain === 'quran' && result.reference?.verseKey) {
      nodeId = ayahNodeId(result.reference.verseKey);
      nodeType = 'QuranAyah';
      canonical = canonicalRef('content', 'quran_ayahs', result.reference.verseKey);
      metadata = {
        surahNumber: result.reference.surahNumber,
        ayahNumber: result.reference.ayahNumber,
        verseKey: result.reference.verseKey,
      };
    } else if (result.domain === 'translation' && result.target?.translationTextId) {
      nodeId = `translation_text:${result.target.translationTextId}`;
      nodeType = 'TranslationText';
      canonical = canonicalRef('content', 'quran_translation_texts', result.target.translationTextId);
      metadata = {
        ayahKey: result.reference?.verseKey ?? null,
        language: result.target?.languageCode ?? null,
        translator: null,
        sourceId: null,
        variantType: null,
      };
    } else if (result.domain === 'tafsir' && result.target?.passageId) {
      nodeId = tafsirNodeId(result.target.passageId);
      nodeType = 'TafsirPassage';
      canonical = canonicalRef('content', 'tafsir_passages', result.target.passageId);
      metadata = {
        sourceId: null,
        language: 'en',
        coveredAyahs: result.reference?.verseKey ? [result.reference.verseKey] : [],
        passageType: 'source_search_result',
      };
    } else if (result.domain === 'hadith' && result.target?.hadithRecordId) {
      nodeId = hadithNodeId(result.target.hadithRecordId);
      nodeType = 'HadithRecord';
      canonical = canonicalRef('content', 'hadith_records', result.target.hadithRecordId);
      metadata = {
        sourceId: null,
        collection: result.reference?.collectionKey ?? result.target?.collectionKey ?? null,
        reference: result.subtitle ?? null,
        recordNumber: result.target.hadithRecordId,
      };
    } else if (result.domain === 'topic' && result.target?.topicId) {
      nodeId = `source_topic:${safeId(result.target.sourceTopicKey ?? result.target.topicId)}`;
      nodeType = 'SourceTopic';
      canonical = canonicalRef('content', 'source_topics', result.target.topicId);
      metadata = {
        namespace: 'source_search',
        sourceId: null,
        topicLabel: result.title,
        language: 'en',
      };
    } else if (result.domain === 'ayah_theme' && result.target?.themeGroupId) {
      nodeId = `source_topic:ayah_theme:${safeId(result.target.themeGroupId)}`;
      nodeType = 'SourceTopic';
      canonical = canonicalRef('content', 'source_ayah_theme_groups', result.target.themeGroupId);
      metadata = {
        namespace: 'ayah_theme',
        sourceId: null,
        topicLabel: result.title,
        language: 'en',
      };
    }

    if (!nodeId || !nodeType) continue;
    addNode(nodes, baseNode({
      id: nodeId,
      type: nodeType,
      label,
      canonical,
      sourceRefs: sourceRefsFromNotice(evidenceCase.notice),
      releaseState: 'public_blocked',
      reviewState: REVIEW_STATE,
      qualityState: QUALITY_STATE,
      metadata,
    }));
    addEdge(edges, baseEdge({
      id: `edge:${caseNode}:case_candidate_result:${nodeId}`,
      type: 'case_candidate_result',
      from: caseNode,
      to: nodeId,
      status: 'derived_candidate',
      confidence: typeof result.score === 'number' ? result.score : null,
      evidenceRefs: [{ type: 'source_search_result', id: result.resultId }],
      releaseState: 'public_blocked',
      metadata: {
        domain: result.domain,
        route: result.target?.route ?? null,
        hasOpenGuidanceTarget: result.hasOpenGuidanceTarget,
      },
    }));
  }
}

function addTheme(nodes, edges, sessionNodeId, session) {
  const theme = session?.need?.detectedTheme;
  if (!theme) return;
  const id = themeNodeId(theme);
  addNode(nodes, baseNode({
    id,
    type: 'RafiqTheme',
    label: theme,
    canonical: canonicalRef('content', 'rafiq_themes', safeId(theme.toLowerCase())),
    releaseState: 'public_blocked',
    reviewState: REVIEW_STATE,
    qualityState: QUALITY_STATE,
    metadata: {
      slug: safeId(theme.toLowerCase()),
      name: theme,
      themeType: 'derived_from_session',
      governanceState: 'private_candidate',
    },
  }));
  addEdge(edges, baseEdge({
    id: `edge:${sessionNodeId}:session_detected_theme:${id}`,
    type: 'session_detected_theme',
    from: sessionNodeId,
    to: id,
    status: 'derived_candidate',
    releaseState: 'public_blocked',
  }));
}

async function main() {
  const evidence = JSON.parse(await readFile(EVIDENCE_PATH, 'utf8'));
  const nodes = new Map();
  const edges = new Map();

  for (const evidenceCase of evidence.cases) {
    const caseId = caseNodeId(evidenceCase.caseId);
    addNode(nodes, baseNode({
      id: caseId,
      type: 'RankingCase',
      label: evidenceCase.caseId,
      canonical: canonicalRef('data', 'graphify_cp21c_cases', evidenceCase.caseId),
      sourceRefs: [{ type: 'case_matrix', id: evidence.matrixId }],
      releaseState: RELEASE_STATE,
      reviewState: REVIEW_STATE,
      qualityState: QUALITY_STATE,
      metadata: {
        caseId: evidenceCase.caseId,
        caseGroup: evidenceCase.caseGroup,
        caseType: evidenceCase.caseType,
        scoringMode: evidenceCase.scoringMode,
        endpoint: evidenceCase.endpoint,
      },
    }));

    let sessionNodeId = null;
    if (evidenceCase.session?.sessionId) {
      const session = evidenceCase.session;
      sessionNodeId = guidanceNodeId(session.sessionId);
      addNode(nodes, baseNode({
        id: sessionNodeId,
        type: 'GuidanceSession',
        label: `${evidenceCase.caseId} ${session.status}`,
        canonical: canonicalRef('content', 'private_guidance_sessions', session.sessionId),
        sourceRefs: sourceRefsFromNotice(evidenceCase.notice),
        releaseState: RELEASE_STATE,
        reviewState: session.verification?.reviewStatus ?? REVIEW_STATE,
        qualityState: session.status === 'blocked_no_evidence' ? 'unverified' : QUALITY_STATE,
        metadata: {
          entryPoint: session.need?.entryPoint,
          status: session.status,
          detectedTheme: session.need?.detectedTheme,
          riskState: session.riskAssessment?.riskClass,
          responseState: session.verification?.status,
          evidenceCount: session.verification?.evidenceCount,
          quranEvidenceCount: session.verification?.quranEvidenceCount,
          sunnahEvidenceCount: session.verification?.sunnahEvidenceCount,
        },
      }));
      addEdge(edges, baseEdge({
        id: `edge:${caseId}:case_has_guidance_session:${sessionNodeId}`,
        type: 'case_has_guidance_session',
        from: caseId,
        to: sessionNodeId,
        status: 'imported',
        evidenceRefs: [{ type: 'evidence_case', id: evidenceCase.caseId }],
      }));

      addTheme(nodes, edges, sessionNodeId, session);
      addValidation(nodes, edges, sessionNodeId, session, 'risk_assessment', session.riskAssessment?.riskClass ?? 'unknown', session.riskAssessment?.escalationRoute ?? 'none');
      addValidation(nodes, edges, sessionNodeId, session, 'evidence_gate', session.verification?.status ?? 'unknown', `evidence=${session.verification?.evidenceCount ?? 0}`);
      addQuranAnchor(nodes, edges, caseId, sessionNodeId, evidenceCase);
      addTafsir(nodes, edges, caseId, sessionNodeId, evidenceCase);
      addHadith(nodes, edges, caseId, sessionNodeId, evidenceCase);
    }

    if (evidenceCase.caseType === 'source_search') {
      addSearchEvidence(nodes, edges, caseId, evidenceCase);
      addTafsir(nodes, edges, caseId, null, evidenceCase);
    }
  }

  const graph = {
    manifest: {
      graphId: 'cp21c-resource-graph-v1',
      graphKind: 'ranking_graph',
      scope: 'CP21C private ranking evidence for GuidanceSession and Source Search cases.',
      environment: evidence.productBoundary?.environment ?? 'private_local',
      deploymentMode: 'private_local',
      sourceDatabaseSnapshot: evidence.collectedAt,
      exportedAt: new Date().toISOString(),
      exportedBy: 'scripts/generate_cp21c_resource_graph.mjs',
      accessLevel: ACCESS_LEVEL,
      publicSafe: false,
      notes: [
        'Product graph export for RAFIQ CP21C only.',
        'Not the developer graphify-out code graph.',
        'Not public release evidence.',
      ],
    },
    summary: {
      sourceEvidenceId: evidence.evidenceId,
      caseCount: evidence.cases.length,
      nodeCount: nodes.size,
      edgeCount: edges.size,
      publicSafeNodeCount: Array.from(nodes.values()).filter((node) => node.publicSafe).length,
      publicSafeEdgeCount: Array.from(edges.values()).filter((edge) => edge.publicSafe).length,
    },
    nodes: Array.from(nodes.values()).sort((a, b) => a.id.localeCompare(b.id)),
    edges: Array.from(edges.values()).sort((a, b) => a.id.localeCompare(b.id)),
  };

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(graph, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    status: 'pass',
    outputPath: OUTPUT_PATH,
    summary: graph.summary,
  }, null, 2));
}

await main();
