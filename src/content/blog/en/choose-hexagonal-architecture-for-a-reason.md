---
title: "Choose Hexagonal Architecture for a Reason"
description: "Choose hexagonal architecture when protocols, isolation, scale, or likely growth justify its extra structure—not because the label signals skill."
lang: en
translationKey: choose-hexagonal-architecture-for-a-reason
publishedAt: 2024-07-19
tags:
  - architecture
  - software-design
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Hexagonal architecture can make a system more complicated without making its design better. That happens when a team begins with the label, reproduces ports and adapters mechanically, and never explains what problem those boundaries solve. The resulting code may look architectural while leaving future maintainers with more indirection and no corresponding benefit.

The issue is not hexagonal architecture itself. The issue is choosing it as a badge of engineering ability or as a default answer. An architecture needs a reason grounded in the system being built: its interfaces, likely growth, required isolation, and maintenance burden.

## An architecture is not a skill multiplier

Low coupling, controlled dependencies, and dependency inversion matter. Hexagonal architecture is one way to pursue them, but it does not create sound implementation and design by itself. A developer who has trouble assigning responsibilities or designing clear flows will not automatically produce better code after adding ports and adapters. Those same problems can simply be spread across more files and interfaces.

Conversely, a well-designed layered system can already keep responsibilities and dependencies under control. It can also be extended when the requirements become clearer. If every architectural change is prohibitively difficult, it is worth examining the underlying implementation and design rather than assuming that one missing architecture label caused the problem.

This matters especially in a company. The code becomes a company asset that other people must maintain for a long time. The cost of an unnecessary abstraction is paid by reviewers, new team members, and whoever has to change the system after its original author leaves. A fashionable name does not compensate for that cost.

## Demand a concrete reason for every boundary

My experience with the approach may be incomplete, so these are selection criteria rather than universal rules. One plausible reason to choose hexagonal architecture is a system that must accept several protocols. The same business capability might be reached through gRPC, HTTP, TCP, or another interface. In that situation, making ports and adapters explicit can help isolate those variations from the core flow.

Stronger isolation can also be a real benefit. A team may have evidence that the service will grow toward several interfaces, or that replaceable boundaries will matter enough to justify the structure. The important part is being able to explain that expectation. “We need this boundary because these protocols vary” is a reason. “We may soon add these interfaces, and this design gives us a controlled place to do it” is a reason.

A small service that communicates through one ordinary path presents a different trade-off. If it uses a straightforward HTTP entry point and a database, adding a full set of ports and adapters may only increase the amount of code to navigate. Even a small coupon service can be built that way, but the team should still be able to answer why the extra isolation is valuable at that size. Popular books or other teams’ choices are not enough.

## Start with a structure you can evolve

There is no need to predict the final architecture before the implementation and domain are understood. A simpler layered design can be a responsible starting point when it expresses the current flow clearly. In my own experiments, moving a well-built layered structure toward a hexagonal one was feasible. That does not prove every migration will be easy, but it does challenge the idea that the most elaborate target must be installed from the first day.

The safer requirement is evolvability. Keep responsibilities clear, prevent careless dependency spread, and avoid tying business decisions to transport details without a reason. These qualities leave room to introduce stronger boundaries when real variation appears. They are useful regardless of what architecture name the team eventually chooses.

This also preserves the value of learning. Trying an architecture out of curiosity is reasonable in a personal experiment. Production work has a different burden: the team needs to explain why the structure helps the product and why its continuing maintenance cost is acceptable.

## Match the structure to the building

A small building and a very tall building do not require the same construction approach. Software deserves the same distinction. Choosing a large-system structure for a small problem does not make the problem more important; it can simply consume more effort than the result needs.

Engineering is the work of achieving the intended result with enough structure, capacity, and safety—not the maximum amount available. Throwing excessive infrastructure at modest load would avoid some hard choices, but it would not demonstrate careful engineering. Architecture should also be treated as a resource whose cost must earn its place.

Before choosing hexagonal architecture, ask four direct questions:

1. Which concrete protocols or interfaces need to vary?
2. What isolation does this service require, and why?
3. Is the expected scale or growth credible enough to pay the complexity now?
4. Can the team maintain and explain every added boundary?

If the answers are specific, hexagonal architecture may be a sensible choice. If they are vague, begin with the smallest design that expresses the business flow clearly and can be changed later. The goal is not to avoid architecture. It is to make every architectural decision carry its own reason.
