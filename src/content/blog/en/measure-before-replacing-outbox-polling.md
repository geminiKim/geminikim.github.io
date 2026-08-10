---
title: "Measure Before Replacing Outbox Polling"
description: "Evaluate outbox polling with realistic load tests, then consider a simpler application-level delivery path before adopting log tailing."
lang: en
translationKey: measure-before-replacing-outbox-polling
publishedAt: 2024-08-22
tags:
  - architecture
  - performance
  - events
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Transactional outbox polling can raise an uncomfortable question: are the open database connections and locks created by the scheduled batch already a performance problem, or will replacing the mechanism add complexity before it is needed?

There is no useful answer based only on the name of the pattern. Start by measuring the current design under the traffic shape the service actually expects. Then inspect whether the polling implementation is holding database resources longer than its job requires. Log tailing is one possible direction, but it should not become the automatic next step merely because polling sounds inefficient.

## Define “safe enough” with a load test

For a service without large traffic, the current polling approach may be adequate. “May” matters here: adequacy needs a testable boundary.

Suppose the current traffic level is represented as 100. Run a test at that level, then test an illustrative spike to 300. The exact multiplier is less important than matching the service’s behavior. A service affected by a major sporting event has a different curve from one that jumps after an online creator mentions it. Understand whether traffic rises gradually, follows a known event, or arrives as a sudden spike.

The result should tell the team how much load the present design can tolerate and where it begins to struggle. That knowledge is useful before an incident. Waiting for production to fail is not a sound way to discover the limit, but predicting every future problem is unnecessary as well. Model plausible growth and spikes, test them, and expand the architecture as the evidence changes.

## Check what the poller is actually holding

The statement “polling keeps a database connection open” can hide several different implementations. Break the work into its real steps:

1. Read pending events.
2. Distribute or deliver them.
3. Update the processing result.

The database connection is needed for the reads and updates. If event delivery itself does not require database work, the connection may not need to remain open during that part. Before replacing the entire mechanism, inspect the transaction and connection boundaries and shorten them where possible.

The same applies to locking. If one scheduled batch serializes all work, consider whether the batch can process work in parallel. This is not a guarantee that parallelism solves every locking problem. It is a prompt to verify whether the current bottleneck comes from the outbox pattern or from the way this particular worker is structured.

## Consider immediate delivery with batch recovery

For a smaller system, there may be a simpler application-level variation. In the thread handling an API request, save the event to the database and complete that transaction. Then hand the event to an asynchronous thread for immediate delivery. If delivery succeeds, update the stored event. Keep the scheduled batch for failed deliveries instead of making it the path for every event.

That changes the role of polling. The batch becomes a recovery mechanism rather than the only delivery mechanism:

1. The request transaction records the event.
2. An asynchronous path tries to send it immediately.
3. A successful attempt updates its state.
4. The batch retries the events that were not delivered successfully.

This is a candidate design, not a universal prescription. The full situation behind the original concern may contain constraints that are not visible here. The team still needs to validate transaction boundaries, delivery behavior, failure handling, and load in its own application.

## Add log tailing only when the evidence justifies it

Log tailing introduces another way to move events by reading database logs, potentially with additional components in the middle. That can be a valid option, but it carries concepts and operational details the team must review and support. Without direct experience and the service’s measurements, there is no honest universal threshold for when to switch.

The practical default is therefore conservative. Measure the polling path against realistic traffic. Make sure connections and locks are scoped to the work that needs them. Explore an application-level immediate-delivery path with batch recovery if it fits the scale. If those options fail the tests or the traffic pattern outgrows them, the team will have concrete evidence for introducing a more complex mechanism.
