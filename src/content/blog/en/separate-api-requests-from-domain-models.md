---
title: "Keep API Request Models Out of the Core Domain"
description: "Convert external request objects into business-owned values at the presentation boundary so the API depends inward and the core never depends back."
lang: en
translationKey: separate-api-requests-from-domain-models
publishedAt: 2024-02-22
tags:
  - backend
  - architecture
  - api-design
  - modularity
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Splitting an application into a core module and separate admin and user APIs creates an immediate question: what happens to a request body after the controller receives it?

Passing the API request object straight into a core service is convenient, but it makes the core depend on the API module. If the API already depends on the core, the design has become circular. The cleaner direction is one-way: the presentation layer accepts the external shape and converts it into an object owned by the business.

## Conversion is part of the boundary

Suppose an order endpoint receives `NewOrderRequest`. That type belongs to the API because it represents an HTTP contract. Before calling the business flow, the controller or nearby presentation code converts it to `NewOrder`, which belongs to the domain.

The alternative is to unpack every request field into service parameters. That avoids the module dependency but becomes awkward as the request grows. A business-owned input object keeps the call coherent without leaking the transport type inward.

This arrangement gives each module a clear view:

- the API knows the request model and the domain input;
- the core knows only the domain input;
- the core never imports the API.

Values move inward while dependencies point inward as well.

## Similar fields do not make the types identical

At first, the request model and domain input may look nearly the same. The separation still matters because they change for different reasons. The request follows an external specification. The domain object follows the concept the business wants to protect.

A payment request illustrates the difference. The external API may receive several primitive amount fields and gateway attributes. During conversion, those values can become a meaningful money object and a domain-owned payment attribute. That is the moment to ask which values belong together and which invariants the inner model should express.

If the two representations remain identical and no boundary benefit exists, a team may reasonably choose less ceremony. The point is not to duplicate every DTO. It is to prevent an outer contract from becoming the core's language merely because conversion seemed inconvenient.

## External change should stop at the edge

An API field can be renamed, added, or rearranged. Those changes should be absorbed by the request type and its conversion when the business meaning has not changed. The core should continue receiving the same meaningful input.

Conversely, the domain may refine a concept without forcing the public request to adopt its internal shape. The boundary translates in one direction and lets the two models evolve for their own purposes.

This pattern also makes module wiring easier to reason about. The admin API and user API can have different request contracts while both call the same core capability. Neither API has to expose its DTOs to the other, and the core does not become a meeting place for transport details.

The request object belongs to the interface that receives it. The business object belongs to the code that acts on it. Converting between them is not wasted mapping; it is the work that keeps an external specification from defining the center of the application.