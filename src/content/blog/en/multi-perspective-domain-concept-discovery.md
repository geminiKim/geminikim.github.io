---
title: "Discover Domain Concepts from Information and Behavior"
description: "Use information and process or behavior from case-dependent viewpoints to distinguish transport events from domain concepts."
lang: en
translationKey: multi-perspective-domain-concept-discovery
publishedAt: 2025-08-17
tags:
  - domain-modeling
  - architecture
  - data-modeling
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Information and process or behavior are both useful when discovering domain concepts. Other viewpoints may also help, but there is no fixed set: the useful perspectives vary by case. Looking only at process or only at data can make the model too one-dimensional.

There is no single mechanical extraction method. A workflow or the information already present can provide clues, and an observation outside the application can prompt another concept. Which viewpoint helps depends on the situation.

## Information is evidence, not the whole model

A real-world notice can prompt a concept that was not found by looking only at the application's information or process. I saw post-due and delinquency amounts printed separately on a maintenance-fee notice and began to consider delinquency as a concept.

Existing information is therefore a useful clue, but it should not be the only way to discover concepts.

Likewise, a transport event may describe only how information arrives. HTTP, gRPC, a socket, or a message queue is not automatically part of the business model. If devices “send events,” first clarify whether event means a technical envelope or an occurrence such as fire detection, gas detection, or intrusion detection.

## Find clusters between one giant event and many tiny types

Calling every device notification simply `Event` can create a concept too broad to manage. It can grow without clear boundaries and hide the different actions each occurrence requires. Creating a top-level concept for every raw event type can fragment the model just as badly.

Look for meaningful clusters. Fire and gas detections might both require doors to open for escape, while each has additional actions appropriate to its nature. Intrusion detection may require the opposite behavior. Start and end occurrences may also have paired responsibilities, such as activating and restoring controls.

These are exploratory examples, not a safety-system specification; without the system details, they remain possibilities rather than a prescribed model. Their value is in the reasoning pattern: group occurrences by shared business consequences and separate them where behavior materially diverges.

## Change viewpoints before naming the concept

Information and process or behavior are two useful viewpoints, and other viewpoints may become relevant in a particular case. For the device example, ask whether `Event` is merely a delivery term, whether different detections share common characteristics, and where their actions differ.

The purpose is not to produce the maximum number of nouns. It is to avoid deciding from one viewpoint alone: use the available information, consider the process or behavior, and bring in other perspectives when the context calls for them.