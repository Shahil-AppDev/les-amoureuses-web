import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

// PROVISOIRE (V1) : géométrie et étiquette générées par code en attendant le
// modèle GLB et les textures validés par le domaine. À remplacer par un
// <Gltf src="/models/cuvee.glb"> dès livraison des assets.

function useLabelTexture(text: string) {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 640;
    const g = c.getContext('2d')!;
    g.fillStyle = '#F5EFE4';
    g.fillRect(0, 0, 512, 640);
    g.strokeStyle = '#B9975B';
    g.lineWidth = 6;
    g.strokeRect(24, 24, 464, 592);
    g.fillStyle = '#26211A';
    g.textAlign = 'center';
    g.font = '600 34px Georgia, serif';
    g.fillText('DOMAINE', 256, 120);
    g.font = '600 56px Georgia, serif';
    g.fillStyle = '#A8502E';
    g.fillText('LES', 256, 210);
    g.fillText('AMOUREUSES', 256, 280);
    g.font = '28px Georgia, serif';
    g.fillStyle = '#26211A';
    g.fillText('ARDÈCHE', 256, 350);
    g.font = 'italic 30px Georgia, serif';
    g.fillText(text, 256, 470);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }, [text]);
}

function Bottle({ label, spin }: { label: string; spin: boolean }) {
  const group = useRef<THREE.Group>(null);
  const tex = useLabelTexture(label);

  const { body, neck } = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const profile: [number, number][] = [
      [0.0, 0], [0.42, 0], [0.46, 0.04], [0.48, 0.12], [0.48, 1.35],
      [0.44, 1.62], [0.28, 1.85], [0.15, 1.98], [0.13, 2.15],
      [0.13, 2.42], [0.16, 2.48], [0.16, 2.55], [0.0, 2.55],
    ];
    profile.forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)));
    const body = new THREE.LatheGeometry(pts, 48);
    return { body, neck: null };
  }, []);

  useFrame((state, dt) => {
    if (!group.current) return;
    if (spin) group.current.rotation.y += dt * 0.6;
    else {
      const p = state.pointer;
      group.current.rotation.y += ((p.x * 0.6) - group.current.rotation.y) * 0.06;
      group.current.rotation.x += ((p.y * 0.15) - group.current.rotation.x) * 0.06;
    }
  });

  return (
    <group ref={group} position={[0, -1.25, 0]}>
      <mesh geometry={body}>
        <meshPhysicalMaterial
          color="#3a2a20"
          roughness={0.15}
          metalness={0.05}
          transmission={0.35}
          thickness={0.6}
          clearcoat={1}
        />
      </mesh>
      <mesh position={[0, 0.85, 0.482]}>
        <planeGeometry args={[0.62, 0.8]} />
        <meshStandardMaterial map={tex} roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.135, 0.135, 0.34, 24]} />
        <meshStandardMaterial color="#7C3E26" roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  );
}

function WebGLFallback({ image }: { image?: string | null }) {
  return (
    <View style={styles.wrap}>
      {image ? (
        <Image source={{ uri: image }} style={styles.img} resizeMode="contain" />
      ) : (
        <Text style={styles.note}>Aperçu 3D indisponible</Text>
      )}
    </View>
  );
}

export default function Bottle3D({ image, label = 'Cuvée « A »', interactive = true, spin = false }: {
  image?: string | null;
  label?: string;
  interactive?: boolean;
  spin?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  // Le Canvas n'est monté qu'après hydratation : le rendu SSR/1er paint affiche
  // le packshot (cohérent SSR ↔ client, et visuel immédiat pendant le chargement).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (failed || reduced || !mounted || !(window as any).WebGLRenderingContext) {
    return <WebGLFallback image={image} />;
  }

  return (
    <View style={styles.wrap} accessibilityLabel="Bouteille 3D interactive">
      <Canvas
        camera={{ position: [0, 0.3, 5.4], fov: 30 }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
        onError={() => setFailed(true)}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 4]} intensity={1.4} color="#fff2dd" />
        <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#d8e2ff" />
        <Suspense fallback={null}>
          <Bottle label={label} spin={spin && !interactive} />
          <ContactShadows position={[0, -1.28, 0]} opacity={0.35} scale={5} blur={2.4} />
          {interactive && <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.9} />}
        </Suspense>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', height: '100%' },
  img: { width: '100%', height: '100%' },
  note: { textAlign: 'center', color: '#5B5245', marginTop: 40 },
});
