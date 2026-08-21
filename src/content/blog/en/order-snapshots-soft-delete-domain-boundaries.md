---
title: "Protect Order Snapshots with Soft Delete and Boundaries"
description: "Separate current products from immutable order snapshots, preserve refund history, and use status transitions or archives before destructive deletion."
lang: en
translationKey: order-snapshots-soft-delete-domain-boundaries
publishedAt: 2025-02-09
tags:
  - domain-modeling
  - data-modeling
  - reliability
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A prohibited product has to come down, and completed orders containing it have to be refunded. A direct foreign key prevents the product row from being deleted, so the proposed sequence refunds the order, deletes its order item, and finally deletes the product. That sequence satisfies the constraint by erasing the wrong concept.

## The deletion sequence reveals the broken boundary

A product is input to a purchase. Once an order is placed, the order item is a snapshot of the product name, price, and other facts at that time. Today's price change does not rewrite yesterday's order. The current catalog product and the purchased item have already entered different lifecycles.

The order item therefore belongs under the order boundary, not under the current product. Deleting it because a catalog row must disappear breaks that boundary. It also removes the record of which orders contained the product and why a refund followed. A database relationship has displaced the more important question: which concept owns this data after the purchase?

For this example, a direct product-to-order-item foreign key offers little if it implies a live relationship after the snapshot is created. Foreign keys can protect useful integrity elsewhere, but they should follow the lifecycle rather than invent it.

## Preserve the state change instead of erasing the event

Refunding changes the order or payment state; it does not make the purchase cease to have happened. Mark the current product blocked or deleted, and mark affected orders or items refunded. The exact status names depend on the service, but the records should show the transition rather than remove its evidence.

A removed product can still answer what it was, who registered it, which purchases included it, and which refunds followed. Hard deletion leaves gaps in later investigation and analysis. A refund table alone cannot restore product and order context once the referenced rows are gone.

Soft deletion is the preferred move in this scenario, not a command for every kind of data. When destructive deletion is genuinely required, move enough information to another table first so necessary history is not lost and the data can be replayed if that is required. Start with the catalog, order, order item, payment, and refund boundaries. Then choose statuses and constraints that preserve what happened inside each one.
