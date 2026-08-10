---
title: "Design for Change with Core Ownership and Surrogate Keys"
description: "Centralize a shared registration rule in the core, escalate isolation only when needed, and keep changing business uniqueness out of the primary key."
lang: en
translationKey: core-ownership-and-surrogate-keys
publishedAt: 2024-06-29
tags:
  - architecture
  - modularity
  - database
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A device registration rule is needed by an API, an admin application, and a batch process. The DAOs and registration logic are scattered across those modules, so a change to duplicate detection forces every caller to understand the rule. At the same time, moving everything into a shared core raises another concern: will core classes spread into applications that should not know them?

There are two separate design decisions here. One is where the registration behavior belongs. The other is how the database represents identity when the business definition of uniqueness changes. Both should make the next change cheaper, but neither requires the most elaborate structure on day one.

## Give the rule a concrete owner in the core

The immediate problem is fragmented ownership. Registering a device is one capability, yet each runnable application appears to know parts of its process. A broad name such as `DeviceCoreService` does little to clarify the boundary. It sits at a high layer and says neither what it does nor which rule it owns.

A more concrete component such as `DeviceAppender` makes the responsibility visible. Place it in the core's implementation layer and gather the registration and duplicate-checking logic there. The API, admin application, and batch process may call the same implementation, while the business rule changes in one place.

This is independent of JPA. Changing persistence technology or adding a JPA-specific abstraction does not answer who owns device registration. First establish a reliable implementation for the concept; then let persistence remain one of the materials used beneath it.

The implementation layer is also an important constraint. The component is a focused tool for registering a device, not another high-level service that asks every caller to understand the entire flow. A precise name and a lower layer narrow how it should be used.

## Start with the boundary the team can operate

Allowing a core component to be visible from several modules can feel untidy. It is still a reasonable first design if the team can govern its use. A short internal rule, routine code review, and team communication can keep callers from bypassing the component. A new colleague working on device registration can ask whether an implementation already exists, find it in the core, and learn the rule through review.

This option keeps the change small. It centralizes the behavior without introducing another runtime boundary. If review and guidance are enough to keep the rule intact, the team has solved the present problem with infrastructure it already has.

There is a stronger option when class-level exposure becomes a real cost. If the API, admin application, and batch process already run as separate servers, a core API can be the only entry point to the core module. Each application calls that API instead of depending on core implementation classes. The registration concept is then isolated behind a runtime contract, and code from the core no longer spreads through every application.

That isolation may help long-term ownership and handover, especially when an outward-facing API already has too many responsibilities. It can also be overengineering. Separate deployment, network calls, and another contract are a large price to pay merely because a class dependency looks uncomfortable. Run the direct core-component design first and move to a core API when the operational boundary provides enough value to justify it.

Splitting the code into even smaller modules is another possible response, but it is especially easy to get wrong before the concepts are understood. A module for `device` alone may cut across related responsibilities and replace one concern with dependency, code, and maintenance problems. If a stable concept later emerges around devices and their related behavior, it may earn a cohesive module. Premature fragmentation does not create that understanding.

## Keep business uniqueness out of the primary key

The duplicate rule reveals a different kind of coupling. Suppose a device number was originally unique. The requirement changes so that the same number is allowed when the brand differs. If the device number itself is the table's primary key, a business-policy change now demands a primary-key change.

Use a surrogate `id` as the primary key instead. The particular generator—an auto-incrementing value, UUID, ULID, or another choice—is a separate decision. The important part is that mutable business data does not define row identity.

Then express the current business rule as a unique constraint or unique index. Under the original rule, the device number can be unique. When uniqueness becomes the combination of device number and brand, replace that constraint with a composite one. The row's primary identity remains stable while the business rule changes around it.

This does not make an existing production migration disappear. If a live table already uses business data as its primary key, changing it may still require data migration, and the safe approach depends on data volume and the current schema. A table with only a small number of rows may be handled quite differently from a large one. Without that context, changing a live primary key is not something I would prefer casually.

Start by consolidating the rule under a concrete core owner. Review is enough while the team can still manage that boundary; introduce a core API only when isolation is worth its cost. A surrogate key then lets the next uniqueness change remain a constraint change instead of becoming an identity rewrite.
