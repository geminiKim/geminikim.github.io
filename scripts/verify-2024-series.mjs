import { existsSync, readdirSync, readFileSync } from 'node:fs';

const failures = [];
const root = new URL('../', import.meta.url);
const manifestPath = new URL('scripts/2024-article-manifest.json', root);

function read(path, label = path) {
  try {
    return readFileSync(new URL(path, root), 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      failures.push(`Missing ${label}: ${path}`);
      return '';
    }
    throw error;
  }
}

function frontmatter(content) {
  return content.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? '';
}

function value(content, key) {
  const raw = frontmatter(content).match(new RegExp(`^${key}:\\s*(.+)$`, 'mu'))?.[1]?.trim() ?? '';
  return raw.replace(/^(?:"|')|(?:"|')$/gu, '');
}

function list(content, key) {
  const lines = frontmatter(content).split('\n');
  const start = lines.findIndex((line) => line === `${key}:`);
  if (start < 0) return [];
  const values = [];
  for (const line of lines.slice(start + 1)) {
    const match = line.match(/^\s+-\s+(.+)$/u);
    if (!match) break;
    values.push(match[1].trim());
  }
  return values;
}

function body(content) {
  return content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/u)?.[1]?.trimStart() ?? '';
}

function requireIncludes(path, expected, label) {
  if (!read(path).includes(expected)) failures.push(`${label}: ${path} is missing ${JSON.stringify(expected)}`);
}

function requireExcludes(path, unexpected, label) {
  if (read(path).includes(unexpected)) failures.push(`${label}: ${path} contains ${JSON.stringify(unexpected)}`);
}

let manifest = null;
let entries = [];
if (!existsSync(manifestPath)) {
  failures.push('The 2024 article manifest is missing');
} else {
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    entries = Array.isArray(manifest) ? manifest : manifest.articles;
    if (!Array.isArray(entries)) failures.push('The 2024 article manifest must contain an articles array');
  } catch (error) {
    failures.push(`The 2024 article manifest is invalid JSON: ${error.message}`);
  }
}

const excludedSources = Array.isArray(manifest?.excludedSources) ? manifest.excludedSources : [];
if (manifest && !Array.isArray(manifest)) {
  if (manifest.sourceYear !== 2024) failures.push('The manifest source year must be 2024');
  if (manifest.sourceCount !== 55) failures.push('The complete 2024 corpus must contain 55 logical Markdown sources');
  if (manifest.retainedCount !== entries.length) failures.push('The manifest retained count must match its article entries');
  if (manifest.excludedCount !== excludedSources.length) failures.push('The manifest excluded count must match its excluded entries');
  if (entries.length + excludedSources.length !== manifest.sourceCount) failures.push('Every 2024 source must be retained or explicitly excluded');
  const sourceFiles = [...entries, ...excludedSources].map((entry) => entry.sourceFile);
  if (new Set(sourceFiles).size !== manifest.sourceCount) failures.push('Every 2024 source file must appear exactly once in the manifest');
  if (
    excludedSources.length !== 1 ||
    String(excludedSources[0]?.sourceId) !== '18' ||
    excludedSources[0]?.classification !== 'exclude-self-promotion'
  ) {
    failures.push('Only source 18 may be excluded, for its self-promotional project/channel focus');
  }
  if (excludedSources.some((entry) => !String(entry.classification ?? '').startsWith('exclude-'))) {
    failures.push('Every excluded source needs an explicit exclusion classification');
  }
}

const englishNote = "> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.";
const koreanNote = '> **출처 및 AI 안내:** 이 글은 [제미니의 개발실무](https://www.youtube.com/@geminikims) 유튜브를 기반으로 작성되었습니다. `gpt-5.6-sol` 모델을 사용해 생성·편집했습니다.';
const slugs = [];
const dates = [];

for (const [index, entry] of entries.entries()) {
  const slug = entry?.slug ?? '';
  const expectedDate = entry?.publishedAt ?? '';
  slugs.push(slug);
  dates.push(expectedDate);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) failures.push(`Invalid slug at manifest index ${index}: ${slug}`);
  if (!/^2024-\d{2}-\d{2}$/u.test(expectedDate)) failures.push(`Invalid 2024 date for ${slug}: ${expectedDate}`);

  const enPath = `src/content/blog/en/${slug}.md`;
  const koPath = `src/content/blog/ko/${slug}.md`;
  const en = read(enPath, `English source for ${slug}`);
  const ko = read(koPath, `Korean source for ${slug}`);
  if (!en || !ko) continue;

  const enTitle = value(en, 'title');
  const koTitle = value(ko, 'title');
  const enDescription = value(en, 'description');
  const koDescription = value(ko, 'description');
  const enTags = list(en, 'tags');
  const koTags = list(ko, 'tags');
  const enBody = body(en);
  const koBody = body(ko);

  if (!enTitle || !koTitle || !enDescription || !koDescription) failures.push(`Titles and descriptions are required for ${slug}`);
  if (enTitle !== entry.enTitle || koTitle !== entry.koTitle) failures.push(`Bilingual titles must match the manifest for ${slug}`);
  if (!String(entry.classification ?? '').startsWith('keep-')) failures.push(`Published source needs a keep classification for ${slug}`);
  if (enDescription.length > 180 || koDescription.length > 180) failures.push(`Descriptions must be at most 180 characters for ${slug}`);
  if (value(en, 'lang') !== 'en' || value(ko, 'lang') !== 'ko') failures.push(`Locale front matter is invalid for ${slug}`);
  if (value(en, 'translationKey') !== slug || value(ko, 'translationKey') !== slug) failures.push(`Translation keys must equal the slug for ${slug}`);
  if (value(en, 'publishedAt') !== expectedDate || value(ko, 'publishedAt') !== expectedDate) failures.push(`Bilingual dates must match the manifest for ${slug}`);
  if (value(en, 'draft') !== 'false' || value(ko, 'draft') !== 'false') failures.push(`Both locales must be published for ${slug}`);
  if (JSON.stringify(enTags) !== JSON.stringify(koTags) || enTags.length < 2) failures.push(`Both locales need the same meaningful tags for ${slug}`);
  if (enTags.some((tag) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(tag))) failures.push(`Tags must be lowercase kebab-case for ${slug}`);
  if (/^updatedAt:/mu.test(en) || /^updatedAt:/mu.test(ko)) failures.push(`updatedAt is forbidden for ${slug}`);
  if (!enBody.startsWith(englishNote) || !koBody.startsWith(koreanNote)) failures.push(`The exact source/model disclosure must be the first body line for ${slug}`);
  if (enBody.length < 2600 || koBody.length < 1500) failures.push(`Bilingual article bodies are too short to be substantive for ${slug}`);

  const combined = `${en}\n${ko}`;
  if (/\b20(?:2[5-9]|[3-9]\d)\b/u.test(`${enBody}\n${koBody}`)) failures.push(`Post-2024 facts appear in the source-era body for ${slug}`);
  if (/\b(?:a few years ago|years ago|I used to)\b/iu.test(en)) failures.push(`Retrospective English framing appears for ${slug}`);
  if (/몇\s*년\s*전|예전에는[\s\S]{0,100}지금은/u.test(ko)) failures.push(`Retrospective Korean framing appears for ${slug}`);
  if (/Hermes Agent|Claude|\bOpus\b|\bKimi\b|OpenCode|\bCodex\b|Jaemin Kim|김재민/u.test(combined)) failures.push(`Deprecated public identity, agent wording, or undisclosed model/platform appears for ${slug}`);

  const enWithoutNote = enBody.slice(englishNote.length);
  const koWithoutNote = koBody.slice(koreanNote.length);
  if (/enroll|buy my course|subscribe to (?:my|the) channel/iu.test(enWithoutNote)) failures.push(`Promotional call to action appears in English for ${slug}`);
  if (/수강해|강의\s*신청|채널을?\s*구독|구독해/u.test(koWithoutNote)) failures.push(`Promotional call to action appears in Korean for ${slug}`);
  if (/\b(?:in today's rapidly evolving|it is important to note|delve|unlock|game-changer|in conclusion)\b/iu.test(enWithoutNote)) {
    failures.push(`Formulaic AI prose appears in English for ${slug}`);
  }

  const enOutput = `dist/articles/${slug}/index.html`;
  const koOutput = `dist/ko/articles/${slug}/index.html`;
  requireIncludes(enOutput, '<html lang="en">', `English document language for ${slug}`);
  requireIncludes(enOutput, `<link rel="canonical" href="https://geminikim.github.io/articles/${slug}/">`, `English canonical for ${slug}`);
  requireIncludes(enOutput, `hreflang="ko" href="https://geminikim.github.io/ko/articles/${slug}/"`, `English Korean alternate for ${slug}`);
  requireIncludes(enOutput, `hreflang="x-default" href="https://geminikim.github.io/articles/${slug}/"`, `English x-default for ${slug}`);
  requireIncludes(enOutput, '<a href="https://www.youtube.com/@geminikims">Gemini’s Devpractice</a>', `English source link for ${slug}`);
  requireIncludes(enOutput, '<code>gpt-5.6-sol</code>', `English model disclosure for ${slug}`);
  requireIncludes(enOutput, `<meta property="article:published_time" content="${expectedDate}T00:00:00.000Z">`, `English publication metadata for ${slug}`);
  requireExcludes(enOutput, 'article:modified_time', `English modified metadata for ${slug}`);

  requireIncludes(koOutput, '<html lang="ko">', `Korean document language for ${slug}`);
  requireIncludes(koOutput, `<link rel="canonical" href="https://geminikim.github.io/ko/articles/${slug}/">`, `Korean canonical for ${slug}`);
  requireIncludes(koOutput, `hreflang="en" href="https://geminikim.github.io/articles/${slug}/"`, `Korean English alternate for ${slug}`);
  requireIncludes(koOutput, `hreflang="x-default" href="https://geminikim.github.io/articles/${slug}/"`, `Korean x-default for ${slug}`);
  requireIncludes(koOutput, '<a href="https://www.youtube.com/@geminikims">제미니의 개발실무</a>', `Korean source link for ${slug}`);
  requireIncludes(koOutput, '<code>gpt-5.6-sol</code>', `Korean model disclosure for ${slug}`);
  requireIncludes(koOutput, `<meta property="article:published_time" content="${expectedDate}T00:00:00.000Z">`, `Korean publication metadata for ${slug}`);
  requireExcludes(koOutput, 'article:modified_time', `Korean modified metadata for ${slug}`);

  const enRendered = read(enOutput);
  const koRendered = read(koOutput);
  const enOgTitle = enRendered.match(/<meta property="og:title" content="([^"]+)">/u)?.[1] ?? '';
  const koOgTitle = koRendered.match(/<meta property="og:title" content="([^"]+)">/u)?.[1] ?? '';
  const enTwitterTitle = enRendered.match(/<meta name="twitter:title" content="([^"]+)">/u)?.[1] ?? '';
  const koTwitterTitle = koRendered.match(/<meta name="twitter:title" content="([^"]+)">/u)?.[1] ?? '';
  if (!enOgTitle || enOgTitle !== koOgTitle) failures.push(`Open Graph titles must use the English title in both locales for ${slug}`);
  if (!enTwitterTitle || enTwitterTitle !== koTwitterTitle) failures.push(`Twitter titles must use the English title in both locales for ${slug}`);

  requireIncludes('dist/articles/index.html', `/articles/${slug}/`, `English archive entry for ${slug}`);
  requireIncludes('dist/ko/articles/index.html', `/ko/articles/${slug}/`, `Korean archive entry for ${slug}`);
  requireIncludes('dist/rss.xml', `/articles/${slug}/`, `English RSS entry for ${slug}`);
  requireIncludes('dist/ko/rss.xml', `/ko/articles/${slug}/`, `Korean RSS entry for ${slug}`);
  requireIncludes('dist/sitemap-0.xml', `<loc>https://geminikim.github.io/articles/${slug}/</loc>`, `English sitemap entry for ${slug}`);
  requireIncludes('dist/sitemap-0.xml', `<loc>https://geminikim.github.io/ko/articles/${slug}/</loc>`, `Korean sitemap entry for ${slug}`);
}

if (new Set(slugs).size !== slugs.length) failures.push('The 2024 manifest contains duplicate slugs');
if (new Set(dates).size !== dates.length) failures.push('Every retained 2024 source needs a unique publication date');
const sourceOrders = entries.map((entry) => entry.order);
if (new Set(sourceOrders).size !== sourceOrders.length) failures.push('Retained 2024 sources need unique source-order positions');
for (let index = 1; index < dates.length; index += 1) {
  if (sourceOrders[index - 1] >= sourceOrders[index]) failures.push(`2024 source order must increase at manifest index ${index}`);
  if (dates[index - 1] >= dates[index]) failures.push(`2024 publication dates must increase in source order at manifest index ${index}`);
}

function published2024Slugs(locale) {
  const directory = new URL(`src/content/blog/${locale}/`, root);
  return readdirSync(directory)
    .filter((name) => name.endsWith('.md'))
    .filter((name) => /^2024-/u.test(value(readFileSync(new URL(name, directory), 'utf8'), 'publishedAt')))
    .map((name) => name.slice(0, -3))
    .sort();
}

const expectedSorted = [...slugs].sort();
if (JSON.stringify(published2024Slugs('en')) !== JSON.stringify(expectedSorted)) failures.push('English 2024 sources must match the manifest exactly');
if (JSON.stringify(published2024Slugs('ko')) !== JSON.stringify(expectedSorted)) failures.push('Korean 2024 sources must match the manifest exactly');

if (failures.length > 0) {
  console.error(`2024 article contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`2024 article contract passed (${entries.length} bilingual pairs)`);
