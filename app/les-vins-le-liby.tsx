import React from 'react';
import { View } from 'react-native';
import { WebShell } from '../components/WebShell';
import { SeoHead, absUrl } from '../components/SeoHead';
import { Section, H1, Eyebrow, P } from '../components/ui';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { t } from '../lib/i18n';
export default function Page() {
  const items = PRODUCTS.filter((p) => p.categories.includes('le-liby'));
  return (
    <WebShell lang="fr">
      <SeoHead title="Le Liby | Domaine Les Amoureuses" canonical={absUrl('/les-vins-le-liby/')} hreflangFr={absUrl('/les-vins-le-liby/')} hreflangEn={absUrl('/en/les-vins-le-liby/')} />
      <Section>
        <Eyebrow>Les Vins</Eyebrow>
        <H1>Le Liby</H1>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 24 }}>
          {items.map((p) => <ProductCard key={p.id} product={p} lang="fr" />)}
        </View>
      </Section>
    </WebShell>
  );
}
