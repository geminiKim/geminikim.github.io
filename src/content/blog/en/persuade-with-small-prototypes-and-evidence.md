---
title: "Win Technical Arguments with Small Proofs, Not Opinions"
description: "Diagnose why a proposal is blocked, build a small proof, strengthen your reasoning, understand the opposing case, and treat new technology as company risk."
lang: en
translationKey: persuade-with-small-prototypes-and-evidence
publishedAt: 2024-04-03
tags:
  - communication
  - teamwork
  - technical-decisions
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

When a technical proposal is rejected, “How do I persuade them?” is not yet the right question. First find out why it is being rejected. The idea may be weak, the explanation may be incomplete, another person may have a stronger case, or the organization may not actually make decisions through open technical discussion.

Across those conditions, my most reliable preparation is a small proof of concept. If I want a large change, I do not build the whole change in secret. I implement a narrow slice that makes the proposed direction visible.

## Bring five units of proof for a hundred-unit idea

Think of the desired change as one hundred units. Build perhaps five units: enough code to show the mechanism, expose the difficult part, and give colleagues something concrete to challenge. The ratio is illustrative. A proof should be cheap enough to discard and real enough to test the claim.

This works particularly well when proposing a different implementation for existing business logic. An abstract argument asks everyone to imagine the code. A small example lets the team compare readability, dependencies, or maintenance consequences directly.

The proof does not end the discussion. It improves it. Once code exists, an opponent can point to a specific cost rather than reject a vague promise. The proposal can also fail quickly before the company commits to it.

## Prepare three kinds of evidence

A prototype alone can become a performance. I pair it with two other tasks:

1. Write down my own reasoning: the problem, expected gain, costs, and conditions.
2. Understand the opposing argument well enough to state it fairly.

If the other proposal is stronger, accepting it benefits the team. Rejection is not proof that colleagues failed to understand me. It may reveal that I have not explained the value or that the value is not there.

When I still believe my direction is better, I can answer the real concern: “I understand why you prefer this approach; here is the maintenance or delivery problem I think remains, and here is the small example that demonstrates an alternative.” That is much more useful than repeating a preference with greater confidence.

## New technology has a higher burden

Changing business code and introducing an unfamiliar technology are different decisions. A new technology can leave the company with a system few people understand. If I want it mainly because I want to learn it, or if no one on the team can operate it, the company bears the risk of my experiment.

A proposal therefore needs more than novelty. I should know the technology well enough to explain why the current problem warrants it, what the team must learn, and what happens when it fails. If I do not yet know it, a personal or disposable experiment is a better place to start than production.

## Some environments are not technical debates

Hierarchy and office politics can make evidence ineffective. In a nominally horizontal team, a person with unchecked authority may still decide everything. If a pattern follows me across many workplaces, I should also examine my own communication and judgment. If one environment consistently refuses reasoned discussion, spending unlimited energy there may not be productive.

There is no persuasion trick that fixes every organization. The part I can control is the quality of the proposal: a small reversible proof, explicit reasoning, and an honest reading of the other side. Those habits turn many disagreements from contests of confidence into decisions the team can inspect.