---
title: "Validate at the Boundary, Simplify the Core"
description: "Turn API input into complete business values at the presentation boundary, keep nulls out of inner flows, and validate stored data when it enters the system."
lang: en
translationKey: validate-at-boundaries-keep-core-flows-simple
publishedAt: 2024-03-13
tags:
  - validation
  - api-design
  - layered-architecture
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Validation becomes repetitive when every layer distrusts the same value in the same way. My preference is to validate each concern where it enters, then pass a complete object inward so the core flow can assume that boundary work has already happened.

For an HTTP request, the presentation layer is that first boundary. It owns the API specification, so it should reject input that does not satisfy that specification before converting the request into a business value.

## Make the conversion produce a usable object

Suppose `NewOrderRequest` contains nullable fields because the external request may omit them. I do not want those nulls traveling through services and important domain objects. The presentation layer checks them, applies any allowed conversion, and constructs an inner value whose required fields are present.

Specification rules also belong here. If the API says a user key cannot exceed a certain length, the request validator can report that failure directly. This is more than checking blank strings. It is enforcing the contract the API has published.

I often prefer explicit validation code because it is straightforward to test and shows the rule in one place. Annotation-based validation is also a reasonable choice; the preference is about readability and testing, not a claim that annotations are wrong.

## Do not rebuild the same perimeter in every service

Once the request has been validated and converted, the service should not repeat the same blank, length, and null checks without a new reason. Its job is to carry the use-case flow. Validation that depends on loaded data still happens inside: a requested product may not exist, for example, and that fact cannot be settled from the request alone.

This distinction is useful:

- presentation validation checks the external specification;
- conversion establishes complete inner values;
- implementation or domain work checks facts discovered during the operation.

Where the last category lives depends on the project's layers. In my structure, much of it appears in the implementation layer that coordinates repositories and business objects rather than in a service that merely repeats the outer checks.

## Validate data when it becomes trusted

The same principle applies to stored data. If a product was validated before it was inserted, repeatedly validating its basic shape every time it is read adds little. The write boundary should prevent invalid state from entering. A read still has to handle absence and any business condition relevant to the current operation, but it does not need to prove the entire object from zero again.

This approach depends on the boundary being real. If another path can write unvalidated rows, the assumption is false and the design must account for that. “The inner layer can trust it” is an earned invariant, not an excuse to ignore unreliable input.

The aim is not to put all validation in controllers. It is to stop each rule at the boundary that owns it. External shape is checked at the API edge. Persisted state is checked when written. Facts revealed by a use case are checked during that use case. With those responsibilities clear, the inner code can read as a flow instead of a second copy of every perimeter.