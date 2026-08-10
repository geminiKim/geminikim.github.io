---
title: "Rank Your Domain Concepts Before You Spend Design Effort"
description: "Identify a small first tier of domain concepts, separate supporting flows, and spend limited design time on the service's center."
lang: en
translationKey: rank-domain-concepts-to-focus-design
publishedAt: 2024-10-28
tags:
  - domain-modeling
  - architecture
  - prioritization
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A service can contain many important concepts, but they do not all need the same priority. When time is limited, the team will eventually have to choose which area to improve first. Ranking the concepts makes that trade-off explicit.

Start by finding a small first tier: the concept or concepts at the center of the service. The first tier does not have to contain exactly one item, but the group should stay small enough to guide a decision.

## Separate an application from the loan it may create

Consider a lending service. An early model might treat application, review, execution, and repayment as states of one `Loan`. That looks simple, but a loan application does not always become a loan.

A person may stop because identity verification has to wait, because a preliminary limit is disappointing, or because another offer looks better. Before execution, there may be no loan yet. The application is a process that can end without creating the central concept.

That observation supports separating `Application` from `Loan`. Application covers the steps before execution, including abandoned cases. Loan begins when execution succeeds, and repayment follows from an existing loan. If the service's main flow begins with the executed loan, `Loan` belongs in the first tier and `Application` can receive a lower rank.

This is a definition made for that service, not a universal law. A different product could choose a different center.

## Use the rank when time forces a choice

A lower-ranked concept is not worthless, and its code does not have permission to be careless. The rank answers a narrower question: where should limited design effort go first?

Suppose launch is next week and the team can reorganize either the loan area or the application area, but not both. In this example, it chooses the first-tier loan concept. If more time becomes available, the application area should also be improved.

The ranking is useful because it prevents every concept from claiming equal urgency. Once the first tier is clear, the remaining concepts can be assessed by how they support or lead into it.

## Let the ranking shape the boundary

The separation should also appear in code. An application leads toward execution, and successful execution creates a loan. Changes inside the application process should otherwise interfere as little as possible with the loan concept.

This is why the earlier status-only model was uncomfortable. It made pre-loan application states part of an object that did not yet exist. A separate application concept gives incomplete attempts a place to live without forcing them into the loan's lifecycle.

The boundary does not have to be perfect on the first attempt. The point is to express the service's current understanding: application comes before execution, loan begins after execution, and repayment depends on that loan.

## Revise the ranking through operation

The hierarchy should continue to evolve while the service is operated. Operation produces insight that a diagram made before launch cannot supply. The team can see whether the concepts and boundaries still match the service it is actually running.

Ranking domain concepts is therefore part of defining what the product is. Find the small first-tier group, place the concepts that support it at an appropriate distance, and use the ranking when design resources are scarce. Then keep revisiting the decision as operation teaches the team more about the service.