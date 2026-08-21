---
title: "Why Domain Concepts Should Not Mirror Database Tables"
description: "Model business importance, hierarchy, and behavior instead of creating one domain object and repository for every persistence table."
lang: en
translationKey: domain-concepts-not-database-tables
publishedAt: 2025-08-10
tags:
  - domain-modeling
  - data-modeling
  - architecture
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A domain can contain fewer concepts than the database contains tables because persistence structure and business meaning answer different questions. Several tables may support one business concept, while an association table may remain an implementation detail rather than becoming its own domain object and repository.

The important work is not counting classes against tables. It is deciding which ideas matter in the product, how important they are relative to one another, and how they relate.

## One concept may require many persistence structures

A coupon concept might be stored through coupon, condition, target, and blacklist tables. Those tables separate data for persistence concerns, yet application behavior can still treat them as parts of one coupon concept. The table count does not force four equally important domain objects.

The reverse shortcut is also unsafe: a table does not become a domain merely because code can generate an entity and CRUD repository for it. Join records, structures used during a transition, and auxiliary classes may support implementation without becoming domain concepts.

A repository can expose an operation such as adding a product while its persistence implementation writes a product row and the necessary relationship rows. The domain-facing interface need not reproduce every underlying repository one for one.

## Determine the status of product and brand first

Suppose a schema has product, brand, and product-brand tables. Before designing objects, ask what “brand” means in this product.

If brand is little more than searchable tag data attached to a product, it may not deserve the same status as product. If brands already exist and products are placed under them, brand may be the higher-level concept. If brands and products are added separately and mapping them is a separate function, that mapping still need not become a top-level domain concept itself.

These models cannot be selected from the schema alone; the missing business context is precisely why the hierarchy must be clarified. The team must consider how important product and brand are relative to each other, whether a brand already exists before a product is added, whether unbranded products are valid, and whether connecting product and brand is a separate function.

## Design repositories around meaningful operations

“Every entity needs CRUD” starts from storage rather than behavior. A domain-facing repository is better shaped by the operations the model needs. Its implementation can coordinate several persistence repositories or queries behind the boundary.

For the product-and-brand example, the useful questions are specific to the case: How important is each concept, and which one sits higher in the hierarchy? Does a brand already exist when a product is added? Can a product have no brand? Is mapping a product to a brand a separate function? The answers determine whether brand is a major concept, supporting information, or something managed separately from product creation.

There is no value in forcing a mismatch for its own sake; one table and one domain object can be appropriate. The rule is that one-to-one correspondence is not the goal. A useful model reflects business meaning and operations, while persistence uses as many tables as it needs behind that model.