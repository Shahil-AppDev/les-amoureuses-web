import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated, Image, Linking, Platform, Pressable, ScrollView, StyleSheet,
  Text, TextInput, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';
import { decodeEntities } from '../lib/text';
import type { Lang } from '../lib/types';
import { PRODUCTS } from '../data/products';
import {
  BUDGET_RANGES, CUVEES, conditioning, recommend,
  type DishKey, type SommelierAnswers, type TasteKey,
} from '../data/sommelier';
import { matchActivities, type VisitAnswers } from '../data/visites';
import { chatTurn, visitQuestion, type ChatMode, type ChatReply } from '../lib/assistant-chat';
import { storeApi, hosted } from '../lib/store-api';
import { storeApiReachable, useCart } from '../context/CartContext';
import { CTAButton, Eyebrow, H1, P } from './ui';
import { EllohaButton } from './EllohaWidget';

const serif = Platform.OS === 'web' ? { fontFamily: fonts.displayWeb } : {};
const FLAGSHIP = 'cuvee-a';

/* ------------------------------- i18n local ------------------------------- */

const STR = {
  fr: {
    titleVin: 'Trouver ma cuvée',
    titleVisite: 'Préparer ma visite',
    introVin: "Bonjour ! Dites-moi ce que vous cherchez — « un vin pour une côte de bœuf » — ou laissez-vous guider.",
    introVisite: 'Bonjour ! Date, nombre de participants, envies : je vous aide à comparer nos expériences. Vous pouvez aussi écrire « nous sommes six samedi ».',
    qDish: 'Quel plat accompagne ce vin ?',
    qDishDetail: 'Précisez le plat si vous voulez (facultatif)',
    qBudget: 'Quel budget par bouteille ?',
    qBudgetTotal: 'Budget total de commande (facultatif, en €)',
    qTaste: 'Quel profil de goût ?',
    qPrep: 'Cuisson, sauce ou préparation ? (facultatif)',
    discover: 'Découvrir ma cuvée',
    dishes: { 'viande-rouge': 'Viande rouge', 'volaille': 'Volaille', 'poisson': 'Poisson & fruits de mer', 'vegetarien': 'Végétarien', 'fromages': 'Fromages', 'autre': 'Autre' } as Record<DishKey, string>,
    tastes: { 'fruite': 'Fruité & gourmand', 'puissant': 'Puissant & structuré', 'leger': 'Léger & délicat', 'frais': 'Frais & minéral', 'surprise': 'Surprenez-moi' } as Record<TasteKey, string>,
    budgets: { 'lt15': 'Moins de 15 €', '15-30': '15 à 30 €', '30-50': '30 à 50 €', 'gt50': 'Plus de 50 €' } as Record<string, string>,
    recoMain: 'Ma recommandation',
    recoAlt: 'Alternative pertinente',
    noResult: "Aucune cuvée ne correspond exactement à ces critères. Élargissez le budget ou le profil de goût.",
    refine: 'Affiner mon accord',
    discoverCuvee: 'Découvrir la cuvée',
    addToCart: 'Ajouter au panier',
    addedGo: 'Voir le panier',
    outOfStock: 'Épuisé — cette cuvée ne peut pas être ajoutée',
    view3d: 'Voir en 3D',
    perBottle: 'la bouteille TTC',
    minCond: 'Conditionnement minimum',
    totalPayable: 'Total TTC à commander',
    tastingSheet: 'Fiche de dégustation',
    cepages: 'Cépages', elevage: 'Élevage', serviceTemp: 'Température de service', degre: 'Degré', millesime: 'Millésime',
    sourceOfficial: 'Source : fiche officielle du domaine',
    demoNotice: 'Démo préproduction : prix, millésime et stock issus de la boutique au 24/11/2026 — la vérification en direct est indisponible depuis cette préproduction (le module se mettra à jour automatiquement en same-origin).',
    liveOk: 'Prix et stock vérifiés en direct à la boutique.',
    liveChecking: 'Vérification du prix et du stock à la boutique…',
    accordsLabel: 'Accords selon la fiche officielle',
    understood: (bits: string[]) => `J'ai noté : ${bits.join(', ')}. Complétez ou modifiez ci-dessous.`,
    writeHere: 'Écrivez ici, ex. « un vin fruité pour une côte de bœuf »…',
    writeHereVisit: 'Écrivez ici, ex. « nous sommes six samedi »…',
    send: 'Envoyer',
    switchToVisit: 'Préparer une visite ?',
    switchToVin: 'Trouver une cuvée ?',
    // visite
    qParticipants: 'Combien serez-vous ?',
    qDate: 'Quand souhaitez-vous venir ? (jour ou date)',
    qPref: 'Quelle expérience vous tente ?',
    prefs: { degustation: 'Dégustation', repas: 'Mets & vins', decouverte: 'Découverte du domaine' } as Record<string, string>,
    participantsUnit: 'participants',
    showActivities: 'Comparer les expériences',
    duration: 'Durée', priceFrom: 'À partir de', perPerson: '/ pers.',
    includes: 'Ce que comprend l\'expérience',
    availUnknown: 'Disponibilités non vérifiables ici : le prestataire de réservation (Elloha) n\'est pas connecté à l\'assistant en préproduction. Les créneaux exacts sont à confirmer sur le calendrier officiel.',
    openCalendar: 'Voir le calendrier officiel',
    groupNote: (n: number) => `Pour un groupe de ${n}, le calendrier officiel confirmera les créneaux ouverts à cette taille de groupe.`,
    privaCta: 'Plutôt une privatisation ? Je prépare une demande de devis.',
    quoteTitle: 'Votre demande de devis — relisez avant envoi',
    quoteSend: 'Envoyer la demande',
    quoteSent: 'Demande envoyée — le domaine vous répondra directement.',
    quoteEdit: 'Modifier',
    yourName: 'Votre nom', yourEmail: 'Votre e-mail',
    whyVin: (dish: string | undefined, taste: string | undefined) => [dish, taste].filter(Boolean).join(' · '),
    explainDish: { 'viande-rouge': 'une viande rouge', 'volaille': 'une volaille', 'poisson': 'un poisson ou des fruits de mer', 'vegetarien': 'un plat végétarien', 'fromages': 'un plateau de fromages', 'autre': 'votre plat' } as Record<DishKey, string>,
  },
  en: {
    titleVin: 'Find my cuvée',
    titleVisite: 'Plan my visit',
    introVin: 'Hello! Tell me what you’re looking for — “a wine for a rib of beef” — or follow the guided path.',
    introVisite: 'Hello! Date, party size, wishes: I’ll help you compare our experiences. You can also write “we are six on Saturday”.',
    qDish: 'Which dish will this wine accompany?',
    qDishDetail: 'Describe the dish if you like (optional)',
    qBudget: 'Budget per bottle?',
    qBudgetTotal: 'Total order budget (optional, in €)',
    qTaste: 'Which taste profile?',
    qPrep: 'Cooking, sauce or preparation? (optional)',
    discover: 'Discover my cuvée',
    dishes: { 'viande-rouge': 'Red meat', 'volaille': 'Poultry', 'poisson': 'Fish & seafood', 'vegetarien': 'Vegetarian', 'fromages': 'Cheese', 'autre': 'Other' } as Record<DishKey, string>,
    tastes: { 'fruite': 'Fruity & generous', 'puissant': 'Powerful & structured', 'leger': 'Light & delicate', 'frais': 'Fresh & mineral', 'surprise': 'Surprise me' } as Record<TasteKey, string>,
    budgets: { 'lt15': 'Under €15', '15-30': '€15 to €30', '30-50': '€30 to €50', 'gt50': 'Over €50' } as Record<string, string>,
    recoMain: 'My recommendation',
    recoAlt: 'Worthwhile alternative',
    noResult: 'No cuvée matches these criteria exactly. Widen the budget or taste profile.',
    refine: 'Refine my pairing',
    discoverCuvee: 'Discover the cuvée',
    addToCart: 'Add to cart',
    addedGo: 'View cart',
    outOfStock: 'Out of stock — this cuvée cannot be added',
    view3d: 'View in 3D',
    perBottle: 'per bottle incl. VAT',
    minCond: 'Minimum packaging',
    totalPayable: 'Total incl. VAT to order',
    tastingSheet: 'Tasting sheet',
    cepages: 'Grape varieties', elevage: 'Ageing', serviceTemp: 'Serving temperature', degre: 'ABV', millesime: 'Vintage',
    sourceOfficial: 'Source: the estate’s official sheet',
    demoNotice: 'Preproduction demo: price, vintage and stock snapshotted from the shop on 24/11/2026 — live verification is unavailable from this preproduction (it will activate automatically once same-origin).',
    liveOk: 'Price and stock verified live from the shop.',
    liveChecking: 'Checking price and stock with the shop…',
    accordsLabel: 'Pairings per the official sheet',
    understood: (bits: string[]) => `Noted: ${bits.join(', ')}. Complete or adjust below.`,
    writeHere: 'Write here, e.g. “a fruity wine for a rib of beef”…',
    writeHereVisit: 'Write here, e.g. “we are six on Saturday”…',
    send: 'Send',
    switchToVisit: 'Plan a visit instead?',
    switchToVin: 'Find a cuvée instead?',
    qParticipants: 'How many of you?',
    qDate: 'When would you like to come? (day or date)',
    qPref: 'Which experience tempts you?',
    prefs: { degustation: 'Tasting', repas: 'Food & wine', decouverte: 'Estate discovery' } as Record<string, string>,
    participantsUnit: 'guests',
    showActivities: 'Compare experiences',
    duration: 'Duration', priceFrom: 'From', perPerson: '/ pers.',
    includes: 'What the experience includes',
    availUnknown: 'Availability cannot be verified here: the booking provider (Elloha) is not connected to the assistant in preproduction. Exact slots must be confirmed on the official calendar.',
    openCalendar: 'Open the official calendar',
    groupNote: (n: number) => `For a group of ${n}, the official calendar will confirm slots open to that group size.`,
    privaCta: 'Rather a private hire? I’ll prepare a quote request.',
    quoteTitle: 'Your quote request — review before sending',
    quoteSend: 'Send the request',
    quoteSent: 'Request sent — the estate will reply directly.',
    quoteEdit: 'Edit',
    yourName: 'Your name', yourEmail: 'Your e-mail',
    whyVin: (dish: string | undefined, taste: string | undefined) => [dish, taste].filter(Boolean).join(' · '),
    explainDish: { 'viande-rouge': 'red meat', 'volaille': 'poultry', 'poisson': 'fish or seafood', 'vegetarien': 'a vegetarian dish', 'fromages': 'a cheese board', 'autre': 'your dish' } as Record<DishKey, string>,
  },
};

type Dict = typeof STR.fr;
type ChatMessage = { role: 'bot' | 'user'; text: string; id: number };

function chatReply(reply: ChatReply, lang: Lang, visit: VisitAnswers) {
  const d = STR[lang];
  const fr = lang === 'fr';
  const replies: Record<ChatReply, string> = {
    dish: d.qDish,
    budget: d.qBudget,
    taste: d.qTaste,
    participants: d.qParticipants,
    day: d.qDate,
    wineResults: fr ? 'Voici le résultat pour vos critères. Vous pouvez encore modifier votre budget ou votre plat ici.' : 'Here is the result for your criteria. You can still change your budget or dish here.',
    visitResults: fr
      ? `Pour ${visit.participants} personne(s), date souhaitée : ${visit.day}. Voici les expériences à comparer. Vérifiez les créneaux chez Elloha.`
      : `For ${visit.participants} guest(s), preferred date: ${visit.day}. Compare these experiences and check available times on Elloha.`,
    quote: fr ? 'Voici un brouillon à relire. Rien ne sera envoyé automatiquement.' : 'Here is a draft to review. Nothing will be sent automatically.',
    unknown: fr ? 'Je n’ai pas compris. Indiquez un plat, un budget, une date ou un nombre de personnes, ou essayez le guide.' : 'I didn’t catch that. Enter a dish, budget, date or group size, or try the guide.',
  };
  return replies[reply];
}

/* ------------------------------ Petits widgets ---------------------------- */

function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={[st.chip, selected && st.chipOn]}>
      <Text style={[st.chipText, selected && st.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

function Bubble({ role, children }: { role: 'bot' | 'user'; children: React.ReactNode }) {
  return (
    <View style={[st.bubble, role === 'user' ? st.bubbleUser : st.bubbleBot]}>
      {typeof children === 'string'
        ? <Text style={[st.bubbleText, role === 'user' && st.bubbleTextUser]}>{children}</Text>
        : children}
    </View>
  );
}

function BubbleText({ children, user }: { children: React.ReactNode; user?: boolean }) {
  return <Text style={[st.bubbleText, user && st.bubbleTextUser]}>{children}</Text>;
}

/* --------------------------- Carte recommandation -------------------------- */

function RecoCard({ rec, lang, d, alt, answers }: {
  rec: NonNullable<ReturnType<typeof recommend>['main']>;
  lang: Lang; d: Dict; alt?: boolean;
  answers: SommelierAnswers;
}) {
  const { add } = useCart();
  const p = rec.product;
  const spec = rec.spec;
  const fade = useRef(new Animated.Value(0)).current;
  const [live, setLive] = useState<'checking' | 'ok' | 'demo' | 'out'>(storeApiReachable ? 'checking' : 'demo');
  const [variantIdx, setVariantIdx] = useState(0);
  const [price, setPrice] = useState(p.price);
  const [inStock, setInStock] = useState(p.inStock);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [fade]);

  // Vérification prix/millésime/stock via la boutique quand elle est joignable
  useEffect(() => {
    if (!storeApiReachable) { setLive('demo'); return; }
    let cancelled = false;
    storeApi.getProduct(p.slug).then((raw) => {
      if (cancelled || !raw) { setLive('demo'); return; }
      const livePrice = parseInt(raw.prices?.price ?? '0', 10) / 100 || p.price;
      const stock = raw.is_in_stock !== false;
      setPrice(livePrice);
      setInStock(stock);
      setLive(stock ? 'ok' : 'out');
    }).catch(() => setLive('demo'));
    return () => { cancelled = true; };
  }, [p.slug, p.price]);

  const cond = conditioning(p);
  const total = price * cond.minQty;
  const formats = p.attributes.find((a) => /format/i.test(a.name))?.terms ?? [];
  const hasVariants = formats.length > 1 || p.variationIds.length > 1;
  const variationId = p.variationIds[variantIdx] ?? p.variationIds[0];
  const productHref = lang === 'en' ? `/en/vins/${p.slug}/` : `/vins/${p.slug}/`;
  const officialUrl = `https://www.lesamoureuses.wine/vins/${p.slug}/`;

  const doAdd = async () => {
    if (!inStock) return;
    if (!storeApiReachable || Platform.OS === 'web') {
      // Web cross-origin : transfert vers le parcours hébergé WooCommerce.
      // La variante est revérifiée côté WooCommerce à l'ajout (stock/prix serveur).
      const url = hosted.addToCart(p.id, cond.minQty, variationId);
      if (Platform.OS === 'web') window.location.href = url;
      else Linking.openURL(url);
      return;
    }
    // Natif / same-origin : Store API (la boutique reste source de vérité).
    try {
      await add(p.id, cond.minQty, variationId);
    } catch {
      // l'erreur est affichée par le contexte panier
    }
  };

  return (
    <Animated.View style={[st.reco, { opacity: fade }]}>
      {alt && <Eyebrow>{d.recoAlt}</Eyebrow>}
      <View style={st.recoRow}>
        {p.image && <Image source={{ uri: p.image }} style={st.recoImg} resizeMode="contain" />}
        <View style={{ flex: 1, minWidth: 220 }}>
          <Text style={[st.recoName, serif]}>{decodeEntities(p.name)}</Text>
          <Text style={st.recoMillesime}>{d.millesime} {spec.millesime}</Text>
          <P style={{ marginTop: 8, fontSize: 14, lineHeight: 21 }}>
            {buildExplanation(lang, d, answers, rec)}
          </P>
          {spec.accordsOfficiels ? (
            <Text style={st.accords}>{d.accordsLabel} : {spec.accordsOfficiels}.</Text>
          ) : null}
        </View>
      </View>

      {/* Fiche de dégustation */}
      <View style={st.sheet}>
        <Text style={[st.sheetTitle, serif]}>{d.tastingSheet}</Text>
        <View style={st.sheetGrid}>
          <SheetRow label={d.cepages} value={spec.cepages} />
          <SheetRow label={d.elevage} value={spec.elevage} />
          <SheetRow label={d.serviceTemp} value={spec.serviceTemp} />
          <SheetRow label={d.degre} value={spec.degre} />
        </View>
        <LinkingText url={officialUrl} label={d.sourceOfficial} />
      </View>

      {/* Prix / conditionnement / total */}
      <View style={st.priceBlock}>
        <Text style={st.priceLine}>
          <Text style={st.priceBig}>{fmtPrice(price)}</Text> {d.perBottle}
        </Text>
        <Text style={st.priceMeta}>{d.minCond} : {cond.minQty} {cond.label}{cond.minQty > 1 ? 's' : ''}</Text>
        <Text style={st.priceMeta}>{d.totalPayable} : <Text style={{ fontWeight: '700', color: colors.ink }}>{fmtPrice(total)}</Text></Text>
        <Text style={[st.liveNote, live === 'demo' && { color: colors.terra }]}>
          {live === 'checking' ? d.liveChecking : live === 'demo' ? d.demoNotice : live === 'out' ? d.outOfStock : d.liveOk}
        </Text>
      </View>

      {/* Variantes */}
      {hasVariants && inStock && (
        <View style={st.chipRow}>
          {formats.map((f, i) => (
            <Chip key={f} label={f} selected={variantIdx === i} onPress={() => setVariantIdx(i)} />
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={st.recoActions}>
        <CTAButton href={productHref} label={d.discoverCuvee} primary={false} />
        {p.slug === FLAGSHIP && Platform.OS === 'web' && (
          <CTAButton href={`${productHref}?viewer=1`} label={d.view3d} primary={false} />
        )}
        {inStock ? (
          <CTAButton label={d.addToCart} onPress={doAdd} />
        ) : (
          <View style={[st.chip, { opacity: 0.5 }]}><Text style={st.chipText}>{d.outOfStock}</Text></View>
        )}
      </View>
    </Animated.View>
  );
}

function SheetRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={st.sheetRow}>
      <Text style={st.sheetLabel}>{label}</Text>
      <Text style={st.sheetValue}>{value}</Text>
    </View>
  );
}

function LinkingText({ url, label }: { url: string; label: string }) {
  return (
    <Pressable onPress={() => (Platform.OS === 'web' ? window.open(url, '_blank') : Linking.openURL(url))}>
      <Text style={st.linkText}>{label} ↗</Text>
    </Pressable>
  );
}

function fmtPrice(n: number) {
  return `${n.toFixed(2).replace('.', ',')} €`;
}

function buildExplanation(lang: Lang, d: Dict, answers: SommelierAnswers, rec: NonNullable<ReturnType<typeof recommend>['main']>): string {
  // L'explication lie le plat demandé, le profil de goût et la fiche officielle.
  const spec = rec.spec;
  const name = decodeEntities(rec.product.name);
  const dishTxt = answers.dish ? d.explainDish[answers.dish] : undefined;
  const dishDetail = answers.dishDetail ? ` (${answers.dishDetail})` : '';
  const prep = answers.preparation ? (lang === 'fr' ? ` — ${answers.preparation}` : ` — ${answers.preparation}`) : '';
  const tasteTxt = answers.taste && answers.taste !== 'surprise' ? d.tastes[answers.taste].toLowerCase() : undefined;
  const prepHit = answers.preparation && spec.prepBonus.some((k) => answers.preparation!.includes(k));
  if (lang === 'fr') {
    const parts: string[] = [];
    if (dishTxt) parts.push(`Pour ${dishTxt}${dishDetail}${prep}`);
    else parts.push('Pour votre table');
    let s = `${parts[0]}, ${name} ${spec.millesime} s'impose : `;
    const why: string[] = [];
    if (tasteTxt) why.push(`son profil ${tasteTxt} rejoint votre préférence`);
    if (prepHit) why.push(`sa structure accompagne particulièrement cette préparation`);
    if (spec.accordsOfficiels && answers.dish) why.push(`la fiche officielle l'accorde elle-même aux ${spec.accordsOfficiels.split(',')[0].trim()}`);
    if (!why.length) why.push(`son équilibre en fait un accord sûr`);
    const glue = (arr: string[]) => arr.length > 1 ? `${arr.slice(0, -1).join(', ')} et ${arr[arr.length - 1]}` : arr[0];
    return s + glue(why) + '.';
  }
  const intro = dishTxt ? `For ${dishTxt}${dishDetail}${prep}` : 'For your table';
  let s = `${intro}, ${name} ${spec.millesime} is the match: `;
  const why: string[] = [];
  if (tasteTxt) why.push(`its ${tasteTxt} profile matches your preference`);
  if (prepHit) why.push(`its structure suits this preparation particularly well`);
  if (spec.accordsOfficiels && answers.dish) why.push(`the official sheet itself pairs it with ${spec.accordsOfficiels.split(',')[0].trim()}`);
  if (!why.length) why.push('its balance makes it a safe pairing');
  const glue = (arr: string[]) => arr.length > 1 ? `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}` : arr[0];
  return s + glue(why) + '.';
}

/* ------------------------------- Écran principal --------------------------- */

type Step = 'dish' | 'budget' | 'taste' | 'prep' | 'result';
const ORDER: Step[] = ['dish', 'budget', 'taste', 'prep'];

export function AssistantConversation({ lang, flow, compact = false }: { lang: Lang; flow: ChatMode; compact?: boolean }) {
  const d = STR[lang];
  const [mode, setMode] = useState<ChatMode>(flow);
  const [answers, setAnswers] = useState<SommelierAnswers>({});
  const [vanswers, setVanswers] = useState<VisitAnswers>({});
  const [step, setStep] = useState<Step>('dish');
  const [showResult, setShowResult] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [guided, setGuided] = useState(false);
  const [detailInput, setDetailInput] = useState('');
  const [totalInput, setTotalInput] = useState('');
  const [prepInput, setPrepInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const id = useRef(0);
  const fr = lang === 'fr';
  const example = mode === 'vin'
    ? (fr ? 'Un vin fruité pour une côte de bœuf, 30 à 50 €' : 'A fruity wine for beef, 30 to 50 euros')
    : (fr ? 'Nous sommes six samedi' : 'We are six on Saturday');
  const quickQuestions = fr ? [
    'Quel vin fruité pour une côte de bœuf, entre 30 et 50 € ?',
    'Que peut-on réserver pour six personnes samedi ?',
    'Comment demander un devis de privatisation ?',
  ] : [
    'Which fruity wine goes with beef, between €30 and €50?',
    'What can we book for six people on Saturday?',
    'How do I get a quote for private hire?',
  ];

  const result = useMemo(
    () => (showResult ? recommend(answers, PRODUCTS.filter((p) => CUVEES[p.slug])) : { main: null, alternative: null }),
    [showResult, answers],
  );

  const nextStep = (current: Step, a: SommelierAnswers): Step => {
    const idx = ORDER.indexOf(current);
    for (const s of ORDER.slice(idx + 1)) {
      if (s === 'budget' && !a.budgetKey && a.bottleMax === undefined && a.totalBudget === undefined) return s;
      if (s === 'taste' && !a.taste) return s;
      if (s === 'prep') return s;
    }
    return 'prep';
  };

  const answer = (patch: Partial<SommelierAnswers>, current: Step) => {
    const merged = { ...answers, ...patch, ...('budgetKey' in patch ? { bottleMin: undefined, bottleMax: undefined } : {}) };
    setAnswers(merged);
    setShowResult(false);
    setStep(nextStep(current, merged));
  };

  const append = (reply: string, text?: string) => {
    const added: ChatMessage[] = [];
    if (text) added.push({ role: 'user', text, id: id.current++ });
    added.push({ role: 'bot', text: reply, id: id.current++ });
    setMessages((prev) => [...prev, ...added].slice(-24));
  };

  const submit = (input: string) => {
    const text = input.trim().slice(0, 350);
    if (!text) return;
    setFreeText('');
    const turn = chatTurn(text, mode, answers, vanswers);
    append(chatReply(turn.reply, lang, turn.visit), text);
    if (turn.reply === 'unknown') return;
    setMode(turn.mode);
    if (turn.mode === 'visite') {
      setVanswers(turn.visit);
      setDateInput(turn.visit.day ?? '');
      if (turn.reply === 'quote') setShowQuote(true);
      return;
    }
    setAnswers(turn.wine);
    setDetailInput(turn.wine.dishDetail ?? '');
    setPrepInput(turn.wine.preparation ?? '');
    setTotalInput(turn.wine.totalBudget?.toString() ?? '');
    setStep(turn.reply === 'dish' || turn.reply === 'budget' || turn.reply === 'taste' ? turn.reply : 'prep');
    setShowResult(turn.reply === 'wineResults');
  };

  const switchMode = (next: ChatMode) => {
    if (next === mode) return;
    setMode(next);
    append(next === 'vin' ? d.introVin : d.introVisite);
  };
  const reset = () => {
    setMessages([]);
    setMode(flow);
    setFreeText('');
    setAnswers({});
    setVanswers({});
    setDetailInput('');
    setPrepInput('');
    setTotalInput('');
    setDateInput('');
    setStep('dish');
    setShowResult(false);
    setShowQuote(false);
    setGuided(false);
  };

  return (
    <View>
      {!compact && (
        <View style={st.masthead}>
          <Eyebrow style={st.mastKicker}>{lang === 'fr' ? 'Le carnet des Amoureuses' : 'The Les Amoureuses notebook'}</Eyebrow>
          <H1 style={st.mastTitle}>{mode === 'vin' ? d.titleVin : d.titleVisite}</H1>
        </View>
      )}

        <View style={st.chat}>
          <View style={st.chatTabs}>
            <Chip label="Sommelier" selected={mode === 'vin'} onPress={() => switchMode('vin')} />
            <Chip label={fr ? 'Réservation' : 'Booking'} selected={mode === 'visite'} onPress={() => switchMode('visite')} />
          </View>
          <ScrollView ref={scrollRef} style={st.thread} contentContainerStyle={st.threadContent} nestedScrollEnabled keyboardShouldPersistTaps="handled" onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
            <Bubble role="bot">{flow === 'vin' ? d.introVin : d.introVisite}</Bubble>
            {messages.map((message, index) => (
              <View key={message.id} accessibilityLiveRegion={message.role === 'bot' && index === messages.length - 1 ? 'polite' : 'none'}>
                <Bubble role={message.role}>{message.text}</Bubble>
              </View>
            ))}
          </ScrollView>
          {messages.length === 0 && (compact ? (
            <View style={st.quickQuestions}>
              <Eyebrow>{fr ? 'Questions rapides' : 'Quick questions'}</Eyebrow>
              {quickQuestions.map((question) => (
                <Chip key={question} label={question} onPress={() => submit(question)} />
              ))}
            </View>
          ) : <Chip label={example} onPress={() => submit(example)} />)}
          <View style={st.inputRow}>
            <TextInput
              value={freeText}
              onChangeText={setFreeText}
              onSubmitEditing={() => submit(freeText)}
              maxLength={350}
              returnKeyType="send"
              accessibilityLabel={fr ? 'Votre message' : 'Your message'}
              placeholder={mode === 'vin' ? d.writeHere : d.writeHereVisit}
              placeholderTextColor={colors.inkSoft}
              style={st.input}
            />
            <Pressable onPress={() => submit(freeText)} disabled={!freeText.trim()} style={st.sendBtn} accessibilityRole="button" accessibilityLabel={d.send}>
              <Text style={st.sendText}>{d.send}</Text>
            </Pressable>
          </View>
          <View style={st.chatTabs}>
            <Chip label={fr ? 'Parcours guidé' : 'Guided options'} selected={guided} onPress={() => setGuided(!guided)} />
            <Chip label={fr ? 'Nouveau chat' : 'New chat'} onPress={reset} />
          </View>
        </View>
        <View style={{ marginTop: compact ? 12 : 20 }}>
          {mode === 'vin' && (guided || showResult) ? (
            <VinFlow
              d={d} lang={lang} answers={answers} step={step} setStep={setStep}
              answer={answer} showResult={showResult} setShowResult={setShowResult}
              detailInput={detailInput} setDetailInput={setDetailInput}
              totalInput={totalInput} setTotalInput={setTotalInput}
              prepInput={prepInput} setPrepInput={setPrepInput}
              result={result}
              onRefine={() => { setShowResult(false); setStep('dish'); setGuided(true); }}
            />
          ) : mode === 'visite' && (guided || showQuote || visitQuestion(vanswers) === 'visitResults') ? (
            <VisitFlow
              d={d} lang={lang} vanswers={vanswers} setVanswers={setVanswers}
              dateInput={dateInput} setDateInput={setDateInput}
              showQuote={showQuote} setShowQuote={setShowQuote}
              guided={guided}
            />
          ) : null}
        </View>
    </View>
  );
}

/* --------------------------------- Flow vin ------------------------------- */

function VinFlow({ d, lang, answers, step, setStep, answer, showResult, setShowResult, detailInput, setDetailInput, totalInput, setTotalInput, prepInput, setPrepInput, result, onRefine }: any) {
  if (showResult) {
    return (
      <View style={{ gap: 16 }}>
        {result.main ? (
          <>
            <Eyebrow>{d.recoMain}</Eyebrow>
            <RecoCard rec={result.main} lang={lang} d={d} answers={answers} />
            {result.alternative && <RecoCard rec={result.alternative} lang={lang} d={d} alt answers={answers} />}
          </>
        ) : (
          <Bubble role="bot"><BubbleText>{d.noResult}</BubbleText></Bubble>
        )}
        <CTAButton label={d.refine} primary={false} onPress={onRefine} />
      </View>
    );
  }

  return (
    <View style={{ gap: 18 }}>
      {/* Plat */}
      <View>
        <Bubble role="bot"><BubbleText>{d.qDish}</BubbleText></Bubble>
        <View style={st.chipRow}>
          {(Object.keys(d.dishes) as DishKey[]).map((k) => (
            <Chip key={k} label={d.dishes[k]} selected={answers.dish === k} onPress={() => answer({ dish: k }, 'dish')} />
          ))}
        </View>
        {(step === 'dish' || detailInput.length > 0) && (
          <TextInput
            value={detailInput} onChangeText={setDetailInput}
            onBlur={() => detailInput && answer({ dishDetail: detailInput }, 'dish')}
            placeholder={d.qDishDetail} placeholderTextColor={colors.inkSoft}
            style={[st.input, { marginTop: 8 }]}
          />
        )}
      </View>

      {/* Budget — visible dès que le plat est choisi */}
      {answers.dish && (
        <View>
          <Bubble role="bot"><BubbleText>{d.qBudget}</BubbleText></Bubble>
          <View style={st.chipRow}>
            {BUDGET_RANGES.map((b) => (
              <Chip key={b.key} label={d.budgets[b.key]} selected={answers.budgetKey === b.key} onPress={() => answer({ budgetKey: b.key }, 'budget')} />
            ))}
          </View>
          {(step === 'budget' || totalInput.length > 0) && (
            <TextInput
              value={totalInput} onChangeText={setTotalInput} keyboardType="numeric"
              onBlur={() => {
                const n = Number(totalInput.replace(',', '.'));
                if (Number.isFinite(n)) answer({ totalBudget: n > 0 ? n : undefined }, 'budget');
              }}
              placeholder={d.qBudgetTotal} placeholderTextColor={colors.inkSoft}
              style={[st.input, { marginTop: 8 }]}
            />
          )}
        </View>
      )}

      {/* Goût — visible dès que le budget est choisi, ou si déjà prérempli (modifiable) */}
      {(step === 'taste' || step === 'prep' || answers.taste) && (
        <View>
          <Bubble role="bot"><BubbleText>{d.qTaste}</BubbleText></Bubble>
          <View style={st.chipRow}>
            {(Object.keys(d.tastes) as TasteKey[]).map((k) => (
              <Chip key={k} label={d.tastes[k]} selected={answers.taste === k} onPress={() => answer({ taste: k }, 'taste')} />
            ))}
          </View>
        </View>
      )}

      {/* Préparation */}
      {((answers.taste && step === 'prep') || (answers.preparation && step !== 'result')) && !showResult && (
        <View>
          <Bubble role="bot"><BubbleText>{d.qPrep}</BubbleText></Bubble>
          <TextInput
            value={prepInput} onChangeText={setPrepInput}
            onBlur={() => prepInput && answer({ preparation: prepInput.toLowerCase() }, 'prep')}
            placeholder={lang === 'fr' ? 'ex. à point, en sauce, grillé…' : 'e.g. medium, in sauce, grilled…'}
            placeholderTextColor={colors.inkSoft}
            style={[st.input, { marginTop: 8 }]}
          />
        </View>
      )}

      {answers.dish && answers.taste && (
        <View style={{ marginTop: 4 }}>
          <CTAButton label={d.discover} onPress={() => {
            if (prepInput && !answers.preparation) answer({ preparation: prepInput.toLowerCase() }, 'prep');
            setShowResult(true);
          }} />
        </View>
      )}
    </View>
  );
}

/* ------------------------------- Flow visite ------------------------------ */

function VisitFlow({ d, lang, vanswers, setVanswers, dateInput, setDateInput, showQuote, setShowQuote, guided }: any) {
  const [quoteStatus, setQuoteStatus] = useState<'opened' | 'error' | null>(null);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const activities = matchActivities(vanswers);
  const sizes = [2, 4, 6, 8, 12];

  const quoteBody = () => {
    const bits = [
      lang === 'fr' ? 'Demande de devis — expérience œnotouristique / privatisation' : 'Quote request — wine experience / private hire',
      vanswers.participants ? `${lang === 'fr' ? 'Participants' : 'Guests'}: ${vanswers.participants}` : null,
      vanswers.day || dateInput ? `${lang === 'fr' ? 'Date souhaitée' : 'Preferred date'}: ${vanswers.day ?? dateInput}` : null,
      vanswers.preference ? `${lang === 'fr' ? 'Expérience' : 'Experience'}: ${d.prefs[vanswers.preference]}` : null,
    ].filter(Boolean);
    return bits.join('\n');
  };

  const sendQuote = async () => {
    if (sending) return; // pas de double envoi en cas de clic répété
    setSending(true);
    const subject = encodeURIComponent(lang === 'fr' ? 'Demande de devis — Les Amoureuses' : 'Quote request — Les Amoureuses');
    const body = encodeURIComponent(`${quoteBody()}\n\n— ${name} (${email})`);
    const url = `mailto:contact@lesamoureuses.wine?subject=${subject}&body=${body}`;
    try {
      if (Platform.OS === 'web') window.location.href = url;
      else await Linking.openURL(url);
      setQuoteStatus('opened');
    } catch {
      setQuoteStatus('error');
    } finally {
      setSending(false);
    }
  };

  if (showQuote) {
    return (
      <View style={{ gap: 12 }}>
        <Bubble role="bot"><BubbleText>{d.quoteTitle}</BubbleText></Bubble>
        <View style={st.quoteBox}>
          <Text style={st.quoteText}>{quoteBody()}</Text>
          <TextInput value={name} onChangeText={setName} placeholder={d.yourName} placeholderTextColor={colors.inkSoft} style={[st.input, { marginTop: 10 }]} />
          <TextInput value={email} onChangeText={setEmail} placeholder={d.yourEmail} placeholderTextColor={colors.inkSoft} style={[st.input, { marginTop: 8 }]} autoCapitalize="none" keyboardType="email-address" />
        </View>
        {quoteStatus && <P>{quoteStatus === 'opened'
          ? (lang === 'fr' ? 'Le brouillon n’est pas envoyé : vérifiez votre messagerie pour le relire et l’envoyer.' : 'The draft has not been sent: check your email app to review and send it.')
          : 'contact@lesamoureuses.wine'}</P>}
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <CTAButton label={sending ? '…' : lang === 'fr' ? 'Ouvrir ma messagerie' : 'Open my email app'} onPress={sendQuote} />
          <CTAButton label={d.quoteEdit} primary={false} onPress={() => { setQuoteStatus(null); setShowQuote(false); }} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ gap: 18 }}>
      {guided && <>
      <View>
        <Bubble role="bot"><BubbleText>{d.qParticipants}</BubbleText></Bubble>
        <View style={st.chipRow}>
          {sizes.map((n) => (
            <Chip key={n} label={`${n}`} selected={vanswers.participants === n} onPress={() => setVanswers((v: VisitAnswers) => ({ ...v, participants: n }))} />
          ))}
        </View>
      </View>
      <View>
        <Bubble role="bot"><BubbleText>{d.qDate}</BubbleText></Bubble>
        <TextInput
          value={dateInput} onChangeText={setDateInput}
          onBlur={() => setVanswers((v: VisitAnswers) => ({ ...v, day: dateInput.trim() || undefined }))}
          placeholder={lang === 'fr' ? 'ex. samedi, ou 14 juin' : 'e.g. Saturday, or June 14'}
          placeholderTextColor={colors.inkSoft}
          style={[st.input, { marginTop: 8 }]}
        />
        {vanswers.day && <Text style={st.ack}>{vanswers.day}</Text>}
      </View>
      <View>
        <Bubble role="bot"><BubbleText>{d.qPref}</BubbleText></Bubble>
        <View style={st.chipRow}>
          {Object.keys(d.prefs).map((k) => (
            <Chip key={k} label={d.prefs[k]} selected={vanswers.preference === k} onPress={() => setVanswers((v: VisitAnswers) => ({ ...v, preference: k as any }))} />
          ))}
        </View>
      </View>
      </>}

      {/* Résultats : activités */}
      {(vanswers.participants || vanswers.preference) && (
        <View style={{ gap: 14 }}>
          {activities.map((a) => (
            <View key={a.id} style={st.actCard}>
              <Text style={[st.actTitle, serif]}>{lang === 'en' ? a.titleEn : a.titleFr}</Text>
              <Text style={st.actMeta}>
                {a.duration ? `${d.duration} ${a.duration} · ` : ''}{d.priceFrom} {a.priceFrom.toFixed(2).replace('.', ',')} € {d.perPerson}
              </Text>
              <P style={{ fontSize: 14, lineHeight: 21, marginTop: 6 }}>{lang === 'en' ? a.descEn : a.descFr}</P>
              <Text style={st.availNote}>
                {d.availUnknown}{vanswers.participants ? ' ' + d.groupNote(vanswers.participants) : ''}
              </Text>
              <View style={{ marginTop: 10 }}>
                <EllohaButton widgetId={a.ellohaId} culture={lang === 'en' ? 'en-GB' : 'fr-FR'} label={d.openCalendar} />
              </View>
            </View>
          ))}
          <Pressable onPress={() => setShowQuote(true)}>
            <Text style={st.switchLink}>{d.privaCta}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

/* --------------------------------- Styles --------------------------------- */

const st = StyleSheet.create({
  bubble: { maxWidth: '92%', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 4 },
  bubbleBot: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, alignSelf: 'flex-start' },
  bubbleUser: { backgroundColor: colors.ink, alignSelf: 'flex-end' },
  bubbleText: { fontSize: 15, lineHeight: 22, color: colors.ink },
  bubbleTextUser: { color: colors.paper },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { borderWidth: 1, borderColor: colors.line, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.paper },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontSize: 13, color: colors.ink },
  chipTextOn: { color: colors.paper },
  masthead: { backgroundColor: colors.ink, padding: 22 },
  mastKicker: { color: '#e4c59c' },
  mastTitle: { color: colors.paper, fontSize: 40, lineHeight: 42 },
  chat: { gap: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper, padding: 12 },
  chatTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickQuestions: { gap: 6 },
  thread: { maxHeight: 300, flexGrow: 0, backgroundColor: colors.cream },
  threadContent: { gap: 8, padding: 8 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1, minWidth: 0, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper,
    paddingVertical: 12, paddingHorizontal: 14, fontSize: 15, color: colors.ink, borderRadius: 2,
  },
  sendBtn: { backgroundColor: colors.terra, minHeight: 44, justifyContent: 'center', paddingHorizontal: 10, borderRadius: 2 },
  sendText: { color: colors.paper, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },
  switchLink: { marginTop: 16, color: colors.terra, fontSize: 14, textDecorationLine: 'underline' },
  ack: { marginTop: 6, fontSize: 13, color: colors.inkSoft, fontStyle: 'italic' },
  reco: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, padding: 20, borderRadius: 4 },
  recoRow: { flexDirection: 'row', gap: 18, flexWrap: 'wrap' },
  recoImg: { width: 110, height: 260 },
  recoName: { fontSize: 26, color: colors.ink },
  recoMillesime: { fontSize: 14, color: colors.terra, marginTop: 2, letterSpacing: 1 },
  accords: { marginTop: 10, fontSize: 13, color: colors.inkSoft, fontStyle: 'italic', lineHeight: 19 },
  sheet: { marginTop: 18, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 14 },
  sheetTitle: { fontSize: 18, color: colors.ink, marginBottom: 8 },
  sheetGrid: { gap: 6 },
  sheetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sheetLabel: { width: 150, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: colors.inkSoft, paddingTop: 1 },
  sheetValue: { flex: 1, minWidth: 200, fontSize: 14, color: colors.ink, lineHeight: 20 },
  linkText: { marginTop: 10, fontSize: 13, color: colors.terra, textDecorationLine: 'underline' },
  priceBlock: { marginTop: 16, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 14, gap: 4 },
  priceLine: { fontSize: 14, color: colors.inkSoft },
  priceBig: { fontSize: 24, color: colors.ink, fontWeight: '700' },
  priceMeta: { fontSize: 14, color: colors.inkSoft },
  liveNote: { marginTop: 8, fontSize: 12, color: colors.inkSoft, fontStyle: 'italic', lineHeight: 17 },
  recoActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  actCard: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, padding: 18, borderRadius: 4 },
  actTitle: { fontSize: 20, color: colors.ink },
  actMeta: { fontSize: 13, color: colors.terra, marginTop: 4, letterSpacing: 0.5 },
  availNote: { marginTop: 10, fontSize: 12, color: colors.terra, fontStyle: 'italic', lineHeight: 17 },
  quoteBox: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, padding: 16, borderRadius: 4 },
  quoteText: { fontSize: 14, lineHeight: 22, color: colors.ink },
});
