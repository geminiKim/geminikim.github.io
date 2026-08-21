---
title: "Split Batch Ingestion from Processing to Reduce Retry Cost"
description: "Stage external data, rerun internal transformations without repeating provider calls, and reduce the traffic and recovery costs of oversized batch jobs."
lang: en
translationKey: split-batch-ingestion-and-processing
publishedAt: 2025-06-22
tags:
  - data-modeling
  - reliability
  - software-delivery
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

When a batch job fetches external data, transforms it, and saves the result as one long operation, a local processing bug can force every external call to run again. Split ingestion from transformation when those steps have different failure costs. Store the received data, then rerun internal processing without contacting the provider again.

This is not a rule that every batch must have multiple jobs. It is a response to costly or rate-limited external calls and to transformations that may need to run again.

## One retry should not repeat every side effect

Imagine fetching a product list and then calling the provider again for each product's options. If the job fails partway through, restarting from the beginning may duplicate thousands of calls. Even if the failed position is known, building correct resume logic inside one oversized flow is another source of complexity.

The failure may be entirely internal: a tag mapping is wrong or required option data is omitted. Re-fetching correct source data does nothing to fix that problem. It only spends the external traffic budget again and may put pressure on a small provider or violate a call limit.

## Use staged source data as a retry boundary

A two-stage design changes the recovery unit.

The ingestion job calls the external API and stores data close to the received representation. The processing job reads that staged data, converts it into the application's model, and writes the final tables. If transformation fails, only the second job needs to run again.

The staged representation can preserve product and option data separately or in another shape appropriate to the source. The external API calls are isolated from the internal transformation.

This also supports intentional reprocessing. When mapping rules change, the application can rebuild its internal view from the retained source snapshot without contacting the provider.

## Splitting moves costs; it does not erase them

The ingestion job can still fail midway and needs its own restart point. Splitting the jobs does not solve that first-stage failure.

The two jobs also need coordination. A simple system may leave enough time between schedules for ingestion to finish, another may trigger processing after ingestion, and settlement-like work may use a more structured flow. The environment determines the choice.

The useful design question is which part needs to be rerun without repeating the external calls. If external retrieval is costly while internal transformation may fail or change, put a stored boundary between them.