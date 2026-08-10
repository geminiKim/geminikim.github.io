---
title: "Before Fixing Circular Dependencies, Fix the Domain Model"
description: "Resolve confusing ownership and concept boundaries before using interfaces or dependency inversion to treat an apparent circular reference."
lang: en
translationKey: fix-domain-boundaries-before-circular-dependencies
publishedAt: 2024-10-15
tags:
  - domain-modeling
  - architecture
  - dependencies
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

When order, delivery, and a delivery add-on seem to depend on one another, a circular dependency is an easy diagnosis. The quick treatment is often an interface: invert one arrow, make the modules compile, and declare the cycle broken.

That can repair a dependency graph while leaving the harder problem untouched. If a delivery operation receives order information but returns an object that the team calls either an order concept or an add-on concept, ownership is already unclear. Before introducing another abstraction, ask what each operation actually means and which concept owns its result.

## Read the signature as a statement about ownership

Inputs may legitimately come from an earlier concept in a business flow. An order happens, then a delivery is reserved. Passing order information into delivery can therefore be natural. The conceptual flow and the code dependency graph are related, but they are not a one-to-one diagram.

The output deserves closer scrutiny. A delivery reservation operation should normally return a result expressed in delivery terms. If it returns an order object, perhaps the operation does not belong to delivery. If it returns a delivery add-on record whose storage is owned elsewhere, perhaps the boundary has been drawn through one responsibility.

This is not a universal rule that forbids every cross-concept type. It is a diagnostic question: can the input, behavior, and output be explained as one coherent responsibility? A function signature that crosses vocabularies without a clear reason reduces reuse and makes the package name a poor guide to the code's real ownership.

## An interface cannot correct confused concepts

Dependency inversion is valuable when there is a meaningful boundary and a reason to isolate implementations. It does not change the semantics of a confused contract. An interface that accepts delivery reservation data and returns an unrelated concept preserves the same ambiguity behind a more abstract name.

In that situation, removing the interface temporarily can make the design easier to see. First make the concrete flow intuitive. Give each operation inputs and outputs that match its responsibility. Once the behavior is understood, extract an interface if the boundary or varying implementation earns one.

This order avoids using abstraction as camouflage. The goal is not to reject interfaces; it is to let a clear model determine where they help.

## Do not confuse conceptual walls with layers

A complaint that one dependency “jumps over two walls” may assume domain boundaries behave like stacked application layers. They do not have to. The same set of concepts can be enclosed differently: an add-on may live inside the delivery boundary, or delivery and its add-ons may share a wider wall while remaining distinct concepts within it.

Arrows in a concept map explain business flow or knowledge. Arrows in a module diagram express compile-time dependency. Treating them as the same picture can create a violation that exists only because the diagram was interpreted too literally.

Start by drawing ownership without forcing every noun into its own module. Then separately decide which boundaries need technical enforcement. A concept can be named and modeled without receiving an independent package wall, module, or dependency direction on day one.

## Delay a split that the business has not earned

“Delivery add-on service” contains a useful clue: the repeated delivery language may mean the add-on still belongs inside the broader delivery concept. If it is small, hidden beneath the main reservation behavior, and not something the wider business must coordinate directly, separating it early may expose an implementation detail as a top-level domain.

Future growth alone is weak evidence for a boundary. Begin with delivery as the larger concept and keep the add-on inside it. If operations, rules, ownership, or change patterns later show that the add-on has an independent life, the team can redraw the boundary with evidence.

The opposite conclusion may also be correct in a richer domain. The point is to earn it from business meaning rather than from the existence of another class or table. With only a partial code example, the exact answer must remain conditional.

## Reframe the review before changing dependencies

When a suspected cycle appears, review the model in this order:

1. Name the business sequence in plain language.
2. Identify who owns each created or returned concept.
3. Check whether every operation's input, behavior, and output tell one coherent story.
4. Group closely related concepts before drawing hard walls.
5. Only then choose module dependencies and interfaces.

Sometimes this process reveals a real circular dependency that still needs restructuring. Other times it shows that no cycle existed in the relevant code, only an unclear concept assignment. In both cases, fixing the language and ownership first produces a dependency solution that future maintainers can understand instead of merely one that satisfies the compiler.
