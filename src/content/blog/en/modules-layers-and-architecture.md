---
title: "Modules, Layers, and Architecture Are Different Decisions"
description: "Separate module boundaries from code-level layers and architectural style, then extract modules only when implementation needs stronger constraints."
lang: en
translationKey: modules-layers-and-architecture
publishedAt: 2024-08-02
tags:
  - architecture
  - modules
  - layering
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A team can separate its domain code into a dedicated module and still use layered architecture. It can keep everything in one module and implement either layered or hexagonal architecture. It can also split a database module without changing the way responsibilities are layered inside the code.

These structures may be related, but they are not the same decision. Treating them as one leads a team to ask which module layout an architecture requires. The more useful questions are what roles the code needs, which dependencies should be allowed, and whether any of those rules now need a module boundary to enforce them.

## A code layer is not necessarily an architectural layer

When I talk about layers in implementation, I often mean code-level roles rather than layered architecture as a named style. Presentation, business behavior, and implementation details still need understandable places even when the surrounding architecture is hexagonal. Ports and adapters do not remove the internal distinctions in the code.

That distinction matters because the word “layer” can make two separate discussions sound identical. One discussion is about the architecture's overall flow. The other is about how responsibilities are arranged inside the implementation so that a developer knows where a change belongs. A single module can express both. Multiple modules do not guarantee either.

The quality of those code-level divisions deserves attention first. If responsibilities are unclear in the implementation, reproducing their names as module boundaries only makes the uncertainty harder to change.

## Architecture does not prescribe a module layout

Layered and hexagonal structures can both live in a single module. In the hexagonal case, ports and adapters can be organized inside it. Conversely, a multi-module project may still follow an ordinary layered flow. Extracting a domain or database module says something about dependency boundaries; it does not, by itself, select an architectural style.

A module layout can support an architecture. For example, separate modules may prevent unwanted dependencies and make a chosen boundary stricter. That is a legitimate use of modules, but the direction of reasoning is important. The team first decides which boundary matters, then uses a module when stronger enforcement is useful. The architecture does not automatically demand one predetermined module tree.

This also leaves room for several valid arrangements. A project may isolate a domain with narrow dependencies. Another may allow more dependencies and combine presentation, business, and implementation roles to favor faster work. A third may separate the business and implementation roles more strictly. The same architectural ideas can survive across these arrangements because the trade-off lies in enforcement and working style, not in whether the architecture exists.

## Extract a module after the need becomes visible

The implementation should evolve far enough for cohesion and boundaries to become visible. Packages may be sufficient at first. A module becomes useful when the package structure no longer expresses or protects an important rule well enough.

That need can appear in concrete ways:

- A newcomer can easily place code in the wrong area.
- The team wants allowed dependency directions to be explicit.
- A clearer boundary would make the correct working location easier to find.
- Domain or business code needs stronger protection from surrounding implementation details.
- Presentation-facing code should remain visibly isolated rather than feel mixed into the core.

These are reasons to introduce a module because they describe a problem the boundary will solve. Merely being able to say that a project uses multiple modules is not such a reason. Creating another module is a technique, not evidence that the implementation is well designed.

## Choose the constraint that fits the work

I sometimes use a compact multi-module pattern when speed matters because it matches how I already know how to implement the code. That makes it an efficient personal default, not a universal minimum. I rarely choose a single module, but I do not consider using one a problem. It would be equally strange to claim that a project is defective merely because it is not multi-module.

Start with the implementation: make its responsibilities and code-level layers coherent. Then ask whether packages communicate those decisions well enough. If mistakes, dependency drift, or mixed responsibilities create a real need for stronger isolation, extract a module around the boundary you can already explain.

Modules, layers, and architecture can reinforce one another. They are still separate levers. Keeping that distinction clear lets each one solve the problem it is actually suited to solve.
