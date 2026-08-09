---
title: "Put Circuit Breakers Next to the Failing I/O"
description: "Circuit breakers, timeouts, cache fallbacks, and remote-call policies belong near the implementation that performs the I/O, while domain code chooses the required behavior."
lang: en
translationKey: circuit-breaker-placement
publishedAt: 2023-12-09
tags:
  - backend
  - reliability
  - architecture
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

If circuit-breaker and cache fallback code is scattered through domain services, something is probably in the wrong place. These policies deal with the mechanics and failure modes of an external interaction. Put them as close as possible to the implementation that performs that interaction.

That advice does not depend on having a sophisticated module structure. In a modular project, the policy may sit inside a client or persistence module. In a package-based project, it can sit beside the concrete client or repository class. The important boundary is responsibility, not the number of Gradle modules.

A circuit breaker observes calls to an external dependency. A configured breaker can open when its failure criteria are met and short-circuit later calls for a period. Depending on the library and policy, the application may then return an error or invoke a separately defined fallback. The concrete client knows what counts as a call failure, which timeout applies, and what technical response came back. That is the natural place to configure the breaker.

## Keep the policy with the remote client

Suppose a domain service needs customer information from another system. The domain should depend on an operation such as `findCustomer`, not on a circuit-breaker annotation, exception counter, or timeout library. The adapter implementing `findCustomer` performs the HTTP call. It can own the connection timeout, read timeout, breaker, and translation from remote errors into an application-level result.

The same applies if no breaker library is involved. A hand-written fallback is still a remote-call policy. Code that catches a timeout and returns a local default belongs near the client that encountered the timeout.

Keeping these decisions together has practical advantages. A developer investigating a slow or failing call can find the timeout and fallback beside the I/O. A library change does not spread through business services. Tests for the client can exercise the failure mapping without constructing unrelated domain flows. Most of all, the domain code does not become coupled to the mechanics of one provider.

There is a limit. A remote client cannot decide whether an unavailable credit check means "reject the order," "leave the order pending," or "continue under a lower limit." That is a business decision. The client should report a meaningful result such as unavailable, timed out, or stale. The use case decides what that result means for the current operation.

The placement rule is therefore not "hide every failure in infrastructure." It is narrower: the mechanics of detecting and containing I/O failure stay with the I/O implementation; the consequence for the business flow stays with the business flow.

## A cache is another external boundary

Cache handling follows the same pattern.

A repository may try a cache first and read the database if the value is missing. It may also fall back to the database when the cache is unavailable. Both behaviors concern the way data is retrieved, so they normally belong in or beside the repository implementation.

A simple read-through flow might be:

1. Read the cached customer.
2. If it exists, return it.
3. If it is missing, load it from the database.
4. Optionally populate the cache and return the value.

Failure needs a separate decision. A cache miss is an expected data state. A cache timeout or connection error is a dependency failure. They may lead to the same database read, but operations and observability should still distinguish them. Otherwise a dead cache can quietly turn every request into a database request until the database also fails.

The repository implementation is well placed to enforce that policy because it understands both storage paths. It can decide whether to bypass the cache, open a breaker, or return an unavailable result. The domain service should not repeatedly write `try cache, catch error, query DB` around every operation.

Fallback data also needs an honest contract. Returning stale local data can be appropriate for a product description and unacceptable for a payment balance. The data boundary can provide `fresh`, `stale`, or `unavailable`; the use case chooses whether that quality is acceptable.

## When behavior changes by use case

The awkward case is when one use case wants a fallback and another must fail immediately. That often leads to domain code full of switches that enable or disable a breaker.

One option is to expose separate implementations or operations, such as a normal client and a client with fallback. The domain chooses the behavior it needs through an explicit port. Another is to pass a policy whose name expresses the business choice. I do not especially like multiplying implementation classes merely to satisfy a library annotation, but it can still be cleaner than putting circuit logic in every service method.

When fallback behavior must differ by context, I would need to see the actual code before deciding where the distinction belongs. One option is to separate implementations or operations so callers choose explicitly. The shared client can still own timeout detection and failure classification.

What I would avoid is a client that silently returns a plausible default for every caller. A fallback is part of the contract. Callers need to know whether they received authoritative data, stale data, or no data, especially when the consequence changes by context.

## Put each decision where its information exists

Circuit-breaker placement becomes simpler when we separate two questions.

The implementation knows how the dependency failed. It owns connection details, timeouts, error translation, breaker state, and technical fallback retrieval. The domain knows what the operation is trying to accomplish. It owns whether the current workflow may continue, wait, use stale information, or stop.

Keep those responsibilities close to the information they require. Do not scatter infrastructure policy through the domain just because annotations make it easy. Do not hide a business choice inside a generic client just because the client can return a default.

For the common case, put the circuit breaker, timeout, and cache fallback next to the concrete client or repository. Let the domain call an explicit operation and respond to an explicit result. The code then says both things clearly: where the failure is contained, and who decides what it means.