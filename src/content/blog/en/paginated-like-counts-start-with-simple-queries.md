---
title: "Paginated Like Counts: Start with a Simple Query"
description: "Count likes for the current page with a bounded query before adding counter columns or Redis and their added management costs."
lang: en
translationKey: paginated-like-counts-start-with-simple-queries
publishedAt: 2025-03-02
tags:
  - data-modeling
  - performance
  - backend
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A paginated list does not need a global like-count system to show the items on one page. Fetch the page, count likes for those item IDs, and join the two results while building the response. That path avoids both the contended counter row in the proposed design and an early move to Redis.

## Build the count as a second page-bounded query

Read the reviews or products first. Pass their IDs to the like table with an `IN` condition, group by item ID, and return a map from ID to count. The presentation layer looks up each count while composing the list response.

For the source's example of a 20-item page, only those 20 IDs enter the grouped query. The number is an illustration rather than a performance guarantee for every database and schema, but the important shape is bounded: the query follows the page instead of aggregating every item in the table. Start with that direct implementation and inspect the real behavior before adding another storage model.

## Updating the review row creates the original contention

Inserting a like and incrementing `like_count` on the review means two writes. Popular reviews concentrate updates on one row, which is where the concurrency problem appears. The count may not belong to the review's main responsibility either. Once that row owns one aggregate, up and down votes, purchase counts, cancel counts, and other secondary statistics can follow.

Keeping each like as an inserted record separates the interaction from the review. Read-time aggregation adds a query, but the current page already limits its scope. A stored counter can still be appropriate in another situation; it simply should not be the automatic first design when the bounded query has not been tried.

## Redis comes after the simple query stops being enough

Moving the count to Redis adds a store the team must operate. If a value disappears, how is it rebuilt? If the database also keeps a count, how do the two values stay synchronized? Those questions arrive even when the page-bounded database query was already sufficient.

At larger scale, caching may become worthwhile despite refill, synchronization, and management costs. That decision belongs after the service has grown beyond the simple insert model plus grouped page query. Until then, use the resources already present and keep the count concern out of the core review row.
