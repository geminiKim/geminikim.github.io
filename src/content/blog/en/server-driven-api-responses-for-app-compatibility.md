---
title: "Server-Driven API Responses for Mobile App Compatibility"
description: "Keep changing display policy and experiments server-side for old app versions, but isolate that translation at the API boundary to protect the domain model."
lang: en
translationKey: server-driven-api-responses-for-app-compatibility
publishedAt: 2025-12-07
tags:
  - api-design
  - architecture
  - backend
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

An app marks products registered within seven days as “new.” Product policy changes that window to three days, but an older installed version still contains the seven-day rule. Sending only the registration date cannot change that client: it continues to put a badge on products the current policy no longer considers new.

## An installed app keeps yesterday's policy

Web presentation logic can often be redeployed quickly. Mobile versions remain on users' devices, and forcing every old version to update is not always practical. The same issue appears in count formatting: one release may show a plus sign while a newer release shows `15K`.

When the server decides the display value or badge, old clients can receive the current representation without a new app release. The service can also change an experiment on the server and compare results instead of publishing another mobile build only to alter a label.

## Treat the API as the client's presentation boundary

The domain should still hold the stable fact: the numeric count, registration date, price, or discount. It should not contain a particular app version's `15K` formatting or “new” badge. Convert those facts while building the request or response in the presentation layer.

That layer belongs to the client in purpose, even though it runs on the server. Its job is to translate internal concepts into the contract the client needs. This keeps frequently changing display policy out of core business code while allowing the backend to carry compatibility for long-lived app versions.

Some teams make every request and response value a string, including amounts, so a later format change does not alter the wire type. The flexibility is understandable, but it is not the preferred strategy.

The narrower decision is where the conversion belongs. If old app versions need consistent policy or the product runs display experiments, let the server presentation layer decide the response while keeping stable domain facts separate from presentation conversion.
