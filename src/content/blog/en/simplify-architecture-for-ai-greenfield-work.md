---
title: "Simplify Modules and Layers for AI-Assisted Greenfield Work"
description: "Explore fewer modules, interfaces, and layers for AI-assisted greenfield work, while protecting clarity, quality, and incremental treatment of legacy systems."
lang: en
translationKey: simplify-architecture-for-ai-greenfield-work
publishedAt: 2026-02-08
tags:
  - architecture
  - ai-agents
  - engineering-practice
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A project template built for years of hand-written small services may not be the best template for work done heavily with AI coding agents. That is a hypothesis under active testing, not a proven architecture rule.

The experiment starts with new projects. Existing codebases have conventions, dependencies, and history that cannot be erased because a different structure might be easier for an agent. Greenfield work provides room to ask whether fewer modules, interfaces, and layers can reduce the context an agent must carry while keeping the code clear.

## A mature template can become extra context

A long-used template often represents hard-won decisions. It may separate clients, storage, configuration, entities, and application code into modules because that shape worked across several small-service launches.

When an AI agent works inside the same structure, every boundary may require more explanation. Module-specific rules have to be supplied as context. A large number of interfaces can also give the agent more places to choose the wrong abstraction or produce work that does not fit the surrounding code.

These are observations from ongoing personal experiments, not measurements of productivity or defects. They are enough to question whether a template optimized for manual work also maximizes AI-assisted work, but not enough to declare that the older structure has failed.

## Fewer boundaries are a hypothesis, not the destination

One possible direction is to keep configuration separate while placing storage entities closer to the core application instead of preserving every existing module. Another is to revisit a four-area layering preference and try a simpler controller, service, and repository shape.

The proposal is not to remove every interface. A system with many genuine ports and adapters may still justify that separation, especially as the software grows. The narrower suspicion is that a typical service can accumulate modules and interfaces that do not carry enough responsibility to repay their context cost.

Some duplication may even be acceptable if it keeps code more direct, but that trade remains unsettled. Fewer abstractions can raise production speed while also making it easier to lose a useful boundary. The experiment has to judge both sides.

## Clarity and quality still constrain the experiment

Higher output does not answer how quality will be preserved. A smaller architecture is useful only if the resulting code is clearer. Removing layers to make an agent faster would be a poor exchange if people can no longer understand or evaluate the result.

The greenfield condition matters for the same reason. A new solo or company project can test a different default from the start. A legacy system should generally keep following its existing structure and improve parts incrementally rather than being forced into an experimental template.

The current position remains provisional: AI-assisted greenfield work may benefit from fewer boundaries than an older template provides. Continued use must show where simplification improves clarity and where necessary structure has been removed. Until then, it is an experiment in template design, not evidence that simpler architecture has already won.