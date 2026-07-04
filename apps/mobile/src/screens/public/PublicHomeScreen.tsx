import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CompanionDeviceShell } from '../../components/CompanionDeviceShell';
import {
  companionColors,
  companionLayout,
  companionRadii,
  companionShadow,
  companionSpacing,
  companionTypography,
} from '../../theme/mobileCompanionDesignSystem';

const TODAY_GUIDANCE = [
  {
    key: 'anxious',
    label: 'Anxious',
    theme: 'Tawakkul',
    situation: 'I need calm reliance on Allah.',
    ayah: 'And whoever relies upon Allah, then He is sufficient for him.',
    reference: 'Quran 65:3',
    meaning: 'Allah does not ask you to control every outcome. Take the next responsible step, then return the result to Him.',
    sunnah: 'The Prophet taught reliance with effort, dua, and patience. Tawakkul is not giving up; it is acting with trust.',
    reflectionPrompt: 'Where can I take one step and leave the outcome to Allah?',
    action: 'Make istighfar, complete one practical step, then make dua before moving on.',
  },
  {
    key: 'sad',
    label: 'Sad',
    theme: 'Rahmah',
    situation: 'I need hope and gentleness.',
    ayah: 'Your Lord has not forsaken you, nor has He detested you.',
    reference: 'Quran 93:3',
    meaning: 'Low moments are not proof that Allah has left you. His mercy can meet you in quiet, tired places too.',
    sunnah: 'The Prophet gave space for grief while keeping the heart connected to Allah, patience, and reward.',
    reflectionPrompt: 'What mercy can I still notice today?',
    action: 'Read Surah Ad-Duha slowly, then write one mercy you still see.',
  },
  {
    key: 'grateful',
    label: 'Grateful',
    theme: 'Shukr',
    situation: 'I want gratitude to become worship.',
    ayah: 'If you are grateful, I will surely increase you.',
    reference: 'Quran 14:7',
    meaning: 'Gratitude grows when the blessing leads to remembrance, humility, and service.',
    sunnah: 'The Prophet turned blessings into worship, thanks, generosity, and remembrance.',
    reflectionPrompt: 'Which blessing can I turn into worship today?',
    action: 'Name three blessings, pray two rakaat, and thank one person sincerely.',
  },
  {
    key: 'lost',
    label: 'Lost',
    theme: 'Hidayah',
    situation: 'I need a simple way back.',
    ayah: 'Guide us to the straight path.',
    reference: 'Quran 1:6',
    meaning: 'Guidance begins with asking Allah honestly, then choosing one obedient next step.',
    sunnah: 'Small consistent deeds keep the path alive when the heart feels unsure.',
    reflectionPrompt: 'What is one small step back to Allah today?',
    action: 'Read Al-Fatihah slowly and ask Allah for guidance before the next decision.',
  },
];

const MOMENTS = ['3 min', '10 min', 'After salah'];

export function PublicHomeScreen() {
  const [selectedNeed, setSelectedNeed] = useState(TODAY_GUIDANCE[0].key);
  const [selectedMoment, setSelectedMoment] = useState(MOMENTS[0]);
  const [reflection, setReflection] = useState('');
  const [actionDone, setActionDone] = useState(false);

  const guidance = useMemo(
    () => TODAY_GUIDANCE.find((item) => item.key === selectedNeed) ?? TODAY_GUIDANCE[0],
    [selectedNeed],
  );

  return (
    <CompanionDeviceShell>
      <View style={styles.todayHeader}>
        <Text style={styles.kicker}>Today</Text>
        <Text style={styles.title}>What is your heart carrying?</Text>
        <Text style={styles.subtitle}>
          Choose a need. Receive one Quran reminder, one meaning, Sunnah support, and one action.
        </Text>
      </View>

      <View style={styles.needRow}>
        {TODAY_GUIDANCE.map((item) => {
          const active = item.key === selectedNeed;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={item.key}
              onPress={() => {
                setSelectedNeed(item.key);
                setActionDone(false);
                setReflection('');
              }}
              style={[styles.needChip, active ? styles.needChipActive : null]}
            >
              <Text style={[styles.needLabel, active ? styles.needLabelActive : null]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.momentRow}>
        {MOMENTS.map((moment) => {
          const active = moment === selectedMoment;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={moment}
              onPress={() => setSelectedMoment(moment)}
              style={[styles.momentChip, active ? styles.momentChipActive : null]}
            >
              <Text style={[styles.momentLabel, active ? styles.momentLabelActive : null]}>{moment}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.quranPanel, companionShadow.soft]}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelKicker}>Quran Reminder</Text>
          <Text style={styles.reference}>{guidance.reference}</Text>
        </View>
        <Text style={styles.ayah}>{guidance.ayah}</Text>
        <Text style={styles.theme}>{guidance.theme}</Text>
        <Text style={styles.situation}>{guidance.situation}</Text>
        <Link href="/quran/1" style={styles.goldButton}>
          Read Quran
        </Link>
      </View>

      <View style={styles.layerStack}>
        <View style={styles.meaningLayer}>
          <Text style={styles.layerKicker}>Meaning</Text>
          <Text style={styles.layerText}>{guidance.meaning}</Text>
        </View>

        <View style={styles.sunnahLayer}>
          <Text style={styles.layerKicker}>Sunnah Support</Text>
          <Text style={styles.layerText}>{guidance.sunnah}</Text>
          <Link href="/hadith" style={styles.inlineLink}>
            Study Sunnah
          </Link>
        </View>
      </View>

      <View style={styles.reflectionPanel}>
        <Text style={styles.layerKicker}>Reflect Once</Text>
        <Text style={styles.prompt}>{guidance.reflectionPrompt}</Text>
        <TextInput
          accessibilityLabel="Today reflection"
          multiline
          onChangeText={setReflection}
          placeholder="Write one honest sentence..."
          placeholderTextColor={companionColors.muted}
          style={styles.reflectionInput}
          value={reflection}
        />
        {reflection.length ? <Text style={styles.savedHint}>Saved in today's draft.</Text> : null}
      </View>

      <View style={styles.actionDock}>
        <View style={styles.actionCopy}>
          <Text style={styles.layerKicker}>One Action</Text>
          <Text style={styles.actionText}>{guidance.action}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: actionDone }}
          onPress={() => setActionDone((value) => !value)}
          style={[styles.actionButton, actionDone ? styles.actionButtonDone : null]}
        >
          <Text style={styles.actionButtonText}>{actionDone ? 'Done' : 'Mark done'}</Text>
        </Pressable>
      </View>

      <View style={styles.continuePanel}>
        <Text style={styles.continueTitle}>Need more guidance?</Text>
        <Text style={styles.continueText}>
          Ask RAFIQ with your own words or continue reading from the Quran.
        </Text>
        <View style={styles.continueActions}>
          <Link href="/answer" style={styles.primaryLink}>
            Ask RAFIQ
          </Link>
          <Link href="/search" style={styles.secondaryLink}>
            Learn more
          </Link>
        </View>
      </View>
    </CompanionDeviceShell>
  );
}

const styles = StyleSheet.create({
  todayHeader: {
    gap: companionSpacing.xs,
    paddingTop: companionSpacing.xs,
  },
  kicker: {
    ...companionTypography.label,
    color: companionColors.goldSoft,
    textTransform: 'uppercase',
  },
  title: {
    ...companionTypography.screenTitle,
    color: companionColors.white,
  },
  subtitle: {
    ...companionTypography.body,
    color: companionColors.mint,
  },
  needRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: companionSpacing.xs,
  },
  needChip: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.full,
    borderWidth: 1,
    minHeight: companionLayout.minTouch,
    paddingHorizontal: companionSpacing.md,
    paddingVertical: companionSpacing.sm,
  },
  needChipActive: {
    backgroundColor: companionColors.gold,
    borderColor: companionColors.gold,
  },
  needLabel: {
    color: companionColors.ink,
    fontWeight: '900',
  },
  needLabelActive: {
    color: companionColors.ink,
  },
  momentRow: {
    flexDirection: 'row',
    gap: companionSpacing.xs,
  },
  momentChip: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: companionRadii.full,
    borderWidth: 1,
    flex: 1,
    minHeight: companionLayout.minTouch,
    paddingHorizontal: companionSpacing.sm,
    paddingVertical: companionSpacing.sm,
  },
  momentChipActive: {
    backgroundColor: companionColors.mint,
    borderColor: companionColors.mint,
  },
  momentLabel: {
    color: companionColors.mint,
    fontWeight: '900',
    textAlign: 'center',
  },
  momentLabelActive: {
    color: companionColors.ink,
  },
  quranPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.gold,
    borderRadius: companionRadii.xl,
    borderWidth: 1,
    gap: companionSpacing.md,
    padding: companionSpacing.xl,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: companionSpacing.sm,
    justifyContent: 'space-between',
  },
  panelKicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  reference: {
    color: companionColors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  ayah: {
    color: companionColors.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 37,
  },
  theme: {
    color: companionColors.gold,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 25,
  },
  situation: {
    ...companionTypography.body,
    color: companionColors.inkSoft,
  },
  goldButton: {
    alignSelf: 'flex-start',
    backgroundColor: companionColors.gold,
    borderRadius: companionRadii.full,
    color: companionColors.ink,
    fontWeight: '900',
    minHeight: companionLayout.minTouch,
    overflow: 'hidden',
    paddingHorizontal: companionSpacing.lg,
    paddingVertical: companionSpacing.sm,
  },
  layerStack: {
    gap: companionSpacing.sm,
  },
  meaningLayer: {
    backgroundColor: companionColors.paperWarm,
    borderColor: companionColors.line,
    borderRadius: companionRadii.lg,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.lg,
  },
  sunnahLayer: {
    backgroundColor: companionColors.mist,
    borderColor: companionColors.mint,
    borderRadius: companionRadii.lg,
    borderWidth: 1,
    gap: companionSpacing.xs,
    padding: companionSpacing.lg,
  },
  layerKicker: {
    ...companionTypography.label,
    color: companionColors.gold,
    textTransform: 'uppercase',
  },
  layerText: {
    ...companionTypography.body,
    color: companionColors.ink,
  },
  inlineLink: {
    color: companionColors.night,
    fontWeight: '900',
    marginTop: companionSpacing.xs,
  },
  reflectionPanel: {
    backgroundColor: companionColors.paper,
    borderColor: companionColors.line,
    borderRadius: companionRadii.xl,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.lg,
  },
  prompt: {
    color: companionColors.ink,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 24,
  },
  reflectionInput: {
    backgroundColor: companionColors.pearl,
    borderColor: companionColors.line,
    borderRadius: companionRadii.md,
    borderWidth: 1,
    color: companionColors.ink,
    fontSize: 16,
    minHeight: 104,
    padding: companionSpacing.md,
    textAlignVertical: 'top',
  },
  savedHint: {
    color: companionColors.night,
    fontWeight: '900',
  },
  actionDock: {
    alignItems: 'center',
    backgroundColor: companionColors.goldSoft,
    borderColor: companionColors.gold,
    borderRadius: companionRadii.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: companionSpacing.md,
    padding: companionSpacing.lg,
  },
  actionCopy: {
    flex: 1,
    gap: companionSpacing.xs,
  },
  actionText: {
    color: companionColors.ink,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 24,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: companionColors.night,
    borderRadius: companionRadii.full,
    justifyContent: 'center',
    minHeight: companionLayout.minTouch,
    minWidth: 94,
    paddingHorizontal: companionSpacing.md,
  },
  actionButtonDone: {
    backgroundColor: companionColors.inkSoft,
  },
  actionButtonText: {
    color: companionColors.white,
    fontWeight: '900',
    textAlign: 'center',
  },
  continuePanel: {
    backgroundColor: companionColors.nightSoft,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: companionRadii.xl,
    borderWidth: 1,
    gap: companionSpacing.sm,
    padding: companionSpacing.lg,
  },
  continueTitle: {
    color: companionColors.white,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
  },
  continueText: {
    ...companionTypography.body,
    color: companionColors.mint,
  },
  continueActions: {
    flexDirection: 'row',
    gap: companionSpacing.sm,
  },
  primaryLink: {
    backgroundColor: companionColors.paper,
    borderRadius: companionRadii.full,
    color: companionColors.ink,
    flex: 1,
    fontWeight: '900',
    minHeight: companionLayout.minTouch,
    overflow: 'hidden',
    paddingVertical: companionSpacing.md,
    textAlign: 'center',
  },
  secondaryLink: {
    backgroundColor: companionColors.mint,
    borderRadius: companionRadii.full,
    color: companionColors.ink,
    flex: 1,
    fontWeight: '900',
    minHeight: companionLayout.minTouch,
    overflow: 'hidden',
    paddingVertical: companionSpacing.md,
    textAlign: 'center',
  },
});
