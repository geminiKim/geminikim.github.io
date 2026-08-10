---
title: "Name Readers, Finders, and Searchers by Behavior"
description: "Distinguish Reader, Finder, and Searcher classes by direct reads, added filtering, and composite searches rather than result count."
lang: en
translationKey: name-readers-finders-and-searchers-by-behavior
publishedAt: 2024-08-29
tags:
  - software-design
  - maintainability
  - backend
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

`Reader`, `Finder`, and `Searcher` can look like three names for the same kind of implementation-layer component. That makes it tempting to distinguish them with a simple rule such as “Reader returns one record, Finder returns many.” That is not the distinction I use. The number of results says little about what the code actually does.

I choose among these names by the behavior a class expresses. Does it directly read data that is already there? Does it bring data in and apply more conditions to find the desired result? Or does it combine several sources and filters into something closer to a search? The name should help a reader anticipate that difference before opening the class.

## Reader: direct access to existing data

I use `Reader` when the behavior feels like a straightforward read. A `UserReader`, for example, might depend only on a `UserRepository`. It retrieves data through that repository without adding a separate filtering or processing responsibility.

The important point is the directness of the action, not whether the result is one user or a collection. When someone sees the class, “this reads user data” should be an honest summary of its job.

This makes `Reader` a good fit for the simplest case. It does not need a more ambitious name merely because the repository offers several query methods. What matters is that the component still acts as a clear route to data that exists.

## Finder: retrieval plus a finding condition

I reach for `Finder` when retrieval is only part of the work. A `UserFinder` might use a `UserRepository` while also collaborating with a validator, filter, or other supporting code. The data is retrieved and then narrowed or processed to locate what the caller needs.

That added behavior changes the impression of the class. It is doing more than exposing an existing read. It is finding a result according to some condition. The difference can be modest, and there is no mechanical threshold, but the name signals that callers should expect selection or processing around the retrieved data.

This is why single-record versus multi-record retrieval is a weak naming rule. Either kind of result could come from a direct read, and either could require additional filtering. Behavior provides the more useful distinction.

## Searcher: a composite search

`Searcher` fits when the operation feels like a search in the fuller sense: several repositories or kinds of data must be combined, with multiple filters contributing to the result. A search involving users and groups, for example, might bring together their repositories and a user-group filter before producing its answer.

The three names can be summarized as a progression of responsibility:

| Name | Behavioral impression |
| --- | --- |
| `Reader` | Reads existing data directly |
| `Finder` | Retrieves and filters or processes data to find a result |
| `Searcher` | Combines multiple data sources and conditions into a more complex search |

This is a difference in nuance, not a formal hierarchy. A particular codebase may draw the lines elsewhere, and not every operation needs all three kinds of component.

## Components can be composed

These names do not require each class to talk directly to repositories. A `UserFinder` could be assembled from Readers—for example, by using a `GroupReader` as one of its collaborators. The outer component remains a Finder if its own behavior is to coordinate those reads and locate a result.

That composition also shows why naming by dependency count would miss the point. Repositories, Readers, filters, and validators are implementation ingredients. The class name describes the behavior created from those ingredients.

There is no universal specification that makes these names correct. I choose them from the software's context and the feel of the code. Another team may choose different words or boundaries. The useful discipline is to decide what each name means in your code and apply that meaning consistently. When the name reflects the action—reading, finding, or searching—it becomes a compact guide to what lies inside the class.
