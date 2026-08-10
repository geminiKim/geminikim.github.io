---
title: "Nullable or Zero? Choosing a Kotlin JPA Entity ID Strategy"
description: "Compare nullable and zero-valued numeric IDs for Kotlin JPA entities, including new-entity detection, ambiguity, and verification."
lang: en
translationKey: kotlin-jpa-new-entity-id-strategies
publishedAt: 2024-10-01
tags:
  - kotlin
  - jpa
  - persistence
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A generated numeric ID on a Kotlin JPA entity creates an awkward modeling choice. Declaring the ID nullable represents the entity's state directly: before persistence it has no database identity, so the ID is `null`. After loading or saving the entity, application code expects an ID, yet Kotlin still requires a null check or `!!` at every use.

Giving the ID a non-null default of zero removes that repeated friction. It also replaces absence with a sentinel value. The decision is therefore larger than a syntax preference: it defines how the application recognizes a new entity and what zero means throughout the model.

## The nullable strategy expresses lifecycle explicitly

With a nullable numeric ID, `null` means the entity has not been persisted. This is easy to explain and fits the lifecycle distinction naturally. Repository save logic can treat the missing ID as evidence that the entity is new and choose persistence rather than an update-oriented path.

The cost appears after that boundary. A query may have returned a managed entity whose ID is known to exist, but its Kotlin type remains nullable. Code that exposes the entity more broadly—as a domain object or an object used across modules—may accumulate assertions wherever the ID is read.

Those assertions are not free merely because developers know the value should exist. Each `!!` says the type cannot prove the assumption and turns a violated assumption into a runtime failure. A helper or narrower boundary might contain some of the noise, but it does not remove the underlying type choice.

## Zero can act as the new-entity sentinel

The alternative is a non-null numeric ID initialized to zero. In the repository path examined here, new-entity detection checks numeric IDs and treats zero as new. The save operation can therefore follow the persistence path even though the Kotlin property itself is non-null.

This produces cleaner use sites: persisted entities expose a non-null ID without repeated assertions. It can be attractive when JPA entities are used directly in upper layers and their identifiers are read frequently.

However, zero is now part of the team's contract. Everyone must understand that it means “not yet persisted,” not a real identity. A detached or transient entity can move through application code carrying zero, so any logic that compares identities must account for that state. If the database can contain a real row whose ID is zero, the sentinel becomes ambiguous and the strategy needs reconsideration.

The framework accepting zero is evidence that the approach can work along this path; it does not prove that it fits every mapping, identifier policy, or project. No universal winner follows from the implementation detail.

## Verify the exact save path instead of relying on preference

This choice should be tested in the project's actual base entity and repository setup. A focused test can save a new entity under each strategy and verify that the repository recognizes it as new, assigns an identifier, and produces the expected persisted state. Debugging through the save operation and its `isNew` decision makes the framework behavior visible rather than assumed.

Add cases for the states the application actually permits:

- a freshly constructed entity with `null` or zero;
- an entity returned after persistence;
- identity comparison before persistence, if the model allows it;
- an existing zero ID, if the database or migration history makes that possible.

These tests serve two purposes. They confirm the current mechanics, and they document the sentinel convention for the next developer. If library behavior or local mappings change, the team has a failing signal at the boundary where the assumption matters.

## Choose the inconvenience you can contain

The nullable strategy favors semantic clarity: absence is represented as absence. Its cost is nullable handling in code that considers a persisted ID mandatory. The zero strategy favors cleaner Kotlin call sites. Its cost is a conventional value whose meaning must be consistently protected.

Entity placement changes the weight of that trade-off. If persistence entities stay behind a narrow adapter, a nullable ID and a conversion boundary may be easy to contain. If entities are used as domain objects throughout the application, repeated assertions may create enough noise to make a verified zero convention appealing.

Make the rule explicit in the base entity, tests, and team conventions. Do not mix strategies casually across otherwise similar entities, because then developers cannot infer lifecycle state from the type or value. Either choice can be workable under the conditions described; the maintainable choice is the one whose assumptions the team can explain, test, and apply consistently.
