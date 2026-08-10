---
title: "Rebuild First, Migrate Second"
description: "Design a replacement system around the problems it must solve, then handle legacy data through explicit migration mappings and retirement conditions."
lang: en
translationKey: rebuild-first-migrate-second
publishedAt: 2024-05-20
tags:
  - architecture
  - database
  - migration
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A rebuild is supposed to correct something the existing system cannot handle well. Yet migration pressure can quietly turn the replacement into the old system with new code. If every design decision begins with “How will the legacy rows fit?”, the only concrete model available is the legacy one, so its mistakes become the blueprint again.

The better sequence is uncomfortable: establish what the new system should be first, then accept that moving old data into it may be difficult. Easy migration is useful, but it should not become the purpose of a redevelopment.

## First decide what kind of change is justified

“Rebuild” covers very different situations. Before changing anything, determine which problem the company is paying to solve. Does the organization still have developers, product owners, or planners who understand the current system? Must all historical data remain available? Is the problem mainly in the application code, or is the data structure itself preventing necessary change? How much flexibility does the next system need?

If the existing schema is adequate, changing only part of the code may be the honest choice. A full data redesign consumes substantial time and people. Reproducing nearly the same system after that investment is disappointing unless the narrower result solves the actual business problem. Sometimes not rebuilding is better than performing a redesign without enough reason or knowledge.

Historical data can also be non-negotiable. A replacement for a transaction system cannot simply discard its transfer history. That constraint is real, but it does not mean every old shape belongs in the new core model.

## Give the destination a chance to exist

Migration moves data from a source to a destination. During early analysis and design, the destination does not yet exist. Repeatedly redesigning it around migration at that stage makes the source the strongest available reference, even when the source is what the project needs to escape.

Instead, ask: if there were no legacy data, how should this system represent the domain? Design the new data structure for correctness, the problems being fixed, and the flexibility that is actually required. Build enough of it to make the destination concrete. People who know the old system remain essential here—not to preserve every table, but to explain policies, exceptions, and data meanings that the replacement must not lose.

This separation does not make the historical-data requirement disappear. Decide which history must remain available and involve people who understand the old system. But do not let the mechanics of one-to-one copying decide the new domain model before that model has taken shape.

## Put legacy complexity in an explicit transition layer

Once the destination is clear, migration becomes concrete work. Some old fields will fit naturally. Others will require conversion rules, mapping tables, or a place to retain legacy-only values that the new system no longer uses. The result may look untidy. That is often the honest cost of changing a flawed structure while keeping its history.

Keep this compatibility work visible and separate from the new model. Mark data and mappings as legacy concerns, document why they remain, and define the condition under which each can disappear. A mapping table might live until the old system is fully retired, until historical records are no longer queried, or until a required client version has replaced an old contract. Depending on the domain, that period can be long.

New traffic can move to the new structure while old data remains read-only or accessible through mappings. The exact transition varies by service. The important distinction is between enduring domain design and temporary compatibility machinery.

## Judge the rebuild by the future it enables

A painful migration does not prove that the new design is good. It can also reveal a careless destination or missing domain knowledge. Conversely, an easy migration does not automatically prove that the rebuild merely copied the old system. These are warning signals to investigate, not mechanical rules.

Review the result against the original reason for the project. Did the new structure remove the constraint that justified redevelopment? Can new behavior be added without reproducing the same data problem? Are legacy mappings clearly separated from the new model, and is there a concrete condition for removing them? Can the team explain which legacy compromises are temporary?

The sequence matters because it protects two responsibilities at once. The new system must be designed for the work ahead, and the old system’s history must arrive safely. Treat migration as a deliberate bridge between those models, rather than allowing the bridge to dictate where the destination is built.
