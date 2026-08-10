---
title: "Reader and Writer Are Options, Not Architecture Rules"
description: "Choose Reader, Writer, and tool-layer boundaries from code size, domain distance, legacy constraints, and team conventions—not imitation."
lang: en
translationKey: use-reader-writer-patterns-as-options-not-rules
publishedAt: 2024-12-28
tags:
  - architecture
  - layering
  - design-patterns
draft: false
---
> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Reader and Writer classes can create a useful boundary around data access and supporting operations. They can also become an extra layer that every request passes through for no reason. The pattern itself cannot decide which result you get. Its value depends on the code you have, the problem you are repairing, and the rules your team can sustain.

Treat Reader, Writer, and a supporting tool layer as options. Introduce them neither because a diagram contains them nor only after a service has become impossible to change. Watch the code, identify the pressure, and make the smallest boundary that addresses it.

## A layer needs a job, not a borrowed name

A “tool layer” can mean a collection of components used to implement business behavior: Readers, Writers, and other focused collaborators below the business flow. The name is local vocabulary, not a standard that other teams must adopt. If “tool” or “component” communicates the job poorly in your organization, choose another name and define it.

That definition matters more than the label. A team should be able to explain what the layer owns, which direction dependencies flow, and what must stay outside it. Otherwise developers reproduce a folder structure without sharing an architecture.

The same test applies to Reader and Writer. A Reader should exist because isolating a read responsibility clarifies dependencies or controls access, not because every repository call needs ceremonial wrapping. A Writer should make a write responsibility easier to reason about, rather than add a forwarding method with no boundary value.

## Timing depends on the code's pressure

An extra tool layer can be a practical way to improve severe legacy code from below. If a business service contains enormous functions, mixed roles, and tightly coupled data access, extracting focused tools lets the team create new boundaries without first rewriting the entire business flow. It is one strategy for gradually separating the responsibilities accumulated in a conventional layered structure.

A clean, small service has different needs. If its logic and data access remain easy to understand, adding Readers and Writers preemptively may only increase navigation and indirection. A simple read-only application may not need a tool layer; depending on its nature, it may not need a distinct business layer either.

Waiting has a cost as well. Splitting an oversized service into more services can create circular references if their responsibilities are not controlled. A focused lower layer is one possible way to direct those dependencies. The choice is not between “always add the layer” and “never add the layer.” It is between concrete ways of controlling the code you actually have.

## Reference rules should reflect conceptual distance

Once Readers exist, teams often ask which one may call which repository. There is no answer independent of the domain. Consider one capability needing data associated with another. The decision depends on how closely the concepts belong together, whether they sit behind the same boundary, and how much coupling the project can tolerate.

For distant domains, preventing direct access to another domain's repository is a useful default. The caller goes through the other domain's Reader or another explicit tool, keeping data-access knowledge behind its owner. This makes a crossed boundary visible in code.

Closely related concepts may justify a looser rule. A small project with few concepts may even allow tools to use the relevant repositories directly without creating meaningful risk. Complexity changes the trade-off: a permissive reference graph that is harmless in a small codebase can become hard to understand as concepts and callers multiply.

Teams can therefore define a broad dependency direction while leaving same-layer references or project-level exceptions open. The goal is enough constraint to preserve the system, without blocking every reasonable local decision.

## Standards should include a reason and an escape hatch

A company-wide default can be valuable when many developers with different levels of familiarity work across projects. It gives newcomers a stable starting point and reduces the number of structural decisions every team must rediscover. That organizational need can justify using a layer earlier than one isolated codebase would.

But a standard should remain explainable and adaptable. Document the project's chosen layers in its README, including deliberate omissions. A query-only project might state that it does not use the usual tool layer. A heavily contaminated legacy application might explain why it adds another boundary. These notes let a default evolve without making deviations look accidental.

Keep the shared rule loose enough for projects to override it with a reason. A rigid four-layer template applied to every service is no better than an unstructured system if nobody can say what each layer contributes.

The durable question is not “Should we use Reader and Writer?” Ask what failure the boundary prevents, when the code will benefit, what references it controls, and who will maintain the rule. If the answers are concrete, use the pattern. If they are not, keep the design smaller, observe the code, and revisit the choice when the pressure becomes real.
