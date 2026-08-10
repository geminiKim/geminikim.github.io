---
title: "Put Logic Where Change Is Cheapest: Client vs. Server"
description: "Place display-only work near the UI, but centralize meaningful or changing values when multiple clients and shipped app versions make updates expensive."
lang: en
translationKey: split-client-server-responsibility-by-change-cost
publishedAt: 2024-04-30
tags:
  - api-design
  - client-server
  - backward-compatibility
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A client can calculate a percentage from two values, so should it? The arithmetic is easy. The design question is where that percentage has meaning and what it will cost to change after web, iOS, and Android clients have shipped.

I use three connected questions: Is the logic only for presentation? Is the calculated value meaningful to the business? How likely is it to change?

## Keep display decisions near the display

If a calculation exists only to render a progress bar or arrange a screen, the client is often the natural owner. Different clients may intentionally present the same data differently. Moving every formatting choice to the server makes the backend responsible for details it does not need to control.

A value with business meaning is different. If the percentage itself drives policy or must be interpreted identically everywhere, calculating it in the backend is often clearer. The server can provide one meaning instead of asking every client to reproduce it.

The boundary is conditional. A percentage formula may appear stable today but later acquire adjustments or extra variables. Once that happens, copies in several clients must change together. Small differences in rounding or release timing can produce different visible results.

## Shipped apps make change asymmetric

Web code can usually be replaced centrally. Installed apps remain on devices, and users do not all update immediately. That makes client-side logic expensive to revise.

Suppose an old app calculates from two response fields. A new server-side calculation is introduced later. The API may have to keep the old fields for existing apps while adding a new result for updated apps. Splitting an API version does not erase the cost; the old version may need to remain available as long as the support policy requires.

The team therefore needs an explicit backward-compatibility policy. How many app versions are supported? When is a forced update acceptable? Can fields be added without breaking old clients? The answers determine how aggressively logic can live in the app.

When long support is required and several clients must agree, I lean toward returning meaningful computed values from the backend. When releases are tightly controlled or the work is purely visual, the client can stay more flexible.

## Text and errors reveal the same tradeoff

Error messages make the change cost easy to see. If the server sends only an error code and every app hardcodes the text, changing that wording requires app releases. Alternatives include returning display text from the server or letting the app periodically load a message map. Each has different complexity and control.

Domain errors add another boundary. An internal error message may be suitable to expose directly, or the API may need to map the domain error to a client-facing code and message. Make that conversion when the service contract needs it; do not build a mapping layer without a case.

## Decide from meaning and lifecycle

Before assigning logic, ask:

- Is this an interface-specific presentation choice?
- Does the value carry business meaning?
- Must every client produce exactly the same result?
- How often might the rule or wording change?
- How long must older clients keep working?

There is no rule that the backend should calculate everything. There is also no reason to duplicate meaningful, changing logic across every client merely because the inputs are available. Put the responsibility where its meaning is clearest and where the real release lifecycle makes change affordable.