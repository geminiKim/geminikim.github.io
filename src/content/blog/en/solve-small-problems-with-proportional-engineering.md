---
title: "Solve Small Problems with Proportional Engineering"
description: "Measure what existing systems can do, solve small problems proportionally, and add caches or distributed infrastructure only when evidence demands it."
lang: en
translationKey: solve-small-problems-with-proportional-engineering
publishedAt: 2025-03-16
tags:
  - architecture
  - performance
  - reliability
  - engineering-practice
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Proportional engineering solves the current problem with the resources already available, measures the result, and adds complexity only when the limit is real. A slow API or a small concurrency issue does not automatically require Redis, caching, messaging, or more servers. First learn what the existing application and database can do.

## Spend the capacity you already own

If the system already has application servers and a capable relational database, first try to solve the problem within those resources. There are urgent situations when adding servers or infrastructure is necessary. Outside them, begin with the capacity already available.

Measure and keep verifying how much efficiency those resources can provide. Add another technique when traffic or scale grows beyond what the current system can handle.

## Do not build for users who do not exist

It can be easy to copy the architecture of a service with millions of users and claim large theoretical capacity. It is harder to build an appropriately small system for the ten users who exist.

Adding Redis, caching, more servers, or distributed components consumes more resources. Doing so before the current small problem requires them is overengineering.

## Small solutions train better judgment

A problem that one table can solve should begin with one table. Repeatedly solving small problems at their actual size builds the judgment needed to choose an efficient approach. That experience matters later, when a larger problem does justify stronger tools.

Using every available technique too early also removes options. If traffic grows after every familiar cache and distributed layer has already been added, the next problem becomes harder to solve.

## Diverse experience prevents one-size-fits-all rules

Engineers who have only worked in resource-rich environments may not feel the operating cost of a new store because another team supplies and tunes it. Engineers who have only seen small systems can use large-scale performance tests to gain experience with the other side. Experience across different scales, or deliberate experiments that reproduce the missing side, broadens the set of reasonable choices.

That is why categorical rules are weak: always use a particular architecture, never use persistence entities as domain objects, or every service needs the same number of layers. Treat these four themes as matters to experience, test, and think through, not as one universal answer. Good engineering uses resources proportionally and adds techniques as the problem grows.
