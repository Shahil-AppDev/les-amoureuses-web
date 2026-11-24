# Domaine Les Amoureuses — refonte web/PWA/native

Application universelle (Expo SDK 54, Expo Router 6, React Native 0.81, TypeScript)
pour le Domaine Les Amoureuses : site vitrine + boutique + œnotourisme, publiée en
web statique (PWA installable) et compilable en natif Android/iOS.

- **Préproduction** : https://shahil-appdev.github.io/les-amoureuses-web/
- **Backend e-commerce** (source de vérité prix/stocks/commandes) : WooCommerce sur
  https://www.lesamoureuses.wine — paiement Paybox hébergé.

## Lancer le projet

```bash
npm install
npx expo start        # Metro : natif (Expo Go / émulateur) + web dev
npx tsc --noEmit      # typecheck
```

### Build web statique (préproduction)

```bash
npx expo export -p web   # génère dist/ (HTML pré-rendu par route)
node scripts/postexport.js   # .html → index.html en arborescence, sitemap.xml, .nojekyll, patchs
```

Le site est servi sous le sous-chemin `/les-amoureuses-web` (cf. `experiments.baseUrl`
dans `app.json`). Pour un test local :

```bash
mkdir -p .preview/les-amoureuses-web && cp -r dist/* .preview/les-amoureuses-web/
npx serve .preview   # http://localhost:PORT/les-amoureuses-web/
```

### Déploiement GitHub Pages

Le site est publié depuis la branche `gh-pages` (worktree dédié `../gh-pages-deploy`) :

```bash
cd ../gh-pages-deploy && git rm -rf --quiet .
cp -r "../Les Amoureuses/dist/"* . && cp "../Les Amoureuses/dist/.nojekyll" .
git add -A && git commit -m "Deploy" && git push origin gh-pages
```

⚠️ `.nojekyll` doit être copié explicitement (le glob `*` ignore les dotfiles) —
sinon `_expo/` n'est pas servi et le bundle JS 404.

## Mettre à jour les contenus

| Contenu | Fichier | Notes |
|---|---|---|
| Catalogue (noms, prix affichés en fallback, images, gammes) | `data/products.ts` | Snapshot statique ; sur natif ou en same-origin, prix/stocks sont rafraîchis en direct depuis la Store API WooCommerce |
| Descriptions produits | `data/products.ts` (`description`) | Reprise des métas Yoast du site actuel |
| Articles d'actualités | `data/posts.ts` (slug, date, titre, extrait, image) | Le corps HTML est chargé depuis WP en same-origin ; sinon extrait affiché |
| Textes FR/EN | `lib/i18n.ts` | Tous les libellés d'interface |
| Thème (couleurs, typo) | `constants/theme.ts` | crème `#F5EFE4`, encre `#23201C`, terre cuite `#A8502E` |
| Slugs/URLs produits | `data/products.ts` + route dynamique `app/vins/[slug].tsx` | URLs conservées à l'identique du site actuel |

Après toute modification : `npx expo export -p web && node scripts/postexport.js`, puis redéployer.

## Architecture

- `app/` — routes Expo Router (FR à la racine, EN sous `/en/`, URLs conservées du site WordPress)
- `components/screens.tsx` — écrans partagés (accueil, boutique, fiche, panier, checkout, œnotourisme, privatisation…)
- `components/Bottle3D.web.tsx` / `Bottle3D.tsx` — bouteille 3D web (R3F) / fallback statique natif ⚠️ **modèle procédural provisoire**, à remplacer par le GLB validé par le domaine
- `lib/store-api.ts` — client Store API WooCommerce + helpers de checkout hébergé (`hosted.addToCart/cart/checkout`)
- `context/CartContext.tsx` — panier ; `storeApiReachable` décide Store API directe (natif / same-origin) ou repli hébergé (web cross-origin, cf. section CORS dans la PR)
- `components/WebShell.tsx` — header/footer/nav + age gate
- `public/` — manifeste PWA, icônes, service worker (cache statique uniquement ; panier/compte/paiement/réservation exclus)

## Panier & paiement — fonctionnement

- **Web en préproduction (github.io)** : ajout au panier → navigation vers
  `lesamoureuses.wine/?add-to-cart=<id>&quantity=<n>` puis panier/commande hébergés
  WooCommerce (paiement Paybox). Testé de bout en bout.
- **Natif** : Store API complète (panier applicatif, checkout API + redirection Paybox).
- **Après bascule DNS** (l'app servie sur lesamoureuses.wine, même origine) : la Store API
  devient joignable en CORS et le panier applicatif s'active automatiquement
  (`storeApiReachable`), sans changement de code.
