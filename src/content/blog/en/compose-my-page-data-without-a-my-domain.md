---
title: "Compose My Page Data Without Inventing a My Domain"
description: "Build My page summaries through a dedicated composition layer while keeping user, order, and product responsibilities in their proper domains."
lang: en
translationKey: compose-my-page-data-without-a-my-domain
publishedAt: 2024-08-09
tags:
  - backend
  - architecture
  - api-design
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A My page may need a profile, orders, products, and several status counts at once. That creates an immediate design choice: make the frontend call each domain API separately, or add a backend API that assembles the whole screen. The second choice can sound as if the backend now needs a new `My` domain. Usually it does not.

The screen is bringing existing information together for one presentation. User and order concepts do not acquire the same responsibilities merely because the UI places them on one page. The useful design problem is therefore where to coordinate their reads without weakening the boundaries of the existing implementation.

## Separate the page requirement from the domain model

Start by examining what the page actually shows. A link to an order-history page, a short summary, and a complete order list are three different requirements. They should not inherit the same API shape just because all three appear under a menu called “My.”

Suppose the page shows a profile alongside total orders, orders being delivered, and completed payments. Those counts may exist only for this summary. They are not necessarily behaviors that belong in the ordinary order service. On the other hand, a separate order-history screen should still use the order capability designed for browsing orders.

This distinction also affects package placement. If the feature is only an extension of user-profile behavior, keeping it near the user area may be reasonable. If it combines user, order, product, and other areas, placing the composition outside any one of them makes the dependency direction clearer. The name `My` describes the consumer-facing view; it does not by itself prove the existence of an independent business domain.

## Put coordination one level above the participating services

When several same-level services must contribute to one result, I would introduce a small composition layer above them. It might be called `MyFacade`, a wrapper service, or something else that fits the project. Its role is more important than its label: it coordinates stable capabilities and produces the data needed by the presentation layer.

```text
User service --------+
Order reader --------+--> My facade --> My page response
Payment reader ------+
```

This extra level can avoid forcing one peer service to reach directly into another service's implementation. Under layer rules where service-to-service access would require concrete implementation dependencies, calling the coordinator another ordinary service only obscures its role and increases complexity.

The coordinator also does not have to call the main order service for every value. If the My page needs counts that no normal order use case provides, it may read through an order reader or use a query implementation dedicated to the summary. The right choice depends on the current code and the actual requirement. The test is whether the page can be assembled from solid existing capabilities with little duplicated implementation.

## Give each API a meaningful workload

A general API is useful only when its payload matches the work its consumers need. Consider a detailed order-history endpoint that returns each purchase, price, and status. Calling that endpoint from the My page and counting the results in the frontend looks like reuse, but it can turn into needless data transfer and computation.

Pagination exposes the flaw. If a customer has ten thousand orders, the frontend should not retrieve every page merely to calculate a total. A summary requirement deserves a summary query. The full order-history endpoint should remain focused on browsing order history.

If the My page genuinely must show the same complete history, a My-specific orders endpoint may be acceptable. It is also worth reviewing the product requirement: showing the entire history on the profile while maintaining a separate order-history screen may duplicate the experience. API boundaries should follow meaningful use cases rather than every box in the current screen.

Whether the client makes several calls or receives one composite response remains a presentation decision. Compatibility concerns, especially for an app, can make an API contract expensive to change. Within those constraints, presentation APIs can still be split or combined more freely than the implementation beneath them. The durable part should be the reusable business and query capabilities, not a controller shape tied to one UI revision.

## Let larger boundaries emerge from scale

There is no need to create a broad “integrated query” domain or split every concept into a separate top-level module at the first sign of composition. User, order, product, stock, and payment may eventually form clearer clusters. Some may grow large enough that separate services become plausible. That is when stronger package or module boundaries earn their cost.

Until then, keep the domain areas coherent and add only the narrow coordination point the page requires. UI and API shapes will change even when the backend would prefer them not to. A small facade or query coordinator contains that movement while allowing the underlying implementations to remain reusable.

First decide whether the page needs details or summaries. Keep the participating domains responsible for their own work, compose their data one level above them, and shape the API payload around the use case. A My page can then grow without turning `My` into a catch-all domain or making every screen change ripple through the core code.
