---
title: "Earn Your Interfaces: Abstraction After Evidence"
description: "Start with concrete code, extract interfaces from proven variation, and keep one-to-one abstractions only when they create a real boundary."
lang: en
translationKey: interfaces-after-concrete-design
publishedAt: 2024-07-26
tags:
  - architecture
  - design-patterns
  - maintainability
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

An interface should make a boundary or a family of behaviors clearer. Yet many projects begin with `UserService`, immediately add a `UserServiceImpl`, and stop there. One interface, one implementation, and no variation: the abstraction exists because the project convention demanded it, not because the code revealed a need.

This arrangement may run perfectly well. The problem is the cost it adds to understanding. Every interface asks a reader to look for possible implementations and discover whether substitution or dependency control matters. When the answer is repeatedly “there is only the `Impl` class,” the codebase spends attention without communicating much in return.

## Treat interfaces as a limited design resource

Interfaces have substantial benefits, but those benefits do not make them free. If nearly every service receives an interface by default, the important abstractions become harder to distinguish from ceremonial ones. Navigation grows less direct, names carry less information, and the structure can suggest flexibility that the implementation does not have.

That is why an interface is worth conserving. Reserve it for a distinction the team can explain: several implementations share a meaningful contract, a module needs to reverse or loosen a dependency, or a boundary must hide implementation details. The criterion is not whether an interface is considered good design in isolation. It is whether this particular interface tells the next reader something true about the system.

## Let concrete implementations reveal the abstraction

A healthier default is to begin with the concrete behavior. Suppose the first thing the system needs is a single user service. Call that class `UserService` and develop it without predicting every future variation.

Later, the code may produce genuinely different roles—perhaps normal, common, and heavy user services. Their behavior may reveal a stable common shape. At that point, extracting an interface is a bottom-up design decision based on evidence in the implementation. `UserService` can become the shared contract, while the concrete classes receive names that explain what each one actually does.

This order improves naming as well as abstraction. Starting with `UserService` and `UserServiceImpl` gives the descriptive name to the interface before the implementation has a distinct role. `Impl` merely says that a class implements something; it says nothing about why this implementation exists. Once real variants appear, names can express those differences instead of reducing every class to a generic implementation suffix.

The resulting contract need not end in `Service`, either. If the common behavior is specifically registering a user, a role-oriented name can say that more directly. The familiar Controller–Service–Repository sequence should not decide the vocabulary before the behavior is understood. Implementation is not the opposite of design; concrete work can supply the evidence from which the design develops.

## One implementation can still justify an interface

Implementation count is not the only test. A one-to-one interface may be justified when it creates an architectural boundary. A domain module, for example, can define the capability it needs as an interface while another module provides the concrete implementation. Even if there is only one implementation, the interface keeps the domain from depending directly on that implementation and loosens coupling across the boundary.

That is materially different from generating an interface beside every class. In the module case, the team can point to the dependency the interface controls. The abstraction has a job today. “We may need another implementation someday” is a much weaker reason when no current boundary or variation supports it.

So the practical questions are broader than “How many implementations are there?” Ask what dependency the interface changes, what concept it names, and what becomes clearer because it exists. If those answers are concrete, a single implementation is not a contradiction.

## Change conventions without leaving the project between versions

An established codebase has a social and operational constraint: everyone already knows its shape. Removing every `Impl` suffix in one pass may create more disruption than clarity. Mixing several naming and layering conventions indefinitely can be worse, leaving the project in an awkward half-migrated state.

For an existing project, either keep the familiar convention for now or agree on a coordinated refactoring boundary. A new project is the easiest place to choose the smaller default. A team can also test the idea on a limited area: remove an unnecessary interface, compare how the code reads, and discuss what was gained or lost.

The goal is not to ban interfaces or `Impl` by decree. It is to stop producing abstractions automatically. Begin with a concrete, well-named implementation. Extract a contract when repeated behavior or a real dependency boundary earns it. Then the interface communicates a decision the code actually needs, rather than a template the team has stopped questioning.
