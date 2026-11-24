import React from 'react';
import { PageScreen, QuoteForm } from '../components/screens';
import { P } from '../components/ui';
export default function Page() {
  return (
    <PageScreen lang="fr" title="Contact" eyebrow="Nous écrire"
      canonical="/contact/" frUrl="/contact/" enUrl="/en/contact/">
      <P>Domaine Les Amoureuses — 1429 Chemin de Vinsas, 07700 Bourg-Saint-Andéol</P>
      <P>+33 (0)4 75 54 51 85 · contact@lesamoureuses.wine</P>
      <QuoteForm lang="fr" subject="Contact — lesamoureuses.wine" />
    </PageScreen>
  );
}
