---
title: "Define Problems from the User's Perspective"
description: "Problem-solving improves when you separate technical load from product value, launch what you build, and keep asking why a user would choose it."
lang: en
translationKey: define-problems-from-user-perspective
publishedAt: 2023-09-10
tags:
  - product
  - career
  - problem-solving
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

Building your own product is one of the better ways to practice problem solving, but only if the exercise continues beyond implementation. Launch it. Ask people to use it. Try to understand why they return or why they do not.

I repeated that process often as a junior developer: make a product, release it, and somehow bring real users to it. The code was part of the training. The uncomfortable part was discovering that my confident definition of the problem did not automatically create value for someone else.

That distinction matters because "problem-solving ability" can refer to different kinds of work. We should not collapse technical performance, product demand, and revenue into one score.

## Traffic can test a system without proving a product

Suppose a personal project earns no revenue and attracts little traffic. Does that mean the developer failed to solve a problem?

Not necessarily. If the goal is to practice handling load, a load generator can create traffic. Pour requests into the architecture and weak points will appear. That experiment can teach technical problem solving even when no customer has discovered the service.

Revenue asks a different question. Solving a technical problem does not guarantee that a customer is satisfied, knows the product exists, or wants to pay for it. A developer who can also solve business problems is extremely useful, but development is still a real responsibility by itself. Lack of revenue does not erase the technical learning.

The reverse is also worth remembering. Synthetic traffic can prove that an endpoint survives a load profile. It cannot prove that a person receives value. We need to state which problem we are testing before interpreting the result.

## Good solutions depend on good definitions

I have met far fewer people who define problems well than people who are eager to solve them. A badly defined problem can still produce a lot of activity. The team implements features, rearranges the architecture, and eventually declares the task complete. Nothing meaningful improves because the original mission was wrong.

Problem definition is analysis. It identifies what is happening, who experiences it, what result must change, and which constraints are real. Once the definition is accurate, implementation often becomes much easier. When it is vague or mistaken, even excellent implementation can solve the wrong thing efficiently.

Before choosing technology as the answer, analyze the mission and define the problem accurately.

I use "why" aggressively during this stage:

- Why is this considered a problem?
- Why does it happen now?
- Who is affected, and what are they unable to do?
- Why would this proposed change help them?
- If they had to pay for the result, why would they choose it?

Repeated questions can become annoying or even feel hostile when asked carelessly. The purpose is not to exhaust a colleague or show that their first answer was weak. It is to prevent the team from spending weeks on a confident but empty definition. Tone matters, but curiosity cannot disappear for the sake of comfort.

## User-centered thinking requires leaving your own chair

Developers often build something while thinking, "This will definitely be a hit." I have done that too. The certainty usually comes from evaluating the idea only from my position.

A user has different circumstances and a different reason for choosing a product. Build and launch the product, invite real users, and ask whether they would use it, why they would use it, and what value it provides.

If the learning goal is technical traffic, create controlled load separately. Synthetic traffic can expose a system problem, while real users show whether the original product problem was defined well. Use both observations to revisit the problem definition.

I do not present this as the one correct method. It is the method my own attempts made convincing: define the mission, ask why from several positions, release the work, and let contact with users correct the story in your head. Problem solving begins before code and is tested after the code runs.