---
title: "Create a Deliberate Messy Boundary to Keep the Core Clean"
description: "Contain unavoidable complexity in an explicit outer boundary so limited engineering time can protect the system's core concepts."
lang: en
translationKey: contain-messy-code-at-system-boundaries
publishedAt: 2024-10-08
tags:
  - architecture
  - boundaries
  - maintainability
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Time, people, and the condition of existing code are always limited. If every part of a system cannot receive the same amount of attention, the team has to decide where clean structure matters most and where some disorder can be accepted.

Calling one area a “trash can” is a deliberately rough metaphor for that choice. The point is not to write bad code on purpose. It is to keep unavoidable mess in one visible place instead of allowing it to spread across the entire system.

## Protect the concepts the business owns

Consider a system with one area for collecting and cleaning data from external partners and another for the product concepts the business itself owns. The external side changes for reasons outside the team's control. The concept side is the part the team most needs to understand and protect.

When those areas are not separated, it can be difficult to tell which code deserves the strongest design effort. Drawing a module boundary makes the priority visible. Under a tight deadline, the team may tolerate more roughness in the external collection area while keeping the core product concepts clear.

This is a trade-off, not a claim that the external area does not matter. It still has to do its job. The distinction is about where limited design time should go first.

## A trash can is useful because it contains the mess

Without a designated place, awkward code does not disappear. It lands wherever someone can fit it, and eventually the whole codebase becomes difficult to read. The value of the trash-can metaphor is that only the trash can becomes dirty.

The boundary therefore has two sides:

- accept that one area may remain less polished when resources are tight;
- prevent that compromise from spreading into the core area.

If both sides become equally tangled, the trade-off has failed. The team accepted the mess but did not protect anything in return.

## Do not turn the metaphor into permission

A “messy boundary” is not permission to make code impossible to operate or change. Nor does it mean that the area must remain messy forever. If time and people become available, it can be improved too.

The metaphor is useful at the moment a real choice has to be made. Suppose only one hour remains and the team can clean either the external integration area or the core concepts. In this example, the core receives the attention first. With more time, both can be improved.

The exact priority depends on the software. What matters is making the choice explicit. Identify the area the business most needs to preserve, draw a boundary around it, and let the unavoidable compromise accumulate somewhere controlled rather than everywhere at once.