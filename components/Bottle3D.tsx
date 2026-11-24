import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

// Native fallback: static packshot. Full 3D ships on web/PWA in V1.
export default function Bottle3D({ image, interactive = false, label, spin }: { image?: string | null; interactive?: boolean; label?: string; spin?: boolean }) {
  return (
    <View style={styles.wrap}>
      <Image
        source={{ uri: image ?? 'https://www.lesamoureuses.wine/wp-content/uploads/2020/06/gabari-bouteille-1089x3280-SUBLIME-ROUGE-2022.png' }}
        style={styles.img}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  img: { width: '70%', height: '100%' },
});
