import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { Locale, LocaleLinks } from '../i18n/config';
import { localePath } from '../i18n/config';
import { getTopicsForTags, topicSlugs } from '../data/tag-taxonomy.mjs';

export type TopicSlug = (typeof topicSlugs)[number];

export async function getVisiblePosts(locale: Locale) {
  const posts = await getCollection(
    'blog',
    ({ data }) => data.lang === locale && (import.meta.env.DEV || !data.draft),
  );

  return posts.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
}

export function getPostSlug(post: CollectionEntry<'blog'>) {
  const [, ...slugParts] = post.id.split('/');
  return slugParts.join('/');
}

export function getPostUrl(post: CollectionEntry<'blog'>) {
  return localePath(post.data.lang, `articles/${getPostSlug(post)}`);
}

export function getPostTopicSlugs(post: CollectionEntry<'blog'>): TopicSlug[] {
  return getTopicsForTags(post.data.tags).map((topic) => topic.slug);
}

export function getPostsForTopic(
  posts: CollectionEntry<'blog'>[],
  topic: TopicSlug,
) {
  return posts.filter((post) => getPostTopicSlugs(post).includes(topic));
}

export function getRelatedPosts(
  current: CollectionEntry<'blog'>,
  posts: CollectionEntry<'blog'>[],
  limit = 3,
) {
  const currentTopics = new Set(getPostTopicSlugs(current));

  return posts
    .filter((candidate) => candidate.id !== current.id && candidate.data.lang === current.data.lang)
    .map((candidate) => ({
      post: candidate,
      sharedTopics: getPostTopicSlugs(candidate).filter((topic) => currentTopics.has(topic)).length,
    }))
    .filter(({ sharedTopics }) => sharedTopics > 0)
    .sort((a, b) =>
      b.sharedTopics - a.sharedTopics
      || b.post.data.publishedAt.valueOf() - a.post.data.publishedAt.valueOf()
      || getPostSlug(a.post).localeCompare(getPostSlug(b.post)),
    )
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getPostAlternates(
  post: CollectionEntry<'blog'>,
  posts: CollectionEntry<'blog'>[],
): LocaleLinks {
  const links: LocaleLinks = { [post.data.lang]: getPostUrl(post) };

  for (const candidate of posts) {
    if (candidate.data.translationKey === post.data.translationKey) {
      links[candidate.data.lang] = getPostUrl(candidate);
    }
  }

  return links;
}
