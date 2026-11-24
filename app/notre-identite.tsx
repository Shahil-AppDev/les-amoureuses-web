import React from 'react';
import { PageScreen } from '../components/screens';
import { P } from '../components/ui';
export default function Page() {
  return (
    <PageScreen lang="fr" eyebrow="Notre Identité" title="Une viticulture biologique & biodynamique"
      canonical="/notre-identite/" frUrl="/notre-identite/" enUrl="/en/notre-identite/">
      <P>Certifiés Agriculture Biologique par ECOCERT et biodynamie par DEMETER, nous cultivons la vigne dans le respect scrupuleux des cycles naturels, des équilibres du sol et de la biodiversité locale.</P>
      <P>Exclusion d'herbicides, pesticides et engrais chimiques, enherbement naturel, taille manuelle et préparations biodynamiques : chaque geste est une promesse, chaque parcelle une histoire à préserver.</P>
      <P>Le Domaine Les Amoureuses est un projet de liberté et de contraste, incarnant une Ardèche créative — des vins qui sont la pure expression de notre terroir ardéchois.</P>
    </PageScreen>
  );
}
