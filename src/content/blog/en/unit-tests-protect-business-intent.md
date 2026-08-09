---
title: "Unit Tests Should Preserve Business Intent"
description: "A business-layer unit test is useful when it guides design, records meaningful behavior, or makes the next developer reconsider a risky change."
lang: en
translationKey: unit-tests-protect-business-intent
publishedAt: 2023-10-28
tags:
  - testing
  - architecture
  - maintainability
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

If a business service mainly combines smaller implementation components, does a unit test for that service still mean anything? The implementation logic may live in finders, updaters, repositories, and other collaborators. Perhaps the service should only be covered by an integration test.

That concern is reasonable. A test written only because "every service must have a unit test" can be useless. The better question is what uncertainty the test removes and what intent it leaves behind.

## A test needs a job

I prefer tests that arise naturally while developing a feature. When I do not understand the business well, a test can be a quick feedback loop for my provisional design. I write the behavior I think the system needs, discover the components required to make it happen, and revise both as my understanding improves.

Imagine that we have suddenly joined a cup factory and must implement `makeCup`. We know almost nothing about making cups. We might guess that the process needs material storage, a mold, and a kiln. The example is deliberately awkward because that is what an unfamiliar domain feels like: the names are uncertain, responsibilities are misplaced, and somebody who knows the work can immediately tell us that cups are formed differently.

A test gives those guesses a concrete form. One test can assert the business result: the returned cup has a handle and a medium size. Another can describe collaboration: material is taken from storage, forming happens, and the kiln performs the required action. These tests protect different things. The first cares about the outcome. The second cares about a sequence or division of responsibility that we consider meaningful.

Neither style is automatically correct. Verifying every collaborator call can couple a test to incidental implementation and make harmless refactoring painful. Checking only the final value can miss a collaboration that is itself meaningful to the business flow. The assertion should match the business concern.

The test is useful during design because it forces me to state what I believe before I hide uncertainty inside classes. When a domain expert says the mold is wrong or the kiln releases the cup automatically, I can change the model and receive feedback immediately.

## Existing code deserves a selective answer

The situation changes when the service already exists.

Adding mocks and assertions to every method after implementation is complete does not become valuable merely because coverage rises. Before writing the test, I would ask whether this service contains a decision worth preserving. Is the component composition hard to understand? Is the business behavior important? Are we preparing to refactor it? Would a new colleague benefit from seeing the intended flow? Did a bug reveal a missing case?

If the answer is yes, a business-layer unit test can be worthwhile even when it is written later. It can document why the service combines these components, verify an important outcome, and give reviewers a second view of a change. A modified test often tells more than the modified implementation: it shows which old assumption the developer chose to replace.

If the only reason is "services need tests," I would rather not add it. Test code is code. It has maintenance cost and should be created for a need, just like production code.

This is not an argument that test-driven development is always superior. I dislike turning a useful technique into an identity or a rule that ignores context. Tests written first can guide work in an uncertain area. Tests written after a bug can prevent the same failure from returning. Tests around stable legacy behavior can make refactoring possible. The timing follows the job.

## A failing test creates a pause

Suppose a new developer changes `makeCup`. They replace the forming component, remove the kiln, or alter a method signature without knowing the original design. Compilation and tests now fail.

The failure does not prove that the old design was right. It creates a pause. The developer must inspect what the test expected and decide whether the business intent also changed. In code review, the team can compare the old and new tests and discuss whether the new component boundary is better or whether unrelated responsibilities have been mixed.

That pause is one reason I write tests for important business-layer behavior. A future change should require one more thought than "the code compiles." Tests help carry intent through handover even when the original author is gone.

A useful practical question is whether the test reduces anxiety. If I deploy while thinking, "I changed only a small part, I clicked through it manually, and I can inspect production again," the uncertainty has not disappeared. It has been moved to the release. An automated check for the fragile rule may be worth more than another broad coverage test.

Tests do not eliminate bugs. That argument wastes time. When a bug appears, reproduce it in a test when feasible so the identical case does not return unnoticed. The suite becomes a record of failures the team has already paid for.

## Start from the outside when the inside is tangled

Sometimes inherited component composition is too confused to unit-test meaningfully. A service that should make a cup somehow depends on something resembling a flower shop. Mocking every collaborator would preserve the confusion rather than make it safer.

In that case, begin with the outer behavior. Write an integration test that captures what users or callers rely on. Once that boundary is protected, refactor the internals in small steps and deploy by feature or behavior. Add narrower tests where clearer responsibilities emerge.

An integration test and a unit test are not competing beliefs. The integration test protects the observable contract across real components. A focused unit test gives faster feedback about an important decision inside that contract. Use the level that addresses the current risk.

The test itself is feedback. Its value is not the count, the mocking framework, or whether it was written before production code. It is valuable when it helps us understand the business, preserves a decision that matters, prevents a paid-for bug from returning, or lets the next developer change the software with less fear.

Write that test. Skip the one that has no purpose.