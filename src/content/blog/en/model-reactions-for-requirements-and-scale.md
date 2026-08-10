---
title: "Modeling Reactions from Requirements to Scale"
description: "Turn a vague like-button request into a reaction model by clarifying policy, estimating data growth, and planning when count queries must change."
lang: en
translationKey: model-reactions-for-requirements-and-scale
publishedAt: 2024-05-13
tags:
  - architecture
  - database
  - performance
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A request to “show a like count and let users press Like” sounds like one integer column and an increment. That is the smallest implementation, but it may answer only the visible screen while discarding information the next requirement needs. The useful design question is not whether a like counter deserves an elaborate architecture. It is how much meaning the feature already has, how much data it can create, and how long the simplest query will remain acceptable.

## Clarify the policy before choosing the table

When a specification is only a screen or a sentence, ask what the interaction actually means. Is it restricted to signed-in members? Can one member react more than once to the same target? Can a reaction be withdrawn? Will users later need a list of things they liked? Could “Like” expand into several reaction types?

These questions change the data you must retain. A counter on the target can show a total, but it cannot identify which user contributed to it. It cannot naturally answer “what did I like?” or distinguish several emotions. Adding one counter column after another merely moves an unclear policy into the schema.

This does not mean designing every imagined feature. It means turning a vague request into explicit rules before choosing an irreversible representation. In one reasonable first version, the policy might be: each member can like a particular target once, can cancel it, and repeated requests do not increase the count.

## Preserve the event-level information you expect to use

For that policy, a separate reaction record can carry a user ID, target type, target ID, reaction type, and active state. The same structure can support another target type or reaction type without adding a column to every target table. It can also serve user-specific queries because the user-to-target relationship still exists.

Cancellation can be represented as a soft deletion or deactivation when the history of a withdrawn reaction may be useful. A later like reactivates the existing record; it does not create another vote. That is a choice based on the assumption that cancelled reactions may have value later, not a universal rule.

The abstraction can also vary by boundary. A UI may call the action a thumbs-up, the domain may call it a like, and storage may use the broader term reaction. Those names are useful only when each boundary genuinely needs its own vocabulary; extra translation for demonstration alone is needless weight.

## Estimate the shape of growth, not just today’s row count

Separating reactions creates a clear model, but totals now require counting rows, usually through an index. Whether that is acceptable depends on actual scale and access patterns.

A rough upper bound starts with the number of users multiplied by the number of targets, under the deliberately extreme assumption that every user reacts to every target. Actual usage will usually be much sparser. Even this simple estimate forces useful questions: Does each user own one target, or can they create many? How quickly do users and targets grow? Are reads much more frequent than writes? How often is a total displayed?

The growth curve matters more than a single snapshot. If targets grow one-for-one with users, the bound looks different from a product where every user can create many target collections. A count query that is comfortable at the current size may become expensive as either dimension changes. Test with representative data when the estimate gets close to a meaningful limit; arithmetic is a filter for decisions, not proof of performance.

## Change the read strategy when evidence demands it

A normalized reaction table and indexed count can be a sound starting point for a small service. It preserves useful information and remains easy to understand. It is not a promise to count rows forever.

If measurements show that repeated counts dominate read cost, options include caching totals, maintaining a precomputed count, synchronizing an aggregate asynchronously, or temporarily buying capacity while a safer change is prepared. These alternatives are worth their added complexity only when the service's growth and query cost require them.

The decision therefore has two time horizons: what is adequate now, and which variables would invalidate it. Record those variables—user growth, targets per user, reaction density, read frequency—and observe them. Unexpected explosive growth should trigger a redesign, not guilt that the first version failed to predict everything. A reaction model is well designed when its current trade-offs are explicit and the team knows what evidence will make it change.
