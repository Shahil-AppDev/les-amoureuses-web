import React from 'react';
import { motion, MotionConfig } from 'motion/react';

// Primitives d'animation web (motion/react). Le fallback natif est un simple
// passthrough : les animations sont un enrichissement progressif côté web.
// reducedMotion="user" respecte prefers-reduced-motion pour toutes les
// animations descendantes (translation/scale neutralisées automatiquement).

export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Apparition au scroll : fondu + légère montée, une seule fois.
export function Reveal({ children, delay = 0, y = 28, style }: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      style={{ display: 'flex', flexDirection: 'column', ...style }}
    >
      {children}
    </motion.div>
  );
}

// Entrée immédiate (hero) : fondu + montée au montage.
export function Enter({ children, delay = 0, y = 34, duration = 0.9, style }: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: EASE_OUT }}
      style={{ display: 'flex', flexDirection: 'column', ...style }}
    >
      {children}
    </motion.div>
  );
}

// Lévitation douce en boucle (bouteille hero, médaillon).
export function Float({ children, amplitude = 10, duration = 5, style }: {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      animate={{ y: [-amplitude / 2, amplitude / 2, -amplitude / 2] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Micro-interaction survol/pression pour les cartes et CTA.
export function Hoverable({ children, scale = 1.03, lift = 4, style }: {
  children: React.ReactNode;
  scale?: number;
  lift?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      whileHover={{ scale, y: -lift }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      style={{ display: 'flex', flexDirection: 'column', ...style }}
    >
      {children}
    </motion.div>
  );
}

// Lueur dorée pulsante derrière le médaillon/bouteille.
export function GlowPulse({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.06, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(185,151,91,0.28) 0%, rgba(185,151,91,0.08) 45%, transparent 70%)',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

// Fond hero « 2026 » : dégradé encre→bordeaux, halo doré, grain subtil.
// Couvre tout le conteneur parent (position absolute inset 0).
export function HeroBackdrop() {
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(155deg, #171008 0%, #2A0E14 42%, #500C19 78%, #3A0A12 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 55% at 72% 40%, rgba(185,151,91,0.16) 0%, transparent 65%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
        background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.012) 2px 4px)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent, rgba(185,151,91,0.55), transparent)',
      }} />
    </>
  );
}

// Apparition en cascade de lignes de titre (hero).
export function StaggerLine({ children, index, style }: {
  children: React.ReactNode;
  index: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, delay: 0.15 + index * 0.14, ease: EASE_OUT }}
      style={{ display: 'flex', flexDirection: 'column', ...style }}
    >
      {children}
    </motion.div>
  );
}
