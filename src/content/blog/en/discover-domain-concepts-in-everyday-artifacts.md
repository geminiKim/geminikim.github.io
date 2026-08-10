---
title: "What a Utility Bill Can Teach Us About Domain Modeling"
description: "How a utility bill revealed a missing delinquency concept in a repayment model and why everyday artifacts can guide software design."
lang: en
translationKey: discover-domain-concepts-in-everyday-artifacts
publishedAt: 2024-11-04
tags:
  - domain-modeling
  - software-design
  - problem-solving
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A domain model can feel wrong before the missing concept has a name. In a repayment flow, a payment may succeed or fail, a failure may be retried, and additional interest may arise after nonpayment. Those rules can be implemented as states and conditions while the overall model still feels uncomfortable.

The clue that clarified this case did not come from another pattern or a more elaborate diagram. It came from a utility bill.

## Three amounts revealed three different facts

The bill showed an amount due within the payment period, an unpaid amount, and a late charge. Reading those items separately made the distinction concrete:

- the current amount is what should be paid on schedule;
- the unpaid amount comes from an earlier payment that did not happen;
- the late charge is an additional cost caused by that nonpayment.

The structure resembled the repayment problem. A normal repayment schedule, an overdue amount, and an additional overdue charge did not have to remain compressed into one repayment status. The bill supplied the trigger for treating delinquency as a concept of its own.

This did not mean that utility charges and loans were the same domain. They are not. The useful part was the distinction already visible in reality.

## Return to the code with a better question

The code had also been producing signals. Failure, retry, and additional interest did not relate to normal repayment in exactly the same way. Once the bill made the distinction visible, it became easier to ask whether those concerns belonged behind a separate delinquency boundary.

The artifact did not generate a finished implementation. It changed the question. Instead of asking how to fit another condition into repayment, the design could ask what belongs to repayment and what begins after repayment fails.

That is often enough to move a stalled model forward. A real-world example gives the discomfort a name, and the code can then be checked against that idea.

## Reality already contains many of the processes we support

Software frequently supports activities that already happen outside the code. Bills, overdue phone charges, and penalties for late returns express consequences that people have dealt with for a long time. Someone who has encountered those processes may recognize their structure quickly.

That does not mean developers should create bad experiences for themselves just to learn. It means ordinary documents and routines can contain useful clues. When staring at the code no longer helps, look at how the same kind of obligation, delay, or penalty is represented in the world.

Experience matters here because it provides more things to compare. An unresolved software problem can stay in mind while an everyday object unexpectedly exposes a familiar shape.

## Use the analogy as a clue, not proof

A bill can start a modeling idea, but the business rules still decide whether it is correct. Loan repayment and utility payment can differ in important ways. The code and the actual service must support the boundary before it is adopted.

The practical lesson is modest. Domain insight does not always arrive through a grand technique. Sometimes a model that keeps bothering you becomes clearer when you notice how reality separates the same kinds of facts. Look beyond the screen, bring the clue back to the code, and check whether it explains the behavior that was difficult to model.