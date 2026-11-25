import { parseFreeText, type SommelierAnswers } from '../data/sommelier';
import { parseBookingText, type VisitAnswers } from '../data/visites';

export type ChatMode = 'vin' | 'visite';
type Question = 'dish' | 'budget' | 'taste' | 'participants' | 'day';
export type ChatReply = Question | 'wineResults' | 'visitResults' | 'quote' | 'unknown';

export function wineQuestion(wine: SommelierAnswers): 'dish' | 'budget' | 'taste' | 'wineResults' {
  if (!wine.dish) return 'dish';
  if (!wine.budgetKey && wine.bottleMin === undefined && wine.bottleMax === undefined && wine.totalBudget === undefined) return 'budget';
  return wine.taste ? 'wineResults' : 'taste';
}

export function visitQuestion(visit: VisitAnswers): 'participants' | 'day' | 'visitResults' {
  return !visit.participants ? 'participants' : !visit.day ? 'day' : 'visitResults';
}

export function chatTurn(text: string, mode: ChatMode, wine: SommelierAnswers, visit: VisitAnswers) {
  const plain = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const quote = /\b(?:privatisation|privatiser|devis|private hire|quote)\b/.test(plain);
  const wantsVisit = quote || /\b(?:visite|visiter|reserver|reservation|creneaux?|degustation|visit|book|booking|tour|tasting)\b/.test(plain);
  const wantsWine = /\b(?:cuvee|sommelier|accord mets|wine pairing|recommend a wine|(?:cherche|cherchons|conseill\w*) (?:un |du )?vin|(?:un|du) vin pour|wine (?:for|with)|revenons au vin|back to wine)\b/.test(plain);
  const group = /\b(?:nous sommes|on est|we are|party of|group of|\d+\s*(?:personnes?|people|guests))\b/.test(plain);
  const target: ChatMode = (quote || ((wantsVisit || group) && !wantsWine)) ? 'visite'
    : wantsWine && !wantsVisit ? 'vin' : mode;

  if (target === 'visite') {
    const { answers, found } = parseBookingText(text, visit);
    const guests = plain.match(/^(?:pour |for )?([1-9]\d{0,2})$/);
    if (guests) {
      answers.participants = Number(guests[1]);
      found.push('participants');
    }
    if (quote) return { mode: target, wine, visit: answers, reply: 'quote' as const };
    return { mode: target, wine, visit: answers, reply: found.length || wantsVisit ? visitQuestion(answers) : 'unknown' as const };
  }

  const { answers, found } = parseFreeText(text, wine);
  const exact = plain.match(/^(?:(?:budget|max(?:imum)?|moins de|under|up to)\s+)?(?:€\s*)?(\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?|eur)?\s*(?:par bouteille|per bottle)?$/)
    ?? plain.match(/(?:max(?:imum)?|moins de|under|up to)\s+(?:€\s*)?(\d+(?:[.,]\d{1,2})?)/);
  const range = plain.match(/(?:^|\s)€?\s*(\d+(?:[.,]\d{1,2})?)\s*€?\s*(?:a|et|to|and|-)\s*€?\s*(\d+(?:[.,]\d{1,2})?)/);
  if (!found.includes('totalBudget') && (exact || range)) {
    const toNumber = (value: string) => Number(value.replace(',', '.'));
    const min = range ? toNumber(range[1]) : undefined;
    const max = range ? toNumber(range[2]) : toNumber(exact![1]);
    if (max > 0 && (min === undefined || min <= max)) {
      answers.budgetKey = undefined;
      answers.bottleMin = min;
      answers.bottleMax = max;
      found.push('budget');
    }
  }
  if (found.includes('budget') && answers.budgetKey && !exact && !range) {
    answers.bottleMin = undefined;
    answers.bottleMax = undefined;
  }
  if (found.includes('totalBudget')) {
    const total = plain.match(/(?:budget total|commande|total|en tout|pour tout|order|altogether)[^0-9]{0,15}(\d+(?:[.,]\d{1,2})?)/)
      ?? plain.match(/(\d+(?:[.,]\d{1,2})?)\s*(?:€|eur|euros?)\s*(?:pour|for|au)\s+(?:la\s+|the\s+)?(?:commande|tout|order|total)/);
    if (total) answers.totalBudget = Number(total[1].replace(',', '.'));
    if (!range) answers.budgetKey = wine.budgetKey;
  }
  if (/^(?:autre|other)$/.test(plain)) { answers.dish = 'autre'; found.push('dish'); }
  return { mode: target, wine: answers, visit, reply: found.length || wantsWine ? wineQuestion(answers) : 'unknown' as const };
}
