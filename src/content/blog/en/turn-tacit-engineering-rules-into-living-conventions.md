---
title: "Turn Tacit Engineering Rules into Living Team Conventions"
description: "Document the engineering rules teammates carry in their heads, explain why they exist, permit team overrides, and keep them alive through review and onboarding."
lang: en
translationKey: turn-tacit-engineering-rules-into-living-conventions
publishedAt: 2025-11-02
tags:
  - collaboration
  - architecture
  - engineering-practice
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

One team barely reacted when a developer spent personal time writing down its conventions. Later, a long-tenured maintainer left suddenly, the author had already moved to another team, and a new hire had to join while the project was under pressure. The neglected Markdown file became a useful starting point. It was not perfectly current, but it gave the team enough language to onboard the newcomer and motivated someone else to update it.

## Write the rules that departure would take away

Layer responsibilities, entity usage, places where logic may live, and deliberate compromises in a legacy system are hard to recover from code alone. Record those choices with their reasons in the repository, where teammates can review changes. The document does not need to describe the entire domain; it needs to preserve the software rules otherwise carried as oral history.

Do not wait for a polished company program. If the organization is open and small enough, a shared convention repository can work. In a larger company, a team-level `CONVENTION.md`, architecture note, or README is still useful. A suitable low-change project can be marked as maintenance-only with an explicit policy not to upgrade dependencies.

## Explain conventions after the code has context

Do not run the convention session on a new hire's first day. People understood it better after seeing the code and company constraints. Then the team could explain why a legacy area remains flexible, why controller logic is avoided, or why a particular entity is used as the main concept.

A company-wide convention should be loose enough for a team to override. When a local agreement differs, record it in that team's repository so the next contributor knows which choice applies. The central document is a default, not a way to erase different project maturity and circumstances.

## A convention stays alive through other people's edits

One author cannot keep every repository current. Start with the main or frequently changed projects, and choose honest limits for the rest. Invite colleagues to add a missing rule through a pull request or discuss a disagreement together. Newcomer questions can expose explanations that experienced people no longer notice are absent.

The useful document is not the one everyone politely reads once. It is the one a team changes when its judgment changes and can still use when the person who knew the rules is no longer there.
