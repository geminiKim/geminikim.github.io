import type { Locale } from '../i18n/config';
import { DEFAULT_SOCIAL_IMAGE, SITE_ORIGIN } from '../../site.config.mjs';
import { serializeStructuredData } from './serialize-structured-data.mjs';

export { serializeStructuredData };

export const siteOrigin = SITE_ORIGIN;
export const defaultSocialImage = DEFAULT_SOCIAL_IMAGE;

const websiteId = `${siteOrigin}/#website`;
const personId = `${siteOrigin}/#person`;

const profileUrls = [
  'https://github.com/geminiKim',
  'https://www.linkedin.com/in/geminikims',
  'https://x.com/geminikims',
  'https://www.youtube.com/@geminikims',
];

export const siteDescription: Record<Locale, string> = {
  ko: '소프트웨어를 만들고 운영하며 배운 것을 기록하는 Gemini Kim의 블로그입니다.',
  en: 'Gemini Kim writes about building, operating, and learning from software.',
};

interface NodeReference {
  '@id': string;
}

interface PersonNode {
  '@type': 'Person';
  '@id'?: string;
  name: 'Gemini Kim';
  url: string;
  sameAs?: string[];
}

interface WebSiteNode {
  '@type': 'WebSite';
  '@id': string;
  name: string;
  description: string;
  url: string;
  inLanguage: Locale[];
  publisher: NodeReference;
}

export interface HomeStructuredData {
  '@context': 'https://schema.org';
  '@graph': [WebSiteNode, PersonNode];
}

export interface ArticleStructuredData {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  datePublished: string;
  author: PersonNode;
  inLanguage: Locale;
  mainEntityOfPage: { '@type': 'WebPage'; '@id': string };
  image: string;
  isPartOf: NodeReference;
}

export type StructuredData = HomeStructuredData | ArticleStructuredData;

export function homeStructuredData(locale: Locale): HomeStructuredData {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: 'Gemini Kim',
        description: siteDescription[locale],
        url: locale === 'ko' ? `${siteOrigin}/ko/` : `${siteOrigin}/`,
        inLanguage: ['en', 'ko'],
        publisher: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Gemini Kim',
        url: `${siteOrigin}/`,
        sameAs: profileUrls,
      },
    ],
  };
}

interface ArticleStructuredDataInput {
  headline: string;
  description: string;
  publishedAt: Date;
  locale: Locale;
  canonicalUrl: string;
}

export function articleStructuredData({
  headline,
  description,
  publishedAt,
  locale,
  canonicalUrl,
}: ArticleStructuredDataInput): ArticleStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished: publishedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Gemini Kim',
      url: `${siteOrigin}/`,
    },
    inLanguage: locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    image: defaultSocialImage,
    isPartOf: { '@id': websiteId },
  };
}
