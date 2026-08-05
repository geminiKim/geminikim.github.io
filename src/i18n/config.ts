export type Locale = 'en' | 'ko';
export type LocaleLinks = Partial<Record<Locale, string>>;

export const ui = {
  ko: {
    home: '홈',
    articles: '글',
    about: '소개',
    mainNav: '주요 메뉴',
    homeAria: 'Gemini Kim 홈',
    skip: '본문으로 건너뛰기',
    emptyPosts: '아직 공개된 글이 없습니다.',
    draft: '초안',
    read: '읽기',
    tags: '태그',
    language: '언어 선택',
  },
  en: {
    home: 'Home',
    articles: 'Articles',
    about: 'About',
    mainNav: 'Main navigation',
    homeAria: 'Gemini Kim home',
    skip: 'Skip to content',
    emptyPosts: 'No published articles yet.',
    draft: 'Draft',
    read: 'Read',
    tags: 'Tags',
    language: 'Choose language',
  },
} as const;

export function localePath(locale: Locale, path = '') {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const needsTrailingSlash = cleanPath !== '' && !cleanPath.includes('.');
  const suffix = cleanPath ? `${cleanPath}${needsTrailingSlash ? '/' : ''}` : '';
  return locale === 'en' ? `/${suffix}` : `/ko/${suffix}`;
}
