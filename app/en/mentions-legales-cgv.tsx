import React from 'react';
import { PageScreen } from '../../components/screens';
import { P } from '../../components/ui';
export default function Page() {
  return (
    <PageScreen lang="en" title="Legal notice & T&Cs" canonical="/en/mentions-legales-cgv/">
      <P>Publisher: Domaine Les Amoureuses — 1429 Chemin de Vinsas, 07700 Bourg-Saint-Andéol, France — contact@lesamoureuses.wine</P>
      <P>Sale of alcohol restricted to adults. Alcohol abuse is dangerous for your health. Please consume responsibly.</P>
      <P>Full terms of sale, legal notice and privacy policy: see the version currently online at lesamoureuses.wine (full replication planned at DNS cutover).</P>
    </PageScreen>
  );
}
