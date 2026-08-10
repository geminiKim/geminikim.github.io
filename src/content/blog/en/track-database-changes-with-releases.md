---
title: "Track Database Changes with the Work That Ships Them"
description: "Collect database changes with the issue and PR that need them, test them in development, and hand off the final release set before code deployment."
lang: en
translationKey: track-database-changes-with-releases
publishedAt: 2024-07-13
tags:
  - database
  - deployment
  - operations
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A database change should travel with the work that requires it. If a column or table is altered in production while the feature is still being developed and tested, every revision creates another handoff. A column may need to be removed, rewritten, or replaced by a different table. Applying each intermediate idea to the live database turns normal development changes into repeated production work.

My practical approach is to keep the queries attached to the issue and pull request, test them freely in the development environment, and pass along only the set that belongs to the release. It is a manual and intentionally straightforward workflow. It is also one option, not a claim that every team should manage database changes this way.

## Let each environment set the boundary

Environment structure varies by company. A team may have development, alpha, beta, staging, QA, and live environments, or only some of them. Database permissions vary with that structure as well.

In development, developers may have permission to run both DDL and DML. That makes it a suitable place to try a schema shape, change it, and test the application against it. The working query does not have to be treated as final the first time it runs.

From staging onward, the operating model may be different. Depending on the company’s size and circumstances, a DBA may control changes to the higher environments. Developers then need to deliver the queries that the DBA will apply. The handoff becomes much easier when it contains a tested release candidate rather than every draft produced during implementation.

## Keep the queries beside the work

While developing a feature, collect its DDL, DML, and other required queries in the issue tracker. If the feature has subtasks, record the relevant changes with those tasks so that the reason for each query remains visible. Continue revising them while the application and database shape are being tested in development.

The important transition comes when the feature branch is ready to move into the development branch. At that point the work has more confidence than it did during early exploration. I tend to put the database changes on that feature pull request rather than leave the final answer only in the issue. The issue preserves the work context; the PR identifies the concrete code change that depends on the query.

This also gives a release a traceable collection point. If a release branch contains several PRs, inspect the database changes attached to those PRs and gather the set that must go live with that release. The unit of database work then matches the unit of application work.

It also keeps the database handoff aligned with the point at which the development work is ready to ship.

## Apply the release set before the code

Do as much testing as possible in development before asking for a live change. When the release is actually ready, consolidate the queries from its PRs and deliver them to the DBA or whoever operates the live database. In this workflow, those database changes are applied before the related application code is deployed.

That ordering does not make unfinished work safe to apply early. The point is to wait until development and internal testing have made the required database shape sufficiently stable, then prepare the exact set for the impending release. Otherwise the team resumes the same back-and-forth: apply a change, discover that the design moved, and ask production operations to alter it again.

## Choose the amount of machinery your team needs

This manual process is not especially systematic. Migration tools such as Flyway may provide stronger structure, particularly when several people need to coordinate changes. I have not used Flyway myself, so I cannot compare it from direct experience. I have heard of a team using it successfully, and it is reasonable to evaluate if it supports reliable multi-person work in your context.

I favor the issue-and-PR approach because I normally split work into short units and prefer a direct process in which concurrent tasks are less likely to collide. A larger team, a different permission model, or a more complicated release process may justify different tooling.

The durable practice is smaller than any particular tool: test database changes where developers can revise them, keep each change connected to the work that needs it, and assemble the live handoff from the PRs that actually make up the release.
