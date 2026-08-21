---
title: "Hide Preview Content at the Server Boundary, Not in CSS"
description: "Do not ship gated text and merely blur it in the client; transform previews at the server response boundary while preserving an honest layout cue."
lang: en
translationKey: hide-preview-content-server-side
publishedAt: 2026-01-11
tags:
  - api
  - authorization
  - client-server
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A blurred comment is still exposed if the client has already received the original text. Someone can remove the blur style in browser tools. Even if the screen remains blurred, the unmodified API response may be sitting in the network panel.

For content that should appear only after login or payment, the safer boundary is the server response. Return a preview representation to an unauthenticated viewer instead of sending the protected text and asking the client to conceal it.

## CSS changes appearance, not the response

Client-side blur can create the intended visual effect, but it does not change the data already delivered. A viewer who understands browser tools can remove the style or inspect the request that populated the page. The gating rule has then been implemented as presentation alone.

The same weakness matters beyond a browser page. If a future app consumes the API directly, it should not depend on every client reproducing the same masking logic. The response itself needs to reflect whether the caller receives the original comment or a preview.

## Transform the preview at the presentation boundary

The underlying post and comments can still be fetched normally inside the application. At the presentation or API response layer, the login state decides which representation leaves the server. Authenticated users receive the comment. Other users receive transformed text in which the original non-whitespace characters have been replaced.

Preserving spaces, line breaks, and approximate character count keeps the shape of the actual comment. The viewer can see that content exists and get a fair sense of its size without receiving the original sentence. This transformation is not encryption; it is a different response representation for the preview case.

## A preview should not invent more content than exists

A fixed image would also avoid sending the original text, but it can misrepresent what waits behind the gate. Showing a large blurred block and revealing a single line after login would feel like bait. Keeping the real whitespace and length makes the invitation more honest.

The example begins with login, but the same reasoning applies to a hypothetical comment unlocked with internal points or payment. If the original should not be available yet, the API should not send it yet. The client can style the placeholder as a preview, while the server boundary decides which text is actually disclosed.