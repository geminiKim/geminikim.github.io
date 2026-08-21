---
title: "Separate Core Data from Like-Count Aggregates"
description: "Design scalable like-based ranking with separate aggregates, explicit freshness goals, async updates, reconciliation, and search boundaries that follow real demand."
lang: en
translationKey: separate-core-data-from-like-count-aggregates
publishedAt: 2025-04-27
tags:
  - data-modeling
  - performance
  - reliability
  - architecture
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

When like-based sorting becomes too expensive to calculate from raw interactions, put ranking signals in a separate aggregate table rather than adding counters to the core product or review row. Define how fresh the public count must be, update the aggregate without blocking the primary like action, and reconcile it at a frequency the product can justify.

## Global sorting is different from showing counts on one page

A grouped count can display likes in a list. Sorting the entire catalog by likes requires comparing the full candidate set before pagination. At large data volumes, repeatedly grouping all interactions becomes expensive, and a cache around the same heavy query can create a burst when entries expire.

An aggregate table reduces the working set to one row per product or review. It can hold `like_count` and other ranking inputs such as review count or rating. The ranking query sorts this smaller structure, obtains the page of IDs, and then loads the corresponding core records.

## Keep the aggregate outside the core lifecycle

A product or review should not have to own every derived statistic used by presentation and search. Those statistics mix secondary ranking concerns into a concept whose main behavior can exist without them.

A separate table acknowledges that the aggregate can have a different lifecycle from the core concept. This is not absolute. If the product owner or planner treats the number as important enough, storing it on the core row may be appropriate instead.

## Freshness should follow user value

A user's own like or saved-item list may need to reflect an action immediately. The public count beside an item may tolerate delay. Those are different consistency promises and should not receive the same cost by default.

The aggregate can be rebuilt by a scheduled batch, updated periodically, or maintained near real time. The interval might be short for a trend-sensitive product and much longer where rankings change slowly. Traffic and freshness requirements should select the method; illustrative volumes and intervals are not universal thresholds.

## Isolate aggregate contention from the primary action

Updating one popular aggregate row inside the transaction that records a like means contention on the secondary row can make the user's primary action fail. If the product accepts eventual consistency, record the like without updating the aggregate in the same transaction, then process the aggregate asynchronously.

At modest scale, an application-level asynchronous task may be enough. At higher event volume, publish events and control consumption separately. Asynchronous aggregation can lose consistency, so decide whether that inconsistency is critical and whether periodic synchronization is enough for the service.

## Complex ranking can become a search boundary

As ranking adds personalization, colors, seasons, ratings, and other signals, it starts behaving like search rather than ordinary domain retrieval. Keeping clean metadata feeds makes a later search service possible without forcing the core database to answer every query shape.

A search system can return ordered IDs while the service loads current detail from its database. That separation is premature for a small product with simple sorting. Start with the grouped query, move to a separate aggregate when data volume makes global ranking difficult, and introduce dedicated search when the service has grown and search needs are clear. Choose each step for the service's current traffic, scale, and requirements.
