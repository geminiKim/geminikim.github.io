---
title: "Architecture Rules Need Team Judgment Before Automation"
description: "Balance automated layer enforcement against review capacity, repository scale, developer growth, and a team's need to reason about architecture."
lang: en
translationKey: architecture-rules-automation-vs-team-judgment
publishedAt: 2025-01-26
tags:
  - architecture
  - collaboration
  - testing
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A custom annotation, compile-time check, or architecture test can reject a dependency that skips a layer. I would not make that enforcement the default for a team that can review its own structure. The dependency mistake matters, but so does the conversation the rule can remove.

## Use the two-pizza team as the test

In a compact team, layer and component boundaries should still be discussable. A developer can ask why an implementation layer exists, say that its name or role does not fit this project, and propose removing it. Those arguments are part of building software together. Encoding every answer as a gate turns a logical model into a physical rule before the team has decided whether the model still fits.

This is different from formatting. Reviewing semicolons and other trivial conventions wastes time, so automation is welcome. A layer carries more meaning: it shapes dependencies and the way developers understand the system. Leaving that rule loose gives less-experienced teammates room to ask why, make a case, and learn from the answer rather than merely satisfy a tool.

If a two-pizza team needs rigid enforcement for every loose architecture rule, review and communication may be the deeper problem. Team-level discussion can produce a different structure from a company-wide default, and that variation is not automatically a defect.

## Automation earns its place when conversation cannot reach the change

The answer reverses for a repository touched by many occasional contributors, an open project, or an organization with too little review time to catch basic dependency mistakes. Mechanical checks can preserve a minimum quality line when the people changing the code do not regularly work together. They can also stop predictable mistakes when inexperienced contributors receive little review.

That protection has a cost. A developer may learn which rule passes without learning why the layer exists or whether the project needs it. Strong enforcement makes more sense when the repository's scale and review limits make that cost unavoidable, not merely because an architecture idea can be expressed as a test.

I have not used every available enforcement tool, so this is not a verdict that architecture tests are bad. It is a question of reach: can the team still debate the boundary, or has the change surface become too large for conversation? Decide where static enforcement begins from that constraint and stop before every architectural thought becomes a compiler error.
