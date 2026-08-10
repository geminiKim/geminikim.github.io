---
title: "The Common Module Trap: Organize Code Around Concrete Capabilities"
description: "Delay common modules until ownership is clear, and organize logging, exceptions, and shared protocols around concrete capabilities instead."
lang: en
translationKey: delay-common-modules-until-boundaries-are-clear
publishedAt: 2024-12-21
tags:
  - modules
  - architecture
  - maintainability
draft: false
---
> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A `common` module promises an easy home for code used in more than one place. That convenience is precisely what makes it dangerous. When the software's boundaries are still unclear, “used twice” becomes a substitute for ownership. Logging configuration, exceptions, response models, helpers, and eventually business rules all drift into the same module.

The safer default is to delay the common module. Let concrete capabilities become visible first, then group code around a responsibility with a name that tells the next maintainer what belongs there. Sharing remains available when the need is real; it simply has to earn a clearer boundary than “common.”

## Reuse does not define ownership

Consider a helper used by both order and member code. Moving it into `common` removes duplication, but it does not answer why the helper changes. If member policy changes while order behavior must remain stable, the supposedly shared class starts growing branches such as “for order” and “for member.” The module has centralized code while separating it from the concepts that govern it.

This becomes harder to maintain as the project grows. A change for one consumer can surprise another. Reviewers must inspect distant callers to understand the impact. New developers see `common` as an approved destination for anything whose owner is uncertain, so the ambiguity compounds.

The warning sign is not a particular number of classes. It is a common area that contains more meaning than the core capabilities it was meant to support. If business logic lives there because several modules call it, reuse has erased the direction of responsibility.

## Name the capability you are actually building

Logging is often described as a cross-cutting concern, but that does not require a generic common bucket. If the system needs to handle diagnostic context, propagate tracing information, and configure related behavior, those pieces can be cohesive as a logging capability. A `logging` module gives contributors a concrete test: does this code serve logging and tracing, or is it merely convenient to share?

Monitoring can be treated the same way. The point is not that every capability deserves its own module immediately. Packages inside the existing project may be enough. A module becomes useful when the capability has sufficient size or dependency needs to justify a boundary.

Naming matters because it preserves intent. `support` may be better than `common` when the responsibility is genuinely supportive, but an even more specific name is preferable when available. The name should narrow possible contents rather than invite accumulation.

## Keep exceptions at the boundary that owns their meaning

Exceptions create a strong urge to define one base type that every module can use. That can make global handling look convenient, but it also connects otherwise separate modules to one central abstraction.

The meanings are often different. A domain module owns failures in its internal rules. An API module owns how errors cross the boundary to external clients. Those errors occupy different levels even if both are represented as exceptions in code. Letting each module manage the errors it owns keeps internal concepts from being shaped by an outward-facing response contract.

This does not forbid all shared exception infrastructure. It argues for postponing it until repeated, stable behavior shows what truly needs to be shared. Starting from a company-wide base exception before those boundaries are known makes the dependency easy to create and difficult to remove.

## Extract a shared protocol only when it is concrete

Some duplication can justify a shared module. Suppose many internal or external API clients must follow one stable response format, and changes require edits across numerous integrations. A module for an `internal-api-spec` or a specifically named client protocol can make sense.

That boundary is useful because its role is explicit. It owns a communication specification, not every utility used by callers. Developers can decide whether a class belongs there by asking whether it represents that protocol. The module can also evolve with the integration responsibility rather than becoming a container for unrelated helpers.

Even then, extraction should follow the observed cost. A small project with a few callers may be clearer with local code. As duplication and coordinated changes become substantial, the specific protocol module becomes easier to justify.

## Design for the people who inherit the code

A carefully managed common module may work while its original authors remember every unwritten rule. Teams change. New hires arrive, maintainers move, and nobody can personally guide every edit. A vague boundary degrades quickly because correct placement depends on knowledge that the structure itself does not express.

Concrete capability modules leave a stronger asset. They make ownership visible, constrain where changes spread, and help an unfamiliar developer choose a destination without guessing. Delay sharing until the common lifecycle and responsibility are evident. When sharing is necessary, name what is actually shared. The result may contain a little duplication for longer, but it avoids concentrating unrelated change in the most ambiguous part of the system.
