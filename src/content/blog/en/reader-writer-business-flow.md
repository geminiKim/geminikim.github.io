---
title: "Use Reader and Writer Components to Reveal Business Flow"
description: "Reader and writer components can hide storage details, narrow change, and let the business layer show policy, but only when the software's lifetime justifies them."
lang: en
translationKey: reader-writer-business-flow
publishedAt: 2023-10-14
tags:
  - software-design
  - backend
  - maintainability
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Why put `UserReader` and `UserWriter` in front of a repository when the repository already reads and writes users? For a small example, the extra classes can look like empty wrapping. Sometimes they are.

I use these components when I expect the software to live, change, and be handed to other people. The point is not to hide every line of implementation. It is to let the business layer show the business flow while details of obtaining and storing data stay in a layer with a narrower reason to change.

That preference comes from maintenance and handover. A person may join after the original developer has left and receive code with little explanation. I want that reader to find a business operation expressed in meaningful steps rather than a long mixture of repository calls, transport details, mapping, and policy.

## Let the business method read like the work

Consider a payment operation. It loads a user, a store, and an item, checks rules, and performs the payment. A method containing every repository and client call may still work correctly. It also exposes implementation details at the same level as the business decisions.

Wrapping the reads as `UserReader`, `StoreReader`, and similar components can make the operation's shape easier to see. The business layer says what it needs and what decision follows. The implementation component owns how that information is retrieved.

There is a tradeoff. A reader hides details, so someone debugging the retrieval must open another class. Keeping everything inline makes the implementation immediately visible. Neither side wins universally. I choose the wrapper when the clearer business flow and narrower change boundary are worth the navigation.

One useful test is a source change. Suppose store information used to come from the local database but must now come through HTTP. If the payment service calls a repository directly, transport and mapping changes enter the business class. If it depends on `StoreReader`, most of that change can stay inside the reader. The business operation continues to ask for store information in the same language.

That kind of change happens often enough in a service that grows over time. It does not happen often enough in every program to justify predicting it everywhere.

## Components create questions we need to ask

The value is not only insulation. Focused components make responsibility visible and give the team something concrete to discuss.

Imagine a Q&A feature that adds an answer. A new requirement says a blacklisted author must not be allowed to add one. Without deliberate boundaries, the use-case class may gain another repository, fetch blacklist data, interpret it, and append the answer. Its constructor grows, and policy becomes mixed with data access.

Once the implementation is viewed as components, we ask better questions. Should there be a blacklist validator? Does blacklist checking belong with answer creation? Is it a reusable capability or part of this one policy? Which component owns the query, and which owns the decision?

I do not know the correct extraction from the toy example alone. That uncertainty is useful. It stops us from following the existing code mechanically and forces us to decide what should be cohesive.

Readers and writers are names I use for this reasoning. "Business layer" and "implementation layer" are also terms I chose for my own project. They are not sacred vocabulary. A team can select different names as long as it can explain the position and responsibility of each component.

## Evolve toward the boundary

I do not recommend generating a reader, writer, validator, and wrapper for every entity before any behavior exists. Start with the repository if that is all the application needs. As the service grows and repeated or changing responsibilities become visible, gather them into components.

In a long-running example project that I control alone, I may create the boundary earlier because I already expect many changes in that area. That is a contextual bet, not a general law. Another team with a different lifetime and change pattern should make a different bet.

Consistency within the chosen scope matters. If one module always uses readers and writers while an adjacent class reaches through every layer directly, the next maintainer cannot predict the structure. Discuss a loose rule with the team and apply it at a module or project level. Even a convention I personally dislike is easier to maintain when it is coherent and documented than several individual styles mixed together.

A new employee should not rewrite the whole structure to match personal taste. Learn the existing flow, then introduce small changes where the benefit can be shown.

## Lifetime decides how much design is enough

The strongest counterexample is a service that will run for one week and then be discarded. For that case, putting the logic directly in a controller may be reasonable. Building layers for years of maintenance in a one-week program wastes time.

If customers are growing and the service delivers an ongoing company value, the calculation changes. Developers will leave. Storage and integrations will change. New rules will enter old flows. A small amount of structure can reduce the number of places each change touches and make handover less dependent on one person's memory.

The distinction I care about is not "repository bad, reader good." It is whether the code expresses the business at the level where people make business changes. Use a reader or writer when it gives an implementation responsibility a stable home and keeps the business flow clear. Skip it when it only adds a name to a call that will never need the boundary.

Make the software's expected lifetime part of the design. Rules that ignore that condition turn a useful component into ceremony.