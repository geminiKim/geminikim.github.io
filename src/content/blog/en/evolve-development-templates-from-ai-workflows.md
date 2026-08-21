---
title: "Evolve Development Templates from Observed AI Workflows"
description: "Update development templates from repeated AI-assisted use, while keeping validation explicit and project-specific instructions out of universal defaults."
lang: en
translationKey: evolve-development-templates-from-ai-workflows
publishedAt: 2026-04-12
tags:
  - ai-agents
  - git
  - engineering-practice
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A reusable development template should lag behind experiments, not lead them. I changed mine only after months of AI-assisted use exposed which old defaults no longer matched my actual workflow.

This is a record of one personal setup. It is not a universal enterprise baseline, and several choices assume the operating system, stack, and way of working that I currently use.

## Move validation instead of quietly removing it

My template used to run lint checks at commit time and block a commit when they failed. That matched a workflow in which I made commits by hand. Now an agent usually prepares the commit and is instructed to run validation, so the local commit hook stopped being the place where the check mattered.

Removing that hook does not mean removing lint or accepting unverified output. The responsibility moved into the execution instructions and review flow. If a team cannot see where validation happens, deleting the hook would only remove a safety net.

The change became reasonable for my template after repeated use, not because commit hooks became obsolete in 2026. A team whose members commit directly may reach the opposite conclusion.

## Keep the universal template smaller than each project

Parallel agent work made worktree support useful in a template where I had never needed it before. Local experiment files also needed explicit ignore rules so they would not enter commits. These are broad workspace mechanics that appeared repeatedly enough to earn a place in my base.

Reusable agent skills were different. A large general skill set may not fit a particular project, team, or new teammate. I still prefer selecting or writing instructions for the current context rather than placing every promising workflow in the universal template.

I also linked two instruction filenames to one source file for convenience. That choice followed my own operating-system assumptions and should not be treated as a portable default. Shared templates need to account for the environments of the people who will actually use them.

## Let architecture experiments earn a template change

AI-assisted development also pushed me to revisit module structure. I tried a single module and a smaller two-part arrangement, then returned to a more familiar baseline because it balanced current productivity with room to extend the project. That is an experimental outcome, not proof that one module layout wins everywhere.

## Re-test defaults as the workflow changes

Changing models can alter how much scaffolding is useful. I sometimes reset the working context and try the same structure again rather than assuming yesterday's instructions remain necessary. The desired direction still persists even when some supporting instructions become lighter.

A template should therefore encode what repeated work has earned: visible validation, workspace support that the workflow actually uses, and a small set of directions that a new teammate can understand. Project-specific tactics can stay with the project until they prove broad enough to belong in the base.