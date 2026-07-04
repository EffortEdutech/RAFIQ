import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrivateWorkspaceShell } from '../src/components/PrivateWorkspaceShell';
import {
  ARABIC_FONT_OPTIONS,
  type ArabicFontFamily,
  getArabicFontPreference,
  setArabicFontPreference,
} from '../src/services/companionPreferences';
import { getGrowthMemory, updateGrowthPreferences } from '../src/services/growthMemory';
import {
  companionColors,
  companionRadii,
  companionSpacing,
  companionTypography,
} from '../src/theme/mobileCompanionDesignSystem';

const LANGUAGE_OPTIONS = ['English', 'Malay', 'Arabic support'];
const REFLECTION_TIMES = ['Morning', 'After prayer', 'Evening'];
const GUIDANCE_MODES = ['Quran-first', 'Tafsir context', 'Sunnah support'];
const ARABIC_SAMPLE = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

type SettingField = 'language' | 'reflectionTime' | 'guidanceMode';

function SettingRow({
  label,
  onSelect,
  options,
  selected,
}: {
  label: string;
  onSelect: (value: string) => void;
  options: string[];
  selected: string;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.optionGrid}>
        {options.map((option) => {
          const active = selected === option;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={option}
              onPress={() => onSelect(option)}
              style={[styles.optionButton, active ? styles.optionButtonActive : null]}
            >
              <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const [preferences, setPreferences] = useState(getGrowthMemory().preferences);
  const [arabicFont, setArabicFont] = useState<ArabicFontFamily>(getArabicFontPreference);

  const arabicFontLabel =
    ARABIC_FONT_OPTIONS.find((option) => option.value === arabicFont)?.label ?? ARABIC_FONT_OPTIONS[0].label;

  useFocusEffect(
    useCallback(() => {
      setPreferences(getGrowthMemory().preferences);
      setArabicFont(getArabicFontPreference());
    }, []),
  );

  function updatePreference(field: SettingField, value: string) {
    setPreferences(updateGrowthPreferences({ [field]: value }));
  }

  function selectArabicFont(label: string) {
    const option = ARABIC_FONT_OPTIONS.find((item) => item.label === label);
    if (!option) return;
    setArabicFont(option.value);
    setArabicFontPreference(option.value);
  }

  return (
    <PrivateWorkspaceShell
      action={{ href: '/profile', label: 'Growth' }}
      eyebrow="Settings"
      subtitle="Language, rhythm, evidence lens, and Quran font."
      title="Reading settings"
    >
      <View style={styles.panel}>
        <SettingRow
          label="Language"
          onSelect={(value) => updatePreference('language', value)}
          options={LANGUAGE_OPTIONS}
          selected={preferences.language}
        />
        <SettingRow
          label="Reflection rhythm"
          onSelect={(value) => updatePreference('reflectionTime', value)}
          options={REFLECTION_TIMES}
          selected={preferences.reflectionTime}
        />
        <SettingRow
          label="Guidance lens"
          onSelect={(value) => updatePreference('guidanceMode', value)}
          options={GUIDANCE_MODES}
          selected={preferences.guidanceMode}
        />
        <SettingRow
          label="Quran Arabic font"
          onSelect={selectArabicFont}
          options={ARABIC_FONT_OPTIONS.map((option) => option.label)}
          selected={arabicFontLabel}
        />
      </View>

      <View style={styles.previewPanel}>
        <Text style={styles.previewLabel}>Preview</Text>
        <Text style={[styles.previewArabic, { fontFamily: arabicFont }]}>{ARABIC_SAMPLE}</Text>
      </View>
    </PrivateWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
  },
  settingRow: {
    borderBottomColor: companionColors.line,
    borderBottomWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.sm,
  },
  settingLabel: {
    color: companionColors.ink,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 20,
  },
  optionGrid: {
    gap: companionSpacing.xs,
  },
  optionButton: {
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.sm,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.xs,
  },
  optionButtonActive: {
    backgroundColor: companionColors.night,
    borderColor: companionColors.night,
  },
  optionText: {
    color: companionColors.ink,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
  optionTextActive: {
    color: companionColors.white,
  },
  previewPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.sm,
  },
  previewLabel: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  previewArabic: {
    ...companionTypography.quranArabic,
    color: companionColors.ink,
    fontSize: 23,
    lineHeight: 38,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
