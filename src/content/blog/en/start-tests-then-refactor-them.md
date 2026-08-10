---
title: "Your First Test Can Be Messy—Refactor It Later"
description: "Start with the test that proves the behavior you care about, mock enough to make it run, and improve test design through repeated use and review."
lang: en
translationKey: start-tests-then-refactor-them
publishedAt: 2024-02-29
tags:
  - testing
  - refactoring
  - backend
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Many developers delay their first test because they are trying to write a good test before they know what one feels like. I did not begin as someone comfortable with testing either. The way through was to stop treating a test as a special artifact that had to be correct on the first attempt.

Choose the behavior you want to protect, create a test, and make it run. If a bug should never return, reproduce that bug and assert the correct behavior. The first version may contain too much setup or clumsy fixtures. It can still be useful.

## Solve one concrete testing problem

“Learn testing” is too broad a goal. “Verify that saving an order produces the expected order key” is workable. It tells you which object to call, what data to prepare, and what result matters.

A class with many dependencies can make the start feel harder. When you are still learning, it is acceptable to mock the dependencies needed to reach the behavior. Set them up directly, run the test, and then inspect what made the test difficult. Some dependencies may not need mocking. Repeated setup may become a builder or fixture. A class that is painful to isolate may reveal a production design problem.

Those refinements are easier to see after a test exists. Waiting to discover the ideal mock boundary in advance often produces no test at all.

## Test code is code that changes

A passing test is not finished forever. Test code should be reviewed, named, reorganized, and refactored like production code. The first version proves a concern; later versions can make that proof easier to understand and cheaper to maintain.

A practical learning loop is:

1. State the behavior or regression you care about.
2. Build enough setup for the test to execute.
3. Get a clear passing result for the right reason.
4. Remove unnecessary mocks and repeated setup.
5. Promote useful tests into the suite the team relies on.

Some local experiments may be excluded from continuous integration while they are being explored. Once a test is stable and valuable, it should move into the normal test set. That separation can encourage practice, but it should not become a place where important checks live unseen.

## Writing a test first is not automatically TDD

Creating a test before touching a bug or behavior does not by itself establish a full test-driven development process. TDD is a practiced development cycle. It also becomes familiar by doing it repeatedly rather than by assembling a perfect “TDD environment.”

The same applies to mocking. Mock configuration is a technique, not the definition of TDD. Use it when the test needs control over a collaborator. Leave real behavior in place when replacing it adds no value.

The immediate standard for a beginner is modest: the test should demonstrate something worth knowing and fail when that behavior breaks. From there, judgment grows through volume and correction.

There is no shortcut that avoids awkward early tests. Write the test that prevents the next repeat of a bug. Let it expose what you do not understand. Then improve both the test and, when the evidence supports it, the production design around it.