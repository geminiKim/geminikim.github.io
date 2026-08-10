---
title: "Reversible Design Is the Antidote to Overengineering"
description: "Build the requirement in front of you, look only a little beyond it, and keep speculative structures cheap to expand, remove, or replace."
lang: en
translationKey: reversible-design-against-overengineering
publishedAt: 2024-04-09
tags:
  - software-design
  - overengineering
  - data-modeling
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

If the current requirement is ten, we have to build ten. How far beyond it should the design look? My rough answer is 12.5: enough awareness to avoid an obvious dead end, but not enough speculative construction to pretend we know the next several turns.

The number is a metaphor, not a sizing formula. The useful test is whether the system remains easy to expand and easy to shrink.

## Future paths do not continue in a straight line

Overengineering often assumes that the next requirement is simply a larger version of the current one. We see A, B, and C, then build all the way to Z. The business may instead leave that path after C and choose something we did not model. The carefully prepared Z becomes unused structure or debt.

That is why implementing twenty for a requirement of ten is dangerous. It spends present effort and makes future developers understand concepts that do not yet serve a user. If the added structure also constrains the model, it can make the real next direction harder.

Going too far is less harmful when it is reversible. If a design reaches fifteen and can cheaply return to twelve, the experiment may be acceptable. The problem is not only how much was built; it is how expensive it is to remove when the guess is wrong.

## Model today's order without inventing tomorrow's package

Suppose the requirement needs orders and order items. A speculative design might add package IDs, bundle concepts, and columns for several imagined fulfillment modes. Those fields make the model look prepared, but no current behavior proves what “package” will mean.

Start with order and order item. If package ordering becomes real, the concept can be introduced above or alongside them when its rules are known. Adding it later is often cheaper than carrying the wrong version from the beginning.

The same principle applies to an uncertain custom-order feature. Keeping its data separate may make it easy to delete if the feature disappears. Yet splitting a table in advance can itself be overengineering. The choice depends on how likely removal is and what the separation costs now.

That tension cannot be solved by a slogan. It requires understanding the current requirement, identifying the cheapest reversible boundary, and stopping there.

## Use change cost as the guardrail

Before adding a future-facing abstraction, ask:

- Which current requirement needs it?
- What evidence suggests the next change?
- Can the structure be removed without a migration campaign?
- Does it make today's code harder for teammates to understand?
- If the future goes another way, what remains as debt?

Experience improves these judgments because previous excess becomes visible: fields nobody uses, abstractions that confuse colleagues, and tables built for features that faded out. The lesson is not to stop designing. It is to make uncertainty explicit and avoid turning a guess into an expensive constraint.

A durable design expresses the requirement plainly and leaves affordable places to evolve. Build ten, notice what lies just beyond ten, and preserve the ability to change direction. That is more useful than arriving early at a future the business never visits.