---
title: "Avoid the Admin Common Module That Owns Every Domain"
description: "Keep admin features from reversing domain dependencies. Preserve service boundaries and accept small duplication while admin requirements continue to diverge."
lang: en
translationKey: avoid-admin-common-module-domain-coupling
publishedAt: 2025-10-26
tags:
  - architecture
  - backend
  - domain-modeling
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

An admin can read members, menus, reviews, last-login information, and other domains on one screen because operators need a broad view. That breadth does not make those concepts one domain. Turning them into an admin common module risks making every service depend on a tool whose job was to consume those services.

## Case one: service modules depend on admin common

This is the clearest dependency reversal. The common module knows every domain because the admin queries across them, then service modules import that common package to do their own work. A boundaryless operational view has become the center of the system.

In the assumed multi-module setup, I would avoid creating that module. Keep domain ownership in the services and let the admin assemble the data it needs. Existing lower-level data access may still be reused when it is already separated, but the admin's need to see everything is not a reason to relocate every model.

## Case two: several admins look similar

The same caution applies when the proposed common package serves several admin applications. A member console may require masking while a super-admin view does not. An internal operator and an external partner can ask for different behavior. The shared implementation then accumulates versions and consumer-specific functions.

Keep those implementations separate while their requirements diverge, even if that leaves some duplication. Consider sharing later only when a concrete common need appears. The test is the simpler history of actual need versus continuing divergence.

An ERP or operational solution may deliver the admin itself as the main product. That case deserves a different design discussion because the console is no longer just an internal view over customer-facing services. Even then, it does not follow that one generic module should own everything.

Small, separate implementations are easier to change than one large common package when only one admin's requirement moves. Cross-domain visibility is part of administration. Cross-domain ownership does not have to be.
