import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { DEFAULT_SOCIAL_IMAGE, SITE_ORIGIN } from '../site.config.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const failures = [];
const siteOrigin = SITE_ORIGIN;
const defaultImage = DEFAULT_SOCIAL_IMAGE;

function read(relativePath) {
  const url = new URL(relativePath, root);
  if (!existsSync(url)) {
    failures.push(`Missing required file: ${relativePath}`);
    return '';
  }
  return readFileSync(url, 'utf8');
}

function collect(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    if (entry.isDirectory()) files.push(...collect(child));
    else files.push(child);
  }
  return files;
}

function exactlyOnce(content, expected, label) {
  const count = content.split(expected).length - 1;
  if (count !== 1) failures.push(`${label}: expected exactly once, found ${count}`);
}

function pagePath(file) {
  const relative = decodeURIComponent(file.pathname.slice(dist.pathname.length));
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404.html';
  return `/${relative.replace(/index\.html$/u, '')}`;
}

function robotsValues(content) {
  return [...content.matchAll(/<meta name="robots" content="([^"]*)">/gu)].map((match) => match[1]);
}

function robotsDirectives(content) {
  return robotsValues(content).flatMap((value) => value.toLowerCase().split(',').map((directive) => directive.trim()));
}

const htmlFiles = collect(dist).filter((file) => file.pathname.endsWith('.html'));
if (!htmlFiles.some((file) => pagePath(file) === '/404.html')) failures.push('Missing generated error page: dist/404.html');
for (const file of htmlFiles) {
  const path = pagePath(file);
  const content = readFileSync(file, 'utf8');
  const isCompatibility = path === '/en/' || path === '/en/about/';
  const isError = path === '/404.html';
  const isCanonicalPage = !isCompatibility && !isError;

  if (isError) {
    exactlyOnce(content, '<meta name="robots" content="noindex,follow">', `Error-page robots for ${path}`);
    if (robotsValues(content).length !== 1) failures.push(`Error page must emit exactly one robots meta for ${path}`);
    if (content.includes('<link rel="canonical"')) failures.push(`Error page must not emit a canonical for ${path}`);
  }

  if (isCanonicalPage) {
    if (robotsDirectives(content).includes('noindex')) failures.push(`Canonical page must remain indexable for ${path}`);
    exactlyOnce(content, `<meta property="og:image" content="${defaultImage}">`, `Open Graph image for ${path}`);
    exactlyOnce(content, '<meta property="og:image:width" content="1200">', `Open Graph image width for ${path}`);
    exactlyOnce(content, '<meta property="og:image:height" content="630">', `Open Graph image height for ${path}`);
    exactlyOnce(content, '<meta name="twitter:card" content="summary_large_image">', `Twitter card for ${path}`);
    exactlyOnce(content, `<meta name="twitter:image" content="${defaultImage}">`, `Twitter image for ${path}`);
  }

  const isHome = path === '/' || path === '/ko/';
  const isArticle = /^\/(?:ko\/)?articles\/[^/]+\/$/u.test(path);
  if (isArticle) {
    const section = content.match(/<section class="related-posts"[\s\S]*?<\/section>/u)?.[0] ?? '';
    const links = [...section.matchAll(/<a class="related-post-link" href="([^"]+)">/gu)].map((match) => match[1]);
    if (links.length < 1 || links.length > 3) {
      failures.push(`Related articles for ${path}: expected 1–3 links, found ${links.length}`);
    }
    for (const href of links) {
      if (href === path) failures.push(`Related articles for ${path} includes itself`);
      const isKoreanPage = path.startsWith('/ko/');
      if (isKoreanPage !== href.startsWith('/ko/')) failures.push(`Related articles cross locale for ${path}: ${href}`);
      const target = new URL(`../dist${href}index.html`, import.meta.url);
      if (!existsSync(target)) failures.push(`Related article target is missing for ${path}: ${href}`);
    }
  }
  if (isHome || isArticle) {
    const scripts = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)];
    if (scripts.length !== 1) {
      failures.push(`Structured data for ${path}: expected one JSON-LD script, found ${scripts.length}`);
      continue;
    }
    try {
      const data = JSON.parse(scripts[0][1]);
      if (isHome) {
        const graph = Array.isArray(data['@graph']) ? data['@graph'] : [data];
        if (!graph.some((entry) => entry['@type'] === 'WebSite')) failures.push(`Home JSON-LD lacks WebSite for ${path}`);
        const person = graph.find((entry) => entry['@type'] === 'Person');
        if (!person || person.name !== 'Gemini Kim') failures.push(`Home JSON-LD lacks Gemini Kim Person for ${path}`);
      }
      if (isArticle) {
        if (data['@type'] !== 'BlogPosting') failures.push(`Article JSON-LD type is not BlogPosting for ${path}`);
        if (data.author?.name !== 'Gemini Kim') failures.push(`Article JSON-LD author is invalid for ${path}`);
        if (!data.headline || !data.description || !data.datePublished || !data.inLanguage) {
          failures.push(`Article JSON-LD required fields are missing for ${path}`);
        }
        if (data.dateModified) failures.push(`Article JSON-LD must preserve the source-date-only policy for ${path}`);
        if (data.mainEntityOfPage?.['@id'] !== `${siteOrigin}${path}`) failures.push(`Article JSON-LD canonical ID is invalid for ${path}`);
        if (data.image !== defaultImage) failures.push(`Article JSON-LD image is invalid for ${path}`);
      }
    } catch (error) {
      failures.push(`Structured data is invalid JSON for ${path}: ${error.message}`);
    }
  }
}

const topicSlugs = [
  'architecture',
  'backend',
  'domain-modeling',
  'api-design',
  'data',
  'testing-quality',
  'reliability-operations',
  'performance',
  'delivery',
  'career-learning',
  'collaboration',
];
const sitemap = read('dist/sitemap-0.xml');
for (const locale of ['en', 'ko']) {
  const prefix = locale === 'ko' ? '/ko' : '';
  const indexPath = `dist${prefix}/tags/index.html`;
  const indexContent = read(indexPath);
  exactlyOnce(indexContent, `<link rel="canonical" href="${siteOrigin}${prefix}/tags/">`, `Topic index canonical for ${locale}`);
  for (const topic of topicSlugs) {
    const path = `${prefix}/tags/${topic}/`;
    const output = `dist${path}index.html`;
    const content = read(output);
    exactlyOnce(content, `<link rel="canonical" href="${siteOrigin}${path}">`, `Topic canonical for ${locale}/${topic}`);
    exactlyOnce(content, `hreflang="en" href="${siteOrigin}/tags/${topic}/"`, `Topic English alternate for ${locale}/${topic}`);
    exactlyOnce(content, `hreflang="ko" href="${siteOrigin}/ko/tags/${topic}/"`, `Topic Korean alternate for ${locale}/${topic}`);
    exactlyOnce(content, `hreflang="x-default" href="${siteOrigin}/tags/${topic}/"`, `Topic x-default for ${locale}/${topic}`);
    const articleLinks = [...content.matchAll(/<a class="topic-article-link" href="([^"]+)">/gu)].map((match) => match[1]);
    if (articleLinks.length < 2) failures.push(`Topic hub is too thin for ${locale}/${topic}: ${articleLinks.length} articles`);
    for (const href of articleLinks) {
      if ((locale === 'ko') !== href.startsWith('/ko/articles/')) failures.push(`Topic hub crosses locale for ${locale}/${topic}: ${href}`);
    }
    exactlyOnce(sitemap, `<loc>${siteOrigin}${path}</loc>`, `Topic sitemap entry for ${locale}/${topic}`);
  }
}

if (!existsSync(new URL('../public/og/default.png', import.meta.url))) {
  failures.push('Default Open Graph image is missing: public/og/default.png');
}

const robots = read('public/robots.txt');
exactlyOnce(robots, `Sitemap: ${siteOrigin}/sitemap-index.xml`, 'robots sitemap');
const cname = read('public/CNAME').trim();
if (cname !== 'geminikim.com') failures.push(`CNAME must be exactly geminikim.com, found ${JSON.stringify(cname)}`);
for (const output of ['dist/sitemap-index.xml', 'dist/sitemap-0.xml', 'dist/rss.xml', 'dist/ko/rss.xml', 'dist/en/rss.xml']) {
  const content = output === 'dist/sitemap-0.xml' ? sitemap : read(output);
  if (content.includes('geminikim.github.io')) failures.push(`${output} still references the retired GitHub host`);
}

if (failures.length > 0) {
  console.error(`SEO contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO contract passed (${htmlFiles.length} HTML files)`);
