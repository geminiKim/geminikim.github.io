---
title: "Design Data Relationships for Organizational Reality"
description: "Prefer simple relationship cardinality, then account for observed requirement churn, decision habits, and deadline constraints instead of predicting every future change."
lang: en
translationKey: design-data-relationships-for-organizational-reality
publishedAt: 2025-11-09
tags:
  - domain-modeling
  - architecture
  - collaboration
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A product-to-category relationship began as one-to-one or one-to-many and later became many-to-many. Does that prove it should have been open from the start? Usually not. The default preference is to start with one-to-one or one-to-many when that is what the present requirement supports.

If one product currently belongs to one category, model that rule. Future possibility alone applies to almost every design and cannot justify every extra structure.

The evidence changes when it comes from the organization rather than imagination. A team may have watched the same decision maker reverse specifications repeatedly or seen several projects change direction near release. Company, planning-team, and leadership behavior are part of the environment in which software must be delivered.

## Three weeks before launch changes the calculation

Some projects changed requirements at the end because a decision maker tried a competitor's product and wanted its behavior. In one example, that request arrived only about three weeks before launch.

After that happens repeatedly, leaving a relationship open can be a practical choice. It is not a claim to have predicted the domain. It is a response to an observed pattern in how requirements are made and to the fact that late changes rarely receive matching schedule extensions.

## Design for the organization you actually have

The default remains one-to-one or one-to-many, with many-to-many introduced when the product requires it. The exception becomes defensible when repeated local behavior makes another reversal likely and the fixed delivery cost is high. Teams and divisions inside the same large company may reach different answers because their decision processes differ.

That context should be stated, not hidden behind “flexibility.” Explain that the model is wider because this organization has repeatedly changed the relationship late. Practical design includes the people and deadlines that produce requirements, not only the cardinality on a diagram.
