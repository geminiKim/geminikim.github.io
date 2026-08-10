---
title: "Separate Shared Counts from Personalized Cache State"
description: "Compose a reaction status from reusable queries, then cache the shared count without leaking one member’s personalized state to everyone else."
lang: en
translationKey: separate-shared-and-personalized-cache-state
publishedAt: 2024-06-09
tags:
  - architecture
  - caching
  - performance
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A reaction-status response may look like one unit: the total count and whether the current user reacted. Caching it as one unit is dangerous. The count is shared by everyone, while `reactedByMe` belongs to one user. If that combined response is reused across callers, every later caller can appear to have the state of the member who populated the cache.

This is more than a cache-key mistake. It exposes two pieces of information with different reuse scopes. The code should make that difference visible before caching is added.

## Let the use case compose the status

A count-only service may begin with a presentation layer that retrieves a number and places it in an API response. Once the response also includes the current user’s state, the operation has become a reaction-status use case. It is reasonable for the business layer to coordinate two reads:

1. Count active reactions for the target.
2. Determine whether this user has an active reaction for the target.

The presentation layer then receives a complete status rather than constructing business meaning itself. Passing a user into the use case can also support future policy, such as excluding reactions to one’s own content. Whether self-reactions are allowed remains a product decision; the design merely leaves the user context where such a rule could be enforced.

## Keep the underlying reads useful on their own

It can be tempting to push a single `status` method all the way into a reader or repository. That method would return both count and personal state at once. At the current size, either design may work, but the combined method reduces reuse.

Some callers may need only the count. Others may need only the personal state or the latest reaction time. Future policy could change one calculation without changing the other. Keeping count and personal-state operations separate at the implementation boundary lets the use case assemble exactly what it needs without forcing unrelated callers to pay for both.

This is not an argument for maximum fragmentation. The boundary is a team decision. For this code at this stage, separate reads are preferable because the count or personal state may be needed independently, and another value such as the latest reaction time may be added later. The refactoring keeps those options open without forcing every query into a separate class.

## Cache only the shared component

The reaction count is a plausible cache candidate because many users ask the same question about the same target. Personal state is different: its answer varies by user and changes when that user reacts or cancels.

Caching the full API response or full status for reuse across users mixes these scopes. A cache populated while one member has reacted can make the button look active for every visitor until expiration. The number may remain correct while the personalized boolean is plainly wrong.

The response does not need to be cached as one unit merely because it is returned as one unit. In this case, the shared count can use the cached implementation while the personalized lookup remains outside that cache.

## Put caching behind a recognizable implementation

Cache placement should also communicate whether a caller receives original or cached data. One option is a cached repository implementation. Another is a cached reader that decorates the original count reader. The exact class name matters less than making the behavior recognizable and keeping cache policy out of unrelated orchestration code.

An explicit implementation is useful when some paths need cached counts and others need the source value. If cached and original reads are mixed in one implementation, it becomes harder to tell which one a caller receives. A separate cached implementation makes that choice visible at wiring time.

The boundary still depends on the service. A cached repository can make sense when the database read itself is the cache target; a cached reader can make sense when the team wants that choice visible as a separate implementation. In this reaction-status flow, either approach keeps the shared count apart from the user-specific answer assembled beside it.
