---
title: "Build APIs for Clarity, Not REST Purity"
description: "Use REST ideas where they improve an HTTP contract, but let client clarity, team consistency, domain boundaries, and change cost decide the API."
lang: en
translationKey: design-apis-for-clarity-not-rest-purity
publishedAt: 2024-03-20
tags:
  - api-design
  - rest
  - http
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

REST offers useful ideas for resource-oriented HTTP APIs. It is less useful as a purity test that overrides the people who must understand and maintain the contract.

I do not begin by asking whether an endpoint is fully RESTful. I ask whether the client can use it clearly, whether the team can apply the convention consistently, and whether the API reflects the business operation without forcing an awkward shape.

## Borrow rules; do not worship them

Resource names, HTTP methods, and status codes give teams a shared vocabulary. Use that vocabulary where it helps. Do not assume that a path containing a verb is automatically bad or that every successful creation must be represented one exact way regardless of the surrounding contract.

For example, an order cancellation endpoint may be easier for its consumers to understand with an explicit `cancel` action. If the team uses that form consistently and the operation is clear, the presence of a verb is not the most important defect to hunt.

The same applies to status codes. I commonly keep successful responses simple and use more varied client-error codes where they convey a useful difference. Another team may choose a more precise REST convention. What matters is that server and client agree and the behavior is predictable.

## An API is a contract between concrete parties

For a client-facing API, talk to the client developers. If a convention makes their integration confusing without protecting an important property, adjust it. Teams and companies often already have HTTP rules; they may not satisfy every interpretation of REST, but consistency across the product can be more valuable than local purity.

A platform whose API is itself the product has a stronger reason to preserve a carefully documented public convention. Changes have broad impact, so versioning and consistency become central. That is a different condition from an internal endpoint used by one client team.

Endpoint separation should follow meaningful capabilities. User and order operations can have distinct paths rather than being tunneled through one universal endpoint with an action parameter. That separation makes the contract easier to read and reduces accidental coupling. Still, the exact path cannot be decided from an abstract rule without seeing the use case.

## Keep the API outside the business center

The API is a specification presented to a client. Except where the API itself is the product, it is not the core business model. The business concepts and behavior should remain separable from HTTP paths and response shapes.

That gives us three different concerns:

1. the API contract exposed to a client;
2. the business behavior that carries the important rules;
3. the implementation that connects them and performs the work.

A clear boundary lets the API change for client usability without rewriting the domain. It also prevents a debate about plural nouns or status codes from replacing the harder work of designing the business behavior.

REST is good reference material. It records patterns that have made many HTTP systems easier to understand. Apply those patterns with a reason, keep the result coherent, and be willing to choose a simpler contract when the actual clients and operating context call for it.