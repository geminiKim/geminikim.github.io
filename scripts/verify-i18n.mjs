import { existsSync, readdirSync, readFileSync } from 'node:fs';

const failures = [];

function read(path) {
  try {
    return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      failures.push(`Required build output is missing: ${path}`);
      return '';
    }
    throw error;
  }
}

function includes(path, expected, label) {
  const content = read(path);
  if (!content.includes(expected)) {
    failures.push(`${label}: ${path} is missing ${JSON.stringify(expected)}`);
  }
}

function excludes(path, unexpected, label) {
  const content = read(path);
  if (content.includes(unexpected)) {
    failures.push(`${label}: ${path} unexpectedly contains ${JSON.stringify(unexpected)}`);
  }
}

function missing(path, label) {
  if (existsSync(new URL(`../${path}`, import.meta.url))) {
    failures.push(`${label}: ${path} must not be generated`);
  }
}

includes('dist/index.html', '<html lang="en">', 'English is the default document language');
includes('dist/index.html', '<link rel="canonical" href="https://geminikim.com/">', 'English home is canonical');
includes('dist/index.html', 'hreflang="en" href="https://geminikim.com/"', 'English home hreflang');
includes('dist/index.html', 'hreflang="ko" href="https://geminikim.com/ko/"', 'Korean home hreflang');
includes('dist/index.html', 'hreflang="x-default" href="https://geminikim.com/"', 'English is x-default');
includes(
  'dist/index.html',
  '<h1>Build it. Run it.<br><em>Learn</em> from it.</h1>',
  'English home preserves the original hero slogan',
);

includes('dist/ko/index.html', '<html lang="ko">', 'Korean home language');
includes(
  'dist/ko/index.html',
  '<h1>Build it. Run it.<br><em>Learn</em> from it.</h1>',
  'Korean home preserves the original English hero slogan',
);
excludes('dist/ko/index.html', '기술을 만들고,', 'Korean home removes the retired localized slogan');
excludes('dist/ko/index.html', '만들고, 운영하고,', 'Korean home does not localize the hero slogan');
includes(
  'dist/ko/index.html',
  '<title>Gemini Kim — 소프트웨어 엔지니어링 노트</title>',
  'Korean home browser title is localized',
);
includes('dist/ko/index.html', '<link rel="canonical" href="https://geminikim.com/ko/">', 'Korean home canonical');
includes(
  'dist/ko/index.html',
  '<meta property="og:title" content="Gemini Kim — Software engineering notes">',
  'Korean home Open Graph title is English',
);
excludes('dist/ko/index.html', 'http-equiv="refresh"', 'Korean home is content, not a redirect');

includes('dist/index.html', 'href="/articles/">Articles</a>', 'English navigation labels the archive Articles');
includes(
  'dist/ko/index.html',
  'href="/ko/" class="active" aria-current="page">Home</a>',
  'Korean navigation uses the shared Home label',
);
includes(
  'dist/ko/index.html',
  'href="/ko/articles/">Articles</a>',
  'Korean navigation uses the shared Articles label',
);
includes('dist/ko/index.html', 'href="/ko/about/">About</a>', 'Korean navigation uses the shared About label');
includes('dist/articles/index.html', '<h1>Articles</h1>', 'English archive heading');
excludes(
  'dist/articles/index.html',
  '<p class="section-kicker">Articles</p>',
  'English archive does not repeat the Articles label',
);
includes('dist/ko/articles/index.html', '<h1>Articles</h1>', 'Korean archive uses the shared Articles heading');
excludes(
  'dist/ko/articles/index.html',
  '<p class="section-kicker">Articles</p>',
  'Korean archive does not pair Articles with a duplicate localized heading',
);
includes(
  'dist/ko/articles/index.html',
  '<title>글 — Gemini Kim</title>',
  'Korean archive document title is localized',
);
const expected2023ArticleSlugs = [
  'normalization-from-requirements',
  'split-large-service-class',
  'experience-over-development-jargon',
  'reuse-below-use-case-layer',
  'define-problems-from-user-perspective',
  'trace-id-across-distributed-services',
  'reader-writer-business-flow',
  'isolate-admin-from-domain',
  'operate-toy-project-for-real-users',
  'gradle-dependency-boundaries',
  'premature-multi-module-complexity',
  'idempotent-ai-tool-calls',
  'unit-tests-protect-business-intent',
  'software-that-survives-developer-departure',
  'frequent-dependency-upgrades',
  'cohesive-packages-with-modules-and-layers',
  'grow-software-in-stages',
  'domain-maturity-and-module-boundaries',
  'timeouts-retries-and-failure-propagation',
  'circuit-breaker-placement',
  'practical-git-commit-branch-rules',
  'dto-boundaries-between-layers',
  'reliable-database-tests-with-testcontainers',
  'high-traffic-experience-without-traffic',
];

function readSource(path) {
  try {
    return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      failures.push(`Required source file is missing: ${path}`);
      return '';
    }
    throw error;
  }
}

function frontmatterValue(content, key) {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? '';
  const value = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'mu'))?.[1]?.trim() ?? '';
  return value.replace(/^(?:"|')|(?:"|')$/gu, '');
}

function frontmatterList(content, key) {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? '';
  const lines = frontmatter.split('\n');
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

function markdownBody(content) {
  return content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/u)?.[1]?.trimStart() ?? '';
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

const englishArticleSlugs = readdirSync(new URL('../src/content/blog/en/', import.meta.url))
  .filter((name) => name.endsWith('.md'))
  .map((name) => name.slice(0, -3))
  .sort();
const koreanArticleSlugs = readdirSync(new URL('../src/content/blog/ko/', import.meta.url))
  .filter((name) => name.endsWith('.md'))
  .map((name) => name.slice(0, -3))
  .sort();
if (JSON.stringify(englishArticleSlugs) !== JSON.stringify(koreanArticleSlugs)) {
  failures.push('English and Korean article source slugs must match exactly');
}
const expected2023PublicationDates = [];
for (const slug of expected2023ArticleSlugs) {
  if (!englishArticleSlugs.includes(slug) || !koreanArticleSlugs.includes(slug)) {
    failures.push(`The complete 2023 YouTube series is missing the translated pair for ${slug}`);
    continue;
  }

  const englishSourcePath = `src/content/blog/en/${slug}.md`;
  const koreanSourcePath = `src/content/blog/ko/${slug}.md`;
  const englishSource = readSource(englishSourcePath);
  const koreanSource = readSource(koreanSourcePath);
  const englishKey = frontmatterValue(englishSource, 'translationKey');
  const koreanKey = frontmatterValue(koreanSource, 'translationKey');
  const englishTitle = frontmatterValue(englishSource, 'title');
  const koreanTitle = frontmatterValue(koreanSource, 'title');
  const englishDescription = frontmatterValue(englishSource, 'description');
  const koreanDescription = frontmatterValue(koreanSource, 'description');
  const englishDate = frontmatterValue(englishSource, 'publishedAt');
  const koreanDate = frontmatterValue(koreanSource, 'publishedAt');
  const englishTags = frontmatterList(englishSource, 'tags');
  const koreanTags = frontmatterList(koreanSource, 'tags');

  if (englishKey !== slug || koreanKey !== slug) {
    failures.push(`Translation keys must match the slug for ${slug}`);
  }
  if (!englishTitle || !koreanTitle || !englishDescription || !koreanDescription) {
    failures.push(`Both locale sources need titles and descriptions for ${slug}`);
  }
  if (englishDescription.length > 180 || koreanDescription.length > 180) {
    failures.push(`Article descriptions must stay within 180 characters for ${slug}`);
  }
  if (frontmatterValue(englishSource, 'lang') !== 'en' || frontmatterValue(koreanSource, 'lang') !== 'ko') {
    failures.push(`Article source languages are invalid for ${slug}`);
  }
  if (!/^2023-\d{2}-\d{2}$/u.test(englishDate) || englishDate !== koreanDate) {
    failures.push(`English and Korean source-era publication dates must match for ${slug}`);
  }
  expected2023PublicationDates.push({ slug, date: englishDate });
  if (JSON.stringify(englishTags) !== JSON.stringify(koreanTags)) {
    failures.push(`English and Korean tags must match for ${slug}`);
  }
  if (frontmatterValue(englishSource, 'draft') !== 'false' || frontmatterValue(koreanSource, 'draft') !== 'false') {
    failures.push(`The complete 2023 series must be published in both locales for ${slug}`);
  }
  if (/^updatedAt:/mu.test(englishSource) || /^updatedAt:/mu.test(koreanSource)) {
    failures.push(`The source-date-only policy forbids updatedAt for ${slug}`);
  }
  if (/Hermes Agent|Gemini Kim(?:'s|’s) YouTube content|Gemini Kim의 2023년도/u.test(`${englishSource}\n${koreanSource}`)) {
    failures.push(`Deprecated public source or agent wording remains for ${slug}`);
  }
  if (/\b20(?:2[4-9]|[3-9]\d)\b/u.test(`${markdownBody(englishSource)}\n${markdownBody(koreanSource)}`)) {
    failures.push(`Post-2023 facts must not be presented inside the source-era article body for ${slug}`);
  }
  if (
    !markdownBody(englishSource).startsWith(
      "> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.",
    )
  ) {
    failures.push(`English article source/model disclosure is missing or changed for ${slug}`);
  }
  if (
    !markdownBody(koreanSource).startsWith(
      '> **출처 및 AI 안내:** 이 글은 [제미니의 개발실무](https://www.youtube.com/@geminikims) 유튜브를 기반으로 작성되었습니다. `gpt-5.6-sol` 모델을 사용해 생성·편집했습니다.',
    )
  ) {
    failures.push(`Korean article source/model disclosure is missing or changed for ${slug}`);
  }
  if (/\b(?:a few years ago|years ago|I used to)\b/iu.test(englishSource)) {
    failures.push(`English article contains retrospective framing for ${slug}`);
  }
  if (/몇\s*년\s*전|예전에는[\s\S]{0,100}지금은/u.test(koreanSource)) {
    failures.push(`Korean article contains retrospective framing for ${slug}`);
  }

  const englishOutput = `dist/articles/${slug}/index.html`;
  const koreanOutput = `dist/ko/articles/${slug}/index.html`;
  includes(englishOutput, '<html lang="en">', `English article language for ${slug}`);
  includes(
    englishOutput,
    `<link rel="canonical" href="https://geminikim.com/articles/${slug}/">`,
    `English article canonical for ${slug}`,
  );
  includes(
    englishOutput,
    `hreflang="ko" href="https://geminikim.com/ko/articles/${slug}/"`,
    `English article Korean alternate for ${slug}`,
  );
  includes(
    englishOutput,
    `hreflang="x-default" href="https://geminikim.com/articles/${slug}/"`,
    `English article x-default for ${slug}`,
  );
  includes(
    englishOutput,
    '<a href="https://www.youtube.com/@geminikims">Gemini’s Devpractice</a>',
    `English article YouTube source for ${slug}`,
  );
  includes(englishOutput, '<code>gpt-5.6-sol</code>', `English article model disclosure for ${slug}`);
  includes(
    englishOutput,
    `<meta property="article:published_time" content="${englishDate}T00:00:00.000Z">`,
    `English article publication date for ${slug}`,
  );
  excludes(englishOutput, 'article:modified_time', `English article modified metadata for ${slug}`);
  excludes(englishOutput, '<span>Updated ', `English article modified label for ${slug}`);

  includes(koreanOutput, '<html lang="ko">', `Korean article language for ${slug}`);
  includes(
    koreanOutput,
    `<link rel="canonical" href="https://geminikim.com/ko/articles/${slug}/">`,
    `Korean article canonical for ${slug}`,
  );
  includes(
    koreanOutput,
    `hreflang="en" href="https://geminikim.com/articles/${slug}/"`,
    `Korean article English alternate for ${slug}`,
  );
  includes(
    koreanOutput,
    `hreflang="x-default" href="https://geminikim.com/articles/${slug}/"`,
    `Korean article x-default for ${slug}`,
  );
  includes(
    koreanOutput,
    '<a href="https://www.youtube.com/@geminikims">제미니의 개발실무</a>',
    `Korean article YouTube source for ${slug}`,
  );
  includes(koreanOutput, '<code>gpt-5.6-sol</code>', `Korean article model disclosure for ${slug}`);
  includes(
    koreanOutput,
    `<meta property="article:published_time" content="${koreanDate}T00:00:00.000Z">`,
    `Korean article publication date for ${slug}`,
  );
  excludes(koreanOutput, 'article:modified_time', `Korean article modified metadata for ${slug}`);
  excludes(koreanOutput, '<span>수정 ', `Korean article modified label for ${slug}`);

  const englishRendered = read(englishOutput);
  const koreanRendered = read(koreanOutput);
  const englishOgTitle = englishRendered.match(/<meta property="og:title" content="([^"]+)">/u)?.[1] ?? '';
  const koreanOgTitle = koreanRendered.match(/<meta property="og:title" content="([^"]+)">/u)?.[1] ?? '';
  const englishTwitterTitle = englishRendered.match(/<meta name="twitter:title" content="([^"]+)">/u)?.[1] ?? '';
  const koreanTwitterTitle = koreanRendered.match(/<meta name="twitter:title" content="([^"]+)">/u)?.[1] ?? '';
  if (!englishOgTitle || englishOgTitle !== koreanOgTitle) {
    failures.push(`English and Korean Open Graph titles must use the English title for ${slug}`);
  }
  if (!englishTwitterTitle || englishTwitterTitle !== koreanTwitterTitle) {
    failures.push(`English and Korean Twitter titles must use the English title for ${slug}`);
  }
  const englishBrowserTitle = decodeHtml(englishRendered.match(/<title>(.*?)<\/title>/su)?.[1] ?? '');
  const koreanBrowserTitle = decodeHtml(koreanRendered.match(/<title>(.*?)<\/title>/su)?.[1] ?? '');
  if (englishBrowserTitle !== `${englishTitle} — Gemini Kim`) {
    failures.push(`English article browser title is incorrect for ${slug}`);
  }
  if (koreanBrowserTitle !== `${koreanTitle} — Gemini Kim`) {
    failures.push(`Korean article browser title is incorrect for ${slug}`);
  }

  includes('dist/articles/index.html', `/articles/${slug}/`, `English archive includes ${slug}`);
  includes('dist/ko/articles/index.html', `/ko/articles/${slug}/`, `Korean archive includes ${slug}`);
  includes('dist/rss.xml', `/articles/${slug}/`, `English RSS includes ${slug}`);
  includes('dist/ko/rss.xml', `/ko/articles/${slug}/`, `Korean RSS includes ${slug}`);
  includes(
    'dist/sitemap-0.xml',
    `<loc>https://geminikim.com/articles/${slug}/</loc>`,
    `Sitemap includes the English route for ${slug}`,
  );
  includes(
    'dist/sitemap-0.xml',
    `<loc>https://geminikim.com/ko/articles/${slug}/</loc>`,
    `Sitemap includes the Korean route for ${slug}`,
  );
}
const publicationDateValues = expected2023PublicationDates.map(({ date }) => date);
if (new Set(publicationDateValues).size !== expected2023ArticleSlugs.length) {
  failures.push('Every article in the 2023 series must have a unique publication date');
}
for (let index = 1; index < expected2023PublicationDates.length; index += 1) {
  const previous = expected2023PublicationDates[index - 1];
  const current = expected2023PublicationDates[index];
  if (previous.date >= current.date) {
    failures.push(
      `2023 series publication dates must increase in source order: ${previous.slug} (${previous.date}) before ${current.slug} (${current.date})`,
    );
  }
}
includes(
  'dist/ko/about/index.html',
  '<title>소개 — Gemini Kim</title>',
  'Korean about browser title is localized',
);
includes(
  'dist/ko/about/index.html',
  '<meta property="og:title" content="About — Gemini Kim">',
  'Korean about Open Graph title is English',
);
includes(
  'dist/ko/articles/index.html',
  '<meta property="og:title" content="Articles — Gemini Kim">',
  'Korean archive Open Graph title is English',
);
excludes('dist/about/index.html', 'What I write about', 'English about does not limit future article topics');
excludes('dist/ko/about/index.html', '이 블로그에 쓰는 것', 'Korean about does not limit future article topics');

for (const [path, label] of [
  ['dist/posts', 'Removed English posts routes'],
  ['dist/ko/posts', 'Removed Korean posts routes'],
  ['dist/en/posts', 'Removed prefixed English posts routes'],
  ['dist/articles/hello-world', 'Removed English placeholder article'],
  ['dist/ko/articles/hello-world', 'Removed Korean placeholder article'],
]) {
  missing(path, label);
}

includes('dist/en/index.html', 'noindex,follow', 'Legacy English home is noindex');
includes('dist/en/index.html', 'content="0;url=/"', 'Legacy English home redirect target');
includes('dist/en/index.html', 'geminikim.locale', 'Legacy English home stores language preference');
includes('dist/en/index.html', 'window.location.replace(destination)', 'Legacy English home uses history-safe redirect');
includes('dist/en/about/index.html', 'noindex,follow', 'Legacy English about is noindex');
includes('dist/en/about/index.html', 'content="0;url=/about/"', 'Legacy English about redirect target');

includes('dist/rss.xml', '<language>en-US</language>', 'Default RSS is English');
excludes('dist/rss.xml', '/articles/hello-world/', 'Default RSS excludes the removed placeholder article');
includes('dist/ko/rss.xml', '<language>ko-KR</language>', 'Korean RSS language');
excludes('dist/ko/rss.xml', '/ko/articles/hello-world/', 'Korean RSS excludes the removed placeholder article');
const englishRss = read('dist/rss.xml');
const legacyEnglishRss = read('dist/en/rss.xml');
if (legacyEnglishRss !== englishRss) {
  failures.push('Legacy English RSS must match the canonical English RSS exactly');
}

includes('dist/404.html', '<html lang="en">', 'Global 404 defaults to English');

const sitemap = read('dist/sitemap-0.xml');
for (const url of [
  'https://geminikim.com/',
  'https://geminikim.com/articles/',
  'https://geminikim.com/ko/',
  'https://geminikim.com/ko/articles/',
]) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) failures.push(`Sitemap is missing ${url}`);
}
for (const removedUrl of [
  'https://geminikim.com/articles/hello-world/',
  'https://geminikim.com/ko/articles/hello-world/',
]) {
  if (sitemap.includes(`<loc>${removedUrl}</loc>`)) {
    failures.push(`Sitemap must exclude removed placeholder article ${removedUrl}`);
  }
}
for (const legacyPrefix of [
  'https://geminikim.com/en/',
  'https://geminikim.com/posts/',
  'https://geminikim.com/ko/posts/',
]) {
  if (sitemap.includes(`<loc>${legacyPrefix}`)) {
    failures.push(`Sitemap must exclude legacy redirect aliases under ${legacyPrefix}`);
  }
}

function collectFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    if (entry.isDirectory()) files.push(...collectFiles(child));
    else files.push(child);
  }
  return files;
}

for (const htmlFile of collectFiles(new URL('../dist/', import.meta.url)).filter(
  (file) => file.pathname.endsWith('.html'),
)) {
  const content = readFileSync(htmlFile, 'utf8');
  const title = content.match(/<title>(.*?)<\/title>/s)?.[1];
  const isKoreanCanonical = htmlFile.pathname.includes('/dist/ko/');
  if (!title) {
    failures.push(`Browser title is missing in ${htmlFile.pathname}`);
  } else if (isKoreanCanonical && !/[\u3131-\u318e\uac00-\ud7a3]/u.test(title)) {
    failures.push(`Korean canonical browser title must be localized in ${htmlFile.pathname}: ${JSON.stringify(title)}`);
  } else if (!isKoreanCanonical && /[\u3131-\u318e\uac00-\ud7a3]/u.test(title)) {
    failures.push(`English or compatibility browser title must stay English in ${htmlFile.pathname}: ${JSON.stringify(title)}`);
  }
}

const deprecatedNames = ['\uAE40\uC7AC\uBBFC', ['Jaemin', 'Kim'].join(' ')];
const publicSourceFiles = [new URL('../README.MD', import.meta.url), ...collectFiles(new URL('../src/', import.meta.url))];
for (const sourceFile of publicSourceFiles) {
  const content = readFileSync(sourceFile, 'utf8');
  for (const name of deprecatedNames) {
    if (content.includes(name)) {
      failures.push(`Deprecated personal name ${JSON.stringify(name)} remains in ${sourceFile.pathname}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`i18n route contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('i18n route contract passed');
