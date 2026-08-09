---
title: "Timeouts Are Product Decisions, Not Just Client Settings"
description: "Design timeout, retry, and recovery policies from the user's waiting budget and the uncertainty of each failure instead of applying one retry rule everywhere."
lang: en
translationKey: timeouts-retries-and-failure-propagation
publishedAt: 2023-11-16
tags:
  - backend
  - reliability
  - distributed-systems
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

When an external system times out, engineers quickly reach for familiar mechanisms: retry the call, save the failed item, run a scheduled job, or publish an event for later processing. All of them are used in real systems. None of them is a policy by itself.

The decision starts at the far end of the chain, with the person waiting for a result.

Imagine a web or mobile client calling an order server, which calls a payment system, which may call a card company, bank, or another upstream provider. Every link has its own connection and read timeouts. The payment system might allow 60 seconds because its provider can take 55 seconds. If the order server simply copies that 60-second value, the client still needs an answer to a more important question: what should the customer see while all of this is happening?

A timeout value without a user flow only tells us when one process stops waiting.

## Give every layer a waiting budget

One product may decide to keep the payment screen open for 61 seconds. Another may wait 30 seconds, move the customer to a pending screen, and poll for the result. A mobile app could stop showing a spinner after 15 seconds and promise a push notification. The server may continue processing after the synchronous client has left.

Those choices lead to different backend designs. A pending screen needs a status that the client can query. A notification flow needs a durable record of the unfinished work and a reliable way to deliver the final result. A synchronous flow needs the whole call chain to complete within the client's budget, with enough margin for network and application overhead.

The timeout numbers should therefore be derived from the experience we are offering, then reconciled with the limits of each downstream system. They should not be copied blindly from a library default.

The chain also needs clear ownership. If the client waits 30 seconds while the order server waits 61 seconds, that can be intentional. The client is no longer holding the user on one screen, but the server still has time to learn the payment outcome. The API must expose "processing" as a real state rather than pretending every request is immediately successful or failed.

## Connection timeout and read timeout mean different things

A connection timeout says the caller could not establish a connection within the allowed period. In some systems it is reasonable to set a short connection timeout, perhaps one second, and retry a small number of times. Even then, the retry needs a limit. A broken network or unavailable host should not hold every request thread indefinitely.

A read timeout is more uncomfortable. The connection was established and the request may have reached the remote application. The caller stopped waiting before it received a response. That does not tell us whether the remote operation ran.

This distinction matters most for side effects. Retrying a read-only lookup may be acceptable. Retrying a payment because the read timed out may charge the customer twice unless the payment system provides a reliable duplicate guard for the same transaction. Even if the downstream provider claims to have that protection, the order system should understand the contract rather than assume it.

For a payment whose result is unknown, I prefer checking the status through a stable transaction identifier. If the status cannot be confirmed immediately, keep it pending and reconcile it later. A scheduled process, an event, a batch job, polling, or a notification can all take part. The mechanism follows the required behavior.

## Do not turn recovery into more failure

Retries are useful for failures that are likely to be temporary and safe to repeat. They are dangerous when applied to every exception.

A practical policy distinguishes at least these cases:

- the connection was never established;
- the remote side explicitly rejected the request;
- the response was not received after the request may have been processed;
- the operation is safe to repeat;
- the operation changes state and its current outcome is unknown.

The policy also sets a total time budget and a maximum number of attempts. Otherwise one layer may retry while its caller also retries, multiplying traffic during an incident. A slow payment provider can then exhaust threads or connections in the order service, which makes an external failure become our outage.

Saving failed items is not enough either. We need to know what "failed" means. A definite decline can be terminal. An unknown result needs investigation or status lookup. An operation that is safe to repeat can enter a retry queue. Mixing all three in one generic failure table makes the scheduled job repeat work it should only reconcile.

The same care applies to what the user is told. "Payment failed" is wrong if the system merely stopped waiting. "We are checking the payment result" is less satisfying, but it is honest and gives the product a state it can recover from.

## Start from the current problem

There is no single production answer called "use retries" or "use a scheduler." Real systems use retries, failed-item storage, events, batches, polling, server push, app notifications, and text messages in different combinations.

The useful question is narrower: what is the current failure, what can we know after it happens, and what experience must the final user receive?

From there, set the waiting budget at each layer. Retry only a failure that is both likely to recover and safe to repeat. For an uncertain side effect, query and reconcile rather than firing it again. Persist enough state that a background process can finish what the synchronous request could not. Make the pending state visible to the client.

A timeout is not evidence that nothing happened. It is evidence that one caller ran out of patience. Good failure handling begins by keeping those two facts separate.