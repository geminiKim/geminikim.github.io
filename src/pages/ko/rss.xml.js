import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'ko' && !data.draft)).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );

  return rss({
    title: 'Gemini Kim',
    description: '소프트웨어를 만들고 운영하며 배운 것을 기록합니다.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/ko/articles/${post.id.replace(/^ko\//, '')}/`,
      categories: post.data.tags,
    })),
    customData: '<language>ko-KR</language>',
  });
}
