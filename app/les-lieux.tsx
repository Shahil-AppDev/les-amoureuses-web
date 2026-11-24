import React from 'react';
import { PageScreen } from '../components/screens';
import { P } from '../components/ui';
export default function Page() {
  return (
    <PageScreen lang="fr" eyebrow="Les Lieux" title="Les Lieux du Domaine"
      canonical="/les-lieux/" frUrl="/les-lieux/" enUrl="/en/les-lieux/">
      <P>À Bourg-Saint-Andéol, entre Montélimar, Bollène et Avignon : les vignes, la cave et ses amphores, et « La Cuverie », notre salle de réception.</P>
      <P>1429 Chemin de Vinsas, 07700 Bourg-Saint-Andéol — à 15 min de Montélimar, 30 min d'Orange, 45 min d'Avignon.</P>
    </PageScreen>
  );
}
