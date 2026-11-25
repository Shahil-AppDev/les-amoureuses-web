import React from 'react';
import { View } from 'react-native';

// Fallback natif : passthrough sans animation (motion/react est un runtime
// DOM ; sur natif les écrans restent identiques, simplement sans transitions).

export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Reveal({ children, style }: any) {
  return <View style={style}>{children}</View>;
}

export function Enter({ children, style }: any) {
  return <View style={style}>{children}</View>;
}

export function Float({ children, style }: any) {
  return <View style={style}>{children}</View>;
}

export function Hoverable({ children, style }: any) {
  return <View style={style}>{children}</View>;
}

export function GlowPulse(_props: any) {
  return null;
}

export function HeroBackdrop() {
  return null;
}

export function StaggerLine({ children, style }: any) {
  return <View style={style}>{children}</View>;
}
