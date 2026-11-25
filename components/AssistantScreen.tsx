import React from 'react';
import type { ChatMode } from '../lib/assistant-chat';
import type { Lang } from '../lib/types';
import { AssistantConversation } from './Assistant';
import { SeoHead, absUrl } from './SeoHead';
import { Section } from './ui';
import { WebShell } from './WebShell';

const pages = {
  fr: {
    vin: ['Trouver ma cuvée', '/trouver-ma-cuvee/', 'Trouvez un accord mets et vins avec le sommelier des Amoureuses.'],
    visite: ['Préparer ma visite', '/preparer-ma-visite/', 'Comparez les visites et dégustations du domaine Les Amoureuses.'],
  },
  en: {
    vin: ['Find my cuvée', '/en/find-my-wine/', 'Find a food and wine pairing with the Les Amoureuses sommelier.'],
    visite: ['Plan my visit', '/en/plan-my-visit/', 'Compare tours and tastings at Domaine Les Amoureuses.'],
  },
} as const;

export function AssistantScreen({ lang, flow }: { lang: Lang; flow: ChatMode }) {
  const [title, path, description] = pages[lang][flow];
  return (
    <WebShell lang={lang} hideChat>
      <SeoHead title={`${title} | Domaine Les Amoureuses`} description={description} canonical={absUrl(path)} />
      <Section style={{ maxWidth: 760 }}>
        <AssistantConversation lang={lang} flow={flow} />
      </Section>
    </WebShell>
  );
}
