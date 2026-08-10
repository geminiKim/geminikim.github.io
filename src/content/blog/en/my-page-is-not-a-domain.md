---
title: "Why a My Page Is Not a Domain"
description: "A My Page is a client-facing view, not a business domain. Keep orders, products, and coupons with their real owners and combine them at the boundary."
lang: en
translationKey: my-page-is-not-a-domain
publishedAt: 2024-06-22
tags:
  - backend
  - domain-modeling
  - api-design
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Paths such as `/my/orders` and `/me/products` are convenient ways to express what a signed-in user wants to see. The trouble begins when that convenient word crosses the presentation boundary and becomes a domain of its own.

Once `My` is treated as a business concept, unrelated features begin to collect beneath it. Orders, products, likes, reviews, and coupons move into a `my` package. A `MyController` keeps gaining methods, and a `MyService` starts depending on every service needed to assemble the page. The code follows the menu name instead of the concepts the system actually manages.

The practical distinction is simple: “my” can be useful in an API contract without deserving ownership of the implementation.

## Keep the endpoint and the domain separate

An API path belongs to the presentation layer. It is part of the agreement through which a client asks for data. If `/my/orders` is clear to the client, there is no need to reject it merely because `My` is not a domain concept.

Inside the application, however, “my order” is still an order. It becomes “mine” because the current user's identity and authorization determine which orders can be returned. The word describes the viewpoint of the request; it does not introduce a new kind of order.

The same reasoning applies to products a user has liked, reviews the user has written, or coupons the user has received. The user context filters or connects those concepts. It does not erase their original meaning or make all of them parts of one `My` model.

This is why the `my` qualifier can effectively disappear when the request moves inward. The implementation works with users, orders, products, reviews, and coupons. The presentation layer can then combine the results into the client-facing “my” view.

## Watch for the package that absorbs everything

The failure pattern becomes visible through growth. A My Page begins with personal information and an order list. Later, product activity, likes, reviews, coupons, and other user-specific views arrive. If the screen name controls the structure, every addition appears to belong in the same controller, service, or package.

That structure has no useful stopping rule. Most actions in a commerce system involve a user in some way. Following that relationship mechanically can lead either to placing nearly every feature under `my`, or to prefixing nearly every API with `users`. Neither choice tells us which concept owns the behavior.

The dependency shape also becomes misleading. A large `MyService` may import order, product, review, and coupon services simply because one screen displays their results together. Presentation needs have now created what looks like a central domain service, even though the underlying concepts still change for different reasons.

This does not mean that a class named `MyController` is automatically wrong. Controller boundaries and endpoint paths are choices at the presentation layer. The warning sign is that the same label begins to organize business logic and pull the real concepts out of their own areas.

## Treat “my” as composition, not ownership

A My Page often performs a combining role. It takes user context and retrieves the relevant orders, products, reviews, or coupons, then presents them as one view. That is a useful behavior, but combining results is different from owning every concept being combined.

A clearer flow keeps the distinction visible:

```text
current user + order lookup ----+
current user + review lookup ---+--> My Page response
current user + coupon lookup ---+
```

Orders remain in the order area. Reviews remain reviews. Coupons keep their own meaning. The boundary responsible for the response may merge them, while each underlying area continues to own its rules and data.

This framing also prevents a screen from silently redefining the whole model. If an order rule changes, the change belongs with orders rather than with the page that happens to show them. If the My Page later changes its layout or stops showing coupons, the coupon concept should not have to move with it.

## Use the signed-in user as context

The phrase “my order” can be expanded into a more precise statement: an order associated with the current user, returned according to the request's login and authorization context. That explanation gives the implementation something concrete to work with. A standalone `My` concept does not.

The useful test is to remove the word “my” and ask what remains. If the answer is still order, product, review, coupon, and user, those are the concepts worth preserving. Let the presentation layer speak the client's language freely, including `/my` or `/me`. Just do not allow that convenient viewpoint to become a container that absorbs the internal model.
