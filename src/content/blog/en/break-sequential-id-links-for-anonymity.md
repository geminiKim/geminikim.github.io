---
title: "Break Sequential ID Links in Anonymous Services"
description: "Use independent random identifiers for identity-related records to remove obvious sequential links, while recognizing that UUIDs alone cannot guarantee anonymity."
lang: en
translationKey: break-sequential-id-links-for-anonymity
publishedAt: 2026-01-18
tags:
  - data-modeling
  - database
  - technical-decisions
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Auto-incrementing numeric IDs are a reasonable default for many small services. In an anonymous service, however, using the same sequence pattern across identity-related tables can leave an unintended trail.

If signup-key record 1 and user record 1 were created together, an operator can infer that they belong to the same person. Once that user is connected to posts, the supposedly separate identity data becomes easier to trace. The problem is not the number by itself. It is the visible correlation between records.

## Matching sequences create an obvious join

Consider a signup table that stores an external profile key to prevent duplicate registration. The user table also receives auto-incrementing IDs. As accounts are created, both tables may advance as 1, 2, 3, and 4.

Even without a declared database relationship, those matching positions make a direct guess available: signup row 1 likely belongs to user 1. People outside the service may never see either internal key, but someone operating the data can use the sequence to connect the records.

That link conflicts with a product whose trust depends on making identity harder to recover from stored data.

## Randomize the identity records that form the link

One response is to assign independent UUID-backed string IDs to the signup and user records. Their primary keys no longer line up as matching counters, so the simple row-one-to-user-one inference disappears.

This does not require changing every identifier in the service. A post or comment can keep a numeric ID when knowing its order does not reveal the identity relationship at issue. The change is aimed at the records whose correlation can connect an external signup identity to an internal user.

The external uniqueness key may still need to remain in the signup side to block duplicate registration. Replacing primary keys does not remove that business need; it breaks one direct path between the key-bearing record and the user record.

## Harder to link does not mean impossible to infer

Independent random IDs reduce an obvious linkage path. They do not guarantee anonymity. If only two people use the service, the small set of possibilities may still make identities guessable. Other stored attributes can also matter even when the primary keys no longer match.

The claim therefore has to stay narrow: UUIDs can make this particular sequence-based tracking harder. They are useful when the service's promise makes that extra separation worth the change, but they are not proof that no operator can ever reconnect a person to an account.