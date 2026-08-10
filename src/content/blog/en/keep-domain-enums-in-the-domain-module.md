---
title: "Who Owns the Enum? Dependency Design Across Domain Modules"
description: "Put a business enum with its domain, let storage depend inward, and use a small shared enum module only while the domain boundary is still emerging."
lang: en
translationKey: keep-domain-enums-in-the-domain-module
publishedAt: 2024-01-26
tags:
  - modularity
  - architecture
  - dependencies
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

When an enum describes a core business distinction, the database module should not own it. A review type used by both an API request and a persistence entity is still a review concept. Put it with the domain, then make the surrounding modules depend on that definition.

The concern I often hear is that this creates a circular dependency. In a properly directed module graph, it does not.

## Draw the dependency graph before duplicating the type

Consider three modules:

- a domain module containing business objects and repository interfaces;
- a storage module containing JPA entities and repository implementations;
- an executable API module containing controllers and application wiring.

The domain knows neither storage nor API. Storage depends on the domain because it implements domain interfaces and converts persisted data into domain objects. The API depends on the domain and includes storage at runtime so the implementation is available when the application starts.

With that direction, both a JPA entity in storage and a request model in the API can import `ReviewType` from the domain. There is no path back from the domain to either outer module, so there is no cycle.

Trying to make storage know nothing about the domain can produce a stranger result. Storage then needs its own result objects and enum representations. Those storage types eventually leak inward because the application must consume them. The effort to hide the domain from its implementation reverses the intended dependency.

## The enum belongs where its meaning lives

The decision is not “enums always go in one module.” It is “the owner of the meaning owns the type.” If `ReviewType` controls review behavior, it belongs with reviews. The persistence layer may store its name, and the API may accept it directly or parse a string into it, depending on the external contract. Those are representation choices; they do not transfer ownership.

A request and a domain object do not have to use identical fields. Still, avoiding every shared domain type can create conversion code without buying a meaningful boundary. Use a separate request representation when the external specification needs it, not merely because the value passes through a controller.

## Make a temporary choice when the domain is not ready

There is a harder starting structure: the API module contains controllers and early business code, while storage is already separate. The domain has not matured enough to deserve its own module. Letting storage depend on the entire API just to import one enum gives it a much wider view than it needs. Extracting an immature domain module can also freeze a boundary too early.

In that stage, a small shared enum module is a practical bridge. Both API and storage can depend on it without exposing the whole API. The cost is that related enums may be scattered temporarily, but that can be preferable to pretending the domain boundary is already understood.

As business knowledge grows, the enum can move into the domain module with the rest of the concept. The right answer therefore depends on the current module shape, the maturity of the model, and the purpose of the split.

A clean dependency graph matters more than a fashionable module count. Keep the business enum close to the business when that boundary exists. When it does not, isolate only the minimum shared type and leave room for the domain to emerge.