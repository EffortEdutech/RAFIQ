import type { GuidanceSession } from '@rafiq/shared';

export type GrowthPreferences = {
  language: string;
  reflectionTime: string;
  guidanceMode: string;
};

export type GrowthMemoryItem = {
  sessionId: string;
  entryPoint: GuidanceSession['need']['entryPoint'] | 'quran_reading';
  title: string;
  theme: string;
  route: string;
  quranReference?: string | null;
  simpleMeaning?: string | null;
  actionLabel: string;
  actionCompleted: boolean;
  actionCompletedAt?: string | null;
  reflectionPrompt: string;
  reflectionText: string;
  savedAt: string;
  updatedAt: string;
};

export type GrowthMemoryState = {
  items: GrowthMemoryItem[];
  preferences: GrowthPreferences;
};

const MEMORY_KEY = 'rafiq:growthMemory';
const MAX_ITEMS = 12;

const DEFAULT_PREFERENCES: GrowthPreferences = {
  language: 'English',
  reflectionTime: 'Evening',
  guidanceMode: 'Quran-first',
};

const DEFAULT_STATE: GrowthMemoryState = {
  items: [],
  preferences: DEFAULT_PREFERENCES,
};

let memoryState: GrowthMemoryState = DEFAULT_STATE;

function now() {
  return new Date().toISOString();
}

function getStorage() {
  if (typeof globalThis === 'undefined') return null;
  if (!('localStorage' in globalThis)) return null;
  return globalThis.localStorage;
}

function parseState(value: string | null): GrowthMemoryState {
  if (!value) return memoryState;
  try {
    const parsed = JSON.parse(value) as Partial<GrowthMemoryState>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      preferences: { ...DEFAULT_PREFERENCES, ...(parsed.preferences ?? {}) },
    };
  } catch {
    return memoryState;
  }
}

function persist(state: GrowthMemoryState) {
  memoryState = state;
  getStorage()?.setItem(MEMORY_KEY, JSON.stringify(state));
}

function routeForSession(session: GuidanceSession) {
  if (session.need.entryPoint === 'today') return '/';
  if (session.need.entryPoint === 'ask') return `/answer?q=${encodeURIComponent(session.need.rawInput)}`;
  if (session.need.entryPoint === 'learn_theme') return `/search?q=${encodeURIComponent(session.need.detectedTheme)}`;
  if (session.quranAnchor) return `/quran/${session.quranAnchor.surahNumber}`;
  return '/';
}

function titleForSession(session: GuidanceSession) {
  if (session.guidance.title) return session.guidance.title;
  if (session.quranAnchor) return `Guidance from ${session.quranAnchor.verseKey}`;
  return session.need.detectedTheme || session.need.rawInput || 'Saved guidance';
}

export function getGrowthMemory(): GrowthMemoryState {
  const state = parseState(getStorage()?.getItem(MEMORY_KEY) ?? null);
  memoryState = state;
  return state;
}

export function getGrowthSession(sessionId: string): GrowthMemoryItem | null {
  return getGrowthMemory().items.find((item) => item.sessionId === sessionId) ?? null;
}

export function saveGuidanceSession(session: GuidanceSession) {
  const state = getGrowthMemory();
  const existing = state.items.find((item) => item.sessionId === session.sessionId);
  const savedAt = existing?.savedAt ?? now();
  const item: GrowthMemoryItem = {
    sessionId: session.sessionId,
    entryPoint: session.need.entryPoint,
    title: titleForSession(session),
    theme: session.need.detectedTheme,
    route: routeForSession(session),
    quranReference: session.quranAnchor?.verseKey ?? null,
    simpleMeaning: session.quranAnchor?.simpleMeaning ?? null,
    actionLabel: session.guidance.action.label,
    actionCompleted: existing?.actionCompleted ?? session.guidance.action.completed,
    actionCompletedAt: existing?.actionCompletedAt ?? session.guidance.action.completedAt ?? null,
    reflectionPrompt: session.guidance.reflectionPrompt,
    reflectionText: existing?.reflectionText ?? session.memory.reflectionText ?? '',
    savedAt,
    updatedAt: now(),
  };
  persist({
    ...state,
    items: [item, ...state.items.filter((current) => current.sessionId !== session.sessionId)].slice(0, MAX_ITEMS),
  });
  return item;
}

export function saveQuranReadingMemory(params: {
  verseKey: string;
  surahNumber: number;
  actionLabel: string;
  actionCompleted?: boolean;
  reflectionText?: string;
  simpleMeaning?: string | null;
}) {
  const state = getGrowthMemory();
  const sessionId = `quran:${params.verseKey}`;
  const existing = state.items.find((item) => item.sessionId === sessionId);
  const item: GrowthMemoryItem = {
    sessionId,
    entryPoint: 'quran_reading',
    title: `Reflection on ${params.verseKey}`,
    theme: 'Quran reading',
    route: `/quran/${params.surahNumber}`,
    quranReference: params.verseKey,
    simpleMeaning: params.simpleMeaning ?? null,
    actionLabel: params.actionLabel,
    actionCompleted: params.actionCompleted ?? existing?.actionCompleted ?? false,
    actionCompletedAt: params.actionCompleted ? now() : existing?.actionCompletedAt ?? null,
    reflectionPrompt: 'What is this ayah asking me to notice or practice?',
    reflectionText: params.reflectionText ?? existing?.reflectionText ?? '',
    savedAt: existing?.savedAt ?? now(),
    updatedAt: now(),
  };
  persist({
    ...state,
    items: [item, ...state.items.filter((current) => current.sessionId !== sessionId)].slice(0, MAX_ITEMS),
  });
  return item;
}

export function updateGrowthReflection(sessionId: string, reflectionText: string) {
  const state = getGrowthMemory();
  const items = state.items.map((item) =>
    item.sessionId === sessionId ? { ...item, reflectionText, updatedAt: now() } : item,
  );
  persist({ ...state, items });
}

export function updateGrowthAction(sessionId: string, actionCompleted: boolean) {
  const state = getGrowthMemory();
  const items = state.items.map((item) =>
    item.sessionId === sessionId
      ? {
          ...item,
          actionCompleted,
          actionCompletedAt: actionCompleted ? now() : null,
          updatedAt: now(),
        }
      : item,
  );
  persist({ ...state, items });
}

export function updateGrowthPreferences(preferences: Partial<GrowthPreferences>) {
  const state = getGrowthMemory();
  persist({ ...state, preferences: { ...state.preferences, ...preferences } });
  return getGrowthMemory().preferences;
}
