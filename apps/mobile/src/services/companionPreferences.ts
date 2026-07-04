export const ARABIC_FONT_OPTIONS = [
  { label: 'KFGQPC Hafs', value: 'RafiqKfgqpcHafs' },
  { label: 'Amiri Quran', value: 'RafiqAmiriQuran' },
] as const;

export type ArabicFontFamily = (typeof ARABIC_FONT_OPTIONS)[number]['value'];

const ARABIC_FONT_KEY = 'rafiq:arabicFontFamily';
const DEFAULT_ARABIC_FONT: ArabicFontFamily = 'RafiqKfgqpcHafs';

let memoryArabicFont: ArabicFontFamily = DEFAULT_ARABIC_FONT;

function isArabicFontFamily(value: string | null): value is ArabicFontFamily {
  return ARABIC_FONT_OPTIONS.some((option) => option.value === value);
}

function getStorage() {
  if (typeof globalThis === 'undefined') return null;
  if (!('localStorage' in globalThis)) return null;
  return globalThis.localStorage;
}

export function getArabicFontPreference(): ArabicFontFamily {
  const stored = getStorage()?.getItem(ARABIC_FONT_KEY) ?? null;
  if (isArabicFontFamily(stored)) {
    memoryArabicFont = stored;
    return stored;
  }
  return memoryArabicFont;
}

export function setArabicFontPreference(value: ArabicFontFamily) {
  memoryArabicFont = value;
  getStorage()?.setItem(ARABIC_FONT_KEY, value);
}

