---
title: "Upgrade Dependencies Before the Gap Becomes a Project"
description: "Frequent, prioritized dependency upgrades keep change small, expose compatibility problems early, and prevent a maintained service from quietly accumulating debt."
lang: en
translationKey: frequent-dependency-upgrades
publishedAt: 2023-11-04
tags:
  - dependencies
  - maintenance
  - technical-debt
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

The easiest way to upgrade dependencies is disappointingly simple: upgrade them often.

Moving Spring Boot from `3.1.4` to `3.1.5` is usually a smaller job than moving a service from `2.4` to `3.1`. If the service will eventually need the large move, postponing every smaller move does not remove the work. It combines compatibility changes, deprecated APIs, altered defaults, language or runtime requirements, and library interactions into one project whose cause is difficult to isolate.

Software is a company asset. A maintained asset needs maintenance even when no feature request mentions it.

## Not every repository gets the same schedule

Saying that dependencies should stay current is easy when one team owns one repository. A team may operate twenty. It cannot treat every library release in every repository as urgent.

I would first rank the systems by business importance and change frequency. Include how often the team touches them, the traffic or users they serve, the cost of an incident, their expected lifetime, and whether the software is still actively operated. Then decide how many the current team can maintain well.

The most important group can receive frequent patch and minor upgrades. Another group may have a scheduled upgrade window for larger releases. A low-value system near retirement may receive security fixes and little else. If every one of twenty repositories is critical and long-lived, the conclusion may be that the team lacks maintenance capacity, not that engineers should quietly work faster.

Priority does not mean starting the experiment on the number-one system. The most important service also has the largest failure cost. When introducing a framework line or upgrade procedure, I may begin with the fifth-ranked service, or even a lower-traffic system that the team still changes regularly. It can reveal migration trouble with a manageable blast radius. The lessons then reduce risk for the central service.

This is staged operation, not neglect. Write down which systems belong to each tier and when their position will be reviewed. Otherwise "we will upgrade it later" becomes permanent policy without anybody deciding that it should.

## Current does not mean installing every release immediately

I do not upgrade blindly on the day a version appears. I am particularly cautious with `.0` releases. I jokingly call it the curse of version zero: the first general-availability release of a new line often exposes problems that a later patch settles. For an important service, waiting for a stable patch after GA can be a reasonable trade-off.

That caution is different from remaining several major lines behind. A team can avoid the first release and still follow the supported line steadily. The goal is not to win a version-number contest. It is to keep the distance small enough that change remains understandable.

Each upgrade needs ordinary engineering checks. Read the release notes. Compile and run the test suite. Inspect deprecations and changed defaults. Review what changed, consider likely problems, and exercise the upgraded service with traffic where possible. A green build is useful, but it is not the whole operating result.

Frequent upgrades improve diagnosis. When only one patch changed, a regression has a narrow search area. When years of dependency changes arrive together, every failure has many plausible causes. Small steps make rollback and review easier too.

## Every new dependency opens a maintenance account

Adding a dependency has an immediate benefit, so its cost is easy to understate. It saves code or provides a capability. From then on, however, the team must follow its versions, security notices, compatibility matrix, runtime needs, configuration changes, and possibly its abandonment.

I consider every dependency an addition to maintenance cost and, in that sense, a potential addition to technical debt. This does not mean "never add a library." It means asking whether the value is worth a recurring obligation.

Before adding one, I want to know:

- Is the problem large or specialized enough to justify a library?
- Is the project maintained and compatible with our stack?
- Does another existing dependency already solve it?
- How much of its API will spread through our code?
- Can we remove or replace it later?

The best dependency upgrade can be deleting a dependency that no longer earns its cost. Removal reduces the version surface, the compatibility combinations, and the knowledge a future maintainer needs. That is a direct reduction in debt.

## Maintenance is part of feature delivery

For a main system expected to live as long as the company needs it, staying on an old framework forever accumulates a gap with each release. The debt is quiet because the service may continue running today. It becomes visible when a security requirement, runtime end-of-life, new feature, or hiring constraint forces a move under pressure.

Keeping pace does not feel like paying off a dramatic debt because there is no large rescue. That is the point. Regular patch upgrades and deliberate major upgrades prevent the rescue project from forming.

While a project is in my hands, I want its dependency state to be explainable. I should know which line it follows, why an upgrade is delayed, what test proves compatibility, and who will revisit the decision. Updating a framework template I maintain follows the same discipline as updating a company service: check what changed, run it, and keep the gap from growing unnoticed.

If frequent dependency upgrades sound like obvious maintenance, good. They should be ordinary. A healthy asset should not need a special campaign every few years just to become maintainable again.