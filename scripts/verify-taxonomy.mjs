import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { getTopicsForTags, topics } from '../src/data/tag-taxonomy.mjs';

const failures = [];

function parsePosts(locale) {
  const directory = new URL(`../src/content/blog/${locale}/`, import.meta.url);
  return readdirSync(directory)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const source = readFileSync(new URL(name, directory), 'utf8');
      const frontmatter = source.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? '';
      const translationKey = frontmatter.match(/^translationKey:\s*(.+)$/mu)?.[1]?.trim();
      const publishedAt = frontmatter.match(/^publishedAt:\s*(.+)$/mu)?.[1]?.trim();
      const isDraft = frontmatter.match(/^draft:\s*(true|false)$/mu)?.[1] === 'true';
      if (isDraft) return null;
      const tagBlock = frontmatter.match(/^tags:\s*\n((?:\s+-\s+[^\n]+\n?)+)/mu)?.[1] ?? '';
      const tags = tagBlock.split('\n').map((line) => line.replace(/^\s*-\s*/u, '').trim()).filter(Boolean);
      const slug = name.slice(0, -3);
      let topicSlugs = [];
      try {
        topicSlugs = getTopicsForTags(tags).map((topic) => topic.slug);
      } catch (error) {
        failures.push(`${locale}/${slug}: ${error.message}`);
      }
      return { locale, slug, translationKey, publishedAt: new Date(publishedAt), tags, topicSlugs };
    })
    .filter(Boolean);
}

const postsByLocale = { en: parsePosts('en'), ko: parsePosts('ko') };
const koreanByKey = new Map(postsByLocale.ko.map((post) => [post.translationKey, post]));

for (const english of postsByLocale.en) {
  const korean = koreanByKey.get(english.translationKey);
  if (!korean) {
    failures.push(`Missing Korean counterpart for ${english.slug}`);
    continue;
  }
  if (english.topicSlugs.join(',') !== korean.topicSlugs.join(',')) {
    failures.push(`Counterpart topic mismatch for ${english.translationKey}: EN=${english.topicSlugs} KO=${korean.topicSlugs}`);
  }
}

for (const locale of ['en', 'ko']) {
  const posts = postsByLocale[locale];
  for (const topic of topics) {
    const topicPosts = posts.filter((post) => post.topicSlugs.includes(topic.slug));
    if (topicPosts.length < 2) failures.push(`Canonical topic is too thin for ${locale}/${topic.slug}: ${topicPosts.length}`);
    const prefix = locale === 'ko' ? '/ko' : '';
    const output = new URL(`../dist${prefix}/tags/${topic.slug}/index.html`, import.meta.url);
    if (!existsSync(output)) continue;
    const content = readFileSync(output, 'utf8');
    const actual = [...content.matchAll(/<a class="topic-article-link" href="[^"]*\/articles\/([^/]+)\/">/gu)].map((match) => match[1]);
    const expected = topicPosts
      .sort((a, b) => b.publishedAt.valueOf() - a.publishedAt.valueOf() || a.slug.localeCompare(b.slug))
      .map((post) => post.slug);
    if (actual.join(',') !== expected.join(',')) {
      failures.push(`Topic membership/order mismatch for ${locale}/${topic.slug}`);
    }
  }

  for (const current of posts) {
    const expected = posts
      .filter((candidate) => candidate.slug !== current.slug)
      .map((candidate) => ({
        candidate,
        shared: candidate.topicSlugs.filter((topic) => current.topicSlugs.includes(topic)).length,
      }))
      .filter(({ shared }) => shared > 0)
      .sort((a, b) =>
        b.shared - a.shared
        || b.candidate.publishedAt.valueOf() - a.candidate.publishedAt.valueOf()
        || a.candidate.slug.localeCompare(b.candidate.slug),
      )
      .slice(0, 3)
      .map(({ candidate }) => candidate.slug);
    const prefix = locale === 'ko' ? '/ko' : '';
    const output = new URL(`../dist${prefix}/articles/${current.slug}/index.html`, import.meta.url);
    if (!existsSync(output)) continue;
    const content = readFileSync(output, 'utf8');
    const section = content.match(/<section class="related-posts"[\s\S]*?<\/section>/u)?.[0] ?? '';
    const actual = [...section.matchAll(/<a class="related-post-link" href="[^"]*\/articles\/([^/]+)\/">/gu)].map((match) => match[1]);
    if (actual.join(',') !== expected.join(',')) {
      failures.push(`Related ranking mismatch for ${locale}/${current.slug}: expected ${expected}, got ${actual}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Taxonomy contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const rawTags = new Set([...postsByLocale.en, ...postsByLocale.ko].flatMap((post) => post.tags));
console.log(`Taxonomy contract passed (${topics.length} topics, ${rawTags.size} raw tags, ${postsByLocale.en.length + postsByLocale.ko.length} articles)`);
