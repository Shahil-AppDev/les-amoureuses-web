import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { colors, fonts } from '../constants/theme';
import { t } from '../lib/i18n';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { AgeGate } from './AgeGate';
import { MotionRoot } from './motionfx';
import type { Lang } from '../lib/types';

const ROUTES = {
  fr: {
    home: '/', shop: '/vins/', oeno: '/oenotourisme/', priva: '/privatisation-du-domaine-les-amoureuses/',
    contact: '/contact/', news: '/actualites-evenements-domaine-amoureuses/', press: '/presse/',
    cart: '/panier/', legal: '/mentions-legales/', account: '/mon-compte/',
    identity: '/notre-identite/', sens: '/le-sens/', places: '/les-lieux/',
    r1: '/les-vins-terres-des-amoureuses/', r2: '/les-vins-le-liby/', r3: '/les-vins-chateau-les-amoureuses/',
    sommelier: '/trouver-ma-cuvee/', visit: '/preparer-ma-visite/',
  },
  en: {
    home: '/en/', shop: '/en/shop/', oeno: '/en/our-services/', priva: '/privatisation-du-domaine-les-amoureuses/',
    contact: '/en/contact/', news: '/en/actualites/', press: '/presse/',
    cart: '/en/cart/', legal: '/en/mentions-legales-cgv/', account: '/en/my-account/',
    identity: '/en/notre-identite/', sens: '/en/le-sens/', places: '/en/les-lieux/',
    r1: '/en/les-vins-terres-des-amoureuses/', r2: '/en/les-vins-le-liby/', r3: '/en/les-vins-chateau-les-amoureuses/',
    sommelier: '/en/find-my-wine/', visit: '/en/plan-my-visit/',
  },
} as const;

export function useRoutes() {
  const { lang } = useApp();
  return ROUTES[lang];
}

function Logo({ lang }: { lang: Lang }) {
  return (
    <Link href={ROUTES[lang].home as any} asChild>
      <Pressable style={styles.logoRow}>
        <Image source={require('../assets/images/medallion.png')} style={styles.logoMark} resizeMode="contain" accessibilityLabel="Domaine Les Amoureuses" />
        <Text style={styles.logo}>
          <Text style={{ fontSize: 20, letterSpacing: 2.5, color: colors.terra }}>LES AMOUREUSES</Text>
          {'\n'}
          <Text style={{ fontSize: 9, letterSpacing: 5, color: colors.gold }}>ARDÈCHE</Text>
        </Text>
      </Pressable>
    </Link>
  );
}

export function LangSwitch() {
  const pathname = usePathname() || '/';
  const isEn = pathname.startsWith('/en');
  let target = isEn ? pathname.replace(/^\/en/, '') || '/' : `/en${pathname === '/' ? '/' : pathname}`;
  // EN shop uses /en/shop/ while product pages keep /en/vins/<slug>
  if (target === '/en/vins/' || target === '/en/vins') target = '/en/shop/';
  if (target === '/en/cart/' || target === '/en/panier/') target = '/en/cart/';
  if (isEn && (pathname === '/en/shop/' || pathname === '/en/shop')) target = '/vins/';
  // L'assistant a des slugs différents par langue
  if (isEn && pathname.startsWith('/en/find-my-wine')) target = '/trouver-ma-cuvee/';
  if (isEn && pathname.startsWith('/en/plan-my-visit')) target = '/preparer-ma-visite/';
  if (!isEn && pathname.startsWith('/trouver-ma-cuvee')) target = '/en/find-my-wine/';
  if (!isEn && pathname.startsWith('/preparer-ma-visite')) target = '/en/plan-my-visit/';
  return (
    <View style={styles.langRow}>
      <Link href={target as any}><Text style={[styles.langItem, !isEn && styles.langActive]}>FR</Text></Link>
      <Text style={styles.langSep}>·</Text>
      <Link href={target as any}><Text style={[styles.langItem, isEn && styles.langActive]}>EN</Text></Link>
    </View>
  );
}

export function WebShell({ children, lang }: { children: React.ReactNode; lang: Lang }) {
  const d = t(lang);
  const r = ROUTES[lang];
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const { width } = useWindowDimensions();
  // SSR rend la version compacte ; le premier rendu client doit lui correspondre
  // (évite le mismatch d'hydratation React #418), puis on bascule après montage.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const compact = Platform.OS !== 'web' || !mounted || width < 960;
  const count = cart?.itemsCount ?? 0;

  const links: { href: string; label: string }[] = [
    { href: r.home, label: d.navHome },
    { href: r.identity, label: d.navIdentity },
    { href: r.shop, label: d.navShop },
    { href: r.sommelier, label: d.navSommelier },
    { href: r.oeno, label: d.navOeno },
    { href: r.news, label: d.navNews },
    { href: r.priva, label: d.navPriva },
    { href: r.contact, label: d.navContact },
  ];

  return (
    <MotionRoot>
    <View style={styles.root}>
      <View style={styles.header}>
        <Logo lang={lang} />
        {!compact && (
          <View style={styles.nav}>
            {links.map((l) => (
              <Link key={l.href} href={l.href as any} asChild>
                <Pressable style={styles.navLink}>
                  <Text style={styles.navText}>{l.label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        )}
        <View style={styles.headerRight}>
          <LangSwitch />
          <Link href={r.cart as any} asChild>
            <Pressable>
              <Text style={styles.navText}>🛍 {d.cart}{count > 0 ? ` (${count})` : ''}</Text>
            </Pressable>
          </Link>
          <Pressable style={[styles.burger, !compact && ({ display: 'none' } as any)]} onPress={() => setMenuOpen((v) => !v)} accessibilityLabel="Menu">
            <View style={styles.burgerBar} /><View style={styles.burgerBar} /><View style={styles.burgerBar} />
          </Pressable>
        </View>
      </View>
      {menuOpen && (
        <View style={styles.mobileMenu}>
          {[...links, { href: r.visit, label: d.homeAssVisit }, { href: r.press, label: d.navPress }, { href: r.account, label: d.account }].map((l) => (
            <Link key={l.href} href={l.href as any} asChild>
              <Pressable style={styles.mobileItem} onPress={() => setMenuOpen(false)}>
                <Text style={styles.mobileText}>{l.label}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      )}
      <ScrollView style={styles.scroll} contentContainerStyle={{ flexGrow: 1 }}>
        {children}
        <View style={styles.footer}>
          <Image source={require('../assets/images/medallion.png')} style={styles.footerMark} resizeMode="contain" />
          <Text style={styles.footerBrand}>DOMAINE LES AMOUREUSES</Text>
          <Text style={styles.footerText}>1429 Chemin de Vinsas{'\n'}07700 Bourg-Saint-Andéol{'\n'}+33 (0)4 75 54 51 85 · contact@lesamoureuses.wine</Text>
          <View style={styles.footerLinks}>
            <Link href={r.shop as any}><Text style={styles.footerLink}>{d.navShop}</Text></Link>
            <Link href={r.legal as any}><Text style={styles.footerLink}>{d.legalMentions}</Text></Link>
          </View>
          <Text style={styles.legal}>{d.alcoholWarning}</Text>
        </View>
      </ScrollView>
      <AgeGate />
    </View>
    </MotionRoot>
  );
}

const isWeb = Platform.OS === 'web';
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 14, backgroundColor: isWeb ? 'rgba(251,247,239,0.86)' : colors.paper,
    borderBottomWidth: 1, borderBottomColor: colors.line,
    ...(isWeb ? ({ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' } as any) : {}),
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 46, height: 46 },
  footerMark: { width: 64, height: 64, alignSelf: 'center', marginBottom: 10 },
  logo: { textAlign: 'left', color: colors.ink, lineHeight: 20, ...(isWeb ? { fontFamily: fonts.displayWeb } : {}) },
  nav: { flexDirection: 'row', gap: 20, flexWrap: 'wrap', ...(Platform.OS === 'web' ? {} : { display: 'none' }) },
  navLink: { paddingVertical: 6 },
  navText: { fontSize: 13, letterSpacing: 1.2, color: colors.ink, textTransform: 'uppercase' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  langRow: { flexDirection: 'row', alignItems: 'center' },
  langItem: { fontSize: 13, color: colors.inkSoft, paddingHorizontal: 4 },
  langActive: { color: colors.terra, fontWeight: '700' },
  langSep: { color: colors.line },
  cartLink: {},
  burger: { padding: 8, gap: 4 },
  burgerBar: { width: 22, height: 2, backgroundColor: colors.ink },
  mobileMenu: { backgroundColor: colors.paper, borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: 8 },
  mobileItem: { paddingVertical: 14, paddingHorizontal: 24, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  mobileText: { fontSize: 15, letterSpacing: 1, color: colors.ink, textTransform: 'uppercase' },
  footer: { backgroundColor: colors.ink, padding: 40, marginTop: 40 },
  footerBrand: { color: colors.gold, fontSize: 18, letterSpacing: 4, textAlign: 'center', marginBottom: 16, ...(isWeb ? { fontFamily: fonts.displayWeb } : {}) },
  footerText: { color: '#CBBFA8', fontSize: 13, lineHeight: 22, textAlign: 'center' },
  footerLinks: { flexDirection: 'row', gap: 24, justifyContent: 'center', marginTop: 18 },
  footerLink: { color: colors.paper, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },
  legal: { color: '#8d8168', fontSize: 11, textAlign: 'center', marginTop: 22, fontStyle: 'italic' },
});
