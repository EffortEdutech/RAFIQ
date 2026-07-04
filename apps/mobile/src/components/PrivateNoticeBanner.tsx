import { StyleSheet, Text, View } from 'react-native';
import { PRIVATE_CONTENT_LABEL, type PrivateContentNotice } from '@rafiq/shared';

type Props = {
  notice?: PrivateContentNotice;
};

export function PrivateNoticeBanner({ notice }: Props) {
  return (
    <View style={styles.banner}>
      <Text style={styles.label}>{notice?.label ?? PRIVATE_CONTENT_LABEL}</Text>
      <Text style={styles.message}>
        {notice?.message ?? 'Private RAFIQ development and testing only.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#fff1f2',
    borderColor: '#9f1239',
    borderRadius: 14,
    borderWidth: 2,
    padding: 12,
  },
  label: { color: '#9f1239', fontWeight: '800' },
  message: { color: '#7f1d1d', marginTop: 4 },
});
