---
title: "Software Is Not Done Until It Is Deployed"
description: "Stale pull requests and delayed releases make changes harder to review, deploy, diagnose, and roll back. Keep the path to production short and observable."
lang: en
translationKey: software-is-not-done-until-deployed
publishedAt: 2024-06-16
tags:
  - software-delivery
  - deployment
  - project-management
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A change is not finished because its code exists, or even because it has been merged into the main branch. It is finished when it has reached the live service and the team has verified that it works there. The longer work sits between those points, the harder it becomes to understand what is active, what is safe to release, and who is responsible for the result.

This is why stale pull requests, abandoned branches, and a large gap between development and production are not merely untidy repository habits. They are signs that the project is not being managed well as a company asset.

## Keep active work genuinely active

A pull request can remain open for a valid reason. Perhaps the work is scheduled for a particular release, or perhaps it should not be completed yet. In that case, its state should say so. Mark it as a draft or otherwise make the delay explicit instead of leaving an ordinary review request open for weeks.

An old pull request whose author has moved to another team is different. It is effectively dead work, yet it still asks every reader to decide whether it matters. The same ambiguity grows when merged branches are never deleted and unused branches accumulate. A repository with scores of branches and year-old pull requests no longer gives a clear view of the work the team can actually ship.

Review active branches and pull requests periodically. Close work that has been abandoned, remove its branch as well, and use repository settings that delete merged branches when that fits the team's process. Cleaning this state is not cosmetic. It restores a trustworthy picture of the project before more work is added.

## Do not let unreleased commits hold one another hostage

The more serious problem appears when the development branch moves far ahead of the production branch. If dozens of commits are waiting, the next deployment contains a large and mixed set of changes. Few people will feel confident releasing it, and that fear encourages another delay.

There can be legitimate differences in release strategy. A team may prepare a separate release branch, for example. But if the team's normal path moves directly from development to the production branch, code that must not ship yet should not enter that path. A change intended for next week can prevent every later commit from going out today. When the release finally happens, the team cannot easily predict the range of a bug or incident.

Teams in this state need an explicit release rhythm. It might be a regular deployment when everyone is available, such as the beginning of the week, or a rule to deploy after a small agreed amount of work accumulates. The exact threshold depends on the size of the changes. The important point is to keep the batch small enough that the team understands and can operate it.

## Large batches make diagnosis and rollback expensive

Consider a refactoring that changes one hundred files. Its author is confident that behavior has not changed, so the deployment is postponed. Other developers then add features on top of it. By the time someone tries to release, the batch touches roughly 160 files.

Suppose that release breaks login or signs customers out. Finding the cause is now difficult because the same areas were changed by the refactoring and by later feature work. Rolling back the entire release is also costly if one of those features was promised to a customer or needed by an external user that day. Returning to the previous production version and cherry-picking only the urgent feature may not work cleanly because that feature was built on top of the large refactoring.

The safer course is to release the refactoring as its own change while its author can observe it and respond. That does not mean deploying carelessly at any time. If the author will be away the next day, ask a colleague to monitor it, deploy early enough to leave time for a response, or wait until the author can own the result. The calendar matters less than having someone available to watch and act.

## Deployment is part of development

Merging code and leaving it unreleased for two weeks is not completion. The live service still does not contain the feature. Even a small change should normally move through deployment and verification promptly; its small size is a reason to validate it quickly, not a reason to hide it inside a later batch.

Fear often sits underneath delayed deployment. Tests and continuous integration can cover expected behavior and reduce that fear, though they do not remove the need to monitor production. A short delivery path makes each result easier to observe, each failure easier to locate, and each rollback easier to reason about.

The practical discipline is simple: keep only meaningful branches active, resolve or remove stale pull requests, merge changes at the right time, and carry merged work through deployment. A project stays useful as a company asset when its visible state matches reality and every change has a clear path all the way into service.
