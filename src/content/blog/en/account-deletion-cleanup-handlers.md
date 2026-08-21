---
title: "Coordinate Account Deletion Cleanup Without a Message Broker"
description: "For small services, collect domain-specific cleanup handlers behind one interface so account deletion stays explicit without extra messaging infrastructure."
lang: en
translationKey: account-deletion-cleanup-handlers
publishedAt: 2026-01-04
tags:
  - backend
  - dependencies
  - software-design
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Account deletion reaches across a service. Reviews, points, favorites, and other domain data may all need some form of follow-up, yet making the user service call every domain service directly creates an obvious dependency problem.

A small service does not automatically need a message broker to avoid that coupling. One practical option is to define a common post-deletion interface, let each affected domain provide an implementation, and inject those implementations into the user service as a list. The deletion flow can then iterate over that list without knowing each concrete domain service.

## A handler list keeps the flow in one place

Suppose the points domain and the reviews domain each implement the same cleanup interface. The user service receives both implementations through the list, then invokes them when an account is deleted. It depends on the shared role of a cleanup handler rather than on points and reviews directly.

This keeps the coordination code visible. An application event can reduce direct references too, but its publishers and listeners may make the path harder to follow. With an explicit list, a reader can see where the post-processing starts and that every registered implementation is traversed.

The invocation can be sequential if deletion is meant to finish only after the handlers run. It could also be treated as background post-processing if account deletion itself completes first. Those are alternatives in the example, not a complete failure-handling design.

## The service's scale decides how far this pattern goes

The preference for a handler list assumes a small, growing service: few users, uncomplicated deletion logic, and limited infrastructure. Under those conditions, adding a broker such as Kafka may create more machinery than the current problem warrants.

That judgment can reverse. If account deletion touches a large number of features, publishing an event and letting each area react may become the cleaner shape. The point is not that events are wrong. It is that loose coupling does not require hiding a small flow behind infrastructure before the flow has earned that complexity.

For the smaller case, the interface and implementation list provide a modest boundary. Each domain owns its cleanup behavior, while the user service retains a direct view of the coordination. That is enough to loosen the dependency without pretending the account-deletion problem itself has become simple.