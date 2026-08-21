---
title: "When to Split Front-Office and Back-Office Systems"
description: "Decide whether front- and back-office systems belong together by comparing purpose, lifecycle, feature overlap, team workflow, and operational cost."
lang: en
translationKey: when-to-split-front-and-back-office-systems
publishedAt: 2026-03-01
tags:
  - architecture
  - modularity
  - team-practice
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

“Front office” and “back office” describe audiences, not necessarily architectural boundaries. A customer-facing system and an operator-facing system can have different screens and permissions while still changing as one product.

The decision to combine or separate them begins with their actual purpose. In the anonymous case discussed here, important details such as codebase size, history, and team structure were missing, so the criteria matter more than a single verdict.

## Compare purpose, lifecycle, and feature overlap

Start by laying the capabilities of the two systems next to each other. If the back office is mostly a more powerful view of the same features—using the same concepts and changing whenever the front office changes—the claimed separation may be weaker than the names suggest.

The boundary is more credible when each system has substantial capabilities of its own. An internal operations tool may need privileged interventions that should not appear in the customer-facing flow. It may also grow at a different pace and serve a different group. Some overlap is expected; the question is whether the overlap is nearly the whole system or only the shared center of two different products.

Size matters, but not by itself. A lightweight administration screen for toggles and basic settings may not justify a separate project. A large back office with its own broad function set and lifecycle may. The distinction should be visible in what the software does, not merely in a diagram.

## Use the team’s work pattern as evidence

Architecture and workflow can contradict each other. A small team may assign one developer to carry a feature through both front and back offices. If every feature requires coordinated edits across two repositories, separate releases, and repeated model changes, the boundary can impose friction without creating independent ownership.

In that situation, combining the projects or keeping them as modules in one repository deserves consideration. The speaker’s usual preference for a small team is to begin together, then split when differences in purpose, lifecycle, codebase size, or ownership become concrete. This is a starting preference, not a rule for systems whose history already justifies separation.

The opposite signal is a distinct team or workflow. In one example, a back-office area eventually grew enough to have its own team. At that point, a separate boundary matched how the organization worked. The structure became evidence of independent responsibility rather than a prediction made in advance.

Talk to the people doing the work. If they repeatedly cross the boundary for one task and the separation does not improve delivery, that cost is relevant. If each side can evolve around different responsibilities, keeping the split may remain worthwhile.

## Avoid a third boundary that only shares persistence code

Shared tables do not automatically require an MSA-style database split. In the small-team scenario described, with developers managing the schema directly and no separate database function, introducing another data boundary would add work before the existing application boundary was understood.

A separately versioned entity library can create a similar problem. The speaker had worked in a structure where two applications depended on a published entity package. Versions drifted, one application’s change forced coordination with the other, and the shared package became another release unit to manage. For this kind of small, tightly coupled system, that middle layer did not remove coupling; it gave the coupling a version number.

The clearer choices are to make the applications genuinely separate and manage each accordingly, or to combine the code where most changes already move together. A shared library should not be used merely to preserve the appearance of separation.

The practical order is architectural: first determine whether two purposes and lifecycles really exist, then choose the smallest operational boundary that matches them.