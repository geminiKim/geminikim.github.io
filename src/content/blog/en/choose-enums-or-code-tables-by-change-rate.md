---
title: "Enums or Code Tables? Let the Rate of Change Decide"
description: "Use enums for stable values and focused tables for frequently changing ones without turning one common-code table into a dumping ground."
lang: en
translationKey: choose-enums-or-code-tables-by-change-rate
publishedAt: 2024-11-24
tags:
  - data-modeling
  - enums
  - databases
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Neither “never use enums” nor “put every value in a common-code table” is a useful universal rule. The better starting point is the value's rate of change and the kind of software being built.

For values that rarely change, an enum is often the clearer choice. For values that change frequently, a table may be more appropriate. A single service can use both.

## Why enums are a strong default for stable values

Enums live in the code that uses them. That makes the allowed values easy to find and keeps the model less coupled to a database. Tests can use the values directly instead of first loading a code table or preparing cached data.

They are also straightforward to read. Stable values such as language, country, or currency identifiers often fit this approach in service development because the set changes very little and already carries a familiar meaning.

There are costs. Changing an enum requires a deployment. If the enum name itself is stored, renaming it can break compatibility with existing data that contains the old name. Those constraints matter, but they do not make a table automatically better. They help identify whether the value is actually stable enough for code ownership.

## A table fits values that really need to change

If values change frequently, storing them as data can be a better option. A table avoids a deployment for every change and can keep a stable code while the associated name changes.

This can matter more in a general-purpose solution or platform than in a narrowly defined service. The software's purpose changes the trade-off. The important point is to choose the table because the values are genuinely variable, not because all classifications have been ordered into the database.

A table also introduces distance. The application has to read the values from the database, perhaps cache them, and arrange them during tests. That cost may be justified, but it should buy flexibility the product actually needs.

## Do not confuse “use a table” with “use one common table”

A common-code table usually starts with a shape such as group code, code, and name. It then attracts very different concepts: country codes, sales codes, provider codes, product categories, and whatever else looks like a code.

The problem is not simply the number of rows. “Common” hides the reason each concept changes. Business logic begins to gather around a table that no longer has one clear owner.

When a concept needs table-based management, a table named for that concept is often easier to understand. Product categories can have their own table rather than becoming another group inside a universal common-code structure. Other classifications can be separated in the same way.

## Mix the approaches deliberately

A practical decision can be made with two questions:

1. Does this value set change often enough that a deployment is a problem?
2. If it belongs in a table, does it really share one concept with the other values in a common table?

Stable values can remain enums. Frequently changing values can use focused tables. The answer may differ between a service and a general-purpose platform, and it can change as the product changes.

The goal is not to defend one mechanism. It is to keep stable meaning close to code, put genuinely variable data where it can change, and avoid allowing the word `common` to erase the boundaries between unrelated concepts.