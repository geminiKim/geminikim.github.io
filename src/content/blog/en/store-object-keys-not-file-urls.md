---
title: "Store Object Keys, Not File URLs"
description: "Design file uploads around stable object keys, server-composed delivery URLs, collision-resistant names, and separately retained original filenames."
lang: en
translationKey: store-object-keys-not-file-urls
publishedAt: 2026-04-05
tags:
  - backend
  - data-modeling
  - migration
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A file record contains two values with different lifecycles. The object key identifies what was stored. The delivery URL describes how clients reach it today. Storing them as one permanent string makes a changeable address look like stable data.

For a typical image upload, I prefer to keep the stable key or relative path in the database and compose the client-facing address in the server response.

## Keep the stable identity in the record

Object storage accepts a key when a file is uploaded. That key, or the relative part needed to locate the object, can be stored with the domain record. The response layer then combines it with the configured delivery prefix.

The prefix may later point at a different domain or CDN address. If the database contains only the stable part, that delivery change can be made where responses are assembled instead of rewriting every stored URL.

This does not make movement between storage locations disappear. Moving objects is still a storage migration. It only separates that work from changing the address clients receive.

## Give internal keys and original names different jobs

A user-supplied filename is not a good default storage key because different users can upload the same name. Generate an internal key from a product rule, an existing record identifier, or another unique identifier suited to the system.

The original filename may still matter to the product. If users need to see it later, keep it in a separate field. The internal key locates the object; the original name is display data. Combining those responsibilities creates avoidable collisions and makes later changes harder.

## Choose the upload route separately

Whether the API server receives the file or the client uploads through a presigned address is another decision. Direct server upload can be reasonable for ordinary review or profile images when measurement shows acceptable performance. Larger media or different traffic patterns may justify another path.

A presigned flow has its own lifecycle question: a database row may exist even when the client never completes the object upload. That possibility needs handling in the design.

Calling one route right for "99%" of cases is rhetoric, not a universal rule. File size, consistency needs, operational complexity, and measured behavior should decide the route. The representation can remain simple in either case: store the stable object identity, keep the original name only when the product needs it, and compose the current delivery address at the response boundary.