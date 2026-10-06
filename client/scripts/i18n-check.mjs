#!/usr/bin/env node
/**
 * Website translation audit. Run from client/: `npm run i18n:check`
 *
 * Reports:
 *  - translation keys used in src/ vs. the en/ru/uz/ar/tr dictionaries (missing keys)
 *  - key parity between languages, duplicate keys inside a dictionary, keys defined in both dictionary files
 *  - unused keys (informational)
 *  - hardcoded English in JSX text / user-visible attributes / toasts (admin panel excluded; it stays English)
 *  - suspicious values in non-English dictionaries (English copies, Cyrillic in uz/tr, Latin-only text in ru/ar)
 *
 * Exits with code 1 when anything other than unused keys is reported.
 */
import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

register(
  'data:text/javascript,' +
    encodeURIComponent(
      "export async function resolve(s,c,n){try{return await n(s,c)}catch(e){if(s.startsWith('.')&&!s.endsWith('.js'))return n(s+'.js',c);throw e}}",
    ),
);

const CLIENT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(CLIENT, 'src');
const I18N = path.join(SRC, 'i18n');
const LANGS = ['en', 'ru', 'uz', 'ar', 'tr'];
const verbose = process.argv.includes('--verbose');

const load = (file) => import(pathToFileURL(path.join(I18N, file)).href);
const { translations } = await load('translations.js');
const { siteTranslations } = await load('siteTranslations.js');
const rawSite = { en: siteTranslations.en };
for (const lang of LANGS.slice(1)) rawSite[lang] = (await load(`site/${lang}.js`)).default;

// ---------- helpers ----------
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (isObj(v)) flatten(v, key, out);
    else out.set(key, v);
  }
  return out;
}
const getNested = (obj, key) => key.split('.').reduce((acc, k) => acc?.[k], obj);
const deepMerge = (base, override) => {
  const out = { ...base };
  for (const [k, v] of Object.entries(override || {})) {
    out[k] = isObj(v) && isObj(base?.[k]) ? deepMerge(base[k], v) : v;
  }
  return out;
};
const walk = (dir, filter, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, filter, out);
    else if (filter(full)) out.push(full);
  }
  return out;
};
const rel = (f) => path.relative(CLIENT, f).replace(/\\/g, '/');
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

const problems = {};
const report = (section, item) => (problems[section] ||= []).push(item);

// ---------- dictionaries ----------
const leaves = {};
const roots = {};
for (const lang of LANGS) {
  const a = flatten(translations[lang]);
  const b = flatten(rawSite[lang]);
  for (const [k, v] of a) {
    if (b.has(k)) report('Keys defined in both translations.js and site dictionaries', `${lang}: ${k}`);
  }
  leaves[lang] = new Map([...b, ...a]);
  roots[lang] = deepMerge(rawSite[lang], translations[lang]);
}
const enKeys = [...leaves.en.keys()];
for (const lang of LANGS.slice(1)) {
  for (const k of enKeys) if (!leaves[lang].has(k)) report('Missing keys', `${lang}: ${k} (present in en)`);
  for (const k of leaves[lang].keys()) if (!leaves.en.has(k)) report('Keys not present in en', `${lang}: ${k}`);
  for (const k of enKeys) {
    const en = leaves.en.get(k);
    const other = leaves[lang].get(k);
    if (Array.isArray(en) && Array.isArray(other) && en.length !== other.length) {
      report('Array length mismatch', `${lang}: ${k} (${other.length} vs en ${en.length})`);
    }
  }
}

// Duplicate keys inside one object literal (JS silently keeps the last one).
function duplicateKeys(source) {
  const dupes = [];
  const stack = [];
  let i = 0;
  let expectKey = false;
  const skipWs = () => {
    for (;;) {
      if (/\s/.test(source[i] || '')) i += 1;
      else if (source.startsWith('//', i)) i = source.indexOf('\n', i) === -1 ? source.length : source.indexOf('\n', i);
      else if (source.startsWith('/*', i)) i = source.indexOf('*/', i) + 2;
      else return;
    }
  };
  const readString = () => {
    const q = source[i];
    let s = '';
    i += 1;
    while (i < source.length && source[i] !== q) {
      if (source[i] === '\\') { s += source[i + 1]; i += 2; } else { s += source[i]; i += 1; }
    }
    i += 1;
    return s;
  };
  while (i < source.length) {
    skipWs();
    const ch = source[i];
    if (ch === undefined) break;
    if (expectKey && stack.at(-1)) {
      expectKey = false;
      const start = i;
      let key = null;
      if (ch === '"' || ch === "'") key = readString();
      else {
        const m = /^[A-Za-z_$][\w$]*/.exec(source.slice(i, i + 200));
        if (m) { key = m[0]; i += key.length; }
      }
      if (key !== null) {
        skipWs();
        if (source[i] === ':') {
          const seen = stack.at(-1);
          if (seen.has(key)) dupes.push({ key, line: lineOf(source, start) });
          seen.add(key);
          i += 1;
        }
        continue;
      }
      i = start;
    }
    if (ch === '"' || ch === "'" || ch === '`') { readString(); continue; }
    if (ch === '{') { stack.push(new Set()); expectKey = true; i += 1; continue; }
    if (ch === '[' || ch === '(') { stack.push(null); i += 1; continue; }
    if (ch === '}' || ch === ']' || ch === ')') { stack.pop(); i += 1; continue; }
    if (ch === ',') { expectKey = true; i += 1; continue; }
    i += 1;
  }
  return dupes;
}
for (const file of ['translations.js', 'siteTranslations.js', ...LANGS.slice(1).map((l) => `site/${l}.js`)]) {
  for (const d of duplicateKeys(fs.readFileSync(path.join(I18N, file), 'utf8'))) {
    report('Duplicate keys', `i18n/${file}:${d.line} ${d.key}`);
  }
}

// ---------- keys used in source ----------
const namespaces = new Set(Object.keys(roots.en));
const sourceFiles = walk(SRC, (f) => /\.(jsx?|tsx?)$/.test(f) && !/[\\/](i18n|admin)[\\/]/.test(f));
const used = new Map();
const prefixes = new Map();
const addUse = (map, key, where) => { if (!map.has(key)) map.set(key, where); };

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/\b(?:t|tf)\(\s*(['"])([^'"\n]+)\1/g)) addUse(used, m[2], `${rel(file)}:${lineOf(text, m.index)}`);
  for (const m of text.matchAll(/\b(?:t|tf|hasTranslation|seededText\(t,)\(?\s*`([^`$]*)\$\{/g)) {
    addUse(prefixes, m[1].replace(/\.$/, ''), `${rel(file)}:${lineOf(text, m.index)}`);
  }
  for (const m of text.matchAll(/(['"])([a-z][A-Za-z0-9]*(?:\.[A-Za-z0-9_-]+)+)\1/g)) {
    if (namespaces.has(m[2].split('.')[0])) addUse(used, m[2], `${rel(file)}:${lineOf(text, m.index)}`);
  }
}
for (const [key, where] of used) {
  if (getNested(roots.en, key) === undefined) report('Missing keys', `en: ${key} (used at ${where})`);
  for (const lang of LANGS.slice(1)) {
    if (getNested(roots[lang], key) === undefined) report('Missing keys', `${lang}: ${key} (used at ${where})`);
  }
}
for (const [prefix, where] of prefixes) {
  if (!isObj(getNested(roots.en, prefix))) report('Missing keys', `en: ${prefix}.* (dynamic key at ${where})`);
}

// Unused keys (informational).
const isUsed = (key) => {
  const parts = key.split('.');
  for (let n = parts.length; n > 0; n -= 1) {
    const p = parts.slice(0, n).join('.');
    if (used.has(p) || prefixes.has(p)) return true;
  }
  return false;
};
const unused = enKeys.filter((k) => !isUsed(k));

// ---------- hardcoded English in source ----------
const ALLOWED_TEXT = [
  /^(Modern Gold( Jewelry| Jewellery)?|Our MG|MG|OUR MG)$/,
  /^[\w.+-]+@[\w-]+\.[\w.]+$/,
  /^(https?:\/\/|www\.)/,
  /^[\d\s+()\-–—.,:/%₹$€£×x·|]+$/,
  /^(SKU|AWB|EMI|COD|USD|UZS|AED|RUB|GBP|INR|OK|ID|PDF|N\/A)$/,
];
// Admin-only UI (the admin panel intentionally stays English).
const ADMIN_ONLY = [
  ['src/layouts/AdminLayout.jsx', /.*/],
  ['src/components/BrandLogo.jsx', /^Admin Panel$/],
];
const adminOnly = (file, s) => ADMIN_ONLY.some(([f, re]) => rel(file) === f && re.test(s));
const allowed = (s) => ALLOWED_TEXT.some((re) => re.test(s.trim()));
const looksEnglish = (s) => /[A-Za-z]{2,}/.test(s) && !allowed(s);
// The `>` before JSX text must close a real tag, not be a comparison operator in code.
const closesTag = (text, gt) => {
  const lt = text.lastIndexOf('<', gt);
  if (lt < 0) return false;
  const tag = text.slice(lt, gt + 1).replace(/=>/g, '');
  return /^<\/?[A-Za-z][\w.]*(\s[^<>]*)?\/?>$/.test(tag);
};
const jsxFiles = sourceFiles.filter((f) => f.endsWith('.jsx'));
for (const file of jsxFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/>([^<>{}]+)</g)) {
    const s = m[1].replace(/\s+/g, ' ').trim();
    if (!s || !closesTag(text, m.index) || adminOnly(file, s)) continue;
    // Code between two JSX blocks, e.g. `</div>\n) : cond ? (\n<p>`.
    if (/^[)\];:,]/.test(s) || /\($/.test(s)) continue;
    if (looksEnglish(s)) report('Hardcoded English in source', `${rel(file)}:${lineOf(text, m.index)} text "${s}"`);
  }
  for (const m of text.matchAll(/\b(placeholder|title|alt|aria-label|label)="([^"]+)"/g)) {
    if (looksEnglish(m[2])) report('Hardcoded English in source', `${rel(file)}:${lineOf(text, m.index)} ${m[1]}="${m[2]}"`);
  }
  for (const m of text.matchAll(/toast(?:\.\w+)?\(\s*(['"`])([^'"`]+)\1/g)) {
    if (looksEnglish(m[2])) report('Hardcoded English in source', `${rel(file)}:${lineOf(text, m.index)} toast "${m[2]}"`);
  }
}

// ---------- suspicious values in non-English dictionaries ----------
// Words that are spelled the same in that language (e.g. "Blog", "Hong Kong" in Uzbek/Turkish).
const SAME_AS_EN_OK = /^(Modern Gold|Our MG|MG|OUR MG|Email|E-mail|WhatsApp|Instagram|Telegram|Facebook|Stripe|SKU|AWB|EMI|COD|OK|Metal|Standart|unisex|Blog|Hong Kong|Figaro.*|\{[\w]+\}.*)$/i;
const BRANDISH = /(Modern Gold|Our MG|Modern Glamour|WhatsApp|Telegram|Instagram|Stripe|BIS|Namangan|Toshkent|SKU|AWB|EMI|COD|UZS|USD|RUB|GBP|SGD|MYR|HKD|AED|INR|₹|\{\w+\}|https?:|@|MG)/g;
const strings = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : isObj(v) ? Object.values(v).flatMap(strings) : []);
for (const lang of LANGS.slice(1)) {
  for (const [key, value] of leaves[lang]) {
    const en = leaves.en.get(key);
    const values = strings(value);
    const enValues = strings(en);
    values.forEach((s, idx) => {
      const stripped = s.replace(BRANDISH, '').trim();
      if (enValues[idx] === s && /[A-Za-z]{3,}/.test(stripped) && !SAME_AS_EN_OK.test(s.trim())) {
        report('Suspicious values in non-English dictionaries', `${lang}: ${key} is identical to English: "${s}"`);
      }
      if ((lang === 'uz' || lang === 'tr') && /[\u0400-\u04FF]/.test(s)) {
        report('Suspicious values in non-English dictionaries', `${lang}: ${key} contains Cyrillic: "${s}"`);
      }
      if (lang === 'ru' && /[A-Za-z]{3,}/.test(stripped) && !/[\u0400-\u04FF]/.test(s) && !SAME_AS_EN_OK.test(s.trim())) {
        report('Suspicious values in non-English dictionaries', `ru: ${key} has no Cyrillic: "${s}"`);
      }
      if (lang === 'ar' && /[A-Za-z]{3,}/.test(stripped) && !/[\u0600-\u06FF]/.test(s) && !SAME_AS_EN_OK.test(s.trim())) {
        report('Suspicious values in non-English dictionaries', `ar: ${key} has no Arabic: "${s}"`);
      }
    });
  }
}

// ---------- output ----------
const count = (section) => problems[section]?.length || 0;
const sections = [
  'Missing keys',
  'Keys not present in en',
  'Array length mismatch',
  'Duplicate keys',
  'Keys defined in both translations.js and site dictionaries',
  'Hardcoded English in source',
  'Suspicious values in non-English dictionaries',
];
console.log(`Languages: ${LANGS.join(', ')}`);
console.log(`Dictionary keys (en): ${enKeys.length}`);
console.log(`Keys referenced in source: ${used.size} static, ${prefixes.size} dynamic prefixes`);
for (const section of sections) {
  console.log(`${section}: ${count(section)}`);
  for (const item of problems[section] || []) console.log(`  - ${item}`);
}
console.log(`Unused keys (informational): ${unused.length}`);
if (verbose) for (const k of unused) console.log(`  - ${k}`);

const failed = sections.some((s) => count(s) > 0);
process.exit(failed ? 1 : 0);
