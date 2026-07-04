import type {
  PublicAnswerDraftResponse,
  PublicGuidedAnswerResponse,
  PublicSearchDomain,
  PublicSearchResponse,
  PublicSourceDetailResponse,
} from '@rafiq/shared';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8056';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`RAFIQ public API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function searchPublicContent(params: {
  q: string;
  domain?: PublicSearchDomain;
  limit?: number;
  offset?: number;
}): Promise<PublicSearchResponse> {
  const query = new URLSearchParams();
  query.set('q', params.q);
  if (params.domain) query.set('domain', params.domain);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.offset !== undefined) query.set('offset', String(params.offset));
  return getJson<PublicSearchResponse>(
    `/api/public-content/search?${query.toString()}`,
  );
}

export function createPublicAnswerDraft(params: {
  q: string;
  intent?: string;
  language?: string;
  domain?: PublicSearchDomain;
  limit?: number;
}): Promise<PublicAnswerDraftResponse> {
  const query = new URLSearchParams();
  query.set('q', params.q);
  if (params.intent) query.set('intent', params.intent);
  if (params.language) query.set('language', params.language);
  if (params.domain) query.set('domain', params.domain);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  return getJson<PublicAnswerDraftResponse>(
    `/api/public-content/answer/draft?${query.toString()}`,
  );
}

export function createPublicGuidedAnswer(params: {
  q: string;
  intent?: string;
  language?: string;
  domain?: PublicSearchDomain;
  limit?: number;
}): Promise<PublicGuidedAnswerResponse> {
  const query = new URLSearchParams();
  query.set('q', params.q);
  if (params.intent) query.set('intent', params.intent);
  if (params.language) query.set('language', params.language);
  if (params.domain) query.set('domain', params.domain);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  return getJson<PublicGuidedAnswerResponse>(
    `/api/public-content/answer/guided?${query.toString()}`,
  );
}

export function getPublicSourceDetail(params: {
  entityType: string;
  entityId: string;
}): Promise<PublicSourceDetailResponse> {
  const query = new URLSearchParams();
  query.set('entityType', params.entityType);
  query.set('entityId', params.entityId);
  return getJson<PublicSourceDetailResponse>(
    `/api/public-content/source/detail?${query.toString()}`,
  );
}
