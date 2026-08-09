---
title: "Do Not Create a DTO for Every Layer by Habit"
description: "Use DTOs where data crosses a boundary with a different contract. Mapping has a cost, but so does letting external request shapes define the inside of a service."
lang: en
translationKey: dto-boundaries-between-layers
publishedAt: 2023-12-09
tags:
  - backend
  - architecture
  - api-design
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A team receives an HTTP request in the presentation layer, maps it to another DTO for the service layer, then maps the result to a response DTO. As the number of fields grows, developers begin to ask whether all that mapping is waste.

It may be. It may also be the cost of keeping a useful boundary. The class names alone do not tell us which one.

I normally separate the external request and response from the important objects used inside the application. A controller accepts a request shaped for the API contract, converts it to an internal concept or command, invokes the use case, and converts the result to a response. The internal object can move through the business and implementation layers when it represents a concept those layers genuinely share.

What I do not automatically add is one more DTO merely because data crosses from the presentation package into the service package. A boundary should explain a difference in meaning, ownership, or rate of change. "There is another layer" is not enough by itself.

## External contracts change for external reasons

The request model belongs to the API boundary. It may include strings that need parsing, optional fields, transport-specific defaults, validation annotations, or names chosen for client compatibility. A later API version may rename a field or combine two values without changing the business concept.

The response model has its own reasons to change. It can hide internal fields, format dates, flatten objects, attach links, or present one domain result differently for mobile and admin clients. Returning an internal domain object directly makes the inside of the service answer to these presentation concerns.

That is why mapping at the outer edge is often worthwhile:

```text
HTTP request -> application concept -> use case
use-case result -> HTTP response
```

A request such as `AddUserRequest` might expose a conversion method that creates `AddUserCommand`. A response such as `QnaResponse` might build itself from the result returned by the Q&A use case. The exact location of factory methods is a team choice. What matters is that the transition is visible and testable.

The mapping code may look repetitive, but it buys the freedom to change the API without forcing the same shape through every internal layer. An explicit response model lets the team choose which fields are exposed and reduces accidental coupling to internal serialization when the response type and serializer are configured accordingly.

## More DTOs do not automatically mean more isolation

Now consider a second pattern:

```text
HTTP request -> presentation-to-service DTO -> application command
```

If the middle DTO has the same fields, the same validation assumptions, and the same lifecycle as one of its neighbors, I would ask what problem it solves. It may be a team convention with a good reason that is not visible from a small example. Without that reason, it adds naming, mapping, tests, and navigation without establishing a real boundary.

A useful DTO usually protects one side from a different source of change. For example:

- The HTTP request accepts a legacy field name, while the application command uses the current business term.
- One endpoint supplies strings, while the internal command requires parsed value objects.
- Several entry points, such as HTTP and a message consumer, create the same application command from different transport models.
- The response deliberately reveals only part of an internal result.

By contrast, copying `id`, `name`, and `imageUrl` through three identical classes because the diagram has three boxes does not create stronger architecture. It creates conversion work whose purpose nobody can explain.

## Do not confuse mapping pain with a useless boundary

There is another failure mode. Developers see repetitive mapping and decide to pass the request DTO all the way to the repository or serialize the domain object directly as the response. The code gets shorter, but the external contract now controls the internal model.

The pain may be telling us that our internal concepts are weak. If every object is only a bag of fields, each conversion looks pointless. Instead of deleting all boundaries, ask what the service actually cares about. Does an image URL remain an arbitrary string inside the business? Is a user registration request the same concept as a registered user? Does an update carry a complete object or only the values the actor is allowed to change?

When those meanings become clear, mapping stops being a ceremonial copy and becomes translation.

Still, do not spend days inventing perfect concepts before the feature exists. Early in a project, one class may be enough. As policies appear and the outer contract begins changing for different reasons, split it. Architecture can evolve from observed differences.

## Use change reasons as the test

Before adding or removing a DTO, I ask:

- Who owns this shape: an external client, an application use case, or an internal domain concept?
- What event would make it change?
- Does it carry transport details that should stop at the boundary?
- Would another entry point use the same internal concept with a different external shape?
- Does the response expose more than the caller should receive?
- Is the extra class translating meaning, or only copying fields to satisfy a rule?

A team can reasonably choose a stricter convention than mine. Consistency has value, especially when many developers work in the same codebase. The convention should still have a known benefit. If nobody can explain why the intermediate DTO exists, "we agreed to do it" only preserves the question.

I prefer an explicit request and response at the presentation boundary, conversion to meaningful internal objects, and as few additional shapes as the application needs. Mapping is not free. Coupling the whole service to an external contract is not free either. Pay for the boundary where the two sides truly have different responsibilities.