---
title: "Append, Don’t Overwrite: Designing Immutable Operational Data"
description: "An append-only repayment example that makes history and synchronization clearer, along with the storage and query costs it introduces."
lang: en
translationKey: design-immutable-records-with-append-only-data
publishedAt: 2024-11-11
tags:
  - data-modeling
  - databases
  - operations
draft: false
---
> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A single mutable row is often the easiest way to answer “what is the current state?” It can also erase the path that produced that state. When operational history must be synchronized, inspected, or explained, appending immutable records can be a better fit—but only if the resulting data volume and read complexity are acceptable.

The decision is visible in a repayment flow. Suppose a repayment fails on August 2, is retried daily, and succeeds on August 7. There are at least two reasonable ways to store that process. Neither is a universal answer; each spends complexity in a different place.

## One row makes current state cheap

In a mutable design, one row can hold the repayment's status and an unpaid-attempt count. Each failed retry updates the status and increments the count. When payment finally succeeds, the same row changes to `SUCCESS`.

This representation is compact. Reading the present status can require only that row. The amount of stored data does not grow with every retry, and APIs that primarily need the latest result have a straightforward query.

What disappears is the sequence. A count may tell us that several failures occurred, but the row does not show each attempt or the exact transition to success. A separate history table can restore that information, but then the system has already acknowledged that current state and operational history have different storage needs.

Updates also matter when data is copied elsewhere. If the main database feeds a search system or a data store for analysis, every state change must reach that destination. A missed final update could leave the replica showing a failure after the main row has changed to success. Detecting and repairing missing updates adds operational work.

## Append records that describe what happened

An append-only alternative first separates repayment from delinquency. The scheduled repayment attempt ends in failure. That failure creates an overdue process, which can have its own records and retry dates.

After the August 2 failure, an overdue record can be inserted with a failed result and August 3 as the next target date. If the August 3 retry also fails, another record is inserted for the next attempt. Records continue to accumulate until the retry succeeds. Existing rows are not rewritten to tell a new story; each inserted row preserves one step in the story.

This structure makes the history visible in the primary data itself. An operator can see when retries occurred and how the process moved toward resolution. Downstream synchronization can also follow inserts rather than tracking repeated mutations to the same row. That can make missing data easier to reason about because the expected unit of transfer is an immutable record.

“Immutable” here describes the storage approach for these operational facts. It does not mean that every table or every domain must forbid updates. The useful boundary comes from the lifecycle: a completed attempt is a past fact, while the next scheduled attempt is a new fact.

## The write model charges the read side

Append-only storage does not remove complexity. It relocates it. The mutable row carries an immediately available current state; an append-only history may require the reader to derive that state.

To answer whether a repayment is still overdue, the application may have to read both the repayment and overdue data, identify the latest relevant record, and distinguish an unresolved failure from a completed recovery. Indexes and carefully shaped queries can help, but the implementation is still more involved than reading one status column. A growing history can also increase the scan range.

Storage grows with the number of attempts. If overdue cases are rare and most repayments succeed immediately, the extra rows may remain a reasonable cost. If failures are common or retries are frequent, the same design can create substantial volume. The assumption about failure frequency is therefore part of the design, not a footnote.

## Choose from workload and operational needs

Before adopting append-only records, make the trade-off testable:

- How often does the process retry, and how many rows can one case create?
- Do operators need the sequence of attempts to be visible without reconstructing a history elsewhere?
- Must changes be synchronized to search or analytical storage?
- Which queries need current state, and how will they derive it efficiently?
- How will the team detect a missing record or an incomplete process?

If reads overwhelmingly need only the latest status and history has little operational value, a mutable row may be the smaller choice. If the sequence itself is valuable and repeated updates make synchronization or investigation fragile, appending facts can justify its cost.

The point is not to declare inserts superior to updates. It is to decide which information must remain visible and where the system can afford complexity. Preserve history deliberately, estimate its volume, design the current-state query, and verify both paths against the actual failure pattern of the service.
