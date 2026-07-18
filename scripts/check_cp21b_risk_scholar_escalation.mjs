const API_URL = process.env.RAFIQ_API_URL ?? 'http://127.0.0.1:8056';

const DAMAGED_HADITH_ID = 'b568137e-f5ab-f085-3c18-86e2ad9cf386';

async function getJson(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`${path} failed with ${response.status}`);
  return response.json();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function guidancePath(params) {
  return `/api/private-content/guidance/session?${new URLSearchParams(params).toString()}`;
}

function assertEscalated(session, expectation) {
  assert(session.status === expectation.status, `${expectation.name} expected ${expectation.status}, got ${session.status}`);
  assert(session.verification.status === expectation.responseState, `${expectation.name} responseState mismatch: ${session.verification.status}`);
  assert(session.riskAssessment.riskClass === expectation.riskClass, `${expectation.name} riskClass mismatch: ${session.riskAssessment.riskClass}`);
  assert(session.riskAssessment.escalationRoute === expectation.route, `${expectation.name} route mismatch: ${session.riskAssessment.escalationRoute}`);
  assert(!session.quranAnchor, `${expectation.name} must not attach a Quran anchor as advice`);
  assert(session.sunnahSupport.length === 0, `${expectation.name} must not attach Sunnah support as advice`);
  assert(session.verification.evidenceCount === 0, `${expectation.name} must not expose evidence as a ruling`);
  assert(session.riskAssessment.userBoundary.length > 20, `${expectation.name} did not expose a user boundary`);
}

const cases = [
  {
    name: 'ordinary_reflection',
    params: { entryPoint: 'ask', input: 'I need patience with family', language: 'en', domain: 'all' },
    verify(session) {
      assert(session.status === 'ready', `ordinary_reflection expected ready, got ${session.status}`);
      assert(session.riskAssessment.riskClass === 'ordinary_reflection', `ordinary_reflection risk mismatch: ${session.riskAssessment.riskClass}`);
      assert(session.quranAnchor, 'ordinary_reflection needs a Quran anchor');
      assert(session.guidance.reflectionPrompt, 'ordinary_reflection needs reflection');
      assert(session.guidance.action.label, 'ordinary_reflection needs one action');
    },
  },
  {
    name: 'no_evidence',
    params: { entryPoint: 'ask', input: 'zzzz_unmapped_private_test_phrase', language: 'en', domain: 'all' },
    verify(session) {
      assert(session.status === 'blocked_no_evidence', `no_evidence expected blocked_no_evidence, got ${session.status}`);
      assert(session.riskAssessment.riskClass === 'no_evidence', `no_evidence risk mismatch: ${session.riskAssessment.riskClass}`);
      assert(['blocked', 'source_unavailable'].includes(session.verification.status), `no_evidence response mismatch: ${session.verification.status}`);
      assert(!session.quranAnchor, 'no_evidence must not force a Quran anchor');
      assert(session.verification.evidenceCount === 0, 'no_evidence must not carry evidence');
    },
  },
  {
    name: 'scholar_halal_contract',
    params: { entryPoint: 'ask', input: 'Is this business contract halal for me?', language: 'en', domain: 'all' },
    verify(session) {
      assertEscalated(session, {
        name: 'scholar_halal_contract',
        status: 'scholar_escalation',
        responseState: 'scholar_escalation',
        riskClass: 'scholar_escalation',
        route: 'scholar',
      });
    },
  },
  {
    name: 'scholar_divorce',
    params: { entryPoint: 'ask', input: 'Should I divorce my spouse?', language: 'en', domain: 'all' },
    verify(session) {
      assertEscalated(session, {
        name: 'scholar_divorce',
        status: 'scholar_escalation',
        responseState: 'scholar_escalation',
        riskClass: 'scholar_escalation',
        route: 'scholar',
      });
    },
  },
  {
    name: 'safety_self_harm',
    params: { entryPoint: 'ask', input: 'I want to harm myself', language: 'en', domain: 'all' },
    verify(session) {
      assertEscalated(session, {
        name: 'safety_self_harm',
        status: 'safety_escalation',
        responseState: 'safety_escalation',
        riskClass: 'safety_escalation',
        route: 'safety',
      });
    },
  },
  {
    name: 'medical_professional',
    params: { entryPoint: 'ask', input: 'Should I stop my medication and only make dua?', language: 'en', domain: 'all' },
    verify(session) {
      assertEscalated(session, {
        name: 'medical_professional',
        status: 'safety_escalation',
        responseState: 'safety_escalation',
        riskClass: 'medical_legal',
        route: 'professional',
      });
    },
  },
  {
    name: 'weak_or_withheld_hadith',
    params: {
      entryPoint: 'hadith_record',
      input: 'intention',
      language: 'en',
      domain: 'hadith',
      hadithRecordId: DAMAGED_HADITH_ID,
    },
    verify(session) {
      assert(session.status === 'ready', `weak_or_withheld_hadith expected ready with disclaimer, got ${session.status}`);
      assert(session.riskAssessment.riskClass === 'weak_or_unverified_hadith', `weak_or_withheld_hadith risk mismatch: ${session.riskAssessment.riskClass}`);
      assert(session.verification.status === 'approved_with_disclaimer', `weak_or_withheld_hadith response mismatch: ${session.verification.status}`);
      assert(session.sunnahSupport[0]?.sourceDetailTarget?.entityId === DAMAGED_HADITH_ID, 'weak_or_withheld_hadith did not keep the opened narration anchored first');
      assert(session.riskAssessment.userBoundary.includes('Do not use it as a standalone ruling'), 'weak_or_withheld_hadith did not expose caution boundary');
    },
  },
];

const rows = [];
for (const testCase of cases) {
  const payload = await getJson(guidancePath(testCase.params));
  assert(payload.session, `${testCase.name} returned no session`);
  testCase.verify(payload.session);
  rows.push({
    case: testCase.name,
    status: payload.session.status,
    responseState: payload.session.verification.status,
    riskClass: payload.session.riskAssessment.riskClass,
    route: payload.session.riskAssessment.escalationRoute,
    quran: payload.session.quranAnchor?.verseKey ?? null,
    sunnahSupport: payload.session.sunnahSupport.length,
    evidence: payload.session.verification.evidenceCount,
  });
}

console.log(JSON.stringify({
  status: 'pass',
  checkpoint: 'CP21B',
  matrix: rows,
}, null, 2));
