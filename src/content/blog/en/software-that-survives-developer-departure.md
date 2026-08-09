---
title: "Software Should Survive the Developer Who Built It"
description: "Good company software reduces debt, fits the team's operating ability, and remains understandable and repairable after its original developer leaves."
lang: en
translationKey: software-that-survives-developer-departure
publishedAt: 2023-10-24
tags:
  - maintainability
  - engineering-culture
  - software-design
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

For company software, I judge a good developer by whether they reduce the company's debt. Holding debt steady can also be a respectable result. I judge the software by a related question: will it remain alive after the person who built it leaves?

Some systems I worked on at previous companies are still operating. I do not take that as proof that I wrote brilliant code. It means the next person could receive the baton, run the system, change it, and pass it on again. That continuity is more valuable to a company than a design that demonstrates one developer's cleverness.

## The rewrite after a departure is a warning

I have seen a recurring pattern. A developer introduces an unfamiliar technology, builds a system around it, speaks publicly about the work, and then leaves. The team that remains looks at the system and decides that rewriting it is cheaper than learning and repairing it. The replacement is often simpler and good enough for the traffic and growth the business expects for the next two or three years.

The problem is not public speaking or new technology. Nor does every rewrite prove the first author was irresponsible. Requirements change and replacements can be justified. The warning is a system whose design value disappears with the only person able to explain or fix it.

It becomes worse when the adopter was also learning the technology while putting it into production. This is not necessarily a lack of general ability. Everybody is clumsy with an unfamiliar tool. That is exactly why a company system should not absorb unlimited experimentation. If a junior developer cannot safely modify it and no remaining senior can repair it during an incident, the company owns a fragile dependency on one person.

A professional developer is paid to advance the company's work. Wanting to learn is healthy, but the production system is not automatically the right place to satisfy every technical curiosity. A footballer employed to play football cannot decide that training time will now be used for another sport simply because it feels interesting. A weekend club can make that choice. The employment context changes the obligation.

The analogy is blunt, and company work is more complicated than sport. Developers do need room to improve, and companies benefit when their engineers learn. The useful boundary is whether the experiment's failure and the adopter's absence are recoverable.

## Ask who can repair the experiment

I do not want teams to use the same tools forever. If that were the conclusion, we would never move beyond familiar database access or old framework versions. A company that forbids every experiment creates a different kind of debt.

When someone proposes a new technology, I ask practical questions:

- Has anybody used it, even in a personal or small internal project?
- Who will guide the implementation and review its failure modes?
- If the adopter leaves, who can operate and modify it?
- If it causes an incident, can I or another engineer enter the code and repair it quickly?
- Is the blast radius small enough for the team to learn safely?

A small internal project with a knowledgeable guide can be a good place to try something. The remaining team still needs to be able to repair or replace it if the adopter leaves or an incident occurs. The deviation from the team's current ability should be something the team can absorb.

This is where I use the image of a cracked jar. Water can only remain as high as the lowest crack. One exceptional engineer may pour sophisticated design into the team, but if nobody else can maintain it, the level falls as soon as that engineer stops pouring.

The answer is not to keep the water permanently low. Raise the crack. Teach, pair, review, document, and run a small project. Let the team stretch a little beyond its current level. Some water may spill while people learn, but the amount should be small enough to clean up. Dumping a flood into the jar does not produce faster growth; it creates an incident and may break the jar.

Growth should look more like steps. A team adopts a manageable practice, learns to operate it, and then takes another step. A single developer making a huge leap while the rest of the team remains behind produces an equally huge drop when that person leaves.

## Handover is hidden inside engineering choices

Many design discussions are really discussions about handover.

A module places a dependency constraint so the next developer pauses before crossing a boundary. A test records an important behavior so a later change has to confront it. Documentation preserves the reason for a decision. A simple technology choice increases the number of people who can respond at 2 a.m. None of these guarantees good software, but each can reduce the knowledge that exists only in one head.

I do not apply my personal-project architecture to a company by default. In a personal project, I expect to keep operating it and may choose complexity because learning or enjoyment is part of the purpose. At work, the company context sets the appropriate level: expected traffic, team ability, hiring, on-call practice, product life, and the cost of failure.

That restraint is not anti-engineering. Appropriate engineering keeps company value available. A system that is easy to change, deploy, recover, and hand over lets the business continue delivering. A fascinating system that must be discarded after one resignation has converted technical ambition into company debt.

## Leave an asset, not a monument

Being paid does not mean accepting every rushed request or sacrificing quality without argument. Poor tests, slow changes, repeated incidents, and dependence on one individual are business costs too. Professional responsibility includes explaining those costs and improving the system, not merely following orders.

It also includes remembering that company code is not a personal monument. The developer's name does not need to remain visible in the architecture. The useful legacy is that another person can understand the intent, repair a failure, and continue the product without starting over.

Before choosing a design or a dependency, I want to ask how the relay continues. If I leave next month, can the team run it? If an unfamiliar failure occurs, does somebody know where to look? Have I left tests, constraints, and explanations at the places where mistakes will be expensive? Does the software match the level the team can sustain while giving that team a path to improve?

Good software survives its author. A good developer makes that survival ordinary.