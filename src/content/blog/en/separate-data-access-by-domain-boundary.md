---
title: "One Database, Separate Boundaries: Controlling Data Access by Domain"
description: "How separate entity and repository boundaries can protect core rules from integration code even when both areas share one database table."
lang: en
translationKey: separate-data-access-by-domain-boundary
publishedAt: 2024-11-18
tags:
  - architecture
  - data-access
  - domain-boundaries
draft: false
---
> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Sharing a database does not require every part of an application to share the same data-access model. A core domain and an external integration flow may store data in the same table while needing very different permissions, names, and dependencies. Giving both areas the same entity and repository can erase that distinction.

Consider a product table populated from external providers. The collection area calls provider APIs, converts their responses, inserts new products, and updates existing rows during synchronization. The core area consumes those products as clean business concepts. It may need to read them, but it should not casually rewrite provider-owned data.

The physical resource is shared. The responsibilities are not.

## Separate the code that protects meaning

The core can own a storage module containing its `Product` entity and repository. This representation exposes the operations the core is allowed to perform. If products should be immutable from the core's point of view, the repository should not make synchronization updates available there.

The integration area can define its own entity and data access inside its module, even when that entity maps to the same table. Its representation may include provider-specific fields and the update operations required to collect and normalize external data. The core storage module does not need to know this integration entity exists.

The reverse dependency should also be absent. The collection module does not import the core repository merely because it needs the same table. It owns the access required for its job. Both sides meet in persisted data, not through unrestricted reuse of one repository.

This creates a logical boundary inside one database:

- integration code can insert and synchronize provider data;
- core code can use the resulting product without depending on collection details;
- provider-specific mess stays outside the protected model;
- changing one area's entity does not automatically expose its operations to the other.

The table name is not the architecture boundary. The allowed behavior is.

## Why one shared repository can be too open

Using the core repository everywhere is certainly possible. For a small, simple flow, it may even be sufficient. The problem appears as integration responsibilities grow.

External data is often awkward. Collection code may need normalization, repeated updates, provider identifiers, or intermediate values that have no place in the core vocabulary. If the shared entity absorbs all of those needs, the core model becomes shaped by the least stable boundary of the system.

The repository also becomes an authority problem. If its update methods are available to every module, a core use case can mutate data that the design intended only the synchronization process to change. A reviewer may catch the misuse, but the code still permits it. Separate access models turn the intended rule into a constraint developers encounter while implementing, not a convention they must remember during review.

This is not perfect physical isolation. Both models still touch the same shared resource, so schema changes and incorrect writes can affect both. The approach provides a code-level ownership boundary appropriate to a system that has not justified separate storage.

## Start with the smallest boundary that expresses ownership

A team could build an additional storage module for every integration from the beginning. That can be valid, but it also adds structure before its value is clear. A smaller starting point is to keep the external entity and repository within the integration module and prevent references across the boundary.

The area can be strengthened later. If it grows, becomes independently deployed, or develops rules worth protecting on their own, its internal modules can be separated more formally. The important early decision is that the core does not become the default storage library for unrelated responsibilities.

Before splitting access, ask:

- Who is allowed to create and update this data?
- Which area only needs a stable, read-oriented view?
- Are provider-specific fields leaking into the core model?
- Would a shared repository expose operations that one side should not call?
- Is the extra entity mapping simpler than creating a new database or service now?

If both areas genuinely have the same lifecycle and permissions, separate models may be needless duplication. If they share rows but not ownership, the duplication carries useful information: these two parts of the system see the same data for different reasons.

Database boundaries should follow the protection the product needs, not a rule that one table must have one entity across the whole codebase. Keep the core view narrow, give integration code the write access its work requires, and let the boundary become more elaborate only when operations justify it.
