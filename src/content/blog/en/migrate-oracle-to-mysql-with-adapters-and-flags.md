---
title: "Oracle to MySQL Migration with Adapters, Dual Writes, and Flags"
description: "A reversible Oracle-to-MySQL migration using compatible adapters, dormant deployments, dual writes, tested switches, deliberate rollback, and legacy cleanup."
lang: en
translationKey: migrate-oracle-to-mysql-with-adapters-and-flags
publishedAt: 2025-10-12
tags:
  - data-modeling
  - software-delivery
  - reliability
  - testing
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

An Oracle database recalled as about thirteen years old and its IDC equipment had to be retired quickly. The code around it was old MyBatis code with many queries, while the API server had already moved to the cloud. Replacing the database was urgent; redesigning the entire service at the same time was not.

## Do not modernize the framework during the move

The migration left business service logic and repository signatures alone. A one-to-one adapter was introduced beneath the existing contract, with a new MySQL implementation behind it. Even the persistence style stayed close to the old one. Moving MyBatis to JPA in the same change would have enlarged the work without helping retire Oracle sooner.

Oracle-specific SQL still had to change. Functions were translated, and sequence behavior that had lived inside queries was made explicit for MySQL, including a separate sequence table. Those differences were contained in the new persistence path instead of forcing changes through every service caller.

## The first production deployment changed no behavior

The adapter and new code went out with flags keeping reads and writes on the legacy path. The new route was present but dormant, so the boundary could be deployed within a few days without asking the live service to use MySQL.

After that, flag combinations were exercised in stages. Reads could remain on Oracle while writes went to both stores. Because the new data was not yet serving reads, it could be inspected, cleared, rebuilt, and tested again. Tests covered the intended legacy-read and new-write states, and partial deployments continued roughly week by week.

## The final migration PR was a switch

Historical data movement was coordinated with database support. The service allowed a short maintenance window, but all necessary code had already been deployed and tested before it began. The last PR changed a narrow true/false setting rather than delivering the migration implementation for the first time.

Rollback was equally narrow: the read setting could return to Oracle because the compatible path was still deployed. Tested flag states, staged rollout, and a reversible switch made the final change small. Minor issues did appear after cutover, but none was serious enough to require rollback.

Once MySQL was stable, the legacy database module, unused repositories, old branches, and migration flags were removed. The speaker recalled that the adapter remained, although it could be removed later. The important pattern was the sequence of deployments: build a compatible boundary, deploy it inactive, test flag states repeatedly, make the cutover small, and delete the bridge that no longer serves a purpose.
