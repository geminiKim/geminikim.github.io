---
title: "Keep Guest Data Masking in the Presentation Layer"
description: "Learn why guest masking and author flags belong at the presentation boundary, keeping domain logic clean while preventing raw data exposure."
lang: en
translationKey: presentation-layer-data-masking
publishedAt: 2025-05-11
tags:
  - architecture
  - api-design
  - backend
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

When logged-out visitors must see masked content, remove or replace the sensitive value in the server response. A visual blur in the browser is not protection: anyone who removes the styling can read raw data that was already delivered. If masking exists only to satisfy that guest-facing UI, the response-building boundary is usually the cleanest place to apply it.

The central question is ownership. Does the rule describe the business concept, or does it describe how one screen presents that concept to one kind of viewer? The answer determines how far inward the rule should travel.

## Return safe presentation data, not a blurred secret

A career record can remain complete inside the application. When a guest requests it, the presentation layer can create a response containing the placeholders the UI needs. A logged-in response can contain the original value. The browser never receives that original in the guest case.

This avoids contaminating the inner model with fake values such as repeated `X` characters. It also avoids passing the current viewer through services whose underlying responsibility is simply to load career records. The masking policy is visible where the external response is assembled and can disappear there if the UI requirement disappears.

## Author markers follow the same boundary

Consider a comment list that shows an “author” badge when a comment writer matches the post writer. The post service can load the post, and the comment service can load comments, without turning `isAuthor` into an intrinsic comment property. At the outer boundary, the response composer has both pieces of information and can derive the flag for the screen.

That distinction prevents a temporary presentation need from becoming a permanent domain field. If the badge is removed, the response mapping changes; core comment behavior does not.

## Not every viewer-dependent rule is presentation logic

This boundary will not fit every case. If masking or a marker exists only for the UI, keep it in response composition. If the rule is important to the business concept itself, it may need to live with the business logic. The placement depends on the case.

Guest masking and author badges in these examples belong in presentation. Keeping them there protects both sides of the boundary: the client receives only what it may see, while the inner model remains free of a screen's temporary vocabulary.
