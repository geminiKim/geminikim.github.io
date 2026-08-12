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

## Google Analytics

GA4 is wired through the shared layout and remains disabled until a valid measurement ID is provided at build time.

1. Copy `.env.example` to `.env` for local development.
2. Replace `G-XXXXXXXXXX` with the GA4 measurement ID.
3. For GitHub Pages, add the same value as a repository variable named `PUBLIC_GA_MEASUREMENT_ID`; the deployment workflow already exposes it to the Astro build step.

The example placeholder and missing or malformed values emit no Google Analytics scripts. `.env` files stay ignored; never commit the real value.
