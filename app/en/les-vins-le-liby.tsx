import React from 'react';
import { View } from 'react-native';
import { WebShell } from '../../components/WebShell';
import { SeoHead, absUrl } from '../../components/SeoHead';
import { Section, H1, Eyebrow } from '../../components/ui';
import { ProductCard } from '../../components/ProductCard';
import { PRODUCTS } from '../../data/products';
export default function Page() {
  const items = PRODUCTS.filter((p) => p.categories.includes('le-liby'));
  return (
    <WebShell lang="en">
      <SeoHead title="Le Liby | Domaine Les Amoureuses" canonical={absUrl('/en/les-vins-le-liby/')} hreflangFr={absUrl('/les-vins-le-liby/')} hreflangEn={absUrl('/en/les-vins-le-liby/')} />
      <Section>
        <Eyebrow>The Wines</Eyebrow>
        <H1>Le Liby</H1>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 24 }}>
          {items.map((p) => <ProductCard key={p.id} product={p} lang="en" />)}
        </View>
      </Section>
    </WebShell>
  );
}
