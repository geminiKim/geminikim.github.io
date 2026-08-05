import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { Locale, LocaleLinks } from '../i18n/config';
import { localePath } from '../i18n/config';

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
