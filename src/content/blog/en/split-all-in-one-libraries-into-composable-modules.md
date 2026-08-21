---
title: "Split All-in-One Libraries into Composable Dependency Modules"
description: "Avoid hidden infrastructure, runtime cost, and dependency conflicts by splitting company libraries into modules each service can understand and compose deliberately."
lang: en
translationKey: split-all-in-one-libraries-into-composable-modules
publishedAt: 2025-12-14
tags:
  - architecture
  - backend
  - reliability
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A service did not use Redis, yet Redis warnings appeared in production. In the worst version of this failure, a problem in that unused integration could consume the service's resources. The cause was an all-in-one company library that imported Redis, Kafka, messaging, Swagger, and other infrastructure whenever a service took the common dependency.

## Excluding dependencies is sorting an unknown bin

Gradle exclusions can remove unused transitive dependencies, and they were used in such a company. The trouble is that each service has to discover what is inside the bundle before it can subtract anything. One Redis dependency may lead through several clients and libraries, so removal is not a single obvious line.

Defaulting every integration to disabled is better because it avoids some runtime work. It still leaves unrelated code in the dependency graph. A large organization where nearly every service truly uses the same infrastructure may value a broad standard package, but that assumption does not hold for services of different sizes and purposes.

## Build the company library from selectable parts

Logging, database access, Redis, Kafka, and test support can be separate modules. A service then adds the capability it understands and needs. One previous company used this composable structure, with review focused on preventing one module from quietly pulling unrelated infrastructure across the boundary. Spring Boot 4.0's more separated test modules provide a concrete illustration: JDBC or JPA test support can be selected with the dependencies appropriate to that feature instead of arriving inside one test auto-configuration bundle. The value is not new business logic; it is clearer visibility and composition.

## Put convenience above the parts, not instead of them

Small modules create a discovery cost. Developers need to know which ones form a typical service. A company can answer with documented parent compositions such as a simple web or heavier web setup. Those presets should assemble the smaller modules and state what “simple” contains, rather than return to an opaque universal dependency. The organizational choice is whether to optimize for stamping out identical services or for making developers think while choosing which modules to add. Both have costs. Prefer adding known parts over removing unknown behavior: build the smallest service from visible blocks, then provide named parent combinations when they are needed.
