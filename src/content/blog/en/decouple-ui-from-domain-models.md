---
title: "Designing Domain Models Beyond the Shape of the UI"
description: "A tree-shaped API does not require a tree-shaped domain. Keep the client contract at the presentation boundary and compose it from internal concepts."
lang: en
translationKey: decouple-ui-from-domain-models
publishedAt: 2024-05-06
tags:
  - backend
  - architecture
  - api-design
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A client asks for books displayed as a tree. The quickest backend design is to call everything a tree too: `TreeController`, `TreeService`, `TreeItem`, and perhaps tree-shaped persistence. That can work, especially at the beginning. The tension appears when the screen's current shape starts deciding what every important object inside the service must be.

I prefer to treat “tree” as the client contract and ask separately what the backend is actually modeling. In this example, the internal concept is a shelf. A shelf holds items; an item knows its depth and priority. The presentation layer turns those shelves and items into the tree the client expects.

## Let each side use the language it owns

The API can consistently use tree terminology. A `findTree` endpoint may accept its arguments, ask a shelf service for shelves, and build a `TreeResponse`. For a response that includes an item, it can retrieve the shelf and the shelf item, then combine them into the required representation.

At first, that call chain may look awkward: a method named `findTree` suddenly enters a shelf service. The mismatch makes the translation point visible. The controller package speaks in terms of the client's tree, while the domain area speaks in terms of shelves and items. Using one noun everywhere would be easier to follow, but it could also hide which side owns that noun.

That difference in vocabulary is deliberate. The presentation layer is a bridge: it translates between the client-facing specification and the concepts used inside the backend. A requirement to “show books as a tree” describes how information should leave the system. It does not prove that `Tree` is the best name for the domain object or that the same structure belongs in the database.

This separation also allows the two sides to change for different reasons. The API may keep promising a tree while the internal metaphor becomes a shelf, a box, or another container. The specific internal name is less important than honoring the external agreement and keeping the translation visible at the boundary.

## Compose the response where the contract is known

At the moment, a shelf and a shelf item do not need to become one permanent domain object merely because one endpoint returns them together. Their combination exists to satisfy a client response, so the presentation layer can assemble it.

The flow is straightforward:

```text
shelf service -> shelves -----------+
                                      +-> tree response
shelf item lookup -> shelf items ----+
```

This is not a rule that all combinations belong in controllers or response classes. If repeated behavior appears around the pair, or the combination gains meaning inside the business, a combined concept may deserve to exist. In the current, simple model, creating that object in advance would claim knowledge the implementation has not yet earned.

The boundary should therefore do enough translation to protect both sides, but it should not become a substitute for a domain concept that has actually emerged.

## Keep persistence from copying the screen by reflex

The same distinction can continue into the data model. A shelf can have a name and description. Each shelf item can carry its own depth and priority, which are enough to arrange items into levels when producing the tree. Fields such as a thumbnail, link, and name reflect the current specification, but they are not necessarily exclusive to a tree-shaped UI.

This model can evolve. A shelf level might later become explicit data rather than remaining a value on each item. The important point is not that the first schema is final; it is that the schema starts from the backend concept instead of mechanically reproducing the first screen.

The shelf may also gain uses that the current tree does not reveal. It holds books now, but later work may place other items on it or present the same contents in another form. Those possibilities do not justify designing every future case today. They explain why preserving a distinction between the reusable internal concept and its first presentation can be useful.

Nor does this example require a separate domain class for every persistence entity. If a JPA entity is an adequate conceptual object for the application, using it directly can be a reasonable choice. Separating the objects is also valid when behavior and cohesion begin to demand it. The decision should follow what the model needs, not a layer-counting rule.

## Accept the cost of separation only when it clarifies change

Moving between “tree” in the API and “shelf” inside the service can be confusing. Developers have to learn the mapping, and navigation is less literal than when every class shares one noun. That is a real cost.

It is also acceptable to begin with tree terminology everywhere and refactor after the model becomes clearer. The more intentional split is useful when we want to stop a presentation requirement from hardening into an internal assumption. It gives us a place to ask two different questions: what have we promised the client, and what concepts best explain the backend?

For this example, the answer is modest. Keep the tree as the API contract, model shelves and shelf items internally, and combine them when producing the response. If later behavior reveals a stronger concept, change the model then. The goal is not maximum separation. It is enough independence for the UI and domain to evolve without either one silently defining the other.
