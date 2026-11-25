import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/theme';

// Ouvre le calendrier officiel Elloha du domaine dans un nouvel onglet.
// (La reproduction du widget JS embarqué générait des erreurs réseau dans son
// loader ; le lien direct est le comportement de repli fiable, identique à la
// version native.)
export function EllohaButton({ widgetId, idoi = '190471b7-b0ac-490e-b45e-66c74649caec', culture = 'fr-FR', label = 'Réserver' }: {
  widgetId: string;
  idoi?: string;
  culture?: string;
  label?: string;
}) {
  const url = `https://reservation.elloha.com/Widget/BookingButton/${widgetId}?idoi=${idoi}&culture=${culture}`;
  return (
    <Pressable style={styles.btn} onPress={() => window.open(url, '_blank', 'noopener')}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: colors.terra, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 2, alignSelf: 'flex-start' },
  text: { color: colors.paper, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },
});
