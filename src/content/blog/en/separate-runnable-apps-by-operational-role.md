---
title: "One Project, Many Deployables: Drawing Boundaries by Runtime Role"
description: "Separate public, admin, batch, and operations workloads into runnable applications without splitting the whole codebase into separate projects too early."
lang: en
translationKey: separate-runnable-apps-by-operational-role
publishedAt: 2024-09-04
tags:
  - backend
  - architecture
  - deployment
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A project is a code boundary. A runnable application is an execution boundary. Treating those as the same thing makes a codebase harder to grow and can put unrelated workloads on the same server for no good reason.

A single-module project often produces one runnable application, so the association feels natural. It is still only one arrangement. A project can contain several runnable applications, each with its own entry point and operational role. The better question is not how many applications a project is supposed to have. It is whether the code and the workloads are grouped coherently.

## Keep related code together while separating execution

Consider a service with a core API, an admin API, and an admin batch job. They may belong to one codebase because they share a mature business context and change together. That does not mean they should start as one process.

Each can be a runnable module inside the project:

- the core API serves product traffic;
- the admin API serves administrative requests;
- the batch application runs scheduled or on-demand work.

The deployment system builds and starts each runnable target independently. A batch application may run only when needed, while both APIs remain available as separate servers. The repository stays cohesive without forcing every workload into one runtime.

This is often a useful stage before splitting a growing area into a separate project. Creating a new repository or top-level project every time another server is needed adds a structural boundary before the code has earned one. A runnable module gives us an execution boundary now and leaves the larger source boundary reversible.

There is a limit. Too many runnable applications become an operational inventory of their own. The point is not to maximize their number. It is to create a distinct runtime when the role, load, or failure behavior justifies it.

## Deployment does not have to dictate source layout

Teams sometimes keep one application per project because their deployment system appears to assume it. That coupling is avoidable. The deployment job only needs to know which source set to build and which artifact to run.

Suppose the admin API and admin batch job grow enough to become independent projects later. Their deployment identities can remain the same. The build target changes from a module in the original project to a source set in the new project. The operational boundary was already present, so the deployment design does not need to be reinvented.

This gives the code room to mature before a harder split. At first, related capabilities can share one project and its internal modules. Once ownership, dependencies, and change patterns are clear, a module can move out. The deployment boundary survives both arrangements.

That is why the number of runnable applications should not be derived from the number of projects. Projects and modules organize source. Runnable applications organize execution. They influence each other, but one should not mechanically determine the other.

## Isolate dangerous internal workloads

The operational reason for separate runnables becomes clearest with internal APIs. Imagine adding endpoints for bulk updates or bulk uploads. These operations may consume considerable CPU. If they live in the public core API, one careless internal request can exhaust resources and take down customer traffic.

A path such as `/operations` inside the core API separates URLs, but it does not separate failure. Both paths still consume the same process and server resources. A dedicated operations application creates a real runtime boundary. It can be deployed on a separate server, given different resources, and stopped or scaled without touching the core API.

The same judgment applies to admin and batch workloads. Their audiences, traffic patterns, and failure costs differ from the public API. Keeping their business code nearby may still improve cohesion, while running them separately prevents one role from damaging another.

## Draw the boundary that solves the current problem

Several runnable applications in one project may look unusual if every project you have seen produced only one. Familiarity is not an architectural constraint.

Start with the responsibilities and operational risks. Keep code together when it belongs to the same evolving context. Create a separate runnable when a workload needs an independent lifecycle, resource budget, or failure boundary. Split it into a new project only when the source itself has matured into an independent unit.

This approach avoids both extremes: one process carrying every role, and a collection of premature projects created only because another server was needed. The result is a source layout that follows cohesion and a deployment layout that follows runtime reality.