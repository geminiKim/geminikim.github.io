---
title: "Give Cross-Domain Behavior to the Domain That Owns It"
description: "Before placing a caller-owned interface across modules, identify which domain owns the action and let callers depend on that capability."
lang: en
translationKey: assign-cross-domain-actions-by-ownership
publishedAt: 2024-02-02
tags:
  - backend
  - domain-modeling
  - modularity
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

An order completes, so product stock must be checked and reduced. One possible design is to define an interface in the order package and implement it in the product package. That can work in some cases. Before extracting that interface, however, I would ask a more basic question: who owns stock behavior?

If checking and decrementing stock are central product capabilities, product should offer them. Order can orchestrate the purchase by calling product. The dependency then follows the business responsibility instead of making product implement a concept named by order.

## Test ownership with a second caller

The order example is easy to overfit. Imagine a reservation flow also needs to reserve or reduce product stock. If the stock operation is modeled as an order-specific interface, another caller tends to create another wrapper for the same behavior. The repetition is a signal that the action may not belong to either caller.

Putting a stock handler or equivalent capability in product gives both order and reservation a stable place to ask for stock work. The exact name and operations depend on the real policy. The important point is that stock remains close to the concept for which it is essential.

This does not mean every collaboration method belongs to the callee. There are genuine cases where a caller needs an interface expressing its own requirement and another module supplies an implementation. With only a hypothetical example, that distinction cannot be settled universally. Define the domains and the action first; choose the interface direction afterward.

## Let module dependencies tell the same story

Packages can tolerate more ambiguity because everything may compile inside one project. Module boundaries expose the problem. If an interface lives in order and product implements it, product must know order. Ask whether that statement makes business sense: does product perform an order operation, or does order ask product to change stock?

For the stated example, the second sentence is more natural. The order module depends on a capability of the product module. Product does not need to import order to manage its own stock.

At larger scale the same ownership may appear as an organizational boundary. A product team can expose an API, and an order team can call it. The transport has changed, but the responsibility has not: product owns stock, while order owns the purchase flow.

## Coordination is still a responsibility

Assigning stock to product does not make order disappear. Order still decides when stock must be checked or reduced as part of completing an order. It coordinates the overall use case and handles its own state. Product enforces the stock behavior it owns.

This split also makes change easier to reason about. A new stock rule changes product. A change to the sequence of ordering changes order. If reservation needs the same capability, it depends on product rather than duplicating an order-shaped abstraction.

Cross-domain code is not placed by asking which class calls first. Start with the meaning of the action, its likely callers, and the domain that would still own it if one caller vanished. Then make the dependency graph express that answer.