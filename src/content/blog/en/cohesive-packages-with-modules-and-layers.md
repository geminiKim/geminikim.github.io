---
title: "Keep Layers Logical and Packages Cohesive"
description: "Modules, packages, and architectural layers solve different problems. Package related behavior together and let layers describe roles without scattering a feature."
lang: en
translationKey: cohesive-packages-with-modules-and-layers
publishedAt: 2023-11-24
tags:
  - architecture
  - modularity
  - packaging
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A module does not need one package for each architectural layer. It can contain presentation, business, implementation, and data-access roles without reproducing those names as its directory tree.

This follows from a distinction I keep making: modules, packages, and layers are related, but they are not the same structure.

A module creates a physical build boundary and can restrict dependencies. A package organizes code and controls proximity and visibility. A layer describes a logical role in the flow of the application. Forcing all three into the same shape can make the architecture look tidy while making the code that changes together harder to find.

## A layer can exist without a layer package

Consider a Q&A feature in a core domain module.

A Q&A controller has a presentation role. A Q&A service coordinates a business use case. A finder, answer updater, remover, or appender may perform smaller implementation responsibilities. A repository interface and its implementation participate in data access, possibly with the implementation located in a separate infrastructure module.

Those layers exist because the classes do different jobs and calls move through them. They do not require packages such as:

```text
presentation/
business/
implementation/
dataaccess/
```

We can instead keep the Q&A classes close to the Q&A behavior they support. The layer is visible in responsibility, dependency direction, naming, and the shape of the code.

This matters because architecture is more than a directory label. A class placed under `business` does not become good business logic, and a repository moved under `dataaccess` does not establish a clean dependency direction. The implementation must carry the design.

## Package by the cohesion you want

Suppose `QuestionService` needs `QuestionFinder`, `AnswerUpdater`, and `QuestionRemover`. If each role lives under a global layer package, opening the service creates imports from distant branches of the tree. The code belongs to one feature but looks geographically unrelated.

I compare this to splitting people between districts such as Gangseo and Gangnam and then claiming they are close because both addresses are in Seoul. The directory labels may share one architectural concept, yet the classes that collaborate every day have been pulled apart.

Keeping feature-specific collaborators near the service has practical advantages. Their relationship is visible in one place. Package-private access may reduce what the rest of the module can call. Navigation requires fewer jumps, and a person changing the Q&A behavior sees the surrounding responsibilities without touring every layer directory.

This is not a command to use one exact feature-package template. Cohesion is the criterion. Code that exists for the same behavior and tends to change together should usually remain near each other. A broadly reused data-access implementation or an infrastructure concern may belong elsewhere. The package boundary should explain the relationship, not satisfy a diagram.

## Use modules only where the stronger boundary helps

The same project can keep a repository interface near the domain behavior and place its technical implementation in a different module. That is a stronger separation than a package. The build can prevent the domain module from importing the infrastructure implementation while allowing the running application to assemble both.

Again, the layer and the module do not map one to one. One module can contain several logical layers. One layer, such as data access, can have an interface in one module and an implementation in another. The right shape follows the constraint we want to enforce.

Creating four modules solely because a diagram has four layers adds build boundaries without proving that those boundaries help. Conversely, keeping everything in one module does not prevent us from writing a clear layered flow. Use the module when compilation or runtime assembly should enforce a rule that package organization alone cannot communicate strongly enough.

## Make the role explicit only when the team needs it

Some teams still want layer roles to be immediately visible in code. That need can be real, especially when naming conventions are inconsistent or onboarding repeatedly produces confusion.

I would first make the responsibilities and package cohesion clear. If the team agrees that another signal would help, a team-agreed annotation can mark the role without moving every class into a global layer package. This is not my default recommendation. An annotation that nobody uses in review or tooling becomes decoration.

The decision should come from team friction: people cannot tell which classes may call which, a boundary is repeatedly crossed, or a role needs to be found reliably. Then choose the least costly signal that solves that problem.

Do not ask a single folder tree to represent every design dimension. Let modules enforce selected physical boundaries. Let packages keep related code close. Let layers describe the logical responsibilities moving through that code. When each tool does its own job, the project can be both understandable and cohesive without turning the architecture diagram into a filesystem.