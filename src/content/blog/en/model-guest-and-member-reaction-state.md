---
title: "One Read Model for Guests and Members"
description: "Return public reaction counts and member-specific state through one read flow while keeping optional identity distinct from required authentication."
lang: en
translationKey: model-guest-and-member-reaction-state
publishedAt: 2024-05-26
tags:
  - api
  - authentication
  - architecture
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A reaction button needs two answers: how many people reacted, and whether the current person did. The first can be public while the second only has meaning for a signed-in member. If the read endpoint accepts only an authenticated user, guests lose access to a count they should be able to see. If every endpoint silently turns a missing identity into a guest, operations that truly require membership may become ambiguous.

The practical design problem is to share the read flow without erasing the difference between optional and required authentication.

## Start from the response the screen needs

To let a client render and toggle a reaction, the response can contain a total count plus a boolean such as `reactedByMe`. A guest receives the same response shape as a member: the count is available and the personal flag is false. A signed-in member receives the count and a flag calculated from that member’s reaction record.

This state must be available before implementing cancellation cleanly. The client needs to know whether pressing the button should call the add operation or the remove operation, and whether to render the icon as filled. Requiring login to change a reaction does not imply requiring login to read the public total.

One tempting solution is a separate guest endpoint. That can be correct when guest and member behavior are genuinely different. But when both paths return the same resource and differ only in optional personalization, it creates another implementation path and can bind the backend structure to two UI states.

## Make optional identity an explicit boundary type

At the HTTP boundary, distinguish two concepts instead of overloading one:

- an authenticated user argument for endpoints that must reject guests;
- a guest-or-user argument for endpoints that allow anonymous access but can personalize the result when identity exists.

An argument resolver can inspect the authentication cookie. For the second concept, a missing cookie resolves to a guest representation; a valid cookie resolves to the member’s ID. The controller then receives an explicit value describing the contract of that endpoint. The count query is unchanged, and the presentation layer combines it with the user-specific flag.

The original implementation represented a guest with an ID such as `-1`. Because no real user has that ID, the ordinary reaction lookup returns no row and therefore `false`. This lets the same lookup run for guests and members while keeping the inner query simple. It depends on that value never belonging to a real user.

## Do not weaken member-only endpoints

It is easy to put guest fallback into the existing authenticated-user resolver and let every missing cookie become the sentinel. That removes a class or two, but also removes a useful guarantee. A private reaction list, for example, should not proceed as if an anonymous visitor were a strange kind of member.

Keeping two resolver types makes the policy visible in each controller signature. Code that receives an authenticated user may assume identity exists. Code that receives guest-or-user must handle the public path. In the implementation shown here, only a missing cookie becomes a guest. A present but manipulated value, or one that no longer identifies a user, remains an authentication failure.

## Reuse behavior, not accidental UI branches

Inside the read flow, the logic can remain ordinary. Count active reactions for the target. Look up an active reaction for the resolved member ID. If there is none—or the caller is a guest—return `false`. Assemble both values in the response model at the presentation boundary.

This arrangement avoids duplicating the domain query merely because a screen can be viewed in two authentication states. It also preserves the important distinction at the edge: some reads are public and optionally personalized; other actions are member-only.

The pattern is not mandatory for every service. Separate endpoints may be clearer when guest and member behavior truly differs. The decision should follow that behavior. When the only variation is the presence of personal state, one read model and an explicit optional-identity type keep the implementation small without pretending that guests and members are the same.
