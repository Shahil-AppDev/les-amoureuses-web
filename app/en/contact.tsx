import React from 'react';
import { PageScreen, QuoteForm } from '../../components/screens';
import { P } from '../../components/ui';
export default function Page() {
  return (
    <PageScreen lang="en" title="Contact" eyebrow="Write to us" canonical="/en/contact/" frUrl="/contact/" enUrl="/en/contact/">
      <P>Domaine Les Amoureuses — 1429 Chemin de Vinsas, 07700 Bourg-Saint-Andéol, France</P>
      <P>+33 (0)4 75 54 51 85 · contact@lesamoureuses.wine</P>
      <QuoteForm lang="en" subject="Contact — lesamoureuses.wine" />
    </PageScreen>
  );
}
