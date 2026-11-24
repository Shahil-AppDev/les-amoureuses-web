import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { Link } from 'expo-router';
import { colors, fonts } from '../constants/theme';

const webFont = (stack: string) => (Platform.OS === 'web' ? { fontFamily: stack } : {});

export function H1({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.h1, webFont(fonts.displayWeb), style]}>{children}</Text>;
}
export function H2({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.h2, webFont(fonts.displayWeb), style]}>{children}</Text>;
}
export function P({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.p, webFont(fonts.bodyWeb), style]}>{children}</Text>;
}
export function Eyebrow({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.eyebrow, webFont(fonts.bodyWeb), style]}>{children}</Text>;
}

export function Section({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.section, style]}>{children}</View>;
}

export function CTAButton({ href, label, primary = true, onPress, style }: {
  href?: string; label: string; primary?: boolean;
  onPress?: () => void; style?: StyleProp<ViewStyle>;
}) {
  const inner = (
    <Text style={[styles.ctaText, !primary && styles.ctaTextGhost, webFont(fonts.bodyWeb)]}>{label}</Text>
  );
  // StyleSheet.flatten requis : à l'intérieur d'un <Link asChild>, Radix Slot
  // fusionne les styles par spread — un tableau deviendrait {0:..,1:..} et ferait
  // planter React DOM (CSSStyleDeclaration indexed setter).
  const box = StyleSheet.flatten([styles.cta, primary ? styles.ctaPrimary : styles.ctaGhost, style]);
  if (href) {
    return (
      <Link href={href as any} asChild>
        <Pressable style={box}>{inner}</Pressable>
      </Link>
    );
  }
  return <Pressable onPress={onPress} style={box}>{inner}</Pressable>;
}

export const styles = StyleSheet.create({
  h1: { fontSize: 44, lineHeight: 50, color: colors.ink, fontWeight: '500' },
  h2: { fontSize: 32, lineHeight: 38, color: colors.ink, fontWeight: '500' },
  p: { fontSize: 16, lineHeight: 26, color: colors.inkSoft },
  eyebrow: { fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: colors.terra, marginBottom: 8 },
  section: { maxWidth: 1080, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  cta: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 2, alignSelf: 'flex-start' },
  ctaPrimary: { backgroundColor: colors.terra },
  ctaGhost: { borderWidth: 1, borderColor: colors.ink },
  ctaText: { color: colors.paper, fontSize: 15, letterSpacing: 1, textTransform: 'uppercase' },
  ctaTextGhost: { color: colors.ink },
});
