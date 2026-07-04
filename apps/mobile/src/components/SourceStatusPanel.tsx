import { StyleSheet, Text, View } from 'react-native';
import type { PrivateContentNotice } from '@rafiq/shared';

type Props = {
  notice?: PrivateContentNotice;
};

const STATUS_FIELDS: Array<{
  key: keyof PrivateContentNotice;
  label: string;
}> = [
  { key: 'rightsStatus', label: 'Rights' },
  { key: 'attributionStatus', label: 'Attribution' },
  { key: 'editorialStatus', label: 'Editorial' },
  { key: 'scholarContentStatus', label: 'Scholar/content' },
  { key: 'publicationStatus', label: 'Publication' },
];

export function SourceStatusPanel({ notice }: Props) {
  return (
    <View style={styles.panel}>
      <Text style={styles.heading}>Internal Review Status</Text>
      <View style={styles.grid}>
        {STATUS_FIELDS.map((field) => (
          <View key={field.key} style={styles.item}>
            <Text style={styles.label}>{field.label}</Text>
            <Text style={styles.value}>{String(notice?.[field.key] ?? 'pending')}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#ecfeff',
    borderColor: '#0e7490',
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  heading: { color: '#164e63', fontSize: 16, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    minWidth: 132,
    padding: 10,
  },
  label: { color: '#64748b', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  value: { color: '#0f172a', fontWeight: '800', marginTop: 4 },
});
