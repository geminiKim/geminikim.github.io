---
title: "Provider Identity and Authentication Boundaries for Platform APIs"
description: "How a small platform API resolves provider keys into a domain identity, separates tenant data, and chooses an authentication boundary that fits its scale."
lang: en
translationKey: design-provider-identity-and-auth-boundaries
publishedAt: 2024-01-19
tags:
  - api-design
  - backend
  - architecture
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A platform API needs to know which provider is making a request. That identity determines which provider's reviews are written or read, so it should be available to the use case without every controller repeating lookup code.

In this project, the mechanism is intentionally small. The caller sends two issued keys in headers. A Spring `HandlerMethodArgumentResolver` reads them, looks up the provider in the database, and supplies a `Provider` object to the controller method. The controller passes that identity into the business flow, where its ID scopes storage and retrieval.

## Provider is a business identity

The term “provider” sounds more elaborate than the implementation. Here it means the party using the platform API. Two stores can use the same review capability, but one store's reviews must remain distinct from the other's. The provider ID supplies that partition.

Because providers are registered and managed by the service, `Provider` is treated as a domain object. Exposing it as a controller argument does not violate this project's dependency direction: the API layer already depends inward on the domain. The domain does not depend back on the controller.

A team that wants a more explicit presentation boundary could resolve a request-side identity and convert it to `Provider` before calling the use case. That extra type can show the transition between layers. In this small design, it would add a distinction that the current rules do not require, so the domain object is passed directly.

## Keep the current authentication as small as the system

Each request currently performs a database lookup. The traffic is small enough that this is acceptable. If the lookup becomes material, a memory cache is one possible next step, but there is no reason to add it before the load calls for it.

The same restraint applies to server boundaries. For a larger system, I often prefer authentication at an edge such as a gateway. The gateway verifies the external credential, then sends an already identified user or provider ID to private backend servers. Those backend services can focus on their domain work instead of repeating authentication calls or carrying Spring Security configuration.

That design depends on an important condition: backend servers must not be directly reachable from outside, and internal requests must be trustworthy within the chosen network design. It also costs more infrastructure. A gateway, an authentication service, and a separate domain API are excessive for a small project whose credential check is simple.

So this project does not pretend to have that architecture. Its argument resolver is effectively the local authentication boundary: it reads the keys, resolves a provider, and continues. The simpler deployment wins because the current problem is small.

## Separate the responsibility even when it shares a process

Identity resolution and business behavior are different responsibilities even if they run in one application. The resolver answers, “Which provider is calling?” The business code answers, “What may this provider read or change?” Keeping that distinction visible makes a later move to a gateway possible without forcing it now.

The useful architecture is the one that fits the system in front of us. For this platform API, headers, a resolver, and a database lookup are enough. If scale or deployment changes, the authentication boundary can move outward while the use cases continue to receive the same meaningful identity.