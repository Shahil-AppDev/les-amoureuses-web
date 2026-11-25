import React from 'react';
import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/theme';

// Native fallback: opens the hosted Elloha booking page.
export function EllohaButton({ widgetId, culture = 'fr-FR' }: { widgetId: string; culture?: string }) {
  const url = `https://reservation.elloha.com/Widget/BookingButton/${widgetId}?idoi=190471b7-b0ac-490e-b45e-66c74649caec&culture=${culture}`;
  return (
    <Pressable style={styles.btn} onPress={() => Linking.openURL(url)}>
      <Text style={styles.text}>Réserver</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: colors.terra, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 2, alignSelf: 'flex-start' },
  text: { color: colors.paper, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },
});
