---
title: "Translate Exceptions at Module Boundaries"
description: "Keep implementation exceptions inside their modules and define explicit translation boundaries that prevent dependencies from leaking upward."
lang: en
translationKey: module-exception-translation-boundaries
publishedAt: 2025-01-19
tags:
  - architecture
  - backend
  - api-design
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Follow one external API failure through the code. An HTTP library throws its own exception inside a client module. If that type reaches the core module and finally a controller advice, a private implementation choice has become a dependency of every layer above it. Translation decides where that leak stops.

## Follow the failure across two module boundaries

The client module first catches the library exception and wraps it in a client-module exception. Its consumer now knows that the client failed without knowing which HTTP implementation produced the failure. The module carries its own failure contract and can remain intact if it is moved or its internal library changes. Putting every exception in a shared module would weaken that independence by giving all modules another common dependency.

The consuming implementation or tool layer then chooses whether the client exception may travel farther. It can catch that type and translate it into a core exception before passing the failure upward. This is the bulkhead: the outside module's exception does not cross in its original form, and the business flow speaks the application's language rather than the HTTP library's language.

Letting a client exception reach a global controller advice is not automatically wrong. One small application with one client may remain easy to understand that way. As clients multiply, however, the presentation layer can become a registry of exceptions from modules far below it. The choice is where to draw the wall before that dependency spread becomes expensive.

## Exception placement still follows the meaning of the failure

Translation between modules does not require every exception to originate in one preferred layer. Invalid HTTP input should be rejected at the presentation boundary so complete values move inward. Insufficient points or a missing user may arise naturally in the business operation that discovers the condition.

If the project has an implementation layer coordinating repositories and clients, many failures can be completed there. A smaller application may have no such layer, making a business service the direct and understandable place to throw. Full dependency inversion can isolate more, but it may be too much structure for the size of the software.

Define which exception each module exposes and how far a consumer permits it to travel. A simple `catch` and translation can be enough. The rule should preserve the module as a whole without turning “services never throw” or any other layer preference into a universal command.
