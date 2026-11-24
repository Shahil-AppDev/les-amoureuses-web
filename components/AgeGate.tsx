import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { t } from '../lib/i18n';
import { useApp } from '../context/AppContext';

export function AgeGate() {
  const { ageVerified, verifyAge, lang } = useApp();
  const d = t(lang);
  if (ageVerified !== false) return null;
  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={[styles.title, Platform.OS === 'web' && { fontFamily: fonts.displayWeb }]}>{d.legalAgeTitle}</Text>
          <Text style={styles.text}>{d.legalAgeText}</Text>
          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.yes]} onPress={() => verifyAge(true)}>
              <Text style={styles.btnText}>{d.legalYes}</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.no]}
              onPress={() => {
                if (Platform.OS === 'web') window.location.href = 'http://www.protectiondesmineurs.com/';
                else verifyAge(false);
              }}
            >
              <Text style={[styles.btnText, { color: colors.ink }]}>{d.legalNo}</Text>
            </Pressable>
          </View>
          <Text style={styles.legal}>{d.alcoholWarning}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(20,15,10,0.75)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: colors.paper, padding: 36, maxWidth: 460, width: '100%', borderTopWidth: 3, borderTopColor: colors.terra },
  title: { fontSize: 28, color: colors.ink, marginBottom: 12 },
  text: { fontSize: 15, lineHeight: 23, color: colors.inkSoft, marginBottom: 24 },
  row: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 2 },
  yes: { backgroundColor: colors.terra },
  no: { borderWidth: 1, borderColor: colors.ink },
  btnText: { color: colors.paper, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },
  legal: { marginTop: 20, fontSize: 11, color: colors.inkSoft, fontStyle: 'italic' },
});
