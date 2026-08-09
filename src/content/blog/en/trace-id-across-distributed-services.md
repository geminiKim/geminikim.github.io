---
title: "Carry One Trace ID across Distributed Services"
description: "Logs become operationally useful when one request can be followed across HTTP calls and asynchronous events without exposing sensitive data or flooding storage."
lang: en
translationKey: trace-id-across-distributed-services
publishedAt: 2023-09-10
tags:
  - observability
  - distributed-systems
  - backend
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A logging question can become enormous very quickly. My practical starting point is smaller: can I find the important business event, and can I follow one request through every service that handled it?

I add logs where an operator will need to recognize a meaningful action. I also separate development-only detail from production records. A log that is convenient on a local machine may expose personal information in a shared production logging system. Put such detail behind an appropriate level and configure local and development environments deliberately rather than letting it escape by accident.

Volume matters too. Logs consume application time, network capacity, indexing work, and storage. I periodically check whether a noisy path is producing far more data than its operational value justifies. More lines do not guarantee better diagnosis.

Those are basic logging habits. Once an application is divided into several services, distributed tracing becomes the more important part of the answer.

## A user ID is not a request ID

Imagine a user tries to apply a coupon. The request enters a user-facing service, calls a coupon service, and then reaches another internal service. Each application writes its own logs.

Now the user reports that the coupon failed. If the only common field is `user_id`, investigation is awkward. The same user may have tried five times. Each attempt may produce several lines in each service. Searching by user finds a pile of related records, but it does not tell us which lines belong to the failed attempt.

One incoming request needs one trace identity. The service that receives or begins the request carries that identity to the next service, and each downstream hop continues to propagate it. Then the operator can search the trace ID recorded with the `500` error and see the path through all participating services.

A trace ID represents the whole distributed request. Span IDs distinguish individual operations or hops inside that trace. The logging system should include these values in a consistent, searchable form so a failure can be followed without manually correlating timestamps from separate applications.

The specific framework support can change. Libraries are replaced, observability integrations migrate, and propagation formats such as B3 or W3C Trace Context may be available. I care first that the selected format is propagated correctly through the systems we operate. A fashionable tracing library that loses context at one client boundary is less useful than a plain setup that preserves the chain.

## Propagation is an application boundary concern

HTTP clients often have integration points that inject and read trace context automatically. Use them, then verify them. Some internal client, custom protocol, or old library may not participate, and that boundary needs manual work.

The trace should appear in application logs as well as tracing storage. Operators often begin with an error log or customer report, not a trace visualization. If the error line contains the trace ID, it becomes the bridge from a local symptom to the whole request.

Do not invent a new identity at every service. That defeats the point. A service can create child spans for its own work while preserving the parent trace that connects the request.

## Keep the context through events

Synchronous HTTP is only the first case. A service may publish an event and return. Another service consumes the event later and performs follow-up work. The thread and call stack are gone, but the operational question remains: what happened after this original action?

Carry trace context or another clearly linked correlation identity in the event metadata. When the consumer starts its work, restore that relationship so the produced and consumed operations can be viewed in the same context. Otherwise the trace ends at the publisher and the most important asynchronous behavior becomes a separate mystery.

This does not mean every event handler must pretend to be the same synchronous call. The producer and consumer can have separate spans and timing. The requirement is that an operator can navigate the causal relationship.

Consider the coupon example again. The user service publishes an event; the coupon service consumes it and updates a coupon. When the update fails, we should be able to connect the consumer failure to the event and then to the action that produced it. Without propagated context, timestamps and business IDs become guesswork.

## Log for operation, not decoration

A useful setup should answer concrete questions:

- Which user-visible or business action was attempted?
- Which trace represents this specific attempt?
- Which service and span failed?
- Did the request cross a client or event boundary where context was lost?
- Is sensitive information restricted to the environments and levels where it is allowed?
- Is one noisy code path overwhelming the logging system?

Trace IDs do not replace business fields. An operator may begin with an order number, coupon ID, or user report, so important identifiers still need safe, deliberate logging. Those fields locate a group of possible actions; the trace ID separates one execution from another.

Distributed tracing also does not fix unclear logs. A perfectly connected trace full of vague messages still wastes time. Log the state or decision that matters, with enough context to recognize it, while avoiding personal or secret data that does not belong in the log store.

I approach this from operation because that is where the design proves itself. When a customer says one coupon attempt failed, I want to move from that report to one trace, follow it through HTTP calls and events, and see where the behavior changed. If every service has logs but nobody can connect them, we have collected data without building an investigative path.