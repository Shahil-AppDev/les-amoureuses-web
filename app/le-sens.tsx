import React from 'react';
import { PageScreen } from '../components/screens';
import { P } from '../components/ui';
export default function Page() {
  return (
    <PageScreen lang="fr" eyebrow="Le Sens" title="Le Sens"
      canonical="/le-sens/" frUrl="/le-sens/" enUrl="/en/le-sens/">
      <P>Un projet libre, tourné vers l'avenir, fidèle à ses valeurs : la rigueur, le travail et la transmission, dans un profond respect de la nature.</P>
      <P>Aux Amoureuses, chaque geste est une promesse, chaque parcelle une histoire à préserver — une viticulture engagée, inspirée par la terre et ses rythmes.</P>
    </PageScreen>
  );
}
