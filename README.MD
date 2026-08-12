# Gemini Kim Blog

Astro source for [geminikim.com](https://geminikim.com).

## Article publishing

SEO is a required part of every article addition or edit. Article work must ship as an English/Korean pair with localized titles and descriptions, aligned publication metadata and tags, mapped topic taxonomy, internal discovery links, canonical language alternates, social metadata, structured data, RSS, and sitemap coverage.

Read [`AGENTS.md`](./AGENTS.md) for the complete authoring contract. A publication is not complete until the production build and all generated-output checks pass:

```sh
npm ci
npm run build
```

The build fails when article pairs, SEO metadata, taxonomy mapping, related articles, RSS, sitemap, JSON-LD, or multilingual routing drift from the repository contract. Pull requests run the same build before deployment.
