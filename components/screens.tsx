import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator, Image, Linking, Platform, Pressable,
  StyleSheet, Text, TextInput, useWindowDimensions, View,
} from 'react-native';
import { Link } from 'expo-router';
import { colors, fonts, SITE } from '../constants/theme';
import { t } from '../lib/i18n';
import { decodeEntities } from '../lib/text';
import type { Activity, Lang, Post, Product, Variation } from '../lib/types';
import { PRODUCTS } from '../data/products';
import { POSTS } from '../data/posts';
import { storeApi, hosted } from '../lib/store-api';
import { storeApiReachable, useCart } from '../context/CartContext';
import { WebShell, useRoutes } from './WebShell';
import { CTAButton, Eyebrow, H1, H2, P, Section } from './ui';
import { SeoHead, absUrl } from './SeoHead';
import { ProductCard } from './ProductCard';
import { EllohaButton } from './EllohaWidget';
import { ACTIVITIES } from '../data/visites';
import { HtmlContent } from './HtmlContent';
import Bottle3D from './Bottle3D';

const serif = Platform.OS === 'web' ? { fontFamily: fonts.displayWeb } : {};
const FLAGSHIP = 'cuvee-a';

/* ---------------------------------- Home ---------------------------------- */

export function HomeScreen({ lang }: { lang: Lang }) {
  const d = t(lang);
  const r = useRoutes();
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const wide = mounted && width > 860;
  const flagship = PRODUCTS.find((p) => p.slug === FLAGSHIP) ?? PRODUCTS[0];

  return (
    <WebShell lang={lang}>
      <SeoHead
        title={lang === 'fr' ? 'Domaine Les Amoureuses — Vins bio & biodynamiques en Ardèche' : 'Domaine Les Amoureuses — Organic & biodynamic wines from Ardèche'}
        description={d.heroText}
        canonical={absUrl(lang === 'en' ? '/en/' : '/')}
        hreflangFr={absUrl('/')}
        hreflangEn={absUrl('/en/')}
        jsonLd={{
          '@context': 'https://schema.org', '@type': 'Winery',
          name: 'Domaine Les Amoureuses',
          url: absUrl('/'),
          address: { '@type': 'PostalAddress', streetAddress: '1429 Chemin de Vinsas', postalCode: '07700', addressLocality: 'Bourg-Saint-Andéol', addressCountry: 'FR' },
        }}
      />
      {/* Hero : bouteille 3D + titre + CTA */}
      <View style={[styles.hero, { flexDirection: wide ? 'row' : 'column' }]}>
        <View style={[styles.heroText, !wide && { paddingTop: 32 }]}>
          <Eyebrow>{d.heroSub}</Eyebrow>
          <H1>{d.heroTitle}</H1>
          <P style={{ marginTop: 16, maxWidth: 520 }}>{d.heroText}</P>
          <View style={styles.ctaRow}>
            <CTAButton href={r.shop} label={d.ctaWines} />
            <CTAButton href={r.oeno} label={d.ctaVisit} primary={false} />
          </View>
        </View>
        <View style={[styles.heroBottle, { height: wide ? 560 : 420 }]}>
          {Platform.OS === 'web' ? (
            <Bottle3D image={flagship.image} label="Cuvée « A »" interactive />
          ) : (
            flagship.image && <Image source={{ uri: flagship.image }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          )}
        </View>
      </View>

      {/* Gammes */}
      <Section>
        <Eyebrow>{d.ranges}</Eyebrow>
        <View style={styles.rangeRow}>
          {[
            { name: d.rangeTerres, href: r.r1, img: PRODUCTS.find(p => p.slug === 'cuvee-a')?.image },
            { name: d.rangeLiby, href: r.r2, img: PRODUCTS.find(p => p.slug === 'le-liby-rouge')?.image },
            { name: d.rangeChateau, href: r.r3, img: PRODUCTS.find(p => p.slug === 'promenade')?.image },
          ].map((g) => (
            <Link key={g.href} href={g.href as any} asChild>
              <Pressable style={styles.rangeCard}>
                {g.img && <Image source={{ uri: g.img }} style={styles.rangeImg} resizeMode="contain" />}
                <Text style={[styles.rangeName, serif]}>{g.name}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </Section>

      {/* Sommelier virtuel : deux entrées */}
      <Section style={{ backgroundColor: colors.paper, maxWidth: '100%' }}>
        <View style={{ maxWidth: 1080, width: '100%', alignSelf: 'center' }}>
          <Eyebrow>{lang === 'fr' ? 'Assistant' : 'Assistant'}</Eyebrow>
          <H2>{d.homeAssTitle}</H2>
          <P style={{ marginTop: 10, maxWidth: 620 }}>{d.homeAssText}</P>
          <View style={[styles.rangeRow, { marginTop: 20 }]}>
            {[
              { title: d.homeAssVin, text: d.homeAssVinText, href: r.sommelier },
              { title: d.homeAssVisit, text: d.homeAssVisitText, href: r.visit },
            ].map((c) => (
              <Link key={c.href} href={c.href as any} asChild>
                <Pressable style={styles.assCard}>
                  <Text style={[styles.assTitle, serif]}>{c.title}</Text>
                  <P style={{ fontSize: 14, marginTop: 6 }}>{c.text}</P>
                  <Text style={styles.assGo}>→</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      </Section>

      <Band title={d.homeOenoTitle} text={d.homeOenoText} cta={d.homeOenoCta} href={r.oeno} />
      <Band title={d.homeEventsTitle} text={d.homeEventsText} cta={d.homeEventsCta} href={r.priva} dark />
      <Band title={d.homeIdentityTitle} text={d.homeIdentityText} cta={d.homeIdentityCta} href={r.identity} />

      <Section style={{ alignItems: 'center' }}>
        <CTAButton href={r.shop} label={d.shopNow} />
      </Section>
    </WebShell>
  );
}

function Band({ title, text, cta, href, dark }: { title: string; text: string; cta: string; href: string; dark?: boolean }) {
  return (
    <View style={[styles.band, dark && { backgroundColor: colors.ink }]}>
      <Section>
        <H2 style={dark && { color: colors.paper }}>{title}</H2>
        <P style={[{ marginVertical: 14, maxWidth: 640 }, dark && { color: '#CBBFA8' }]}>{text}</P>
        <CTAButton href={href} label={cta} primary={!dark} />
      </Section>
    </View>
  );
}

/* ---------------------------------- Shop ---------------------------------- */

export function ShopScreen({ lang }: { lang: Lang }) {
  const d = t(lang);
  const [range, setRange] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [items, setItems] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    // live refresh against WooCommerce (source of truth) — ignoré si l'API
    // n'est pas joignable en CORS depuis cette origine (préprod GH Pages).
    if (!storeApiReachable) return;
    fetch(`${SITE.api}/wc/store/v1/products?per_page=100`)
      .then((r) => r.json())
      .then((list: any[]) => {
        if (!Array.isArray(list)) return;
        setItems(list.map((p) => ({
          id: p.id, slug: p.slug,
          name: decodeEntities(p.name),
          type: p.type, price: parseInt(p.prices.price, 10) / 100,
          categories: p.categories.map((c: any) => c.slug),
          image: p.images[0]?.src ?? null, thumb: p.images[0]?.thumbnail ?? null,
          images: (p.images ?? []).map((i: any) => i.src),
          attributes: (p.attributes ?? []).map((a: any) => ({ name: a.name, terms: a.terms.map((x: any) => x.name) })),
          variationIds: (p.variations ?? []).map((v: any) => v.id),
          inStock: p.is_in_stock, purchasable: p.is_purchasable,
          description: PRODUCTS.find((x) => x.slug === p.slug)?.description,
        })));
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => items.filter((p) => {
    if (range && !p.categories.includes(range)) return false;
    if (color && !p.categories.includes(color)) return false;
    return true;
  }), [items, range, color]);

  const chips = (list: [string | null, string][], sel: string | null, set: (v: string | null) => void) => (
    <View style={styles.chipRow}>
      {list.map(([v, label]) => (
        <Pressable key={label} onPress={() => set(v)} style={[styles.chip, sel === v && styles.chipOn]}>
          <Text style={[styles.chipText, sel === v && styles.chipTextOn]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <WebShell lang={lang}>
      <SeoHead
        title={lang === 'fr' ? 'e-Boutique — Vins, coffrets & épicerie fine | Les Amoureuses' : 'Shop — Wines, gift boxes & fine groceries | Les Amoureuses'}
        description={d.shopIntro}
        canonical={absUrl(lang === 'en' ? '/en/shop/' : '/vins/')}
        hreflangFr={absUrl('/vins/')}
        hreflangEn={absUrl('/en/shop/')}
      />
      <Section>
        <Eyebrow>{d.navShop}</Eyebrow>
        <H1>{d.shopTitle}</H1>
        <P style={{ marginTop: 10, marginBottom: 20 }}>{d.shopIntro}</P>
        <Text style={styles.filterLabel}>{d.filterRange}</Text>
        {chips([[null, d.filterAll], ['terres-des-amoureuses', d.rangeTerres], ['le-liby', d.rangeLiby], ['chateau-les-amoureuses', d.rangeChateau], ['coffrets', d.coffrets], ['epicerie-fine', d.epicerie]], range, setRange)}
        <Text style={[styles.filterLabel, { marginTop: 10 }]}>{d.filterColor}</Text>
        {chips([[null, d.filterAll], ['rouge', d.rouge], ['blanc', d.blanc], ['rose', d.rose]], color, setColor)}
        <View style={styles.grid}>
          {filtered.map((p) => <ProductCard key={p.id} product={p} lang={lang} />)}
        </View>
      </Section>
    </WebShell>
  );
}

/* --------------------------------- Product -------------------------------- */

export function ProductScreen({ slug, lang, initialViewer }: { slug: string; lang: Lang; initialViewer?: boolean }) {
  const d = t(lang);
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(() => PRODUCTS.find((p) => p.slug === slug) ?? null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [variation, setVariation] = useState<Variation | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [show3d, setShow3d] = useState(!!initialViewer);

  useEffect(() => {
    // Live refresh: price, stock and purchasability stay governed by WooCommerce
    if (!storeApiReachable) return;
    storeApi.getProduct(slug).then((p) => {
      if (!p) return;
      setProduct((prev) => prev ? {
        ...prev,
        price: parseInt(p.prices?.price ?? '0', 10) / 100 || prev.price,
        inStock: p.is_in_stock !== false,
        purchasable: p.is_purchasable !== false,
        variationIds: (p.variations ?? []).map((v: any) => v.id).length ? (p.variations ?? []).map((v: any) => v.id) : prev.variationIds,
      } : prev);
    }).catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (!product?.variationIds.length || !storeApiReachable) return;
    Promise.all(product.variationIds.map((id) => storeApi.getVariation(id).catch(() => null)))
      .then((vs) => {
        const ok = vs.filter(Boolean) as Variation[];
        setVariations(ok);
        setVariation(ok[0] ?? null);
      });
  }, [product?.slug]);

  if (!product) {
    return (
      <WebShell lang={lang}>
        <Section><ActivityIndicator color={colors.terra} /></Section>
      </WebShell>
    );
  }

  const isWine = ['rouge', 'blanc', 'rose'].some((c) => product.categories.includes(c));
  const price = variation?.price ?? product.price;
  const casePrice = isWine ? price * 6 : null;

  const doAdd = async () => {
    setAdding(true);
    try {
      if (!storeApiReachable) {
        // Store API bloquée en CORS cross-origin : transfert du panier vers le
        // parcours WooCommerce hébergé (paybox conservé côté domaine).
        window.location.href = hosted.addToCart(product.id, 1, variation?.id);
        return;
      }
      await add(product.id, 1, variation?.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } finally { setAdding(false); }
  };

  return (
    <WebShell lang={lang}>
      <SeoHead
        title={`${decodeEntities(product.name)} | Domaine Les Amoureuses`}
        description={product.description}
        canonical={absUrl(lang === 'en' ? `/en/vins/${slug}/` : `/vins/${slug}/`)}
        hreflangFr={absUrl(`/vins/${slug}/`)}
        hreflangEn={absUrl(`/en/vins/${slug}/`)}
        jsonLd={{
          '@context': 'https://schema.org', '@type': 'Product',
          name: product.name, image: product.image ?? undefined,
          description: product.description,
          offers: { '@type': 'Offer', price: price.toFixed(2), priceCurrency: 'EUR', availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: absUrl(`/vins/${slug}/`) },
        }}
      />
      <Section>
        <View style={styles.productRow}>
          <View style={styles.productVisual}>
            {show3d ? (
              <Bottle3D image={product.image} label={product.name} interactive />
            ) : product.image ? (
              <Image source={{ uri: product.image }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            ) : null}
          </View>
          <View style={styles.productInfo}>
            <Eyebrow>{product.categories.includes('coffrets') ? d.coffrets : product.categories.includes('epicerie-fine') ? d.epicerie : 'Vin'}</Eyebrow>
            <H1 style={{ fontSize: 34, lineHeight: 40 }}>{decodeEntities(product.name)}</H1>
            {product.description ? <P style={{ marginTop: 12 }}>{product.description}</P> : null}

            {variations.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Text style={styles.filterLabel}>{d.variant}</Text>
                <View style={styles.chipRow}>
                  {variations.map((v) => (
                    <Pressable key={v.id} onPress={() => setVariation(v)} style={[styles.chip, variation?.id === v.id && styles.chipOn]}>
                      <Text style={[styles.chipText, variation?.id === v.id && styles.chipTextOn]}>
                        {v.attributes.map((a) => a.value).join(' ') || `#${v.id}`}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <View style={{ marginTop: 18 }}>
              <Text style={styles.priceBig}>{price.toFixed(2).replace('.', ',')} € {isWine ? d.perBottle : ''}</Text>
              {casePrice !== null && (
                <Text style={styles.casePrice}>{d.caseOf} : {casePrice.toFixed(2).replace('.', ',')} € — {d.caseNote}</Text>
              )}
            </View>

            <View style={[styles.ctaRow, { marginTop: 20 }]}>
              <CTAButton label={adding ? '…' : added ? `✓ ${d.added}` : d.addToCart} onPress={doAdd} />
              <CTAButton label={show3d ? 'Packshot' : d.explore3d} primary={false} onPress={() => setShow3d((v) => !v)} />
            </View>
            <Text style={{ marginTop: 14, fontSize: 13, color: product.inStock ? colors.success : colors.error }}>
              {product.inStock ? d.inStock : d.outOfStock}
            </Text>
          </View>
        </View>
      </Section>
    </WebShell>
  );
}

/* ----------------------------------- Cart ---------------------------------- */

export function CartScreen({ lang }: { lang: Lang }) {
  const d = t(lang);
  const r = useRoutes();
  const { cart, loading, update, remove, error } = useCart();
  const checkout = lang === 'en' ? '/en/checkout/' : '/commande/';

  return (
    <WebShell lang={lang}>
      <SeoHead title={`${d.cartTitle} | Les Amoureuses`} canonical={absUrl(lang === 'en' ? '/en/cart/' : '/panier/')} />
      <Section>
        <H1>{d.cartTitle}</H1>
        {loading && <ActivityIndicator color={colors.terra} style={{ marginTop: 24 }} />}
        {error && <P style={{ marginTop: 16, color: colors.error }}>{error}</P>}
        {!storeApiReachable ? (
          <View style={{ marginTop: 24, gap: 16 }}>
            <P>{d.cartHosted}</P>
            <CTAButton label={d.cartHostedCta} onPress={() => { window.location.href = hosted.cart; }} />
            <CTAButton href={r.shop} label={d.cartEmptyCta} primary={false} />
          </View>
        ) : !loading && (!cart || cart.itemsCount === 0) && !error && (
          <View style={{ marginTop: 24, gap: 16 }}>
            <P>{d.cartEmpty}</P>
            <CTAButton href={r.shop} label={d.cartEmptyCta} />
          </View>
        )}
        {cart?.items.map((item) => (
          <View key={item.key} style={styles.cartItem}>
            {item.image && <Image source={{ uri: item.image }} style={styles.cartImg} resizeMode="contain" />}
            <View style={{ flex: 1 }}>
              <Text style={styles.cartName}>{item.name}</Text>
              <Text style={styles.cartPrice}>{item.price.toFixed(2).replace('.', ',')} €</Text>
            </View>
            <View style={styles.qtyRow}>
              <Pressable style={styles.qtyBtn} onPress={() => update(item.key, Math.max(0, item.quantity - 1))}><Text>−</Text></Pressable>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Pressable style={styles.qtyBtn} onPress={() => update(item.key, item.quantity + 1)}><Text>+</Text></Pressable>
            </View>
            <Pressable onPress={() => remove(item.key)}><Text style={styles.remove}>{d.remove}</Text></Pressable>
          </View>
        ))}
        {cart && cart.itemsCount > 0 && (
          <View style={{ marginTop: 24, alignItems: 'flex-end', gap: 12 }}>
            <Text style={styles.total}>{d.total} : {cart.total.toFixed(2).replace('.', ',')} €</Text>
            <CTAButton href={checkout} label={d.checkoutCta} />
          </View>
        )}
      </Section>
    </WebShell>
  );
}

/* --------------------------------- Checkout -------------------------------- */

export function CheckoutScreen({ lang }: { lang: Lang }) {
  const d = t(lang);
  const { cart, refresh } = useCart();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', address_1: '', postcode: '', city: '' });
  const [state, setState] = useState<'form' | 'processing' | 'error'>('form');

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const pay = async () => {
    setState('processing');
    try {
      const billing = { ...form, country: 'FR', address_2: '', company: '', state: '' };
      const { redirectUrl } = await storeApi.checkout({ billing, shipping: billing });
      if (redirectUrl) {
        if (Platform.OS === 'web') window.location.href = redirectUrl;
        else Linking.openURL(redirectUrl);
        return;
      }
      // Payment plugin did not expose a redirect: fall back to hosted checkout
      setState('error');
    } catch {
      setState('error');
    }
  };

  const input = (key: string, label: string, opts: object = {}) => (
    <TextInput
      key={key} placeholder={label} value={(form as any)[key]} onChangeText={set(key)}
      style={styles.input} placeholderTextColor={colors.inkSoft} {...opts}
    />
  );

  return (
    <WebShell lang={lang}>
      <SeoHead title={`${d.checkoutTitle} | Les Amoureuses`} canonical={absUrl(lang === 'en' ? '/en/checkout/' : '/commande/')} />
      <Section style={{ maxWidth: 640 }}>
        <H1>{d.checkoutTitle}</H1>
        <P style={{ marginVertical: 14 }}>{d.checkoutIntro}</P>
        {!storeApiReachable ? (
          <View style={{ gap: 16 }}>
            <P>{d.checkoutHosted}</P>
            <CTAButton label={d.checkoutHostedCta} onPress={() => { window.location.href = hosted.checkout; }} />
          </View>
        ) : (!cart || cart.itemsCount === 0) ? (
          <CTAButton href={lang === 'en' ? '/en/shop/' : '/vins/'} label={d.cartEmptyCta} />
        ) : state === 'processing' ? (
          <View style={{ gap: 12 }}>
            <ActivityIndicator color={colors.terra} />
            <P>{d.payRedirect}</P>
          </View>
        ) : (
          <>
            {input('first_name', d.firstName)}
            {input('last_name', d.lastName)}
            {input('email', d.email, { keyboardType: 'email-address', autoComplete: 'email' })}
            {input('phone', d.phone, { keyboardType: 'phone-pad' })}
            {input('address_1', d.address)}
            {input('postcode', d.postcode)}
            {input('city', d.city)}
            <Text style={styles.total}>{d.total} : {cart.total.toFixed(2).replace('.', ',')} €</Text>
            <CTAButton label={d.payCta} onPress={pay} style={{ marginTop: 12 }} />
            {state === 'error' && (
              <View style={{ marginTop: 16, gap: 10 }}>
                <P style={{ color: colors.error }}>{d.payError}</P>
                <CTAButton
                  primary={false}
                  label={d.payFallback}
                  onPress={() => (Platform.OS === 'web' ? (window.location.href = `${SITE.fr}/commande/`) : Linking.openURL(`${SITE.fr}/commande/`))}
                />
              </View>
            )}
          </>
        )}
      </Section>
    </WebShell>
  );
}

/* -------------------------------- Oenotourism ------------------------------ */

export { ACTIVITIES };

export function OenoScreen({ lang }: { lang: Lang }) {
  const d = t(lang);
  return (
    <WebShell lang={lang}>
      <SeoHead
        title={lang === 'fr' ? 'Œnotourisme en Ardèche | Domaine Les Amoureuses' : 'Wine tourism in Ardèche | Domaine Les Amoureuses'}
        description={d.oenoIntro}
        canonical={absUrl(lang === 'en' ? '/en/our-services/' : '/oenotourisme/')}
        hreflangFr={absUrl('/oenotourisme/')}
        hreflangEn={absUrl('/en/our-services/')}
      />
      <Section>
        <Eyebrow>{d.navOeno}</Eyebrow>
        <H1>{d.oenoTitle}</H1>
        <P style={{ marginTop: 12, maxWidth: 640 }}>{d.oenoIntro}</P>
      </Section>
      <Section>
        {ACTIVITIES.map((a) => (
          <View key={a.id} style={styles.activity}>
            <View style={{ flex: 1 }}>
              <H2 style={{ fontSize: 24, lineHeight: 30 }}>{lang === 'fr' ? a.titleFr : a.titleEn}</H2>
              <P style={{ marginTop: 8 }}>{lang === 'fr' ? a.descFr : a.descEn}</P>
              <Text style={styles.activityMeta}>
                {a.duration ? `${lang === 'fr' ? 'Durée' : 'Duration'} : ${a.duration} · ` : ''}
                {d.from} {a.priceFrom.toFixed(2).replace('.', ',')} €
              </Text>
            </View>
            <View style={{ minWidth: 180, marginTop: 12 }}>
              <EllohaButton widgetId={a.ellohaId} culture={lang === 'en' ? 'en-GB' : 'fr-FR'} />
            </View>
          </View>
        ))}
      </Section>
      <Section style={{ backgroundColor: colors.paper }}>
        <H2>{d.oenoQuoteTitle}</H2>
        <P style={{ marginVertical: 12 }}>{lang === 'fr'
          ? "Groupes, entreprises, EVG/EVJF : formules sur mesure pour vos événements privés ou professionnels."
          : 'Groups, companies: tailored packages for private or corporate events.'}</P>
        <CTAButton href={lang === 'en' ? '/en/contact/' : '/contact/'} label={d.ctaQuote} primary={false} />
      </Section>
    </WebShell>
  );
}

/* ------------------------------- Privatisation ----------------------------- */

const CF7_ID = '2311';

export function QuoteForm({ lang, subject }: { lang: Lang; subject: string }) {
  const d = t(lang);
  const [form, setForm] = useState({ name: '', email: '', subject, message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  const send = async () => {
    setStatus('sending');
    if (!storeApiReachable) {
      // CF7 bloqué en CORS depuis la préprod : repli mailto (reste à valider
      // la réception réelle — voir PR, scénario « formulaire événement »).
      const subject = encodeURIComponent(form.subject);
      const bodyMail = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:contact@lesamoureuses.wine?subject=${subject}&body=${bodyMail}`;
      setStatus('ok');
      return;
    }
    try {
      const body = new FormData();
      body.append('your-name', form.name);
      body.append('your-email', form.email);
      body.append('your-subject', form.subject);
      body.append('your-message', form.message);
      body.append('_wpcf7_locale', lang === 'en' ? 'en_US' : 'fr_FR');
      const res = await fetch(`${SITE.api}/contact-form-7/v1/contact-forms/${CF7_ID}/feedback`, { method: 'POST', body });
      const json = await res.json();
      setStatus(json.status === 'mail_sent' ? 'ok' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const input = (k: keyof typeof form, label: string, multi = false) => (
    <TextInput
      placeholder={label} value={form[k]} multiline={multi}
      onChangeText={(v) => setForm((f) => ({ ...f, [k]: v }))}
      style={[styles.input, multi && { height: 120, textAlignVertical: 'top' }]}
      placeholderTextColor={colors.inkSoft}
    />
  );

  if (status === 'ok') return <P style={{ color: colors.success, marginTop: 12 }}>{d.sentOk}</P>;
  return (
    <View style={{ marginTop: 12, gap: 10, maxWidth: 520 }}>
      {input('name', d.yourName)}
      {input('email', d.yourEmail)}
      {input('subject', d.subject)}
      {input('message', d.message, true)}
      <CTAButton label={status === 'sending' ? '…' : d.send} onPress={send} />
      {status === 'error' && <P style={{ color: colors.error }}>{d.sentError}</P>}
    </View>
  );
}

export function PrivaScreen({ lang }: { lang: Lang }) {
  const d = t(lang);
  return (
    <WebShell lang={lang}>
      <SeoHead
        title={lang === 'fr' ? 'Privatisation du Domaine Les Amoureuses — Mariages, séminaires' : 'Private hire — Domaine Les Amoureuses'}
        description={d.privaIntro}
        canonical={absUrl('/privatisation-du-domaine-les-amoureuses/')}
        hreflangFr={absUrl('/privatisation-du-domaine-les-amoureuses/')}
      />
      <Section>
        <Eyebrow>{d.navPriva}</Eyebrow>
        <H1>{d.privaTitle}</H1>
        <P style={{ marginTop: 12, maxWidth: 640 }}>{d.privaIntro}</P>
        <View style={styles.spacesRow}>
          {['La Cuverie', 'Les Vignes', 'Extérieurs'].map((s) => (
            <View key={s} style={styles.spaceCard}><Text style={[styles.spaceName, serif]}>{s}</Text></View>
          ))}
        </View>
      </Section>
      <Section style={{ backgroundColor: colors.paper }}>
        <H2>{d.privaFormTitle}</H2>
        <QuoteForm lang={lang} subject={lang === 'fr' ? 'Demande de devis — Privatisation' : 'Quote request — Private hire'} />
      </Section>
    </WebShell>
  );
}

/* ------------------------------ Simple pages ------------------------------- */

export function PageScreen({ lang, eyebrow, title, children, canonical, frUrl, enUrl }: {
  lang: Lang; eyebrow?: string; title: string; children: React.ReactNode;
  canonical?: string; frUrl?: string; enUrl?: string;
}) {
  return (
    <WebShell lang={lang}>
      <SeoHead
        title={`${title} | Domaine Les Amoureuses`}
        canonical={canonical ? absUrl(canonical) : undefined}
        hreflangFr={frUrl ? absUrl(frUrl) : undefined}
        hreflangEn={enUrl ? absUrl(enUrl) : undefined}
      />
      <Section>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <H1>{title}</H1>
        <View style={{ marginTop: 18, gap: 14 }}>{children}</View>
      </Section>
    </WebShell>
  );
}

/* ---------------------------------- News ----------------------------------- */

export function NewsScreen({ lang }: { lang: Lang }) {
  const d = t(lang);
  return (
    <WebShell lang={lang}>
      <SeoHead
        title={`${d.newsTitle} | Domaine Les Amoureuses`}
        canonical={absUrl(lang === 'en' ? '/en/actualites/' : '/actualites-evenements-domaine-amoureuses/')}
        hreflangFr={absUrl('/actualites-evenements-domaine-amoureuses/')}
        hreflangEn={absUrl('/en/actualites/')}
      />
      <Section>
        <Eyebrow>{d.navNews}</Eyebrow>
        <H1>{d.newsTitle}</H1>
        <View style={[styles.grid, { marginTop: 20 }]}>
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/${p.slug}/` as any} asChild>
              <Pressable style={styles.postCard}>
                {p.image && <Image source={{ uri: p.image }} style={styles.postImg} resizeMode="cover" />}
                <Text style={styles.postDate}>{p.date}</Text>
                <Text style={[styles.postTitle, serif]} numberOfLines={3}>{p.title}</Text>
                <Text style={styles.postExcerpt} numberOfLines={3}>{p.excerpt}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </Section>
    </WebShell>
  );
}

export function PostScreen({ slug, lang }: { slug: string; lang: Lang }) {
  const post = POSTS.find((p) => p.slug === slug);
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    if (!storeApiReachable) return;
    fetch(`${SITE.api}/wp/v2/posts?slug=${slug}&_fields=content,title`)
      .then((r) => r.json())
      .then((list) => setHtml(list?.[0]?.content?.rendered ?? null))
      .catch(() => setHtml(null));
  }, [slug]);
  if (!post) {
    return (
      <WebShell lang={lang}>
        <Section><P>Article introuvable.</P></Section>
      </WebShell>
    );
  }
  return (
    <WebShell lang={lang}>
      <SeoHead title={`${post.title} | Domaine Les Amoureuses`} description={post.excerpt} canonical={absUrl(`/${slug}/`)} />
      <Section style={{ maxWidth: 720 }}>
        <Text style={styles.postDate}>{post.date}</Text>
        <H1 style={{ fontSize: 34, lineHeight: 42 }}>{post.title}</H1>
        {post.image && <Image source={{ uri: post.image }} style={styles.postHero} resizeMode="cover" />}
        <View style={{ marginTop: 16 }}>
          <HtmlContent html={html} excerpt={post.excerpt} />
        </View>
      </Section>
    </WebShell>
  );
}

/* --------------------------------- Styles ---------------------------------- */

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 20 },
  heroText: { flex: 1, maxWidth: 560 },
  heroBottle: { flex: 1, width: '100%', maxWidth: 480 },
  ctaRow: { flexDirection: 'row', gap: 14, marginTop: 24, flexWrap: 'wrap' },
  band: { borderTopWidth: 1, borderTopColor: colors.line },
  rangeRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', marginTop: 8 },
  rangeCard: { width: 220, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, padding: 18, alignItems: 'center' },
  assCard: { width: 300, maxWidth: '100%', backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.line, padding: 22 },
  assTitle: { fontSize: 22, color: colors.ink },
  assGo: { fontSize: 22, color: colors.terra, marginTop: 10 },
  rangeImg: { width: '100%', height: 160 },
  rangeName: { fontSize: 18, color: colors.ink, textAlign: 'center', marginTop: 8 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 8 },
  chip: { borderWidth: 1, borderColor: colors.line, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.paper },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontSize: 13, color: colors.ink },
  chipTextOn: { color: colors.paper },
  filterLabel: { fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: colors.inkSoft, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 24 },
  productRow: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', gap: 32, flexWrap: 'wrap' },
  productVisual: { width: '100%', maxWidth: 420, height: 480, alignSelf: 'center' },
  productInfo: { flex: 1, minWidth: 300 },
  priceBig: { fontSize: 24, color: colors.terra, fontWeight: '700' },
  casePrice: { fontSize: 15, color: colors.ink, marginTop: 6 },
  cartItem: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  cartImg: { width: 56, height: 90 },
  cartName: { fontSize: 16, color: colors.ink },
  cartPrice: { fontSize: 14, color: colors.terra, marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { width: 30, height: 30, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  qty: { fontSize: 15, minWidth: 22, textAlign: 'center' },
  remove: { fontSize: 12, color: colors.error, textTransform: 'uppercase', letterSpacing: 1 },
  total: { fontSize: 20, color: colors.ink, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper, padding: 14, fontSize: 15, color: colors.ink, marginBottom: 10, borderRadius: 2 },
  activity: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: colors.line },
  activityMeta: { marginTop: 10, fontSize: 13, color: colors.inkSoft, letterSpacing: 0.5 },
  spacesRow: { flexDirection: 'row', gap: 14, flexWrap: 'wrap', marginTop: 22 },
  spaceCard: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper, paddingVertical: 26, paddingHorizontal: 30 },
  spaceName: { fontSize: 18, color: colors.ink },
  postCard: { width: Platform.OS === 'web' ? 300 : '100%', backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, marginBottom: 18 },
  postImg: { width: '100%', height: 170 },
  postDate: { fontSize: 11, letterSpacing: 1.5, color: colors.terra, textTransform: 'uppercase', margin: 14, marginBottom: 4 },
  postTitle: { fontSize: 18, color: colors.ink, marginHorizontal: 14 },
  postExcerpt: { fontSize: 13, color: colors.inkSoft, margin: 14, marginTop: 8, lineHeight: 20 },
  postHero: { width: '100%', height: 320, marginTop: 20 },
});
