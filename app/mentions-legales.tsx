import React from 'react';
import { PageScreen } from '../components/screens';
import { P } from '../components/ui';
export default function Page() {
  return (
    <PageScreen lang="fr" title="Mentions légales & CGV" canonical="/mentions-legales/">
      <P>Éditeur : Domaine Les Amoureuses — 1429 Chemin de Vinsas, 07700 Bourg-Saint-Andéol — contact@lesamoureuses.wine</P>
      <P>Vente d'alcool réservée aux personnes majeures. L'abus d'alcool est dangereux pour la santé. Sachez apprécier et consommer avec modération.</P>
      <P>Conditions générales de vente, mentions légales et politique de confidentialité complètes : voir la version actuellement en ligne sur lesamoureuses.wine (reprise intégrale prévue à la bascule DNS).</P>
    </PageScreen>
  );
}
