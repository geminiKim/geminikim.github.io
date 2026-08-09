---
title: "Choose Normalization from Requirements and Object Relationships"
description: "Database normalization is not a score to maximize. Decide from change semantics, query cost, and the relationships the data is meant to preserve."
lang: en
translationKey: normalization-from-requirements
publishedAt: 2023-08-26
tags:
  - database
  - backend
  - design
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

I do not begin a database design by asking how normalized the tables should be. That question is too detached from the work the system has to do. I begin with the concepts in the service, the relationships between them, and the requirements that decide how those relationships change.

My default designs tend to be fairly normalized because I use tables to support conceptual objects rather than treating the database as a bag of values. But denormalization is neither a shortcut nor a mistake by definition. Sometimes it is exactly what a requirement says the data means.

## The same coupon name can mean two different things

Suppose there is a `coupon` table with an ID and a name. An `issued_coupon` table records which coupon was given to which user. The normalized shape stores `user_id` and `coupon_id`, then joins the coupon when it needs the name.

Now add a real requirement.

The issued-coupon view is read constantly, it always needs the coupon name, and the join or separate lookup has become a performance problem. Copying the name into `issued_coupon` may be a reasonable response. That is the familiar performance case, but it is not the only one.

A product owner may say, "If the coupon name changes later, the name shown on coupons already issued must not change." In that case the copied name is not merely a cache. It is a snapshot of what was issued. The issue record owns that historical value, so storing it there matches the requirement.

Reverse the requirement and the answer changes. If every issued coupon must immediately display the current name, keeping only `coupon_id` is the simpler design. We can still copy the name and update all issued rows whenever the source changes, but that creates a synchronization job we did not need.

Scale makes that choice painful. Imagine one coupon has been issued one hundred million times. Renaming the coupon now means one hundred million updates if every row carries a synchronized copy. The cost is not hidden anymore. A field that looked convenient on the first day has become a large write operation with consistency concerns.

The useful question is therefore not "Should I denormalize?" It is "Is this value a snapshot, a live reference, or a performance copy?" Those three meanings lead to different change rules. They should not share a column design just because the screen happens to show the same text.

## Table relationships teach developers how to use the data

There is another failure mode that receives less attention than query speed. A denormalized structure can erase the hierarchy between concepts.

I worked with an order structure that roughly had an order header, an order detail, and an order item. The lower records carried IDs, names, and other information copied from the levels above. The exact old schema is less important than what happened to the code afterward: as more developers passed through the system, almost everything started loading only the order item.

Code that needed an order-level name fetched an item. Code that needed detail-level information also fetched an item. The header and detail tables remained, but only a small part of the application used them. The item had become a universal object that wandered through the codebase.

That is convenient until it is not. The database says there are three concepts with a hierarchy, while the application behaves as if the bottom record represents all three. Future maintainers no longer know whether a value belongs to the order, the detail, or the item. A copied field does more than save a join; it changes which object developers reach for and where they attach new behavior.

This is why I consider the relative position of tables, not only their columns. Does an order item really need to know everything about its header? Where should coupling remain strong, and where should it be loosened? Which values change together? Which concept owns the rule?

Normalization terminology does not answer those questions. The object relationships do.

## A practical decision sequence

Before copying a field, I try to make the change semantics explicit:

- Must an existing record preserve the value as it was at creation time?
- Must it follow the current source value?
- Is the read frequent enough, and expensive enough, to justify another representation?
- If the source changes, how many copies must be updated and what happens when some updates fail?
- Will the copied fields encourage callers to use a lower-level object in place of the concept they actually need?

The answers may justify a snapshot column, a join, a separate read model, or a controlled synchronization process. This example intentionally stays at the database level; a larger system may have more options. More options do not remove the need to state what the data means.

I would rather see a modest normalized design that expresses the relationships clearly than a clever schema nobody can explain. When a concrete requirement or measured cost calls for duplication, add it deliberately and document its update rule. A table design should make the current system easier to understand, not leave the next developer guessing which copy is true.