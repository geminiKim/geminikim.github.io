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
includes('dist/index.html', '<link rel="canonical" href="https://geminikim.github.io/">', 'English home is canonical');
includes('dist/index.html', 'hreflang="en" href="https://geminikim.github.io/"', 'English home hreflang');
includes('dist/index.html', 'hreflang="ko" href="https://geminikim.github.io/ko/"', 'Korean home hreflang');
includes('dist/index.html', 'hreflang="x-default" href="https://geminikim.github.io/"', 'English is x-default');
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
  '<title>Gemini Kim — Software engineering notes</title>',
  'Korean home browser title is English',
);
includes('dist/ko/index.html', '<link rel="canonical" href="https://geminikim.github.io/ko/">', 'Korean home canonical');
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
  '<title>Articles — Gemini Kim</title>',
  'Korean archive document title matches the shared heading',
);
includes(
  'dist/articles/idempotent-ai-tool-calls/index.html',
  '<link rel="canonical" href="https://geminikim.github.io/articles/idempotent-ai-tool-calls/">',
  'English idempotency article canonical',
);
includes(
  'dist/articles/idempotent-ai-tool-calls/index.html',
  '<a href="https://www.youtube.com/@geminikims">Gemini’s Devpractice</a>',
  'English article links the English YouTube channel name',
);
includes(
  'dist/articles/idempotent-ai-tool-calls/index.html',
  '<code>gpt-5.6-sol</code>',
  'English article discloses its generation model',
);
includes(
  'dist/articles/idempotent-ai-tool-calls/index.html',
  '<meta property="article:published_time" content="2023-10-28T00:00:00.000Z">',
  'English article keeps the source-video publication date',
);
excludes(
  'dist/articles/idempotent-ai-tool-calls/index.html',
  'article:modified_time',
  'English article omits modified metadata',
);
excludes(
  'dist/articles/idempotent-ai-tool-calls/index.html',
  '<span>Updated ',
  'English article displays only its publication date',
);
includes(
  'dist/ko/articles/idempotent-ai-tool-calls/index.html',
  '<html lang="ko">',
  'Korean idempotency article language',
);
includes(
  'dist/ko/articles/idempotent-ai-tool-calls/index.html',
  '<title>When an AI Agent Calls the Same Tool Twice — Gemini Kim</title>',
  'Korean idempotency article browser title uses its English translation',
);
includes(
  'dist/ko/articles/idempotent-ai-tool-calls/index.html',
  '<link rel="canonical" href="https://geminikim.github.io/ko/articles/idempotent-ai-tool-calls/">',
  'Korean idempotency article canonical',
);
includes(
  'dist/ko/articles/idempotent-ai-tool-calls/index.html',
  '<meta property="og:title" content="When an AI Agent Calls the Same Tool Twice — Gemini Kim">',
  'Korean idempotency article Open Graph title uses its English translation',
);
includes(
  'dist/ko/articles/idempotent-ai-tool-calls/index.html',
  '<a href="https://www.youtube.com/@geminikims">제미니의 개발실무</a>',
  'Korean article links the Korean YouTube channel name',
);
includes(
  'dist/ko/articles/idempotent-ai-tool-calls/index.html',
  '<code>gpt-5.6-sol</code>',
  'Korean article discloses its generation model',
);
includes(
  'dist/ko/articles/idempotent-ai-tool-calls/index.html',
  '<meta property="article:published_time" content="2023-10-28T00:00:00.000Z">',
  'Korean article keeps the source-video publication date',
);
excludes(
  'dist/ko/articles/idempotent-ai-tool-calls/index.html',
  'article:modified_time',
  'Korean article omits modified metadata',
);
excludes(
  'dist/ko/articles/idempotent-ai-tool-calls/index.html',
  '<span>수정 ',
  'Korean article displays only its publication date',
);
includes(
  'dist/ko/about/index.html',
  '<title>About — Gemini Kim</title>',
  'Korean about browser title is English',
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
includes(
  'dist/rss.xml',
  '/articles/idempotent-ai-tool-calls/',
  'Default RSS includes the English idempotency article',
);
includes('dist/ko/rss.xml', '<language>ko-KR</language>', 'Korean RSS language');
excludes('dist/ko/rss.xml', '/ko/articles/hello-world/', 'Korean RSS excludes the removed placeholder article');
includes(
  'dist/ko/rss.xml',
  '/ko/articles/idempotent-ai-tool-calls/',
  'Korean RSS includes the Korean idempotency article',
);
const englishRss = read('dist/rss.xml');
const legacyEnglishRss = read('dist/en/rss.xml');
if (legacyEnglishRss !== englishRss) {
  failures.push('Legacy English RSS must match the canonical English RSS exactly');
}

includes('dist/404.html', '<html lang="en">', 'Global 404 defaults to English');

const sitemap = read('dist/sitemap-0.xml');
for (const url of [
  'https://geminikim.github.io/',
  'https://geminikim.github.io/articles/',
  'https://geminikim.github.io/articles/idempotent-ai-tool-calls/',
  'https://geminikim.github.io/ko/',
  'https://geminikim.github.io/ko/articles/',
  'https://geminikim.github.io/ko/articles/idempotent-ai-tool-calls/',
]) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) failures.push(`Sitemap is missing ${url}`);
}
for (const removedUrl of [
  'https://geminikim.github.io/articles/hello-world/',
  'https://geminikim.github.io/ko/articles/hello-world/',
]) {
  if (sitemap.includes(`<loc>${removedUrl}</loc>`)) {
    failures.push(`Sitemap must exclude removed placeholder article ${removedUrl}`);
  }
}
for (const legacyPrefix of [
  'https://geminikim.github.io/en/',
  'https://geminikim.github.io/posts/',
  'https://geminikim.github.io/ko/posts/',
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
  if (!title) {
    failures.push(`Browser title is missing in ${htmlFile.pathname}`);
  } else if (/[\u3131-\u318e\uac00-\ud7a3]/u.test(title)) {
    failures.push(`Browser title must be English in ${htmlFile.pathname}: ${JSON.stringify(title)}`);
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
