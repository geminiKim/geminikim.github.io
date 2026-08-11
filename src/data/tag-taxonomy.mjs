export const topicSlugs = /** @type {const} */ ([
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
]);

/** @typedef {(typeof topicSlugs)[number]} TopicSlug */
/** @typedef {{ slug: TopicSlug, label: { en: string, ko: string }, description: { en: string, ko: string }, aliases: readonly string[] }} TopicDefinition */

/** @type {readonly TopicDefinition[]} */
export const topics = [
  {
    slug: 'architecture',
    label: { en: 'Architecture', ko: '아키텍처' },
    description: {
      en: 'Practical boundaries, modules, layers, and design choices that keep software adaptable.',
      ko: '소프트웨어를 변화에 강하게 만드는 경계, 모듈, 계층과 실용적인 설계 선택을 다룹니다.',
    },
    aliases: [
      'architecture', 'boundaries', 'design', 'design-patterns', 'layered-architecture', 'layering',
      'modularity', 'modules', 'object-oriented-design', 'overengineering', 'packaging',
      'software-design', 'technical-decisions',
    ],
  },
  {
    slug: 'backend',
    label: { en: 'Backend Engineering', ko: '백엔드 엔지니어링' },
    description: {
      en: 'Application services, frameworks, and implementation patterns for maintainable backend systems.',
      ko: '유지보수 가능한 백엔드 시스템을 위한 애플리케이션 서비스, 프레임워크와 구현 패턴을 다룹니다.',
    },
    aliases: ['admin', 'ai-agents', 'backend', 'dependencies', 'gradle', 'jpa', 'kotlin'],
  },
  {
    slug: 'domain-modeling',
    label: { en: 'Domain Modeling', ko: '도메인 모델링' },
    description: {
      en: 'Business concepts, ownership, events, and boundaries that make the domain visible in code.',
      ko: '비즈니스 개념과 소유권, 이벤트, 경계를 코드에 드러내는 방법을 다룹니다.',
    },
    aliases: [
      'domain-boundaries', 'domain-driven-design', 'domain-events', 'domain-knowledge',
      'domain-modeling', 'enums', 'events',
    ],
  },
  {
    slug: 'api-design',
    label: { en: 'API Design', ko: 'API 설계' },
    description: {
      en: 'Clear contracts, authorization boundaries, validation, and pragmatic HTTP API decisions.',
      ko: '명확한 계약, 인증과 권한 경계, 검증과 실용적인 HTTP API 의사결정을 다룹니다.',
    },
    aliases: ['api', 'api-design', 'authentication', 'authorization', 'client-server', 'http', 'rest', 'validation'],
  },
  {
    slug: 'data',
    label: { en: 'Data & Persistence', ko: '데이터와 영속성' },
    description: {
      en: 'Data models, databases, query models, and persistence decisions grounded in operations.',
      ko: '운영 현실에 기반한 데이터 모델, 데이터베이스, 조회 모델과 영속성 선택을 다룹니다.',
    },
    aliases: ['data-access', 'data-modeling', 'database', 'databases', 'persistence', 'query-models'],
  },
  {
    slug: 'testing-quality',
    label: { en: 'Testing & Quality', ko: '테스트와 품질' },
    description: {
      en: 'Tests, refactoring, static analysis, and quality practices that protect intent over time.',
      ko: '시간이 지나도 의도를 지키는 테스트, 리팩터링, 정적 분석과 품질 실천을 다룹니다.',
    },
    aliases: ['maintainability', 'refactoring', 'static-analysis', 'testing'],
  },
  {
    slug: 'reliability-operations',
    label: { en: 'Reliability & Operations', ko: '신뢰성과 운영' },
    description: {
      en: 'Failure handling, observability, and lessons from operating distributed systems.',
      ko: '분산 시스템을 운영하며 배우는 장애 대응, 관측성과 신뢰성 설계를 다룹니다.',
    },
    aliases: ['distributed-systems', 'observability', 'operations', 'reliability', 'resilience'],
  },
  {
    slug: 'performance',
    label: { en: 'Performance & Scale', ko: '성능과 확장성' },
    description: {
      en: 'Caching and evidence-based performance decisions for systems under real traffic.',
      ko: '실제 트래픽을 고려한 캐시와 근거 중심의 성능 판단을 다룹니다.',
    },
    aliases: ['cache', 'caching', 'performance'],
  },
  {
    slug: 'delivery',
    label: { en: 'Delivery & Evolution', ko: '배포와 진화' },
    description: {
      en: 'Deployment, migration, maintenance, and reversible ways to evolve real systems.',
      ko: '실제 시스템을 가역적으로 발전시키는 배포, 마이그레이션과 유지보수를 다룹니다.',
    },
    aliases: [
      'backward-compatibility', 'deployment', 'git', 'legacy', 'legacy-code', 'maintenance', 'migration',
      'project-management', 'software-delivery', 'technical-debt',
    ],
  },
  {
    slug: 'career-learning',
    label: { en: 'Career & Learning', ko: '커리어와 학습' },
    description: {
      en: 'Career choices, engineering growth, products, and learning through real-world experience.',
      ko: '현실적인 경험에서 배우는 개발자 성장, 커리어 선택, 제품과 학습을 다룹니다.',
    },
    aliases: [
      'career', 'computer-science', 'engineering-practice', 'growth', 'hiring', 'junior-developer',
      'learning', 'prioritization', 'problem-solving', 'product', 'side-project', 'software-engineering',
    ],
  },
  {
    slug: 'collaboration',
    label: { en: 'Collaboration', ko: '협업' },
    description: {
      en: 'Communication, engineering culture, and team practices that make work sustainable.',
      ko: '지속 가능한 협업을 만드는 커뮤니케이션, 엔지니어링 문화와 팀 실천을 다룹니다.',
    },
    aliases: ['collaboration', 'communication', 'engineering-culture', 'team-practice', 'teamwork'],
  },
];

const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
/** @type {Map<string, TopicDefinition>} */
const topicByAlias = new Map();

for (const topic of topics) {
  for (const alias of topic.aliases) {
    if (topicByAlias.has(alias)) throw new Error(`Raw tag is mapped more than once: ${alias}`);
    topicByAlias.set(alias, topic);
  }
}

/** @param {TopicSlug} slug @returns {TopicDefinition} */
export function getTopic(slug) {
  const topic = topicBySlug.get(slug);
  if (!topic) throw new Error(`Unknown canonical topic: ${slug}`);
  return topic;
}

/** @param {readonly string[]} rawTags @returns {TopicDefinition[]} */
export function getTopicsForTags(rawTags) {
  /** @type {Map<TopicSlug, TopicDefinition>} */
  const resolved = new Map();
  for (const rawTag of rawTags) {
    const topic = topicByAlias.get(rawTag);
    if (!topic) throw new Error(`Unmapped raw tag: ${rawTag}`);
    resolved.set(topic.slug, topic);
  }
  return topics.filter((topic) => resolved.has(topic.slug));
}
