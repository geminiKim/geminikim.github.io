---
title: "Reuse Below the Use-Case Layer"
description: "When use cases call one another for reuse, business changes spread and cycles follow. Compose above them or extract focused implementation components below them."
lang: en
translationKey: reuse-below-use-case-layer
publishedAt: 2023-09-09
tags:
  - architecture
  - backend
  - software-design
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A use case represents a business operation in the way I usually structure code. Because of that role, I am cautious when one use case calls another merely to reuse code.

The first reference looks harmless. Business flow B needs information that flow A already loads, so B calls A. Another flow then needs part of B. Soon the application has a chain of use cases whose business relationships are difficult to see. If the references grow in both directions, a circular dependency is the natural result.

There is a subtler problem even before a cycle appears. A changes because its own business requirement changed, but B has reused A as an implementation shortcut. The new behavior now reaches B even though nobody intended to change B's business. Reuse has coupled two policies that happen to share a step today.

I do not claim that a use case must never call another use case. There are situations where that relationship is honest. I treat it as a design decision, though, not as the default answer to duplicated code.

## Move composition up or capability down

When two business operations need to work together, I usually consider two directions.

The first is to move the composition one layer higher. A coordinator, facade, wrapper, or explicitly combined use case can call both operations. Its name should reveal that it combines business flows rather than pretending to be one of them. This keeps the original use cases from quietly owning each other.

The second direction is to extract the reusable capability below the use-case layer. If multiple operations need to load a user, create a focused `UserReader` or another implementation component with that responsibility. Both use cases can depend on it without inheriting each other's business policy.

The choice depends on what is actually shared. If the shared part is the coordination of two complete business decisions, composition belongs above. When several use cases need the same user lookup, it can be lowered into an implementation component such as `UserReader`.

Consider an authentication-related flow that needs user information. If the existing user use case exposes a method only because authentication needs it, the boundary is suspicious. Loading a user is not necessarily a user business case. It may be an implementation capability that a `UserReader` can express more honestly. We should also ask whether the authentication component should be responsible for loading the user at all.

Those questions are more useful than trying to make every reuse fit the same hexagonal diagram.

## Strengthen the implementation layer

I prefer a capable implementation layer because it gives business code small, reusable building blocks. A focused component such as `UserReader` can serve several use cases without making those use cases depend on one another.

This does not mean turning every repository call into a wrapper on day one. It means noticing when a lower-level operation has its own stable responsibility and several business flows need it. Extracting at that point reduces coupling without moving one use case inside another.

The result should make change propagation easier to predict. Changing how `UserReader` loads data may affect every caller at the implementation boundary, which is expected. Changing the rules of "register user" should not silently change "authenticate user" merely because one business flow reused the other.

## Architecture should follow the software's growth

The question that prompted this discussion came from studying hexagonal architecture, also known as ports and adapters. I am not saying that architecture is bad. I am skeptical of treating the complete shape as the learning goal before the software has a reason to need it.

I think software grows more like a living cell than a finished building plan. It starts small. As behavior accumulates, a domain module may become visible. A layered application may gain several external interfaces: HTTP, RPC, TCP, or other transports. At that point ports and adapters can solve a concrete problem by separating the stable application from those interfaces.

Applying the full structure at the beginning can lower productivity because the team spends time maintaining boundaries whose value has not appeared. Worse, an early boundary can freeze a misunderstanding of the business.

Implementation is part of the learning. Operate the service and watch where it changes. See which capabilities are reused, which policies move together, and which external interfaces multiply. The architecture then records knowledge gained from the software instead of guessing all of it in advance.

## A simple review test

When I see use-case reuse, I ask:

1. Is the caller intentionally composing two business operations?
2. Is it borrowing a lower-level capability that happens to be trapped inside another use case?
3. If the callee's policy changes, should the caller's behavior change too?
4. Will more references create a chain or cycle that hides the business flow?

If the business operations truly belong together, name the higher-level composition. If they only share implementation work, lower that work into a focused component. Keep the use case readable as a business decision.

Reuse is not successful merely because two methods now share code. It is successful when the shared boundary can change for one clear reason and the business flows remain understandable.