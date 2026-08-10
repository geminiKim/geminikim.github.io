---
title: "Design Performance Tests from Real Traffic Shapes"
description: "Estimate volume and arrival patterns before choosing a load test, add deliberate headroom, and require evidence only where traffic risk justifies it."
lang: en
translationKey: performance-tests-from-traffic-and-failure-models
publishedAt: 2024-02-15
tags:
  - performance
  - testing
  - operations
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

The first skill in performance testing is not operating JMeter or nGrinder. It is understanding what is being tested. A tool can generate load, but only the traffic model tells us which load is meaningful.

Before writing a scenario, estimate the incoming traffic. Use the number of users, ordinary access volume, and the behavior created by the feature. The estimate will be imperfect. It still gives the team a target and, more importantly, a shape.

## A spike and a long run answer different questions

An event that opens at a precise time may produce a sharp spike. Requests arrive together, so the test should apply load in that form. A smooth ramp that eventually reaches the same throughput can miss the failure the event is likely to create.

A push notification campaign has a different shape. The company may send notifications in batches specifically to spread arrivals over time. The useful test then follows the batching policy rather than pretending that every recipient opens the service in the same second.

There are also services that experience repeated waves or sustained load. In those cases, a longer run can reveal memory or stability problems that a brief peak test does not. I have used tests that ran overnight for this purpose. The duration itself is not a rule; it follows from the failure we are trying to observe.

The sequence is simple:

1. Estimate how many requests may arrive.
2. Describe whether they arrive at once, in stages, repeatedly, or continuously.
3. Decide which failure condition matters.
4. Build the load profile around that description.

## Leave room without pretending traffic is infinite

Testing only the exact estimate means the next increase immediately consumes the engineering budget. I have sometimes used roughly three times the expected load as working headroom. That number is a practical example, not a universal standard. The point is to choose an explicit margin so the team does not rebuild the system for every small increase.

The estimate should also come from something observable. If a review page is getting a new reaction button, existing review views and actions can help approximate how often the new endpoint may be called. Peak, ordinary, and sustained periods may produce different targets.

## Do not force every team into the same ritual

A team repeatedly hurt by traffic failures will naturally treat performance tests as routine. An internal administration feature used by a small number of operators may not need the same ceremony. Making every feature perform the same load test can create activity without reducing real risk.

If an organization wants a consistent policy, require teams to state expected volume and arrival pattern for substantial releases. Then define a team threshold above which a performance-test record is required before production deployment. The threshold should be chosen from that system's risks; sample request counts from another team are not a standard.

This approach makes the decision inspectable. A low-risk feature can explain why no test is needed. A high-risk feature cannot skip testing without addressing the projected load.

Performance testing becomes useful when it models the service rather than the tool. Know the users, the event, the arrival pattern, and the failure you cannot accept. Only then decide how much load to generate and how long to keep it there.