/** Decode les entités HTML nommées/numériques courantes renvoyées par l'API WP. */
const NAMED: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  rsquo: '\u2019', lsquo: '\u2018', rdquo: '\u201C', ldquo: '\u201D',
  nbsp: '\u00A0', hellip: '\u2026', eacute: 'é', egrave: 'è', ecirc: 'ê',
  agrave: 'à', acirc: 'â', ccedil: 'ç', ugrave: 'ù', ocirc: 'ô', icirc: 'î',
  iuml: 'ï', euml: 'ë', deg: '°', euro: '€', laquo: '«', raquo: '»',
};
export function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, e) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return NAMED[e] ?? m;
  });
}
