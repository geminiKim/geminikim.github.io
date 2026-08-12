import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { JSON_SCHEMA, load as parseYaml } from 'js-yaml';
import { SITE_ORIGIN } from '../site.config.mjs';
import { getTopicsForTags } from '../src/data/tag-taxonomy.mjs';

const failures = [];
const root = new URL('../', import.meta.url);

function read(relativePath) {
  const url = new URL(relativePath, root);
  if (!existsSync(url)) {
    failures.push(`Missing required file: ${relativePath}`);
    return '';
  }
  return readFileSync(url, 'utf8');
}

function metadata(source, label) {
  const block = source.match(/^---\n([\s\S]*?)\n---/u)?.[1];
  if (!block) {
    failures.push(`${label}: YAML frontmatter is missing`);
    return {};
  }
  try {
    const data = parseYaml(block, { schema: JSON_SCHEMA });
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      failures.push(`${label}: frontmatter must be a YAML mapping`);
      return {};
    }
    return data;
  } catch (error) {
    failures.push(`${label}: invalid YAML frontmatter: ${error.message}`);
    return {};
  }
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function tags(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? value.map((item) => item.trim())
    : [];
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x27;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function metaContent(html, attribute, value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  return decodeHtml(html.match(new RegExp(`<meta ${attribute}="${escaped}" content="([^"]*)">`, 'u'))?.[1] ?? '');
}

function articleIds(locale) {
  const base = new URL(`../src/content/blog/${locale}/`, import.meta.url);
  const collect = (directory, prefix = '') => readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const relative = `${prefix}${entry.name}`;
      if (entry.isDirectory()) return collect(new URL(`${entry.name}/`, directory), `${relative}/`);
      return entry.isFile() && entry.name.endsWith('.md') ? [relative.slice(0, -3)] : [];
    });
  return collect(base).sort();
}

function validCalendarDate(value) {
  const match = text(value).match(/^(\d{4})-(\d{2})-(\d{2})$/u);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

const englishSlugs = articleIds('en');
const koreanSlugs = articleIds('ko');
if (JSON.stringify(englishSlugs) !== JSON.stringify(koreanSlugs)) {
  failures.push('Every article must be delivered as a complete English/Korean slug pair');
}

const seen = {
  enTitle: new Map(),
  koTitle: new Map(),
  enDescription: new Map(),
  koDescription: new Map(),
  translationKey: new Map(),
};
const sitemap = read('dist/sitemap-0.xml');
const englishRss = read('dist/rss.xml');
const koreanRss = read('dist/ko/rss.xml');

function unique(map, value, slug, label) {
  if (!value) return;
  const previous = map.get(value);
  if (previous) failures.push(`${label} is duplicated by ${previous} and ${slug}`);
  else map.set(value, slug);
}

for (const slug of [...new Set([...englishSlugs, ...koreanSlugs])].sort()) {
  const enSource = read(`src/content/blog/en/${slug}.md`);
  const koSource = read(`src/content/blog/ko/${slug}.md`);
  if (!enSource || !koSource) continue;

  const enData = metadata(enSource, `en/${slug}`);
  const koData = metadata(koSource, `ko/${slug}`);
  const en = {
    title: text(enData.title),
    description: text(enData.description),
    lang: text(enData.lang),
    translationKey: text(enData.translationKey),
    publishedAt: text(enData.publishedAt),
    draft: enData.draft,
    tags: tags(enData.tags),
  };
  const ko = {
    title: text(koData.title),
    description: text(koData.description),
    lang: text(koData.lang),
    translationKey: text(koData.translationKey),
    publishedAt: text(koData.publishedAt),
    draft: koData.draft,
    tags: tags(koData.tags),
  };

  if (en.lang !== 'en' || ko.lang !== 'ko') failures.push(`${slug}: lang must be en/ko`);
  if (!en.translationKey || en.translationKey !== ko.translationKey) failures.push(`${slug}: translationKey must be present and identical`);
  unique(seen.translationKey, en.translationKey, slug, 'translationKey');
  if (!en.title || !ko.title) failures.push(`${slug}: both locales require a localized title`);
  if (en.title.length > 80 || ko.title.length > 80) failures.push(`${slug}: title must stay within 80 characters`);
  if (en.description.length < 80 || en.description.length > 180) failures.push(`${slug}: English description must be 80–180 characters`);
  if (ko.description.length < 40 || ko.description.length > 180) failures.push(`${slug}: Korean description must be 40–180 characters`);
  unique(seen.enTitle, en.title, slug, 'English title');
  unique(seen.koTitle, ko.title, slug, 'Korean title');
  unique(seen.enDescription, en.description, slug, 'English description');
  unique(seen.koDescription, ko.description, slug, 'Korean description');
  if (!validCalendarDate(en.publishedAt) || en.publishedAt !== ko.publishedAt) {
    failures.push(`${slug}: publishedAt must be a matching, real YYYY-MM-DD calendar date`);
  }
  if (en.draft !== ko.draft || typeof en.draft !== 'boolean') failures.push(`${slug}: draft state must be an explicit, identical boolean`);
  if (en.tags.length === 0 || JSON.stringify(en.tags) !== JSON.stringify(ko.tags)) {
    failures.push(`${slug}: both locales require the same non-empty tag list`);
  }
  for (const [locale, articleTags] of [['en', en.tags], ['ko', ko.tags]]) {
    try {
      getTopicsForTags(articleTags);
    } catch (error) {
      failures.push(`${slug}: ${locale} ${error.message}`);
    }
  }
  const isVideoDerived = /youtube\.com\/@geminikims/u.test(enSource) || /youtube\.com\/@geminikims/u.test(koSource);
  if (isVideoDerived && (Object.hasOwn(enData, 'updatedAt') || Object.hasOwn(koData, 'updatedAt'))) {
    failures.push(`${slug}: video-derived articles must preserve the source-date-only policy`);
  }

  if (en.draft === true) continue;
  const expectedSocialTitle = `${en.title} — Gemini Kim`;
  const pages = [
    { locale: 'en', path: `/articles/${slug}/`, source: en },
    { locale: 'ko', path: `/ko/articles/${slug}/`, source: ko },
  ];
  for (const page of pages) {
    const html = read(`dist${page.path}index.html`);
    const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/u)?.[1] ?? '');
    const description = decodeHtml(html.match(/<meta name="description" content="([^"]*)">/u)?.[1] ?? '');
    const h1Matches = [...html.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gu)];
    const h1 = decodeHtml((h1Matches[0]?.[1] ?? '').replace(/<[^>]+>/gu, ''));
    if (title !== `${page.source.title} — Gemini Kim`) failures.push(`${slug}: ${page.locale} browser title does not match localized source`);
    if (description !== page.source.description) failures.push(`${slug}: ${page.locale} meta description does not match source`);
    if (h1Matches.length !== 1 || h1 !== page.source.title) failures.push(`${slug}: ${page.locale} output must have exactly one localized H1`);
    if (metaContent(html, 'property', 'og:title') !== expectedSocialTitle) failures.push(`${slug}: ${page.locale} Open Graph title is invalid`);
    if (metaContent(html, 'name', 'twitter:title') !== expectedSocialTitle) failures.push(`${slug}: ${page.locale} Twitter title is invalid`);
    if (metaContent(html, 'property', 'og:description') !== page.source.description) failures.push(`${slug}: ${page.locale} Open Graph description is invalid`);
    if (metaContent(html, 'name', 'twitter:description') !== page.source.description) failures.push(`${slug}: ${page.locale} Twitter description is invalid`);
    if (html.includes('<meta name="robots" content="noindex')) failures.push(`${slug}: ${page.locale} canonical article must be indexable`);
    if (!html.includes(`<link rel="canonical" href="${SITE_ORIGIN}${page.path}">`)) failures.push(`${slug}: ${page.locale} canonical is invalid`);
    if (!html.includes(`hreflang="en" href="${SITE_ORIGIN}/articles/${slug}/"`)) failures.push(`${slug}: ${page.locale} English alternate is missing`);
    if (!html.includes(`hreflang="ko" href="${SITE_ORIGIN}/ko/articles/${slug}/"`)) failures.push(`${slug}: ${page.locale} Korean alternate is missing`);
    if (!html.includes(`hreflang="x-default" href="${SITE_ORIGIN}/articles/${slug}/"`)) failures.push(`${slug}: ${page.locale} x-default is missing`);
    if (!sitemap.includes(`<loc>${SITE_ORIGIN}${page.path}</loc>`)) failures.push(`${slug}: ${page.locale} sitemap entry is missing`);

    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)];
    if (scripts.length !== 1) {
      failures.push(`${slug}: ${page.locale} output must have exactly one JSON-LD script`);
    } else {
      try {
        const data = JSON.parse(scripts[0][1]);
        const expectedPublishedAt = `${page.source.publishedAt}T00:00:00.000Z`;
        if (data['@type'] !== 'BlogPosting') failures.push(`${slug}: ${page.locale} JSON-LD type is invalid`);
        if (data.headline !== page.source.title) failures.push(`${slug}: ${page.locale} JSON-LD headline is invalid`);
        if (data.description !== page.source.description) failures.push(`${slug}: ${page.locale} JSON-LD description is invalid`);
        if (data.datePublished !== expectedPublishedAt) failures.push(`${slug}: ${page.locale} JSON-LD publication date is invalid`);
        if (data.inLanguage !== page.locale) failures.push(`${slug}: ${page.locale} JSON-LD language is invalid`);
        if (data.mainEntityOfPage?.['@id'] !== `${SITE_ORIGIN}${page.path}`) failures.push(`${slug}: ${page.locale} JSON-LD canonical ID is invalid`);
        if (data.dateModified) failures.push(`${slug}: ${page.locale} JSON-LD must not contain dateModified`);
      } catch (error) {
        failures.push(`${slug}: ${page.locale} JSON-LD is invalid: ${error.message}`);
      }
    }
  }
  if (!englishRss.includes(`<link>${SITE_ORIGIN}/articles/${slug}/</link>`)) failures.push(`${slug}: English RSS entry is missing`);
  if (!koreanRss.includes(`<link>${SITE_ORIGIN}/ko/articles/${slug}/</link>`)) failures.push(`${slug}: Korean RSS entry is missing`);
}

const agentPolicy = read('AGENTS.md');
for (const requirement of ['## Mandatory article SEO contract', 'npm run build', 'scripts/verify-article-seo.mjs']) {
  if (!agentPolicy.includes(requirement)) failures.push(`AGENTS.md is missing mandatory SEO guidance: ${requirement}`);
}

if (failures.length > 0) {
  console.error(`Article SEO contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Article SEO contract passed (${englishSlugs.length} bilingual article pairs)`);
