---
title: "Where Cross-Domain Coordination Code Belongs"
description: "Use business ownership, cohesion, imports, and a package-move experiment to place code that coordinates a primary action with another domain's rule."
lang: en
translationKey: place-cross-domain-work-by-business-ownership
publishedAt: 2024-01-13
tags:
  - packaging
  - domain-modeling
  - architecture
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A feature often crosses more than one domain. Deleting a post may require the post itself, the current user, and an authorization check. The code still has to live somewhere. Creating a neutral package merely because several concepts appear in the same flow usually hides the decision rather than solving it.

I start by separating the main operation from the supporting rule. The post is being deleted; authorization enables that deletion. Then I ask which domain owns the rule being consulted.

## Name the rule before placing it

A validator for a general service user probably belongs with the user domain. A validator for the narrower idea of a “review user” may belong with reviews. The words matter because they expose whether the concept is general or only meaningful inside one bounded area.

This is why the actual business model has to come before a package convention. From a short description, I can only make a conditional judgment. If the user is the ordinary user of the whole service, placing user validation under the review or post package makes the ownership look narrower than it is. If the concept exists only for reviews, the opposite placement may be correct.

The coordinating class can remain with the operation it leads. A review appender, for example, may need a review repository and a user validator as constructor dependencies. That says something useful: adding a review is the primary work, and it requires a rule supplied by another domain.

## Let imports expose the relationship

Imports are not merely compiler noise. Expanded in a business-facing class, they show which surrounding domains the class needs. A review operation importing user and provider concepts makes the collaboration visible. Hiding every import behind a vague shared package can erase that signal.

There is a simple experiment I use when the right package is unclear:

1. Move the class to the package that seems to own it.
2. Let the IDE update imports.
3. Inspect which classes changed and in which layers.

The affected files reveal the class's reach. If both business-facing code and low-level implementations depend on it, the class may be crossing a layer boundary poorly. If only a family of implementation classes changes, it may be an implementation helper rather than a domain concept. The move is an inexpensive way to make coupling concrete.

Constructor dependencies add another clue. They distinguish something required for the class to exist from a value supplied only for one call. Neither clue decides the design alone, but together they give the team evidence to discuss.

## Package for cohesion, not visual symmetry

The final test is cohesion. Does this package gather concepts that change for the same business reason? Does the placement explain the role without a long comment? Does the dependency direction follow the ownership?

For the deletion example, I would usually leave the deletion flow with the post or review operation and place general user authorization under the user domain. The operation can depend on that capability. I would not move the user rule into the post package just because posts currently call it.

A different business may produce a different answer. There may even be a distinct authorization domain if permission policy has become substantial enough to deserve one. The useful outcome is not a universal package tree. It is a shared explanation of what each concept owns, supported by the dependency graph the code actually has.