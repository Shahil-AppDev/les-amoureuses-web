import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import type { Lang } from '../lib/types';
import { AssistantConversation } from './Assistant';

export function ChatBubble({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const fr = lang === 'fr';
  const title = fr ? 'Le chat des Amoureuses' : 'Les Amoureuses chat';
  const close = fr ? 'Fermer le chat' : 'Close chat';

  return (
    <>
      <Pressable
        style={styles.launcher}
        accessibilityRole="button"
        accessibilityLabel={fr ? 'Ouvrir le chat des Amoureuses' : 'Open Les Amoureuses chat'}
        aria-expanded={open}
        onPress={() => setOpen(true)}
      >
        <View style={styles.icon} aria-hidden>
          <Text style={styles.dots}>{'\u2026'}</Text>
        </View>
        <Text style={styles.label}>{fr ? 'Une question ?' : 'Need help?'}</Text>
      </Pressable>
      {open && (
        <Modal visible transparent animationType="none" onRequestClose={() => setOpen(false)}>
          <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} accessible={false} focusable={false} />
            <View style={styles.panel} accessibilityViewIsModal>
              <View style={styles.header}>
                <View style={styles.heading}>
                  <Text style={styles.title} accessibilityRole="header">{title}</Text>
                  <Text style={styles.subtitle}>{fr ? 'Sommelier et réservation' : 'Sommelier and booking'}</Text>
                </View>
                <Pressable style={styles.close} accessibilityRole="button" accessibilityLabel={close} onPress={() => setOpen(false)}>
                  <Text style={styles.closeText}>{'\u00d7'}</Text>
                </Pressable>
              </View>
              <ScrollView style={styles.body} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <AssistantConversation lang={lang} flow="vin" compact />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  launcher: { position: 'absolute', right: 16, bottom: 16, zIndex: 20, minHeight: 48, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 24, borderWidth: 1, borderColor: colors.gold, backgroundColor: colors.ink },
  icon: { width: 22, height: 18, borderRadius: 5, borderBottomLeftRadius: 1, borderWidth: 1, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  dots: { color: colors.paper, fontSize: 15, lineHeight: 15, marginTop: -4 },
  label: { color: colors.paper, fontSize: 13, fontWeight: '600' },
  overlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', padding: 10, backgroundColor: 'rgba(36,37,30,0.46)' },
  panel: { width: '100%', maxWidth: 440, height: 680, maxHeight: '100%', overflow: 'hidden', borderRadius: 12, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.ink, paddingHorizontal: 14, paddingVertical: 10 },
  heading: { flex: 1 },
  title: { color: colors.paper, fontSize: 25, lineHeight: 28, ...(Platform.OS === 'web' ? { fontFamily: fonts.displayWeb } : {}) },
  subtitle: { color: '#e4c59c', fontSize: 12, marginTop: 3 },
  close: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#6c6358' },
  closeText: { color: colors.paper, fontSize: 26 },
  body: { flex: 1 },
  content: { padding: 8 },
});
