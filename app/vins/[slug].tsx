import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ProductScreen } from '../../components/screens';
import { PRODUCTS } from '../../data/products';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default function Product() {
  const { slug, viewer } = useLocalSearchParams<{ slug: string; viewer?: string }>();
  return <ProductScreen slug={slug} lang="fr" initialViewer={viewer === "1"} />;
}
