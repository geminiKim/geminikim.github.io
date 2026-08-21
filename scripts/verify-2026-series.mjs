import { existsSync, readdirSync, readFileSync } from 'node:fs';

const failures = [];
const root = new URL('../', import.meta.url);
const manifestPath = new URL('scripts/2026-article-manifest.json', root);
const auditPath = new URL('scripts/2026-source-audit.json', root);
const expectedDatePolicy = 'Editorial estimates at seven-day intervals preserve ascending source ID order from 2026-01-04. They are not researched upload dates.';
const expectedManifestKeys = ['sourceYear', 'sourceCount', 'retainedCount', 'excludedCount', 'datePolicy', 'articles', 'excludedSources'];
const expectedArticleKeys = ['order', 'sourceId', 'sourceFile', 'classification', 'slug', 'enTitle', 'koTitle', 'publishedAt', 'enDescription', 'koDescription', 'tags'];
const expectedExcludedKeys = ['sourceId', 'sourceFile', 'classification', 'reason'];
const expectedAuditKeys = ['sourceYear', 'sourceCount', 'datePolicy', 'sources'];
const expectedAuditSourceKeys = ['sourceId', 'sourceFile', 'finalLineRead', 'classification', 'thesis', 'reason', 'risks', 'evidence', 'slug', 'enTitle', 'koTitle', 'enDescription', 'koDescription', 'tags'];

function exactKeys(value, expected) {
  return value && !Array.isArray(value) && typeof value === 'object'
    && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort());
}

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

function frontmatterKeys(content) {
  return frontmatter(content)
    .split('\n')
    .map((line) => line.match(/^([A-Za-z][A-Za-z0-9]*):/u)?.[1])
    .filter(Boolean);
}

function activeMarkup(content) {
  return content
    .replace(/<!--[\s\S]*?-->/gu, '')
    .replace(/<!--[\s\S]*$/gu, '')
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/gu, '')
    .replace(/<(?:script|style|template|title|textarea|noscript|xmp|iframe|noembed|noframes)\b[^>]*>[\s\S]*?<\/(?:script|style|template|title|textarea|noscript|xmp|iframe|noembed|noframes)>/giu, '')
    .replace(/<plaintext\b[^>]*>[\s\S]*$/giu, '');
}

function requireIncludes(path, expected, label) {
  if (!activeMarkup(read(path)).includes(expected)) failures.push(`${label}: ${path} is missing ${JSON.stringify(expected)}`);
}

function requireExcludes(path, unexpected, label) {
  if (activeMarkup(read(path)).includes(unexpected)) failures.push(`${label}: ${path} contains ${JSON.stringify(unexpected)}`);
}

function requireExactlyOnce(path, expected, label) {
  const count = activeMarkup(read(path)).split(expected).length - 1;
  if (count !== 1) failures.push(`${label}: ${path} must contain ${JSON.stringify(expected)} exactly once, found ${count}`);
}

function requireMatchCount(path, pattern, expectedCount, label) {
  const count = activeMarkup(read(path)).match(pattern)?.length ?? 0;
  if (count !== expectedCount) failures.push(`${label}: ${path} must contain ${expectedCount} active matching elements, found ${count}`);
}

function requireExactlyOneMatch(path, pattern, label) {
  requireMatchCount(path, pattern, 1, label);
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/gu, '&')
    .replace(/&quot;/gu, '"')
    .replace(/&#(?:39|x27);/giu, "'")
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>');
}

let manifest = null;
let entries = [];
if (!existsSync(manifestPath)) {
  failures.push('The 2026 article manifest is missing');
} else {
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    if (!manifest || Array.isArray(manifest) || typeof manifest !== 'object') {
      failures.push('The 2026 article manifest must be an object, not a bare article array');
      manifest = {};
    }
    if (!Array.isArray(manifest.articles)) failures.push('The 2026 article manifest must contain an articles array');
    entries = Array.isArray(manifest.articles) ? manifest.articles : [];
  } catch (error) {
    failures.push(`The 2026 article manifest is invalid JSON: ${error.message}`);
    manifest = {};
  }
}

const excludedSources = Array.isArray(manifest?.excludedSources) ? manifest.excludedSources : [];
if (manifest) {
  if (!exactKeys(manifest, expectedManifestKeys)) failures.push('The 2026 manifest must use the exact approved top-level schema');
  if (manifest.sourceYear !== 2026) failures.push('The manifest source year must be 2026');
  if (manifest.sourceCount !== 18) failures.push('The complete 2026 corpus must contain 18 logical Markdown sources');
  if (manifest.retainedCount !== 16) failures.push('The manifest must retain exactly 16 publishable sources');
  if (manifest.excludedCount !== 2) failures.push('The manifest must explicitly exclude exactly two sources');
  if (manifest.retainedCount !== entries.length) failures.push('The manifest retained count must match its article entries');
  if (manifest.excludedCount !== excludedSources.length) failures.push('The manifest excluded count must match its excluded entries');
  if (manifest.datePolicy !== expectedDatePolicy) failures.push('The manifest must disclose the approved estimated-date policy exactly');
  if (entries.length + excludedSources.length !== manifest.sourceCount) failures.push('Every 2026 source must be retained or explicitly excluded');
  const allSources = [...entries, ...excludedSources];
  const sourceFiles = allSources.map((entry) => entry.sourceFile);
  const sourceIds = allSources.map((entry) => String(entry.sourceId));
  const expectedSourceIds = ['03', '05', '06', '11', '13', '14', '15', '17', '18', '19', '21', '24', '25', '26', '27', '28', '29', '30'];
  if (new Set(sourceFiles).size !== manifest.sourceCount) failures.push('Every 2026 source file must appear exactly once in the manifest');
  if (new Set(sourceIds).size !== expectedSourceIds.length || expectedSourceIds.some((sourceId) => !sourceIds.includes(sourceId))) {
    failures.push('The manifest must contain the exact 18 logical 2026 source IDs once each');
  }
  if (allSources.some((entry) => !String(entry.sourceFile ?? '').normalize('NFC').startsWith(`26_${String(entry.sourceId).padStart(2, '0')}_`))) {
    failures.push('Every manifest source file must match its logical source ID');
  }
  const technicalCount = entries.filter((entry) => entry.classification === 'keep-technical').length;
  const developerCount = entries.filter((entry) => entry.classification === 'keep-developer-related').length;
  if (technicalCount !== 11 || developerCount !== 5) failures.push('The retained corpus must contain 11 technical and 5 developer-practice sources');
  if (
    excludedSources.length !== 2 ||
    JSON.stringify(excludedSources.map((entry) => String(entry?.sourceId))) !== JSON.stringify(['18', '24']) ||
    excludedSources.some((entry) => entry?.classification !== 'exclude-promotion')
  ) {
    failures.push('Only sources 18 and 24 may be excluded for promotion-led course recruitment or sales focus');
  }
  if (excludedSources.some((entry) => !String(entry.classification ?? '').startsWith('exclude-'))) {
    failures.push('Every excluded source needs an explicit exclusion classification');
  }
  for (const [index, entry] of entries.entries()) {
    if (!exactKeys(entry, expectedArticleKeys)) failures.push(`Manifest article ${index + 1} must use the exact approved schema`);
    if (entry.order !== index + 1) failures.push(`Manifest article ${index + 1} must use contiguous source-order positions`);
  }
  for (const entry of excludedSources) {
    if (!exactKeys(entry, expectedExcludedKeys)) failures.push(`Excluded source ${entry?.sourceId ?? '?'} must use the exact approved schema`);
  }
}

let audit = {};
try {
  audit = JSON.parse(readFileSync(auditPath, 'utf8'));
} catch (error) {
  failures.push(`The 2026 source audit is missing or invalid: ${error.message}`);
}
if (!exactKeys(audit, expectedAuditKeys)) failures.push('The 2026 source audit must use the exact approved top-level schema');
if (audit.sourceYear !== 2026 || audit.sourceCount !== 18 || audit.datePolicy !== expectedDatePolicy) failures.push('The 2026 source audit metadata is invalid');
const auditedSources = Array.isArray(audit.sources) ? audit.sources : [];
if (auditedSources.length !== 18) failures.push('The 2026 source audit must contain exactly 18 sources');
const manifestById = new Map([...entries, ...excludedSources].map((entry) => [String(entry.sourceId), entry]));
for (const source of auditedSources) {
  const sourceId = String(source?.sourceId ?? '');
  const expectedKeys = source?.classification?.startsWith('keep-')
    ? [...expectedAuditSourceKeys, 'estimatedPublishedAt']
    : expectedAuditSourceKeys;
  if (!exactKeys(source, expectedKeys)) failures.push(`Audited source ${sourceId || '?'} must use the exact approved schema`);
  if (!Number.isInteger(source?.finalLineRead) || source.finalLineRead < 1) failures.push(`Audited source ${sourceId} has no verified final line`);
  if (!Array.isArray(source?.risks) || source.risks.length < 1 || source.risks.some((risk) => typeof risk !== 'string' || !risk.trim())) failures.push(`Audited source ${sourceId} needs explicit risks`);
  if (!Array.isArray(source?.evidence) || source.evidence.length !== 2) failures.push(`Audited source ${sourceId} needs exactly two evidence entries`);
  for (const evidence of source?.evidence ?? []) {
    if (!exactKeys(evidence, ['lines', 'paraphrase']) || !/^L?\d+-L?\d+$/u.test(evidence.lines) || typeof evidence.paraphrase !== 'string' || !evidence.paraphrase.trim()) failures.push(`Audited source ${sourceId} has invalid line evidence`);
    const bounds = String(evidence.lines).match(/L?(\d+)-L?(\d+)/u)?.slice(1).map(Number) ?? [];
    if (bounds.length !== 2 || bounds[0] < 1 || bounds[0] > bounds[1] || bounds[1] > source.finalLineRead) failures.push(`Audited source ${sourceId} evidence is outside the verified source range`);
  }
  const manifestEntry = manifestById.get(sourceId);
  if (!manifestEntry) failures.push(`Audited source ${sourceId} is absent from the publication manifest`);
  else {
    for (const key of ['sourceFile', 'classification']) {
      if (source[key] !== manifestEntry[key]) failures.push(`Audited source ${sourceId} ${key} does not match the manifest`);
    }
    if (source.classification.startsWith('keep-')) {
      for (const key of ['slug', 'enTitle', 'koTitle', 'enDescription', 'koDescription']) {
        if (source[key] !== manifestEntry[key]) failures.push(`Audited source ${sourceId} ${key} does not match the retained manifest`);
      }
      if (JSON.stringify(source.tags) !== JSON.stringify(manifestEntry.tags)) failures.push(`Audited source ${sourceId} tags do not match the retained manifest`);
      if (source.estimatedPublishedAt !== manifestEntry.publishedAt) failures.push(`Audited source ${sourceId} estimated date does not match the retained manifest`);
    } else if (source.estimatedPublishedAt !== undefined) {
      failures.push(`Excluded source ${sourceId} must not receive an estimated publication date`);
    }
  }
}
if (new Set(auditedSources.map((source) => String(source?.sourceId))).size !== 18) failures.push('Every audited source ID must appear exactly once');

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
  if (!/^2026-\d{2}-\d{2}$/u.test(expectedDate)) failures.push(`Invalid 2026 date for ${slug}: ${expectedDate}`);

  const enPath = `src/content/blog/en/${slug}.md`;
  const koPath = `src/content/blog/ko/${slug}.md`;
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
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
  const expectedFrontmatterKeys = ['title', 'description', 'lang', 'translationKey', 'publishedAt', 'tags', 'draft'];

  if (!enTitle || !koTitle || !enDescription || !koDescription) failures.push(`Titles and descriptions are required for ${slug}`);
  if (enTitle !== entry.enTitle || koTitle !== entry.koTitle) failures.push(`Bilingual titles must match the manifest for ${slug}`);
  if (enDescription !== entry.enDescription || koDescription !== entry.koDescription) failures.push(`Bilingual descriptions must match the manifest for ${slug}`);
  if (JSON.stringify(frontmatterKeys(en)) !== JSON.stringify(expectedFrontmatterKeys) || JSON.stringify(frontmatterKeys(ko)) !== JSON.stringify(expectedFrontmatterKeys)) {
    failures.push(`Both locales must use the exact approved frontmatter fields and order for ${slug}`);
  }
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
  if (enBody.length < 1200 || koBody.length < 700) failures.push(`Bilingual article bodies are too short to carry the source thesis for ${slug}`);

  const combined = `${en}\n${ko}`;
  if (/\b20(?:2[7-9]|[3-9]\d)\b/u.test(`${enBody}\n${koBody}`)) failures.push(`Post-2026 facts appear in the source-era body for ${slug}`);
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
  requireExactlyOnce(enOutput, `<link rel="canonical" href="https://geminikim.com/articles/${slug}/">`, `English canonical for ${slug}`);
  requireExactlyOneMatch(enOutput, /<link\b[^>]*\srel="canonical"[^>]*>/gu, `English canonical element for ${slug}`);
  requireExactlyOnce(enOutput, `hreflang="en" href="https://geminikim.com/articles/${slug}/"`, `English self alternate for ${slug}`);
  requireExactlyOnce(enOutput, `hreflang="ko" href="https://geminikim.com/ko/articles/${slug}/"`, `English Korean alternate for ${slug}`);
  requireExactlyOnce(enOutput, `hreflang="x-default" href="https://geminikim.com/articles/${slug}/"`, `English x-default for ${slug}`);
  requireMatchCount(enOutput, /<link\b[^>]*\shreflang="(?:en|ko|x-default)"[^>]*>/gu, 3, `English hreflang set for ${slug}`);
  requireIncludes(enOutput, '<a href="https://www.youtube.com/@geminikims">Gemini’s Devpractice</a>', `English source link for ${slug}`);
  requireIncludes(enOutput, '<code>gpt-5.6-sol</code>', `English model disclosure for ${slug}`);
  requireExactlyOnce(enOutput, `<meta property="article:published_time" content="${expectedDate}T00:00:00.000Z">`, `English publication metadata for ${slug}`);
  requireExactlyOneMatch(enOutput, /<meta\b[^>]*\sproperty="article:published_time"[^>]*>/gu, `English publication metadata element for ${slug}`);
  requireExcludes(enOutput, 'article:modified_time', `English modified metadata for ${slug}`);

  requireIncludes(koOutput, '<html lang="ko">', `Korean document language for ${slug}`);
  requireExactlyOnce(koOutput, `<link rel="canonical" href="https://geminikim.com/ko/articles/${slug}/">`, `Korean canonical for ${slug}`);
  requireExactlyOneMatch(koOutput, /<link\b[^>]*\srel="canonical"[^>]*>/gu, `Korean canonical element for ${slug}`);
  requireExactlyOnce(koOutput, `hreflang="en" href="https://geminikim.com/articles/${slug}/"`, `Korean English alternate for ${slug}`);
  requireExactlyOnce(koOutput, `hreflang="ko" href="https://geminikim.com/ko/articles/${slug}/"`, `Korean self alternate for ${slug}`);
  requireExactlyOnce(koOutput, `hreflang="x-default" href="https://geminikim.com/articles/${slug}/"`, `Korean x-default for ${slug}`);
  requireMatchCount(koOutput, /<link\b[^>]*\shreflang="(?:en|ko|x-default)"[^>]*>/gu, 3, `Korean hreflang set for ${slug}`);
  requireIncludes(koOutput, '<a href="https://www.youtube.com/@geminikims">제미니의 개발실무</a>', `Korean source link for ${slug}`);
  requireIncludes(koOutput, '<code>gpt-5.6-sol</code>', `Korean model disclosure for ${slug}`);
  requireExactlyOnce(koOutput, `<meta property="article:published_time" content="${expectedDate}T00:00:00.000Z">`, `Korean publication metadata for ${slug}`);
  requireExactlyOneMatch(koOutput, /<meta\b[^>]*\sproperty="article:published_time"[^>]*>/gu, `Korean publication metadata element for ${slug}`);
  requireExcludes(koOutput, 'article:modified_time', `Korean modified metadata for ${slug}`);

  const enRendered = activeMarkup(read(enOutput));
  const koRendered = activeMarkup(read(koOutput));
  requireExactlyOneMatch(enOutput, /<meta\b[^>]*\sproperty="og:title"[^>]*>/gu, `English Open Graph title element for ${slug}`);
  requireExactlyOneMatch(koOutput, /<meta\b[^>]*\sproperty="og:title"[^>]*>/gu, `Korean Open Graph title element for ${slug}`);
  requireExactlyOneMatch(enOutput, /<meta\b[^>]*\sname="twitter:title"[^>]*>/gu, `English Twitter title element for ${slug}`);
  requireExactlyOneMatch(koOutput, /<meta\b[^>]*\sname="twitter:title"[^>]*>/gu, `Korean Twitter title element for ${slug}`);
  const enOgTitle = enRendered.match(/<meta property="og:title" content="([^"]+)">/u)?.[1] ?? '';
  const koOgTitle = koRendered.match(/<meta property="og:title" content="([^"]+)">/u)?.[1] ?? '';
  const enTwitterTitle = enRendered.match(/<meta name="twitter:title" content="([^"]+)">/u)?.[1] ?? '';
  const koTwitterTitle = koRendered.match(/<meta name="twitter:title" content="([^"]+)">/u)?.[1] ?? '';
  const expectedSocialTitle = `${entry.enTitle} — Gemini Kim`;
  if (decodeHtml(enOgTitle) !== expectedSocialTitle || decodeHtml(koOgTitle) !== expectedSocialTitle) failures.push(`Open Graph titles must match the branded manifest English title in both locales for ${slug}`);
  if (decodeHtml(enTwitterTitle) !== expectedSocialTitle || decodeHtml(koTwitterTitle) !== expectedSocialTitle) failures.push(`Twitter titles must match the branded manifest English title in both locales for ${slug}`);

  requireExactlyOneMatch('dist/articles/index.html', new RegExp(`<a\\b[^>]*\\shref="/articles/${escapedSlug}/"[^>]*>`, 'gu'), `English archive entry for ${slug}`);
  requireExactlyOneMatch('dist/ko/articles/index.html', new RegExp(`<a\\b[^>]*\\shref="/ko/articles/${escapedSlug}/"[^>]*>`, 'gu'), `Korean archive entry for ${slug}`);
  requireExactlyOnce('dist/rss.xml', `<link>https://geminikim.com/articles/${slug}/</link>`, `English RSS item for ${slug}`);
  requireExactlyOnce('dist/ko/rss.xml', `<link>https://geminikim.com/ko/articles/${slug}/</link>`, `Korean RSS item for ${slug}`);
  requireExactlyOnce('dist/sitemap-0.xml', `<loc>https://geminikim.com/articles/${slug}/</loc>`, `English sitemap entry for ${slug}`);
  requireExactlyOnce('dist/sitemap-0.xml', `<loc>https://geminikim.com/ko/articles/${slug}/</loc>`, `Korean sitemap entry for ${slug}`);
}

if (new Set(slugs).size !== slugs.length) failures.push('The 2026 manifest contains duplicate slugs');
if (new Set(dates).size !== dates.length) failures.push('Every retained 2026 source needs a unique publication date');
if (dates[0] !== '2026-01-04' || dates.at(-1) !== '2026-04-19') failures.push('The approved estimated date range must remain 2026-01-04 through 2026-04-19');
const sourceOrders = entries.map((entry) => entry.order);
if (new Set(sourceOrders).size !== sourceOrders.length) failures.push('Retained 2026 sources need unique source-order positions');
for (let index = 1; index < dates.length; index += 1) {
  if (sourceOrders[index - 1] >= sourceOrders[index]) failures.push(`2026 source order must increase at manifest index ${index}`);
  if (dates[index - 1] >= dates[index]) failures.push(`2026 publication dates must increase in source order at manifest index ${index}`);
  const previous = new Date(`${dates[index - 1]}T00:00:00Z`);
  const current = new Date(`${dates[index]}T00:00:00Z`);
  if (current - previous !== 7 * 24 * 60 * 60 * 1000) failures.push(`2026 estimated dates must stay exactly seven days apart at manifest index ${index}`);
}

function published2026Slugs(locale) {
  const directory = new URL(`src/content/blog/${locale}/`, root);
  return readdirSync(directory)
    .filter((name) => name.endsWith('.md'))
    .filter((name) => /^2026-/u.test(value(readFileSync(new URL(name, directory), 'utf8'), 'publishedAt')))
    .map((name) => name.slice(0, -3))
    .sort();
}

const expectedSorted = [...slugs].sort();
if (JSON.stringify(published2026Slugs('en')) !== JSON.stringify(expectedSorted)) failures.push('English 2026 sources must match the manifest exactly');
if (JSON.stringify(published2026Slugs('ko')) !== JSON.stringify(expectedSorted)) failures.push('Korean 2026 sources must match the manifest exactly');

if (failures.length > 0) {
  console.error(`2026 article contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`2026 article contract passed (${entries.length} bilingual pairs)`);
