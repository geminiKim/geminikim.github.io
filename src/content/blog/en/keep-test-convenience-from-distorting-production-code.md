---
title: "Don't Distort Production Code Just to Make Tests Easier"
description: "Change production code when its behavior becomes clearer or legacy code needs a testing seam—not merely to expose values or methods that only tests use."
lang: en
translationKey: keep-test-convenience-from-distorting-production-code
publishedAt: 2024-04-23
tags:
  - testing
  - refactoring
  - legacy-code
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Tests can reveal that production code is hard to use. That does not mean every change that makes a test convenient improves the production design. The distinction I use is whether the change expresses a legitimate behavior or creates an artificial surface that only the test consumes.

If a validator returns an integer solely so a test can assert something, the method's meaning has probably been distorted. Test the validation behavior instead: the expected exception, result, or interaction that callers also care about.

## A return value must belong to the operation

A void updater might reasonably return the ID of the object it updated. That can be a useful result of the production operation. If callers can use it and the method becomes clearer, the test is not the only justification.

An `UpdateResult` invented only to expose internal values is different. If no production caller reads it, the type exists for observation rather than behavior. That test convenience has leaked into the service contract.

The same rule applies to visibility. Changing a private method to public merely to call it from a test expands the production API without a production need. Prefer testing through the public behavior. Mocking a collaborator may also be a better fit when the assertion concerns an interaction rather than an internal return value.

This is not a ban on refactoring for testability. Test pressure can expose a class that owns too much or dependencies that are hidden. Improve those problems in a way that makes the production design more honest, then let the tests benefit.

## Severe legacy code changes the calculation

A new system and an old untested system do not offer the same choices. Legacy code may use field injection everywhere, contain circular dependencies, or place thousands of lines in one method. Without a seam, even a necessary change cannot be verified safely.

In that setting, modifying production code to gain control can be justified. Add a constructor where possible. If a constructor immediately exposes an existing dependency cycle, temporary setter injection may let a test provide collaborators while the code is untangled. Extract sections from an enormous method without changing their logic, then characterize the extracted behavior.

A temporary return object or visibility change can also be acceptable if it is the only practical route to a safety net. The condition is that the team knows it is scaffolding. Remove or improve it as the legacy area becomes manageable rather than letting the workaround become the new design standard.

## Spend only the energy the legacy system warrants

Some legacy systems will be replaced. Others will continue running even though no large cleanup is planned. In either case, a modest characterization test may be worth more than a beautiful redesign because it reduces the chance that the next small edit causes an incident.

The decision therefore depends on context:

- In new or healthy code, keep test-only artifacts out of production contracts.
- When testability reveals a real design defect, fix the defect for production reasons.
- In severe legacy code, create the smallest seam that makes necessary change observable.
- Mark temporary compromises and do not confuse them with the desired architecture.

Production code should describe production behavior. Tests should verify that behavior. When legacy code blocks any verification, change it carefully enough to regain control—but keep the exception tied to that recovery work.