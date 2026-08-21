---
title: "Model Drafts by Meaning: Status or Separate Storage?"
description: "Choose a status for ordinary lifecycle stages and separate versioned storage for distinct preparatory data, based on domain meaning and compatibility cost."
lang: en
translationKey: model-drafts-by-business-meaning
publishedAt: 2026-01-25
tags:
  - data-modeling
  - database
  - domain-boundaries
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

"Draft" describes a user experience, but it does not tell us how the data belongs in the domain. A draft order may be an ordinary order before payment. It may instead be preparatory data with fields and rules that do not belong to a completed order at all.

That distinction comes before the table design. If temporary saving is simply an earlier lifecycle stage, a status on the main record is the natural model. If it is a separate business concept, forcing it into the final tables can spread nullable fields and intermediate-only data through the main model.

## A lifecycle stage belongs with the main record

Consider an order form that already has its items and is waiting for the user to proceed to payment. The record exists as an order; only its state has not advanced. Calling it a draft does not make it a different concept.

In that case, storing it in the order tables with a pre-order or waiting status keeps one schema and one lifecycle. When the order specification changes, the same structure continues to describe both the earlier and later states. Creating a full parallel set of draft order, draft detail, and draft metadata tables would duplicate schema work without a distinct domain reason.

## Preparatory data may deserve its own concept

A different design becomes plausible when the temporary stage has information used only during preparation. A multi-step process may collect incomplete values, pause for an intermediate procedure, and later materialize a final order. Those records do not yet have the same shape or meaning as the completed object.

In one comparable case, the preparatory data was stored in a separate table as versioned JSON. The application later loaded and parsed that representation to create the final record. This avoided mirroring every related final table and kept preparation-only fields out of the order data.

The separation is logical before it is physical: "prepared order" and "order" need to be meaningfully different concepts. A separate table is not justified merely because the interface has a Save Draft button.

## Flexible storage moves the compatibility burden

A versioned JSON representation avoids changing several draft tables whenever the final model gains a field. It also moves work into parsing and version compatibility. If old drafts do not expire, the application may need to keep understanding earlier representations for a long time.

That trade-off can become especially uncomfortable when the temporary data is important. A flexible column is not automatically the simpler choice; it exchanges visible schema duplication for code that interprets versions and incomplete shapes.

The decision therefore depends on what temporary saving means in this service, how different the preparatory data is, and how long it must remain usable. Status works for one lifecycle. Separate storage becomes worth considering when preparation has its own information and behavior. The label "draft" alone cannot choose between them.