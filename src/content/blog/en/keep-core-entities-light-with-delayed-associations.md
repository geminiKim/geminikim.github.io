---
title: "Keep Core Entities Light by Delaying ORM Associations"
description: "Decide ORM associations by lifecycle and responsibility, separating searchable supporting data so core entities stay focused and adaptable."
lang: en
translationKey: keep-core-entities-light-with-delayed-associations
publishedAt: 2025-02-02
tags:
  - domain-modeling
  - data-modeling
  - architecture
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Take a `Review` entity with tag and image collections. The first question is not how JPA should map those collections. It is whether a review needs to know about them at all. The tables may be related while the central object remains deliberately unaware of most of that relationship.

## A review can remain a review without every supporting concept

Tags used for classification or search are far from the review's main responsibility. Images may be optional too. If `Review` must own tags, images, types, comments, and every later supporting concept, it gradually becomes a god object whose size follows the database rather than the business concept.

Direction matters. An image row can refer to a review without giving the review a navigable image collection. The useful question is not whether the mapping is possible or symmetrical. Ask whether this concept needs to know the other concept and whether that knowledge belongs to its essence.

## Separate tables do not require an object graph

Searchable tags should not be hidden in one serialized string merely to avoid another table. Store tag rows separately so they can be queried. Image data can have its own table as well. That storage choice still does not force associations onto `Review`.

A use case can save the review, then insert the tag or image rows through their repositories. The code may look more procedural than persisting one object graph, but the review stays small. It also buys time to discover whether tags are review behavior or a separate search concern. Associations can be added later; starting with all of them makes the core entity heavy before the model has earned that weight.

## A required image changes the lifecycle question

If every review must have an image and that image is created, changed, and deleted with the review, the shared lifecycle is a stronger reason for a tight association. If a review can exist without an image and the image can arrive later, their lifecycles no longer match as closely. In that case I would delay the relationship, especially a one-to-many collection.

This does not make optional associations wrong or forbid ORM relationships. It keeps the decision tied to service behavior. First decide whether the supporting concept is essential, whether the lifecycles really move together, and whether the core needs to navigate the relationship. Store data in the shape its queries need, but do not let that storage shape decide ownership by itself.
