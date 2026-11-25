// Données de dégustation issues des fiches officielles du domaine
// (lesamoureuses.wine/vins/<slug>/ — millésimes, cépages, élevages, températures
// et accords repris tels quels). Moteur de recommandation du sommelier virtuel.
import type { Product } from '../lib/types';

export type DishKey = 'viande-rouge' | 'volaille' | 'poisson' | 'vegetarien' | 'fromages' | 'autre';
export type TasteKey = 'fruite' | 'puissant' | 'leger' | 'frais' | 'surprise';

export interface CuveeSpec {
  millesime: string;
  cepages: string;
  elevage: string;
  serviceTemp: string;
  degre: string;
  accordsOfficiels?: string;   // texte d'accord repris de la fiche officielle
  profiles: TasteKey[];        // profils de goût auxquels la cuvée répond
  dishes: DishKey[];           // familles de plats accordées
  prepBonus: string[];         // mots-clés de préparation qui renforcent l'accord
}

// fiche officielle : https://www.lesamoureuses.wine/vins/<slug>/
export const CUVEES: Record<string, CuveeSpec> = {
  'cuvee-a': {
    millesime: '2022', cepages: '60% Touriga, 40% Syrah',
    elevage: 'Élevage de plus de 18 mois en amphores. Vin non filtré',
    serviceTemp: '14-16°C', degre: '14,5%',
    accordsOfficiels: 'viandes grillées ou rôties, plats mijotés, volailles aux herbes, fromages affinés et légumes rôtis',
    profiles: ['puissant', 'fruite'],
    dishes: ['viande-rouge', 'volaille', 'fromages', 'vegetarien'],
    prepBonus: ['grill', 'rôt', 'à point', 'saignant', 'mijot', 'braisé', 'braise'],
  },
  'sublime': {
    millesime: '2022', cepages: '40% Petit Verdot, 35% Merlot, 25% Syrah',
    elevage: '18 mois en amphores et fûts de chêne français',
    serviceTemp: '16-18°C', degre: '14,5%',
    profiles: ['puissant'],
    dishes: ['viande-rouge', 'fromages'],
    prepBonus: ['mijot', 'sauce', 'civet', 'braisé'],
  },
  'touriga': {
    millesime: '2022', cepages: 'Touriga Nacional',
    elevage: 'Élevé 16 mois en amphores et fûts de chêne français',
    serviceTemp: '16-18°C', degre: '14%',
    profiles: ['puissant'],
    dishes: ['viande-rouge', 'fromages'],
    prepBonus: ['grill', 'à point', 'saignant'],
  },
  'tempranillo': {
    millesime: '2023', cepages: '100% Tempranillo',
    elevage: '2 ans en amphores et fûts de chêne français',
    serviceTemp: '14-16°C', degre: '14%',
    profiles: ['puissant', 'fruite'],
    dishes: ['viande-rouge', 'vegetarien'],
    prepBonus: ['grill', 'rôt', 'à point'],
  },
  'la-barbare': {
    millesime: '2023', cepages: 'Syrah et Grenache',
    elevage: '18 mois en fûts de chêne. À carafer de préférence',
    serviceTemp: '15-18°C', degre: '13,5%',
    profiles: ['puissant'],
    dishes: ['viande-rouge', 'fromages'],
    prepBonus: ['sauce', 'mijot', 'grill'],
  },
  'le-liby-rouge': {
    millesime: '2022', cepages: '25% Syrah, 25% Tempranillo, 25% Marselan, 25% Merlot',
    elevage: 'Élevé 18 mois en fûts de chêne français',
    serviceTemp: '16-18°C', degre: '14%',
    accordsOfficiels: 'viandes rouges ou volailles rôties, plats en sauce, fromages demi affinés et légumes rôtis',
    profiles: ['fruite', 'puissant'],
    dishes: ['viande-rouge', 'volaille', 'fromages', 'vegetarien'],
    prepBonus: ['sauce', 'rôt', 'mijot'],
  },
  'dandy': {
    millesime: '2021', cepages: 'Assemblage de Syrah, Mourvèdre et Touriga',
    elevage: 'Vinifié et élevé en cuves inox',
    serviceTemp: '14-16°C', degre: '14,5%',
    profiles: ['fruite'],
    dishes: ['viande-rouge', 'vegetarien'],
    prepBonus: ['grill', 'à point'],
  },
  'les-charmes': {
    millesime: '2023', cepages: '80% Grenache, 20% Syrah',
    elevage: 'Élevé 12 mois en fûts de chêne français',
    serviceTemp: '14-16°C', degre: '15%',
    profiles: ['fruite', 'leger'],
    dishes: ['volaille', 'viande-rouge'],
    prepBonus: ['rôt', 'grill'],
  },
  'grenache': {
    millesime: '2023', cepages: 'Grenache',
    elevage: 'Élevage de 6 mois en cuve inox',
    serviceTemp: '14-16°C', degre: '14,5%',
    profiles: ['fruite'],
    dishes: ['viande-rouge', 'vegetarien', 'fromages'],
    prepBonus: ['grill', 'mijot'],
  },
  'syrah': {
    millesime: '2023', cepages: 'Syrah',
    elevage: 'Cuve inox',
    serviceTemp: '14-16°C', degre: '13,5%',
    profiles: ['fruite'],
    dishes: ['viande-rouge'],
    prepBonus: ['grill', 'à point'],
  },
  'promenade': {
    millesime: '2024', cepages: 'Syrah, Malbec, Mourvèdre',
    elevage: 'Élevage de 6 mois en barriques',
    serviceTemp: '12-16°C', degre: '13%',
    profiles: ['leger', 'fruite'],
    dishes: ['volaille', 'vegetarien', 'viande-rouge'],
    prepBonus: ['grill'],
  },
  'le-colombier': {
    millesime: '2023', cepages: '80% Counoise, 20% Grenache',
    elevage: 'Élevé 12 mois en amphores et fûts de chêne français. Garde de 3 à 5 ans',
    serviceTemp: '10-14°C', degre: '13%',
    accordsOfficiels: 'viandes blanches comme les volailles ou encore un cochon de lait à la broche',
    profiles: ['leger'],
    dishes: ['volaille'],
    prepBonus: ['rôt', 'broche', 'grill'],
  },
  'cuvee-a-blanc': {
    millesime: '2022', cepages: 'Viognier, Roussanne, Marsanne',
    elevage: 'Fermentation en cuve inox et barriques de 500L. Élevage de 18 mois pour moitié en barriques de chêne français et moitié en amphores',
    serviceTemp: '12°C', degre: '14,5%',
    profiles: ['frais', 'puissant'],
    dishes: ['poisson', 'volaille', 'vegetarien', 'fromages'],
    prepBonus: ['sauce', 'crème', 'beurre blanc', 'grill'],
  },
  'le-liby-blanc': {
    millesime: '2023', cepages: '60% Viognier, 20% Roussanne, 10% Marsanne, 10% Sauvignon Blanc',
    elevage: 'Élevé 12 mois en fûts de chêne français et amphores',
    serviceTemp: '10-12°C', degre: '14%',
    profiles: ['frais'],
    dishes: ['poisson', 'fromages', 'volaille'],
    prepBonus: ['sauce', 'crème'],
  },
  'promenade-blanc': {
    millesime: '2025', cepages: 'Sauvignon Blanc, Roussanne',
    elevage: 'Cuve inox',
    serviceTemp: '10-12°C', degre: '13%',
    profiles: ['frais', 'leger'],
    dishes: ['poisson', 'vegetarien'],
    prepBonus: ['cru', 'vapeur', 'grill', 'citron'],
  },
  'loverose-2025': {
    millesime: '2025', cepages: '80% Grenache, 20% Mourvèdre',
    elevage: 'Cuve inox — certifié HVE, biologique et biodynamie',
    serviceTemp: '10°C', degre: '12,5%',
    profiles: ['frais', 'fruite'],
    dishes: ['poisson', 'vegetarien', 'volaille'],
    prepBonus: ['grill', 'cru', 'apéritif', 'salade'],
  },
};

export interface BudgetRange { key: string; min: number; max: number | null }
export const BUDGET_RANGES: BudgetRange[] = [
  { key: 'lt15', min: 0, max: 15 },
  { key: '15-30', min: 15, max: 30 },
  { key: '30-50', min: 30, max: 50 },
  { key: 'gt50', min: 50, max: null },
];

export interface SommelierAnswers {
  dish?: DishKey;
  dishDetail?: string;
  budgetKey?: string;
  bottleMin?: number;
  bottleMax?: number;
  totalBudget?: number;
  taste?: TasteKey;
  preparation?: string;
}

export interface Recommendation {
  product: Product;
  spec: CuveeSpec;
  score: number;
  totalPayable: number; // prix réellement payable pour le conditionnement minimum
  minQty: number;       // conditionnement minimum (bouteilles)
}

function priceOf(p: Product): number {
  return p.price;
}

export function conditioning(p: Product): { minQty: number; label: string } {
  // Aucune vente au carton dans le catalogue actuel : conditionnement minimum
  // d'une bouteille. La logique reste en place si le domaine active des cartons.
  const carton = p.attributes.find((a) => /carton/i.test(a.name));
  if (carton) {
    const n = parseInt(carton.terms[0], 10);
    if (n > 1) return { minQty: n, label: `carton de ${n}` };
  }
  return { minQty: 1, label: 'bouteille' };
}

export function recommend(answers: SommelierAnswers, products: Product[]): { main: Recommendation | null; alternative: Recommendation | null } {
  const range = BUDGET_RANGES.find((b) => b.key === answers.budgetKey);
  const cands: Recommendation[] = [];
  for (const p of products) {
    const spec = CUVEES[p.slug];
    if (!spec || !p.purchasable) continue;
    if (!p.inStock) continue; // un produit épuisé ne peut ni être recommandé ni ajouté
    // Le plat est un filtre strict (sauf « autre ») : recommander un vin non
    // accordé serait trompeur ; mieux vaut avouer qu'aucune cuvée ne convient.
    if (answers.dish && answers.dish !== 'autre' && !spec.dishes.includes(answers.dish)) continue;
    const price = priceOf(p);
    if (price < (answers.bottleMin ?? 0) || price > (answers.bottleMax ?? Infinity)) continue;
    if (range) {
      if (price < range.min) continue;
      if (range.max != null && price > range.max) continue;
    }
    const cond = conditioning(p);
    const totalPayable = price * cond.minQty;
    // Si un budget total de commande est indiqué, on filtre sur le montant
    // réellement payable pour le conditionnement proposé.
    if (answers.totalBudget && totalPayable > answers.totalBudget) continue;

    let score = 0;
    if (answers.dish && spec.dishes.includes(answers.dish)) score += 3;
    if (answers.taste && answers.taste !== 'surprise' && spec.profiles.includes(answers.taste)) score += 2;
    if (answers.taste === 'surprise') score += 1; // terrain neutre, la hiérarchie joue
    if (answers.preparation) {
      const prep = answers.preparation.toLowerCase();
      if (spec.prepBonus.some((k) => prep.includes(k))) score += 2;
    }
    // légère préférence de gamme : les cuvées signature d'abord à score égal
    if (p.categories.includes('terres-des-amoureuses')) score += 0.5;
    cands.push({ product: p, spec, score, totalPayable, minQty: cond.minQty });
  }
  cands.sort((a, b) => b.score - a.score || b.product.price - a.product.price);
  const main = cands[0] ?? null;
  // L'alternative n'est proposée que si elle est pertinente pour le plat (score ≥ 3).
  const alt = cands[1] ?? null;
  return { main, alternative: alt && alt.score >= 3 ? alt : null };
}

/* ------------------------- Analyse du texte libre ------------------------- */

const DISH_WORDS: [RegExp, DishKey][] = [
  [/b[œoe]uf|viande rouge|steak|entrec[ôo]te|agneau|gigot|gibier|canard|c[ôo]te de|red meat|beef|lamb|duck/i, 'viande-rouge'],
  [/volaille|poulet|dinde|pintade|poultry|chicken|turkey/i, 'volaille'],
  [/poisson|fruits? de mer|saumon|cabillaud|saint-?jacques|fish|seafood|salmon|scallop/i, 'poisson'],
  [/v[ée]g[ée]tarien|l[ée]gumes?|vegetarian|veggie|vegan/i, 'vegetarien'],
  [/fromages?|cheese/i, 'fromages'],
];

const TASTE_WORDS: [RegExp, TasteKey][] = [
  [/fruit[ée]|gourmand|fruity/i, 'fruite'],
  [/puissant|structur[ée]|cors[ée]|powerful|structured|bold|tannin/i, 'puissant'],
  [/l[ée]ger|d[ée]licat|light|delicate/i, 'leger'],
  [/frais|fra[îi]cheur|min[ée]ral|fresh|crisp|mineral/i, 'frais'],
  [/surprenez|surprise|surprends/i, 'surprise'],
];

export function parseFreeText(text: string, current: SommelierAnswers = {}): { answers: SommelierAnswers; found: string[] } {
  const answers = { ...current };
  const found: string[] = [];
  for (const [re, dish] of DISH_WORDS) {
    if (re.test(text)) { answers.dish = dish; found.push('dish'); break; }
  }
  for (const [re, taste] of TASTE_WORDS) {
    if (re.test(text)) { answers.taste = taste; found.push('taste'); break; }
  }
  // préparations / cuissons
  const prepMatch = text.match(/[àa] point|saignant|bleu|bien cuit|grill[ée]?|r[ôo]ti|mijot[ée]?|en sauce|[àa] la cr[èe]me|beurre blanc|vapeur|cru|medium|rare|grilled|roast/i);
  if (prepMatch) { answers.preparation = prepMatch[0].toLowerCase(); found.push('preparation'); }
  // budget par bouteille : « 30 à 50 € », « entre 15 et 30 », « moins de 20 € »
  const rangeMatch = text.match(/(\d+)\s*(?:[àa]|to|-|et|and)\s*(\d+)\s*(?:€|eur|euros?|\$)?/i);
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1], 10), hi = parseInt(rangeMatch[2], 10);
    const best = BUDGET_RANGES.find((b) => lo >= b.min - 5 && (b.max == null || hi <= b.max + 5))
      ?? BUDGET_RANGES.find((b) => b.max != null && hi <= b.max) ?? BUDGET_RANGES[BUDGET_RANGES.length - 1];
    answers.budgetKey = best.key; found.push('budget');
  } else {
    const lessMatch = text.match(/moins de\s*(\d+)|under\s*(\d+)|max(?:imum)?\s*(\d+)/i);
    const single = lessMatch ? parseInt(lessMatch[1] ?? lessMatch[2] ?? lessMatch[3], 10) : null;
    if (single) {
      const best = BUDGET_RANGES.find((b) => b.max == null || single <= b.max);
      if (best) { answers.budgetKey = best.key; found.push('budget'); }
    }
  }
  // budget total de commande : « 50 € pour la commande », « en tout », « total »
  const totalMatch = text.match(/(?:commande|total|en tout|pour tout|order|altogether)[^0-9]{0,15}(\d+)\s*(?:€|eur|euros?)?/i)
    ?? text.match(/(\d+)\s*(?:€|eur|euros?)\s*(?:pour|for)\s+(?:la\s+)?(?:commande|tout|order)/i);
  if (totalMatch) { answers.totalBudget = parseInt(totalMatch[1], 10); found.push('totalBudget'); }
  // précision de plat : « pour une côte de bœuf », « avec un … »
  const dishDetail = text.match(/(?:pour|avec|with|for)\s+(?:une?|a|le|la|des)?\s*([a-zàâäéèêëîïôöùûüçœæ' -]{4,40})/i);
  if (dishDetail && answers.dish) { answers.dishDetail = dishDetail[1].trim(); }
  return { answers, found };
}
