// Activités œnotouristiques — informations validées du domaine, reprises de
// https://www.lesamoureuses.wine/oenotourisme/ (durées, tarifs, contenus).
// La disponibilité en temps réel dépend du prestataire Elloha ; sans accès API
// elle ne peut pas être vérifiée (voir l'interface, qui le signale).
import type { Activity } from '../lib/types';

export const ACTIVITIES: Activity[] = [
  {
    id: 'gamme-complete',
    titleFr: 'Visite de la Cave & Dégustation de la Gamme Complète',
    titleEn: 'Cellar Tour & Full Range Tasting',
    descFr: "Visite guidée de la cave : vinification, élevage en barriques et amphores, puis dégustation commentée de l'ensemble de la gamme du domaine.",
    descEn: 'Guided cellar tour — winemaking, barrel and amphora ageing — followed by a guided tasting of the estate’s full range.',
    duration: '1h30', priceFrom: 10,
    ellohaId: 'd02ed4e6-ce00-433b-a314-817471da5f1e',
  },
  {
    id: 'amphores-barriques',
    titleFr: 'Visite & dégustation sur amphores et barriques',
    titleEn: 'Amphorae & Barrels Tour & Tasting',
    descFr: "Comprenez l'influence des élevages : dégustation comparative de vins élevés en amphores et en barriques.",
    descEn: 'Understand the influence of ageing vessels: comparative tasting of amphora- and barrel-aged wines.',
    duration: '2h', priceFrom: 30,
    ellohaId: '3e4bb70f-5719-433e-8cf8-c6deffa8115d',
  },
  {
    id: 'accords-ete',
    titleFr: 'Accords Mets & Vins — Version Été',
    titleEn: 'Food & Wine Pairing — Summer',
    descFr: 'Visite, dégustation de cuvées estivales puis repas convivial en extérieur autour du brasero. Saveurs et convivialité en plein air.',
    descEn: 'Tour, tasting of summer cuvées then a convivial outdoor meal around the brasero.',
    duration: '3h', priceFrom: 80,
    ellohaId: '5e482345-c0ae-4940-b83e-9ce477f16eee',
  },
  {
    id: 'accords-hiver',
    titleFr: 'Accords Mets & Vins — Version Hiver',
    titleEn: 'Food & Wine Pairing — Winter',
    descFr: 'Visite guidée, dégustation approfondie et mets de saison en salle de séminaire. Chaleur et gastronomie.',
    descEn: 'Guided tour, in-depth tasting and seasonal dishes in the seminar room.',
    duration: '3h', priceFrom: 55,
    ellohaId: '91dc66e6-c338-4904-b9da-27c42d5f98a8',
  },
];

/* --------------------- Analyse du texte libre (visite) -------------------- */

const NUM_WORDS: Record<string, number> = {
  un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10,
  one: 1, two: 2, three: 3, four: 4, five: 5, seven: 7, eight: 8, nine: 9, ten: 10,
};

const DAYS: [RegExp, string][] = [
  [/lundi|monday/i, 'lundi'], [/mardi|tuesday/i, 'mardi'], [/mercredi|wednesday/i, 'mercredi'],
  [/jeudi|thursday/i, 'jeudi'], [/vendredi|friday/i, 'vendredi'], [/samedi|saturday/i, 'samedi'],
  [/dimanche|sunday/i, 'dimanche'],
];

export interface VisitAnswers {
  participants?: number;
  day?: string;         // jour souhaité en clair (ex. « samedi ») ou date saisie
  dateText?: string;
  preference?: 'degustation' | 'repas' | 'decouverte';
}

export function parseBookingText(text: string, current: VisitAnswers = {}): { answers: VisitAnswers; found: string[] } {
  const answers = { ...current };
  const found: string[] = [];
  // « nous sommes six », « 6 personnes », « à 4 », « groupe de 8 »
  const numMatch = text.match(/(?:nous sommes|on est|sommes|we are|group(?:e)? de|for)\s+(\d+|[a-z]+)/i)
    ?? text.match(/(\d+)\s*(?:personnes?|people|pers\b|convives|guests)/i);
  if (numMatch) {
    const raw = numMatch[1].toLowerCase();
    const n = parseInt(raw, 10);
    const val = isNaN(n) ? NUM_WORDS[raw] : n;
    if (val) { answers.participants = val; found.push('participants'); }
  } else {
    const wordMatch = text.match(/\b(deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\s*(?:personnes?|convives)?/i);
    if (wordMatch) { answers.participants = NUM_WORDS[wordMatch[1].toLowerCase()]; found.push('participants'); }
  }
  for (const [re] of DAYS) {
    const day = text.match(re);
    if (day) { answers.day = day[0]; found.push('day'); break; }
  }
  const dateMatch = text.match(/\b(?:\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?|(?:\d{1,2} (?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)|(?:january|february|march|april|may|june|july|august|september|october|november|december) \d{1,2})(?: \d{4})?|demain|tomorrow)\b/i);
  if (dateMatch) { answers.day = dateMatch[0]; found.push('day'); }
  if (/repas|mets|gastronom|d[îi]ner|d[ée]jeuner|meal|dinner|lunch|food/i.test(text)) { answers.preference = 'repas'; found.push('preference'); }
  else if (/d[ée]gustation|tasting|vin\b/i.test(text)) { answers.preference = 'degustation'; found.push('preference'); }
  else if (/d[ée]couverte|visite|tour|discover/i.test(text)) { answers.preference = 'decouverte'; found.push('preference'); }
  return { answers, found };
}

export function matchActivities(answers: VisitAnswers): Activity[] {
  const list = [...ACTIVITIES];
  if (answers.preference === 'repas') return list.filter((a) => a.id.startsWith('accords'));
  if (answers.preference === 'degustation') return list.filter((a) => !a.id.startsWith('accords'));
  return list;
}
