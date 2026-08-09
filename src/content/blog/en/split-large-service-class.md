---
title: "How to Split a Large Service Class by Responsibility and Layer"
description: "Use constructor dependencies and imports to diagnose an oversized service, then separate cohesive responsibilities before adding another architecture label."
lang: en
translationKey: split-large-service-class
publishedAt: 2023-08-26
tags:
  - backend
  - refactoring
  - architecture
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

When a class named `UserService` has twenty constructor dependencies and a hundred methods, I do not believe it has one coherent responsibility. It has become the place where unrelated work accumulates because every new function involving a user seems allowed to enter.

The constructor may contain payment and coupon dependencies alongside the user repository. That is a signal that several responsibilities have accumulated in one service. The name remains stable while the meaning expands until `UserService` means "most things in this application."

If the class already feels too responsible for too much, separation is usually the right direction. The difficult part is finding a boundary that improves the code instead of turning one large file into ten arbitrary files.

## Read the constructor before reading every method

In legacy code, the constructor is one of the fastest diagnostic tools I know. Its dependencies show what the class has been asked to coordinate.

A user service that depends on a user repository is unsurprising. Add a payment repository, a coupon repository, and several unrelated clients, and the constructor starts telling a different story. The import list gives another useful view. Together they reveal the regions of the system this class reaches into before we understand every branch in every method.

I first group dependencies and methods by the concepts that actually change together. Payment-related work may become `UserPaymentService`, or perhaps simply `PaymentService` if the responsibility is not really owned by the user concept. Coupon work can move into a coupon-focused component. The names are provisional. The useful signal is that dependencies disappear from the original constructor as cohesion improves.

This is an incremental strategy for old code. We do not need to understand and redesign the entire system in one attempt. Extract one responsibility whose callers and data dependencies are reasonably clear. Observe what remains. The shrinking constructor and import list make the next boundary easier to see.

Simply moving methods is not enough, though. If every extracted class still depends on every repository, we have reproduced the same knot across more files. Separation should narrow what each component needs to know.

## Escape service-controller-repository tunnel vision

There is a second problem I call "service hell." A team treats controller, service, and repository as the only available shapes, so every piece of behavior must fit into a class ending in `Service`.

That structure is a useful starting convention. It is not a complete model of every responsibility. Once the large service has been divided into cohesive areas, inspect the relative position of the remaining code. Some components express a business use case. Others read data, perform an implementation detail, combine several use cases, or translate an external interface. Calling all of them services hides those differences.

When every responsibility is expressed only as a service, the relative position and layer differences between those components can be lost. The problem is not solved by finding a more impressive suffix. It is solved by recognizing that the classes occupy different layers and giving those layers boundaries the team can explain.

This does not require importing a full architecture template. A small implementation component, reader, facade, or coordinator may be enough. The exact word matters less than whether the code reveals which component owns business flow and which component supports it.

## Spring's annotation does not name the class

I am not fond of attaching `Service` to every class merely because Spring provides `@Service`. That annotation helps register a component; it does not command us to name every annotated class `SomethingService`.

The same applies to controllers. In one project, after discussing it with the team, I used `Router` for classes that exposed routes. That is not a universal recommendation. It is an example of breaking the assumption that framework vocabulary must dictate our design vocabulary.

Team consistency still matters. A private naming experiment that makes every neighboring class harder to understand is not an improvement. Agree on what a name means inside the project, then use it consistently. The convention should help a reader predict responsibility, not show that its author knows unusual terminology.

## What I want from the refactoring

A useful split should produce visible effects:

- the original constructor has fewer unrelated dependencies;
- imports cluster around one concept;
- extracted classes have a reason to change that can be stated plainly;
- layer relationships are more obvious than before;
- names describe work rather than repeat a framework stereotype.

The first boundary may be imperfect. That is normal in a legacy system. I would rather make one understandable extraction and learn from it than impose a complete diagram on code I do not yet understand.

The goal is not a lower method count by itself. A hundred methods can become ten confusing classes very easily. The goal is to make the responsibility and position of each piece clearer, so the next person can tell where a change belongs without reopening the entire application.