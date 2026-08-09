---
title: "Isolate Admin Work from the Service Domain"
description: "Admin APIs have different queries, mutation needs, and release risks. Isolate them by module or repository instead of letting operational convenience reshape the core service."
lang: en
translationKey: isolate-admin-from-domain
publishedAt: 2023-10-14
tags:
  - architecture
  - backend
  - admin
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

I usually do not treat an admin function as part of the service domain. It is an operational surface around the product, with different users, queries, and mutation needs.

There is an important exception. If the product itself is an admin product, then administration is naturally the domain. A team building an admin platform for customers should model that work accordingly. My concern is the common case where a product team owns reviews, coupons, or accounts and also needs internal APIs so operators or a central admin team can manage them.

In that case, putting admin behavior inside the core domain often pollutes the code we most need to keep stable.

## Admin and product code change for different reasons

A customer-facing service usually limits state changes according to product rules. An admin tool may need broad correction abilities because operators must repair data. If both surfaces share one entity, the setters or update paths required by admin work become available to service code too.

The same mismatch appears in reads. Admin users ask for dynamic search by author, creation time, status, and several sorting options. Those queries are valid operational requirements. They are not automatically core domain behavior. Pushing every search combination into domain repositories makes the central model grow around an internal screen.

At first, adding one condition to an existing review query looks cheaper than creating a boundary. Then pagination, optional filters, new sort orders, and corrective writes accumulate. The core service changes every time the admin screen changes. I have seen this pattern often enough that I prefer separation early when the direction is clear.

## Choose the isolation strength from the context

If the company has one shared admin system used across teams, I would seriously consider a separate repository and application. Its ownership and release cycle are already different.

A small company may not want to operate another server for a lightly used internal tool. In that case, keep one project and one running application but create a separate admin API module. Module boundaries do not require two server processes. One runtime can include both public and admin API modules while the build prevents the admin code from reaching into internals it should not use.

The requirement is isolation, not a fashionable deployment count. I want a change in the admin module to remain visibly an admin change. If core code also changes, the pull request should make that exception obvious and invite the reviewer to ask why.

As the admin area grows, a well-isolated module can later become its own server or repository with less surgery. That option is useful because admin systems have a habit of starting small and becoming company-wide operational infrastructure.

## Even two entity mappings can be reasonable

In one example structure, the admin API owns its own JPA entity mapping even though it accesses the same table as the service-side entity. That can look strange: two entities for one table.

The duplication is deliberate. The service mapping exposes only the changes allowed by customer-facing business rules. The admin mapping exposes the fields operators are allowed to correct. Sharing one mutable entity would force both sides to accept the union of their capabilities.

This is not a general instruction to duplicate every entity. It is a strong boundary for a case where accidental cross-use creates enough risk to justify the cost. Separate mappings mean separate maintenance and require care when the table changes. The benefit is that the compiler and module graph prevent a service developer from casually using an admin-only mutation.

I prefer that mechanical protection to spending code-review time repeatedly catching small setter mistakes. Reviews should discuss the business and the risky exceptions, not depend on every reviewer remembering which field is only editable from an internal screen.

## Different modules may have different internal rules

A concern about separation is that the admin module will no longer look like the domain module. I think that difference can be correct. Admin code may not need the same implementation layers or rich conceptual objects. It may need direct, efficient queries and simple operational commands.

Consistency still matters inside each module. Write a short README that states the module's layer structure, allowed dependencies, and loose rules. A developer should understand why the admin area is simpler or more query-oriented rather than assuming it is unfinished core code.

Naming it `admin-api` is also not mandatory. `operations` may better describe a module that contains several tools used to run the service. Again, the name should describe the responsibility in this organization.

## A boundary makes review and release safer

Suppose a developer says a pull request changes only an admin feature. If admin and service code are mixed, the reviewer has to inspect changes across the core package and decide whether each one can affect customers. A small mistake by someone still learning the system can ship with the service.

With separate modules, the diff itself is a signal. Changes under the admin module match the stated task. A change under core requires an explanation. The boundary does not guarantee safety, but it narrows what reviewers must distrust.

My default for the internal-tool case is therefore:

- keep admin behavior out of the core domain;
- use a separate module when one runtime is the practical limit;
- harden dependencies enough that admin convenience cannot leak into service code;
- move to a separate repository or server when ownership and impact justify it;
- document why the modules follow different rules.

The exact answer depends on what "admin" means in the organization. An admin product, a small team-only correction screen, and a company-wide operations platform are not the same architecture problem. Start by naming which one you have. Then choose enough isolation that frequent operational changes do not make the customer-facing service harder to understand and easier to break.