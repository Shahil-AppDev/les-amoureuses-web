import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors, fonts } from '../constants/theme';
import type { Lang, Product } from '../lib/types';
import { t } from '../lib/i18n';
import { decodeEntities } from '../lib/text';

export function ProductCard({ product, lang }: { product: Product; lang: Lang }) {
  const d = t(lang);
  const href = lang === 'en' ? `/en/vins/${product.slug}/` : `/vins/${product.slug}/`;
  const isWine = ['rouge', 'blanc', 'rose'].some((c) => product.categories.includes(c));
  return (
    <Link href={href as any} asChild>
      <Pressable style={styles.card}>
        <View style={styles.imgWrap}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.img} resizeMode="contain" />
          ) : (
            <View style={[styles.img, { backgroundColor: colors.line }]} />
          )}
        </View>
        <Text style={styles.name} numberOfLines={2}>{decodeEntities(product.name)}</Text>
        <Text style={styles.price}>{product.price.toFixed(2).replace('.', ',')} €{isWine ? ` ${d.perBottle}` : ''}</Text>
        {!product.inStock && <Text style={styles.stock}>{d.outOfStock}</Text>}
        <Text style={styles.cta}>{d.viewProduct} →</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '22%',
    flexGrow: 1,
    maxWidth: 278,
    minWidth: 128,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
  },
  imgWrap: { height: 184, backgroundColor: '#ece4d6', padding: 12, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 12 },
  img: { width: '100%', height: '100%' },
  name: { fontSize: 21, lineHeight: 24, color: colors.ink, minHeight: 48, ...(Platform.OS === 'web' ? { fontFamily: fonts.displayWeb } : {}) },
  price: { fontSize: 15, color: colors.terra, fontWeight: '600', marginTop: 4 },
  stock: { fontSize: 12, color: colors.error, marginTop: 4 },
  cta: { fontSize: 12, color: colors.inkSoft, letterSpacing: 1, marginTop: 10, textTransform: 'uppercase' },
});
