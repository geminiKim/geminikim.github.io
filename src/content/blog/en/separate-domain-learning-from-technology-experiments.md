---
title: "Separate Domain Learning from Technology Experiments"
description: "Use familiar tools to launch domain projects, and isolate unfamiliar infrastructure in minimal experiments with focused performance tests."
lang: en
translationKey: separate-domain-learning-from-technology-experiments
publishedAt: 2025-02-23
tags:
  - engineering-practice
  - performance
  - software-delivery
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A side project can answer one of two questions: how a domain or product idea works, or how an unfamiliar technology behaves. Trying to answer both at once gives the project two large unknowns. I separate them into a running service built with familiar tools and a deliberately plain experiment built around one technology.

## Track one: put the domain into service with familiar tools

When the goal is to experience a domain or test a business idea, make a small version quickly with technology you already know. Deploy it instead of stopping at a repository, then keep evolving the running service. The point is to learn the product and its domain rather than spend the project learning the stack.

Once it runs, the project can still test structural choices. Try using no layers, or compare a model where persistence entities double as domain objects with one where persistence is hidden. A focused performance test also shows the practical limit of the chosen structure and gives experience applying load to the service.

The unfamiliar part in this track should be the domain question. Familiar implementation tools shorten the path to the part that needs to be learned.

## Track two: strip a technology experiment to one module

When the goal is Redis, a messaging system, a search engine, or a reactive stack, start with a minimal single-module project. Put aside elaborate modularization and domain rules. Exercise the commands, apply load, and observe the technology itself. This project can remain a small repository because launching a product is not its purpose.

Performance testing belongs here too. It helps answer how the technology behaves and how it might be used later. Unit tests are possible, but the emphasis is direct use and a focused look at performance rather than building a complete domain around the tool.

An unfamiliar commerce domain plus an unfamiliar messaging platform combines ignorance with ignorance. My attempts to mix those tracks often produced weak progress in both. Some people learn effectively by combining them, so this is a personal learning pattern rather than a universal law. For a similar learning style, naming the question first keeps the project from becoming two unfinished experiments at once.
