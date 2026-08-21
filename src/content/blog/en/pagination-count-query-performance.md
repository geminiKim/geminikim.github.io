---
title: "Why Pagination Count Queries Slow Down Databases"
description: "Understand why exact totals can cost more than limited queries and when to consider slices, cached metadata, estimates, or product changes."
lang: en
translationKey: pagination-count-query-performance
publishedAt: 2025-06-29
tags:
  - performance
  - data-modeling
  - backend
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

An exact page count can cost far more than fetching one page of results. A limited query may stop after finding enough rows, while the companion count query must account for every matching row. Before optimizing that count, ask whether users genuinely need an exact total and a reliable last page.

Many pagination abstractions make the second query easy to overlook. The application asks for a page, then the framework fetches the rows and issues another query to compute total elements. The convenient API does not remove the database work.

## A limit bounds the result, not the count

Suppose a filtered list displays ten rows. With suitable access paths, the database can stop once it has the requested window. To display the exact total and calculate the final page, it must evaluate the full matching set for the count.

How expensive that becomes depends on the data size, query, and indexes. Small tables may show no problem, and good indexing may keep a case acceptable. The actual query still needs to be checked rather than assumed cheap.

A badly designed admin search can even compete with production traffic when both use the same database. A broad filter followed by repeated exact counts may consume CPU and memory without any increase in user traffic.

## Change the product contract before adding machinery

If an exact total and final page are unnecessary, a slice or list may be enough. This is a product choice, not merely a repository return type.

When the total matters, count metadata can be kept separately or cached. For very large result sets, an approximate count or a bounded page display may also be considered.

Google is mentioned as an example of a search interface with approximate or changing totals and pages that may not all exist, but its internal implementation is unknown.

The product requirement comes first. If users do not need an exact total or direct access to the final page, a slice or list avoids the count. If the total remains necessary, the alternatives are to retain the query, cache or store count metadata separately, or show only an estimate or bounded range. The decision depends on the actual query cost and what the product needs to display.