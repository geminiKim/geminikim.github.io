---
title: "Find Domain Boundaries Through Concept Lifecycles"
description: "Compare creation, reads, changes, and deletion to judge cohesion, coupling, and boundaries among products, orders, payments, shipping, and settlement."
lang: en
translationKey: domain-boundaries-through-concept-lifecycles
publishedAt: 2025-03-09
tags:
  - domain-modeling
  - architecture
  - data-modeling
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

To find a domain boundary, compare when concepts are created, read, changed, and deleted. Concepts that repeatedly move together are more cohesive. Concepts that merely reference one another may still have different lifecycles.

## Start with four lifecycle questions

List the concepts in the service and ask four plain questions for each pair:

- Are they created at the same moment?
- Are they normally read together?
- Can one change without the other?
- Does deleting one require deleting the other?

A product, its required item, and an optional option may align differently at creation. They may all appear in one read, yet the option can still have a weaker lifecycle because it is not required and changes independently. No single answer decides the boundary; the pattern across the four questions does.

## A relationship is not the same as one lifecycle

A wish or favorite references a product, but it is created by a user later. If the product disappears, the favorite may be removed, or the product may remain visible as unavailable in the user's list. Either requirement is possible. In both cases the favorite's lifecycle is not identical to the product's.

This distinction helps separate cohesion from coupling. Two concepts can influence each other without sharing one lifecycle or boundary. A cancellation can affect settlement, but that does not prove payment and settlement should share one lifecycle.

## Orders, payments, shipping, and settlement expose the differences

An order may exist before payment and may never become paid. Payment and cancellation can be closely related if cancellation is represented as a payment state. Shipping has its own sequence of preparation, transit, and completion. Settlement may occur after payment has otherwise finished and can follow a different schedule.

Putting all of these into one boundary because they form one business journey can make the model too dense. Splitting every noun is not better. Compare creation, reads, changes, deletion, cohesion, and coupling under the service's requirements.

## Requirements decide the final grouping

Write the concepts down, draw candidate bulkheads, and group only the close ones. Compare those groups through creation, reads, changes, deletion, cohesion, and coupling. The service's requirements decide whether the proposed lifecycles fit.

There is no universal commerce model hidden in this exercise. A product requirement can change whether favorites survive deletion, whether an order owns payment status, or how cancellation affects settlement. Lifecycle analysis does not hand over an answer. It gives the team a concrete language for revising boundaries when “these things are related” is too weak a reason to keep them together.
