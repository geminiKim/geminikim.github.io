---
title: "Domain Models First: A Conservative Approach to JPA Associations"
description: "A cautious way to map JPA entities: start with IDs, add associations only when lifecycles truly align, and model business concepts independently."
lang: en
translationKey: jpa-domain-modeling-without-association-overload
publishedAt: 2024-01-06
tags:
  - jpa
  - domain-modeling
  - backend
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

JPA makes it easy to connect entities. That convenience does not mean every relationship in the database should become an object association. My default is deliberately conservative: keep the related ID, leave the entities unmapped, and add an association only after the relationship proves that it belongs in the model.

This is a preference shaped by difficult systems, not a universal rule. Teams that use associations well can keep using them. The point is to make the relationship earn its place before it spreads through the code.

## Begin with an ID

Suppose a review has images. I would normally let each image carry the review ID and start without a JPA association. From that position, adding a mapping later is straightforward. Reversing a model already covered with bidirectional associations is much harder because navigation, loading behavior, and business code have grown around those links.

If I do map an association, I first ask whether the two things have the same lifecycle. Does one always exist and disappear with the other? Does the parent genuinely need to know the child for its work? Even a review and its images may not satisfy that condition: a review can exist with no image, and the number of images may vary by policy.

My narrower default is therefore:

- avoid bidirectional mappings;
- be especially cautious with one-to-many and one-to-one mappings;
- consider a unidirectional many-to-one only after checking the lifecycle and the required direction of navigation.

These are guardrails, not laws. If an order and its items are inseparable in a particular business, a closer mapping can be reasonable. The decision should come from that business relationship rather than from what JPA can generate.

## Persistence entities do not define the domain model

A second mistake is assuming that every entity must have a matching domain object with the same fields and shape. Persistence describes how data is stored. A domain model should describe the concept the business needs to work with.

Consider a question and an answer stored as separate entities. The answer can hold the question ID without either entity navigating to the other. In the domain layer, however, a `Q&A` concept may combine a question with an optional answer because that is the meaningful unit for the use case. The domain object is free to express that relationship even when the persistence mapping does not.

The same is true for reviews and images. Depending on the use case, the domain may expose a review alone, a review paired with images, or a more explicit combined concept. Names and shapes should make the business meaning visible. They do not have to reproduce the entity graph.

## Keep the two decisions separate

Entity mapping and domain modeling influence each other, but they answer different questions:

1. What association is safe and useful for persistence?
2. What object shape explains the business operation clearly?

Separating those questions leaves room to change. A table or entity can evolve without forcing every domain object to follow it. The domain can also try several representations without first rebuilding the persistence graph.

I would rather start with fewer JPA relationships and discover a necessary one than begin with a dense graph and spend the next change trying to escape it. That is a conservative choice, and it may not fit every team. It does, however, keep attention on the relationship that matters most: the one the business actually has.