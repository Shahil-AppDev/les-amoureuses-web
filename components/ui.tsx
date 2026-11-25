import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { Link } from 'expo-router';
import { colors, fonts } from '../constants/theme';
import { Hoverable } from './motionfx';

const webFont = (stack: string) => (Platform.OS === 'web' ? { fontFamily: stack } : {});

export function H1({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text accessibilityRole="header" aria-level={1} style={[styles.h1, webFont(fonts.displayWeb), style]}>{children}</Text>;
}
export function H2({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text accessibilityRole="header" aria-level={2} style={[styles.h2, webFont(fonts.displayWeb), style]}>{children}</Text>;
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

export function CTAButton({ href, label, primary = true, onPress, style, inverted = false }: {
  href?: string; label: string; primary?: boolean;
  onPress?: () => void; style?: StyleProp<ViewStyle>; inverted?: boolean;
}) {
  const inner = (
    <Text style={[styles.ctaText, !primary && styles.ctaTextGhost, !primary && inverted && styles.ctaTextGhostLight, webFont(fonts.bodyWeb)]}>{label}</Text>
  );
  // StyleSheet.flatten requis : à l'intérieur d'un <Link asChild>, Radix Slot
  // fusionne les styles par spread — un tableau deviendrait {0:..,1:..} et ferait
  // planter React DOM (CSSStyleDeclaration indexed setter).
  const box = StyleSheet.flatten([
    styles.cta,
    primary ? styles.ctaPrimary : styles.ctaGhost,
    !primary && inverted && styles.ctaGhostLight,
    style,
  ]);
  const btn = href ? (
    <Link href={href as any} asChild>
      <Pressable style={box}>{inner}</Pressable>
    </Link>
  ) : (
    <Pressable onPress={onPress} accessibilityRole="button" style={box}>{inner}</Pressable>
  );
  return <Hoverable scale={1.035} lift={3} style={{ alignSelf: 'flex-start' } as any}>{btn}</Hoverable>;
}

export const styles = StyleSheet.create({
  h1: { fontSize: 48, lineHeight: 48, letterSpacing: -1.1, color: colors.ink, fontWeight: '500' },
  h2: { fontSize: 40, lineHeight: 42, letterSpacing: -0.7, color: colors.ink, fontWeight: '500' },
  p: { fontSize: 16, lineHeight: 26, color: colors.inkSoft },
  eyebrow: { fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: colors.terra, marginBottom: 8 },
  section: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 48 },
  cta: { minHeight: 46, justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 18, alignSelf: 'flex-start' },
  ctaPrimary: { backgroundColor: colors.terra },
  ctaGhost: { borderWidth: 1, borderColor: colors.ink },
  ctaGhostLight: { borderColor: 'rgba(245,239,228,0.55)' },
  ctaText: { color: colors.paper, fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  ctaTextGhost: { color: colors.ink },
  ctaTextGhostLight: { color: colors.cream },
});
