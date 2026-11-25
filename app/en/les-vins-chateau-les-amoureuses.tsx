import React from 'react';
import { View } from 'react-native';
import { WebShell } from '../../components/WebShell';
import { SeoHead, absUrl } from '../../components/SeoHead';
import { Section, H1, Eyebrow } from '../../components/ui';
import { ProductCard } from '../../components/ProductCard';
import { PRODUCTS } from '../../data/products';
export default function Page() {
  const items = PRODUCTS.filter((p) => p.categories.includes('chateau-les-amoureuses'));
  return (
    <WebShell lang="en">
      <SeoHead title="Château les Amoureuses | Domaine Les Amoureuses" canonical={absUrl('/en/les-vins-chateau-les-amoureuses/')} hreflangFr={absUrl('/les-vins-chateau-les-amoureuses/')} hreflangEn={absUrl('/en/les-vins-chateau-les-amoureuses/')} />
      <Section>
        <Eyebrow>The Wines</Eyebrow>
        <H1>Château les Amoureuses</H1>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 24 }}>
          {items.map((p) => <ProductCard key={p.id} product={p} lang="en" />)}
        </View>
      </Section>
    </WebShell>
  );
}
