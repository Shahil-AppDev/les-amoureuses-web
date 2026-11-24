#!/usr/bin/env node
/**
 * Post-export pour GitHub Pages :
 * - transforme les fichiers <name>.html en <name>/index.html (URLs avec slash final, comme le site actuel)
 * - ajoute .nojekyll (sinon Jekyll ignore le dossier _expo qui contient les bundles)
 * - génère 404.html et sitemap.xml
 */
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', process.argv[2] || 'dist');
const SITE = 'https://www.lesamoureuses.wine';
const SKIP = new Set(['index', '404', '+not-found', '_sitemap', '[slug]', '[post]']);
const urls = [];

function walk(dir, prefix) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full, `${prefix}${entry.name}/`); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const name = entry.name.slice(0, -5);
    if (SKIP.has(name)) continue;
    if (name.startsWith('_') || name.startsWith('+')) continue;
    const route = `${prefix}${name}/`;
    const targetDir = path.join(dir, name);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(full, path.join(targetDir, 'index.html'));
    urls.push(route);
  }
}

walk(DIST, '/');
urls.push('/');

// .nojekyll — indispensable pour que GitHub Pages serve _expo/
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

// 404
const notFound = fs.existsSync(path.join(DIST, '+not-found.html'))
  ? fs.readFileSync(path.join(DIST, '+not-found.html'))
  : '<h1>404</h1>';
fs.writeFileSync(path.join(DIST, '404.html'), notFound);

// sitemap.xml (preprod : URLs du domaine canonique, à relire lors de la bascule)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.sort().map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nDisallow: /\n\n# Préproduction : non indexable. Remplacer par le sitemap canonique à la bascule.\n`);

// Neutralise les `import.meta` restants dans les bundles web classiques
// (code pré-minifié de certaines deps que le plugin Babel ne couvre pas)
const jsDir = path.join(DIST, '_expo', 'static', 'js', 'web');
if (fs.existsSync(jsDir)) {
  for (const f of fs.readdirSync(jsDir)) {
    if (!f.endsWith('.js')) continue;
    const p = path.join(jsDir, f);
    let code = fs.readFileSync(p, 'utf8');
    if (code.includes('import.meta')) {
      code = code.replace(/import\.meta\.env/g, '({MODE:"production"})');
      code = code.replace(/import\.meta\.url/g, '""');
      code = code.replace(/import\.meta/g, '({})');
      fs.writeFileSync(p, code);
    }
  }
}

console.log(`postexport: ${urls.length} routes en index.html, sitemap ${urls.length} URLs`);
