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

includes('dist/ko/index.html', '<html lang="ko">', 'Korean home language');
includes('dist/ko/index.html', '<link rel="canonical" href="https://geminikim.github.io/ko/">', 'Korean home canonical');
includes(
  'dist/ko/index.html',
  '<meta property="og:title" content="Gemini Kim — Software engineering notes">',
  'Korean home Open Graph title is English',
);
excludes('dist/ko/index.html', 'http-equiv="refresh"', 'Korean home is content, not a redirect');

includes('dist/index.html', 'href="/articles/">Articles</a>', 'English navigation labels the archive Articles');
includes('dist/articles/index.html', '<h1>Articles</h1>', 'English archive heading');
includes('dist/articles/hello-world/index.html', '<html lang="en">', 'Default article is English');
includes(
  'dist/articles/hello-world/index.html',
  'href="https://geminikim.github.io/articles/hello-world/"',
  'English article canonical',
);
includes('dist/ko/articles/hello-world/index.html', '<html lang="ko">', 'Korean article language');
includes(
  'dist/ko/articles/hello-world/index.html',
  'href="https://geminikim.github.io/ko/articles/hello-world/"',
  'Korean article canonical',
);
includes(
  'dist/ko/articles/hello-world/index.html',
  '<meta property="og:title" content="Starting This Journal — Gemini Kim">',
  'Korean article Open Graph title uses its English translation',
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

for (const [path, label] of [
  ['dist/posts', 'Removed English posts routes'],
  ['dist/ko/posts', 'Removed Korean posts routes'],
  ['dist/en/posts', 'Removed prefixed English posts routes'],
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
includes('dist/rss.xml', '/articles/hello-world/', 'Default RSS points to canonical English article');
includes('dist/ko/rss.xml', '<language>ko-KR</language>', 'Korean RSS language');
includes('dist/ko/rss.xml', '/ko/articles/hello-world/', 'Korean RSS points to canonical Korean article');
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
  'https://geminikim.github.io/articles/hello-world/',
  'https://geminikim.github.io/ko/',
  'https://geminikim.github.io/ko/articles/',
  'https://geminikim.github.io/ko/articles/hello-world/',
]) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) failures.push(`Sitemap is missing ${url}`);
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
