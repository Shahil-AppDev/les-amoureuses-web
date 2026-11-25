import React from 'react';
import Head from 'expo-router/head';
import { SITE } from '../constants/theme';

export function SeoHead({ title, description, canonical, hreflangFr, hreflangEn, jsonLd }: {
  title: string;
  description?: string;
  canonical?: string;
  hreflangFr?: string;
  hreflangEn?: string;
  jsonLd?: object | object[];
}) {
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {hreflangFr && <link rel="alternate" hrefLang="fr" href={hreflangFr} />}
      {hreflangEn && <link rel="alternate" hrefLang="en" href={hreflangEn} />}
      {(hreflangFr || hreflangEn) && <link rel="alternate" hrefLang="x-default" href={hreflangFr ?? hreflangEn} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
      <meta property="og:site_name" content="Domaine Les Amoureuses" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
    </Head>
  );
}

export const absUrl = (path: string) => `${SITE.fr}${path.startsWith('/') ? path : `/${path}`}`;
