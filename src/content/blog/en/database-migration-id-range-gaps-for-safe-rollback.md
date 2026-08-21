---
title: "Use ID Range Gaps for Safer Database Rollbacks"
description: "Separate legacy and new identifier ranges to prevent rollback collisions, simplify reverse migration, and make operational traffic easier to trace."
lang: en
translationKey: database-migration-id-range-gaps-for-safe-rollback
publishedAt: 2025-04-20
tags:
  - data-modeling
  - software-delivery
  - reliability
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

During a database migration, start new writes in an identifier range clearly separated from the legacy range. If rows from the new database must be copied back, the gap keeps their IDs from colliding with legacy IDs that continued to increase. It also makes new-system IDs recognizable in API responses and logs.

## Matching sequences create a rollback trap

Suppose the legacy database has reached an ID near one boundary and the new database begins from that same point. During cutover, both systems may keep advancing. If a defect appears after the new system has accepted writes, moving those rows back can collide with IDs created by the legacy flow.

The identifier may also appear in related tables or other systems. If different records claim the same number, the overlap creates more trouble when the data has to move back.

## Move the new sequence to a separate range

Advance the new sequence to a clearly separate range before opening writes. For example, legacy posts can remain in one range while new posts begin in another.

With disjoint ranges, rows created by the new database can be copied back without overlapping the legacy IDs that continued to grow.

## The range also becomes an operational marker

A separated ID range makes new-system records recognizable in API responses and collected server logs. Operators can see traffic reaching the modernized system and how many posts it created.

The separated range therefore helps both when data must move back and when the rollout is observed.
