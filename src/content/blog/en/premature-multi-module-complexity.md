---
title: "Multi-Module Too Early Makes Design Harder"
description: "Modules should enforce boundaries discovered through implementation, not freeze guessed domains or mirror an architecture diagram before the software is understood."
lang: en
translationKey: premature-multi-module-complexity
publishedAt: 2023-11-04
tags:
  - architecture
  - modularity
  - software-design
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

"Do not use multi-module" is an intentionally sharp title, not my actual rule. I use modules and talk about them often. The problem is treating a multi-module build as proof of architecture before we understand what the software does.

A module is useful when it isolates something and places a constraint on dependencies. Good module boundaries can strengthen cohesion and reveal design intent. Bad ones freeze guesses, scatter related code, and recreate dependency trouble with more build files.

## Do not turn first impressions into domain modules

Imagine being asked to build software for a school. At the beginning, we know the ordinary objects visible in a school: books, desks, lockers, classrooms, uniforms. It is tempting to create modules named after those nouns before writing the behavior.

That is not domain understanding. It is inventory.

The meaningful boundaries might be enrollment, attendance, classes, assessment, or something specific to how this school operates. The whole school might initially be one domain. We cannot know from the word "school" alone. A person who has operated the product for a long time, or a planner or domain expert who knows the work in depth, can provide a much stronger model. I mentioned something like two years of operation as an example of mature experience, not a timer that automatically produces the right design.

Until that understanding exists, start with implementation. Put related code in packages, build actual use cases, and watch which concepts change together. Packages preserve flexibility while the domain is immature; premature modules freeze guessed boundaries and can create tangled module dependencies.

The sequence matters. A module can help good implementation stay separated. It cannot make an implementation good merely by existing.

## A domain module full of technology is a suspicious boundary

Another warning appears when every supposed domain module contains its own Spring setup, Redis client, Kafka integration, persistence details, and assorted infrastructure. Technology inside a domain module is not automatically wrong. The question is what the split is protecting.

If `book`, `desk`, and `locker` modules all carry the same technical dependencies, and each also depends on the others, we have not isolated the domain. We have cut a tangled implementation into smaller containers. Soon `desk` depends on `book`, `locker` depends on `book`, and `book` depends back on both. The dependency graph describes uncertainty rather than intent.

Circular module relationships are a strong signal to stop. They may represent an explicit trade-off, but the common explanation is that the concepts or ownership were divided incorrectly. More Gradle configuration will not settle the business boundary.

In that situation I would often merge the code back into a larger package boundary, improve the implementation, and wait. Extraction becomes easier after responsibilities are clear. Premature isolation makes every correction cross a wall we built without evidence.

## Architecture does not have to be a module diagram

I also disagree with the habit of making the module tree mirror an architecture picture.

A layered architecture does not require separate `presentation`, `business`, and `data-access` modules. Hexagonal architecture does not require one module for every port and another for every adapter. Those structures can be implemented with modules when a real dependency needs enforcement, but the architecture does not depend on that physical shape.

Architecture describes the roles and flow in the implementation. A module provides a physical boundary that can enforce access. They can support each other, but they are not the same thing.

The same is true of packages. A package tree may make an architecture easier to see, and a team can choose that convention. It is not a prerequisite for the architecture to exist. If removing the layer-named packages causes the design to disappear, perhaps the design lived mostly in the names.

I extract a module where I most need isolation, where an accidental dependency would be costly, or where the build should force someone to reconsider a change. I do not create one merely to reproduce every box in a diagram.

## Let important boundaries emerge at several scales

A piece of software rarely has one "core" and nothing else worth protecting. The core product has important concepts inside it. An admin area, even if it is not the product's central domain, has its own policies and responsibilities. Within each area, smaller boundaries appear as behavior accumulates.

That does not mean every nested concept deserves a module. It means importance and cohesion exist at several scales. We can represent a small boundary with a class, a package, a test, an interface, or simply careful naming. A module is one of the stronger tools, so it should answer a stronger need.

In my own example project, I kept a broad domain module because I understood the product intention but the implementation was not mature enough to split into separate Q&A or review domain modules. I also kept technical dependencies out of that domain area and isolated the admin area because that was a boundary I wanted collaborators to notice. This is not a universal template. It is an example of using modules for known intent while leaving uncertain divisions flexible.

## Implementation first does not mean careless code

Saying "implementation first" can sound like permission to make a mess and promise a redesign later. That is not what I mean.

Write the simplest coherent implementation you can. Keep responsibilities readable. Put code that changes together near each other. Test behavior that matters. Avoid needless dependencies. Then use the evidence from actual features, changes, and operations to decide which boundary deserves stronger enforcement.

A useful extraction has an answer to questions such as:

- What must this module prevent another part of the system from using?
- Which code has one reason and rhythm of change?
- Which technology should remain an implementation detail?
- What dependency direction should the build enforce?
- Who understands and will maintain this boundary?

If the only answer is "we are using multi-module architecture," keep the package for now.

Modules are not an achievement badge. They are constraints, and constraints have a cost. Apply them after the implementation reveals what deserves protection. Then the module records knowledge instead of turning an early guess into permanent structure.