---
title: "Choose Experience and Judgment over Development Jargon"
description: "Theories and patterns are useful references, but a developer still needs to explain the code, its tradeoffs, and what happened when it was operated."
lang: en
translationKey: experience-over-development-jargon
publishedAt: 2023-09-10
tags:
  - career
  - software-design
  - collaboration
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

I sometimes use the phrase "concept object." By it I mean an object that is important inside the code because it carries behavior, a rule, or a central position in the model. It is different from an object whose job is only to move data between boundaries. Many people would call something similar a domain object or, in older vocabulary, a business object.

The phrase itself is not important. I chose an ordinary expression because I wanted the meaning to be understandable without first agreeing on a school of software design. That choice points to a larger frustration I have with development conversations: terminology can replace thought.

## A theory name is not an explanation

I have worked with developers whose answer to a design question was always "That is not DDD," "That is not TDD," or "This violates pattern X." The specific theory is not the target. Domain-driven design, test-driven development, object-oriented programming, functional programming, and design patterns all contain useful work.

The problem begins when a person cannot discuss the actual code without borrowing authority from the label. I want to hear why this dependency exists, which requirement shaped the object, what cost the design accepts, and how the system behaves in operation. If the answer stops at "the theory says so," I still do not know whether the decision fits our software.

I want to work with people who can explain their code line by line in their own words. They do not need to have invented every technique. They do need an opinion about the code they are asking teammates to maintain.

This matters more after launch. A structure can look impressive in a presentation and still be painful to operate, difficult to extend, and expensive for colleagues to repair. Shipping it and leaving before those consequences appear does not make the architecture successful. The people still maintaining the service are the ones paying for the gap between the vocabulary and the result.

## Patterns came from repeated work

I do not imagine that the people who developed important methods woke up one morning with a complete theory. More likely, they built software, failed, adjusted it, operated it, and noticed recurring shapes. They organized those observations so other developers could learn faster.

That is why studying their work can save time. Early in my career, before I knew the design-pattern catalog, I needed one class to have a single shared instance. I struggled until I made it work, felt rather proud of the idea, and later discovered that it was already known as the singleton pattern.

Knowing the pattern first would have reduced that effort. I am not arguing for ignorance. But memorizing hundreds of named solutions is not enough either. Eventually we meet a problem that does not match the page we remember. A developer must be able to observe the situation and form a solution rather than say, "I have never seen this pattern, so I cannot solve it."

There is also value in discovering a pattern through experience. The lesson is attached to a problem, not only to a definition. When a book later gives the idea a name, we can compare our reasoning with accumulated knowledge and see what we missed.

## Shared vocabulary can help or dominate

Abbreviations are efficient when a team already shares their meaning. Coaches who repeat the same explanation every day also need concise language. There is no problem with saying "TDD" among colleagues who understand both the term and the practice.

Vocabulary becomes harmful when it is used as status. A reviewer writes that a junior developer violated an unfamiliar three-letter rule, offers no concrete explanation, and leaves the recipient to feel ignorant. That is not a useful review. It displays knowledge without transferring it.

A better review explains why this code was built this way, which problem it solves, and what it means for operation and growth. Explain the consequence, then introduce the established term if it helps the team discuss the same issue later.

The order matters. The term should compress understanding that already exists; it should not conceal the absence of understanding.

## Build judgment that survives unfamiliar problems

I put more weight on wisdom and operating experience than on a vocabulary count. That judgment grows through a repeated loop: build something, explain the choice, operate it, notice where it fails, and revise the rule.

When reviewing a design, I ask plain questions:

- What problem does this code solve here?
- Why is this object important, and why does it own this behavior?
- What happens when the requirement changes?
- Can the person proposing the design describe its costs without citing a label?
- Did operation confirm the assumption?

Use books and theories as references throughout that process. They contain lessons we do not need to rediscover painfully. Just do not let them close the discussion before the concrete system has been examined.

I know this view can sound harsher than intended, especially because bad experiences with jargon make me react strongly. It is not a claim that everyone using established language lacks thought. It is a demand that the language lead back to code, consequences, and personal judgment. If it cannot do that, the impressive name is not helping the team.