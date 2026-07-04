import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  active: boolean;
  label: string;
  onPress: () => void;
};

export function ToggleChip({ active, label, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, active ? styles.activeChip : styles.inactiveChip]}
    >
      <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeChip: { backgroundColor: '#0f766e', borderColor: '#0f766e' },
  inactiveChip: { backgroundColor: '#ffffff', borderColor: '#cbd5e1' },
  label: { fontWeight: '800' },
  activeLabel: { color: '#ffffff' },
  inactiveLabel: { color: '#334155' },
});
