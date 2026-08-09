---
title: "Gradle Dependency Scopes Are Architectural Boundaries"
description: "Use Gradle implementation, api, runtimeOnly, and compileOnly deliberately to express module access, prevent accidental coupling, and preserve design intent."
lang: en
translationKey: gradle-dependency-boundaries
publishedAt: 2023-10-28
tags:
  - gradle
  - architecture
  - modularity
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A Gradle dependency declaration is not housekeeping. In a multi-module project, it decides which classes another module can see and which mistakes the build will refuse to compile. That makes `implementation`, `api`, `runtimeOnly`, and `compileOnly` part of the architecture.

My default is simple: start with `implementation`. Change the scope only when I can explain the access that another module needs.

## Keep transitive implementation details hidden

Assume an `sftp-client` module uses Spring Integration SFTP internally. A `payments-batch` module depends on `sftp-client`.

If `sftp-client` declares Spring Integration with `implementation`, `payments-batch` can compile against the public types that `sftp-client` exposes, but it does not automatically receive Spring Integration's classes on its compile classpath. That is useful. The batch module should ask the client module to transfer a file; it should not reach through the client and construct Spring Integration objects directly.

If the dependency is declared with `api`, those classes are exposed to consumers. That can be correct when the module's own public API requires them. It also creates an easy shortcut. A developer sees a convenient class in the transitive library and uses it from the upper module. The intended boundary is now porous even though every code review once agreed that SFTP details belong below it.

Code review can catch that choice. A compile-time restriction catches it before review and keeps catching it after the original developers leave. The difference matters during handover. Seeing a class in autocomplete invites use. Seeing that a dependency scope must be changed first adds a moment of friction: "Was this hidden on purpose?" I want that question to happen.

This is the first job of a module in my design: isolation that creates a constraint. Cohesion and a readable architecture can follow, but a module that restricts nothing is often only another directory with a build file.

## Give runtime composition a narrow path

Some modules must be present when the application starts but should not become implementation dependencies of the module that assembles the application.

Suppose a core API application loads an admin module as part of the running Spring application. The core module needs the admin code on the runtime classpath, but its source should not call admin implementation classes. A `runtimeOnly` relationship can express that direction. The application can compose the module at runtime while the compiler prevents core code from importing it.

Changing that declaration to `implementation` removes the guard. Suddenly the core module can call into admin because the classes are available at compile time. The application may still run, but the architecture has lost a boundary.

`compileOnly` solves a different problem. A module may need an API to compile while another application owns the actual runtime. In the example project, the admin API is absorbed into and run by the core API rather than launched by itself. A compile-only dependency can state that the admin code needs certain types for compilation but does not own their runtime delivery.

That choice has consequences for tests. A dependency available only to main compilation may be absent from test compilation or test runtime. The test configuration must then add exactly what the tests need. The declarations can look repetitive, yet the repetition is carrying information: production compilation, runtime assembly, and test execution do not have identical classpaths.

IntelliJ makes these classpaths visible. When a test cannot find a JPA or web class, inspect the compile and runtime classpaths before adding broad dependencies at random. The failure may be the build telling the truth about an unstated requirement.

## Treat cycles as a design warning

Dependency scopes help enforce a good boundary; they do not rescue a bad module split.

If domain modules depend on one another in both directions, I consider that a strong warning. There may be a deliberate trade-off, but more often the concepts were divided incorrectly. Changing `implementation` to `api` until everything compiles hides the signal. The useful response is to revisit ownership and dependency direction.

The same restraint applies to `compileOnly`. It can improve classpath precision, but precision has a cost. If a mature team agrees that using `implementation` everywhere is sufficient for a small project, that can be a reasonable strategy. Build complexity should earn its place. I care about whether the declarations communicate a boundary that the team can understand and maintain, not whether the file demonstrates every Gradle configuration.

## Design for the people who inherit the build

Company software is an asset that somebody else will operate. I have seen systems rebuilt as soon as their author left because continuing the existing design cost more than replacing it. Build configuration is not the whole cause, of course, but small constraints can preserve intent after the explanation disappears.

The appropriate constraint should match the team. If a jar has a crack halfway up, pouring water above that point does not fill it. A design that only one specialist understands leaks away when that person is absent. I prefer a standard that the whole team can use, with a small stretch that helps less experienced members grow. A configuration so clever that nobody dares touch it has failed the handover test.

One practical exercise is to make dependencies narrower and observe what breaks. Start with `implementation`. Try moving a dependency to `runtimeOnly` when consumers should not compile against it. Use `compileOnly` when code needs a type for compilation but does not provide it at runtime, then supply explicit test dependencies. For a deeper exercise, temporarily move dependencies toward `compileOnly` and inspect every compilation failure. Do this in a branch, not as an unreviewed production change.

Use `api` reluctantly. It means, "If you depend on me, you are allowed or required to know this dependency too." A shared test module may legitimately expose the testing types its consumers need. A library's public signature may require an API dependency. Those are decisions, not defaults.

A good Gradle file answers architectural questions before a person opens the implementation. Which module owns this technology? Which classes may consumers use? Who supplies the runtime? What must tests assemble for themselves? When the scopes answer those questions, the build is doing more than downloading libraries. It is protecting the design.