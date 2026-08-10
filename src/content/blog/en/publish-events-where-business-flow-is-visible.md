---
title: "Publish Events Where the Business Flow Is Visible"
description: "Place event publication in the layer that understands the completed business action, while keeping implementation-specific cases explicit."
lang: en
translationKey: publish-events-where-business-flow-is-visible
publishedAt: 2024-08-15
tags:
  - architecture
  - domain-events
  - layering
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

An order has been completed, and the system needs to publish an event. The entity can publish it when its state changes, a lower-level processor can publish it as part of the implementation, or the business service can publish it after the whole operation succeeds. All three locations can be made to work. They do not make the flow equally easy to understand.

My default is to publish a business event in the layer that can see the business operation. If the event says that an order was completed, the code responsible for completing the order is usually the clearest place to send it. That is a preference grounded in code visibility, not a rule that removes every exception.

Without the surrounding implementation, the answer has to remain conditional. The purpose of the event and the components that receive it may justify a different location.

## An entity is often too low for this decision

Publishing from an entity can look attractive because the state transition happens there. It also makes the entity responsible for more than changing and protecting its own state. Once entities have been pushed down into a database-oriented layer and are expected to act only as entities, event publication becomes especially awkward. The business reason for the event is no longer visible at that level.

This is why I tend not to put event publication inside the entity. The placement raises complexity, especially after the entity has been moved below the wider business flow. The entity knows that its state changed; the business layer knows why the change happened and what completion means in this use case.

There may also be a small modeling cost when moving publication upward. If a processor currently returns only an identifier, while the event needs more information from the result, its return type may need to change. That is not a reason to hide publication lower down. It is a sign that the upper flow needs an honest representation of the result it is coordinating.

## Separate the publication point from the publishing mechanism

Choosing the business layer does not require exposing a framework publisher throughout that layer. Injecting Spring's application event publisher directly makes a framework implementation conspicuous in code that is trying to express a stable business flow.

I would usually put a small component in front of it: an event publisher owned by the application, or a collaborator named after the business action. The business service can depend on that component, while the component handles the actual publication mechanism. This also leaves a clearer boundary if the system is later separated or the delivery mechanism changes.

The name should help the reader understand the action. A generic `EventPublisher` may still reveal very little. In a reaction flow, a collaborator that expresses what happens after a like can be more useful than exposing the framework API itself. The right level of specificity depends on the code, but the business layer should not have to speak in framework terms just to announce a business result.

## Do not hide a local flow behind an event chain

Application events have legitimate uses, including cases where several domains need to react to one result. The problem begins when events become the automatic way to connect every step inside one application.

Imagine that changing an order state must also send a text notification. One option is to publish an application event, find a listener elsewhere, and let that listener call the sender. Another is for the visible business flow to call an `SmsSender` or a clearly named post-processor directly. The second version may be less abstract, but a reader can follow the operation without searching for every listener that might receive the event.

This cost grows when one listener publishes another event and the application becomes a chain of indirect reactions. To understand a single operation, a maintainer has to search every publication and handler and reconstruct the sequence. That does not make event-driven code inherently wrong. It means the benefit of indirection should be worth the loss of a visible call path.

## Use the reason for the event to choose the layer

The practical distinction is the reason the event exists.

- If it represents a completed business action, publish it from the business service or other layer that owns that flow.
- If publication is tightly coupled to an implementation detail, a lower processor may be the more accurate location.
- If several domains genuinely need to receive and handle the result, application events may fit the collaboration.

Even then, I would ask two more questions: does the code show the business clearly, and can someone trace what happens next without searching the entire application? In most ordinary cases, placing publication beside the completed business operation answers both questions well. When it does not, the exception should come from the actual implementation and collaboration needs—not from a habit of putting every reaction on an event bus.
