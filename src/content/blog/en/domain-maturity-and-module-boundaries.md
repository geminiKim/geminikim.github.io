---
title: "Do Not Split Modules Before the Domain Has Matured"
description: "Domain maturity comes from understanding policy, behavior, and operating reality. Let those lessons reveal module boundaries instead of freezing guesses too early."
lang: en
translationKey: domain-maturity-and-module-boundaries
publishedAt: 2023-11-24
tags:
  - architecture
  - domain-driven-design
  - backend
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

People sometimes ask what I mean when I say a domain is "mature." I am not talking about a formal level that can be measured with a checklist. I mean something more practical: how much of the policy, specification, behavior, and operating reality is really in our hands.

A team may have named its packages, drawn boundaries, and implemented every requirement it received. That does not mean it understands the domain yet. If the developers have operated a similar service, they have a better chance of recognizing the hidden rules. If the company has a domain expert who can answer questions, the chance improves again. Neither one guarantees a good model. They simply reduce the amount of guessing.

Experience matters because a domain is much larger than its nouns. Consider a review feature. Who owns the text after a customer submits it? Can the author edit it after a reply arrives? How many replies are allowed? Can replies have replies? What happens when the product is deleted or the order is refunded? A class named `Review` tells us almost nothing about these policies.

Domain maturity is the degree to which we understand those rules, have implemented them, and have watched them survive contact with real use.

## Opening the service is not the finish line

When neither the developer nor the company knows the domain well, we learn by building. Understanding improves when development begins, when the main flow works, and when the first release goes live. I would still hesitate to call the model mature at any of those points.

Operation changes the picture. Users do things we did not expect. A state transition that looked clean on a diagram may allow `A -> B -> C`, while an operator soon asks to restore `C -> A`. The written requirements may never mention that reversal. It appears only when a real customer has a real problem and someone must resolve it manually.

That kind of exception is not noise around the domain. It is part of the domain.

I sometimes use three months of operation as a rough point at which the first serious increase in understanding appears. It is not a universal threshold. Actual operation, not a fixed elapsed-time rule, reveals hidden policy. Observing real use, incidents, manual work, and policy changes is stronger evidence than development time alone.

Product managers and planners can prepare excellent requirements, but nobody can write down every condition in advance. Without someone who already knows the field, operation is the only reliable way to discover many of them. The longer we operate and pay attention, the more clearly we can say what the software does in the real world.

## A package name is not yet a module boundary

This matters when deciding whether to split a codebase into modules.

Suppose the initial requirements mention Q&A and reviews. The code naturally starts with `qna` and `review` packages. Once each package looks tidy, it is tempting to extract two domain modules. The directory structure appears to support the decision.

Then the product goal becomes clear: the company is building commerce. Q&A and reviews exist around products, customers, purchases, inventory, and operating policy. Depending on the system, they may be coherent parts of a commerce domain rather than independent domains with separate lifecycles. Extracting them too early can turn an initial vocabulary into a hard dependency boundary.

The problem is not that Q&A or reviews can never become modules. They may deserve that boundary if the product direction, ownership, change patterns, reuse needs, and operating experience support it. The problem is treating today's package shape as proof.

We often do not yet know what we are building. A company may first say, "We only need Q&A and reviews." Later it adds products, users, stock management, order history, and moderation because the actual product is commerce. If every early noun has already become its own module, the architecture can become a record of incomplete requirements rather than a model of the business.

## Let boundaries emerge from responsibility

I prefer to begin with packages and a structure that is easy to change. Implement the behavior. Keep responsibilities readable. Watch which concepts change together, which policies belong together, and which parts need genuine isolation. Move to modules when the boundary is understood well enough that enforcing it removes confusion rather than creating adapters around a guess.

Before extracting a module, I want to be able to answer questions like these:

- What is the purpose of this project, beyond the feature currently on the board?
- Which policies does this part own?
- What data and behavior must change together?
- Who operates it, and what exceptions do they handle?
- Does it have an independent lifecycle, or does it move with a larger capability?
- What dependency are we deliberately preventing by making the boundary physical?

If those answers are unclear, a package is cheaper than a module. It gives us room to learn without pretending there is no structure at all.

This is not an argument against modular design. It is an argument for earning the boundary. Modules are useful because they impose constraints. A constraint based on a well-understood responsibility protects the design. A constraint based on an early guess makes later understanding expensive.

Build, release, operate, and observe. Ask what role the software is actually playing, not what its first folder names implied. The domain model should become firmer as our knowledge becomes firmer. It does not need to get there first.