---
title: "Choosing Project Structure and Tech Stacks in the AI Era"
description: "Choose project boundaries and technology stacks by team size, existing expertise, reviewability, and failure cost—not AI output speed alone."
lang: en
translationKey: choosing-project-structure-and-stack-in-ai-era
publishedAt: 2026-02-15
tags:
  - ai-agents
  - architecture
  - technical-decisions
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

AI can shorten implementation time, but speed alone does not decide where a project should be divided or which technology it should use. Those choices still depend on the people who will review the result, the way the team works, and the damage a failure could cause.

There is no single “AI-native” structure to copy. The useful question is how much separation and specialization the current project can justify.

## Let team shape determine project boundaries

A small team or personal project may gain little from maintaining separate front-end and back-end repositories. In one personal experiment, the speaker put a server-rendered front end and the back end in one project because the work was small enough to treat as a single flow. AI made that experiment easier to try; it did not prove that every project should be combined.

The answer changes in an organization with established roles and a larger engineering group. A back-end developer may use an agent to produce a front-end change, but someone with front-end expertise is still better positioned to judge the details. Generating outside a specialty is not the same as reviewing with that specialty.

Project boundaries should therefore reflect the organization that must carry them. If a small group works across the whole feature, one repository may reduce handoffs. If distinct specialists own substantial areas, separate projects can preserve useful focus.

## Familiar technology makes generated code easier to judge

An agent can produce code in a language the team barely knows. That does not give the team the judgment needed to decide whether the result is sound.

The speaker continues to use a familiar back-end stack in his own projects largely because familiarity makes review easier. When generated code looks questionable, he can inspect it instead of guessing. Choosing an unfamiliar stack only because an agent appears productive shifts effort from typing to verification and recovery.

That is not an argument against trying new technology. A personal experiment is an appropriate place to explore it. A company-wide change is different: the team has to consider who can review the code, who can operate it, and what happens after the person who introduced it leaves. A broader stack change belongs at the level where those costs can actually be accepted.

The same reasoning applies to learning. If a developer is aiming for a company that uses a particular stack, that target still gives the stack practical relevance. It is too early to treat languages and frameworks as irrelevant simply because AI can write them.

## Set review depth by failure cost

The hardest variable is not how much code AI can generate. It is how much of that code people intend to inspect.

A team may decide that a low-stakes experiment only needs to work end to end. That strategy becomes harder to defend when the software handles money, contracts, sensitive users, or other failures with serious consequences. The acceptable review depth is a product and team decision, not a universal rule.

Structure needs the same calibration. The speaker tried taking an AI-assisted project all the way to a single module and concluded that the experiment had gone too far. The lesson was not to return automatically to a large module hierarchy, but to keep enough structure for people to understand and judge the result.

AI makes it cheaper to test different arrangements. Use that advantage to run bounded experiments, then keep the boundaries, stack, and review process that fit the team’s expertise and the product’s risk.