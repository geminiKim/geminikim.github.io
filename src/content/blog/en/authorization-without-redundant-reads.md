---
title: "Authorization Without Redundant Reads"
description: "Resolve the logged-in user once, keep access checks focused, and separate system-wide administration from channel-level permissions."
lang: en
translationKey: authorization-without-redundant-reads
publishedAt: 2024-07-06
tags:
  - authorization
  - architecture
  - testing
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Authorization code becomes harder to understand when it mixes three separate concerns: resolving the logged-in user, reading the resource, and deciding whether that user may access it. The result often includes database reads that repeat work already done at the boundary, plus permission concepts whose names hide different responsibilities.

Consider a channel with a simple policy. A public channel is available to any user. A private channel is available only to a system administrator or a subscriber. Everyone else receives a 403 response. The policy is small, but where each part runs changes both the query cost and the shape of the tests.

## Do not resolve the same user twice

Suppose the service receives a logged-in user identifier, then calls a user reader to fetch that user again. Before accepting that read, ask what the incoming value represents. If an outer layer has already authenticated the request and resolved a valid logged-in user, the inner flow should usually receive that resolved object, including the permissions it needs. Looking it up again adds work without adding knowledge.

I would resolve the user at the outer boundary and pass the result inward. This does not depend on Spring or on a particular number of layers. The important part is that authentication and user resolution happen once, before the access flow begins.

There is a caveat in this example: a public channel may not need a user at all. That can justify a flow that reads the channel first and resolves identity only for a private channel. In many applications, though, the logged-in user is already loaded once per request or cached. The right choice depends on that surrounding request path. The narrow rule is simply to avoid a second read when the caller has already supplied a trustworthy, resolved user.

## Let the validator decide, not report

Given the two approaches in the question, I would start with the one that reads the channel and delegates the access decision to a focused validator. In outline, the flow is:

1. Read the channel.
2. Ask the access validator to validate the channel and resolved user.
3. Return the channel if validation completes.

The validator can read subscription information when the public and administrator checks do not settle the decision. It does not need to return a Boolean for the caller to interpret. If access is forbidden, it can raise the exception that becomes a 403 response. If it returns normally, the service can continue.

That arrangement separates resource reading from validation without pretending that validation never needs data. The subscription lookup remains behind the validator, where it supports the permission decision. Tests can cover the channel read and access policy separately, and validator tests need only mock the subscription reader at that boundary.

## An authorized reader is also a valid shape

A separate validator is not the only reasonable design. If callers repeatedly need to read a channel only when it is accessible, that operation can become an explicit reader function: read the channel from the repository, check whether it is public, then check the relevant administrative permission and subscription, and return the channel only when one of those conditions passes.

Putting the complete operation in a channel reader can make the call sites simpler and prevent them from forgetting validation. Whether that is better depends on the layers already present and how broadly the reader is reused. Without seeing the full code, I would not turn either shape into a universal rule. The useful question is whether the boundary expresses a real operation and keeps its data access purposeful.

## Clarify what “administrator” owns

The more important issue may be hidden in the word `admin`. Is this user the manager of one channel, or a system-wide administrator who can cross every channel boundary? Those are different business concepts even if both can open the same private channel.

If system-wide administration is coupled directly to the ordinary user model, every user-facing flow may grow another `isAdmin` branch. A capability with no ordinary channel boundary can deserve a separate administrative path or role. By contrast, checking whether someone manages a particular channel naturally belongs to the channel-level access decision and requires that channel's identity.

The model is especially worth revisiting if the same object can simultaneously mean system administrator, channel manager, and subscriber. That overlap may be valid, but it should be deliberate. When the concepts are unclear, moving code between a service, validator, and reader will not make the implementation clean; it only relocates the ambiguity.

## Start with the smallest clear split

With only the described code available, my first version would resolve the logged-in user outside, read the channel once, and call a validator that performs only the remaining access work and throws on denial. It is a small split, easy to test, and it avoids an unnecessary user lookup.

I would then verify the meaning of administrator before polishing the classes. If it is a system-wide privilege, separate it from channel ownership. If authorized channel reads recur throughout the application, consider promoting the whole operation into the reader. The final structure depends on context, but redundant reads and blurred permission ownership are useful signals that the current responsibilities need another pass.
