---
title: "Grow Software One Boundary at a Time"
description: "Start with working code, then extract functions, classes, packages, modules, and projects as real cohesion and scale make each stronger boundary necessary."
lang: en
translationKey: grow-software-in-stages
publishedAt: 2023-11-07
tags:
  - software-design
  - architecture
  - modularity
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

I think software should grow through a sequence of boundaries: code, function, class, package, module, and project.

This is not a checklist that every feature must complete. It is a direction for making structure follow understanding. Begin with the smallest form that can express the behavior well. Add a stronger container when the implementation shows what belongs together and what must be separated.

Starting from the project diagram and working downward reverses that learning. It asks us to choose large boundaries while we know the least.

## My first boundary was a function

My first professional work was firmware written mainly in C. The existing programs often had a very long `main` function. New logic went into that flow. Only behavior that was clearly common or reused was extracted into a function.

Timing code made the lesson concrete. A delay was tied to the CPU and hardware characteristics, and we adjusted hardware and checked the result with an oscilloscope. That operation had a distinct purpose and could be reused, so it earned a function. Much of the surrounding logic stayed in `main`, accompanied by a great many comments.

I did not think in terms of a rich class model. The immediate design question was smaller: is this block coherent enough to name and call separately?

When I moved into C++ and MFC work, classes became a new boundary. I had studied the language, but using classes in a working socket server and user-interface application was different from seeing the syntax in a book. I had to decide which functions and data formed one concept. Existing code and more experienced colleagues supplied examples, and the software became a set of cooperating classes rather than one flow with extracted helpers.

Later, in larger C#, Java, and Spring systems, classes were no longer the largest useful grouping. Related classes needed packages. Closely related packages sometimes needed a module with explicit dependencies. A set of modules could form one application, while sufficiently separate applications or concerns could become different projects.

The important lesson was not that modules are advanced and functions are primitive. It was that each boundary answered a problem the smaller boundary could no longer handle.

## Extract after finding cohesion

The progression begins with writing the code well. When a piece of behavior has a clear purpose, name it as a function. When functions and data protect one responsibility, a class may be the right home. When the number of classes makes one namespace hard to understand, organize them into packages around cohesive behavior.

If package relationships become important enough to enforce, consider a module. A module can isolate dependencies, hide technology choices, and force another area to use a deliberate interface. If the system accumulates many modules with different operating or ownership needs, ask whether one project is still the correct boundary.

Size alone is not the decision. "There are twenty classes, so create a package" is not a design rule. The useful signal is a relationship: these things change together, serve one behavior, share a lifecycle, or need protection from the rest. Growth reveals that relationship through implementation.

This is why I am cautious about creating a multi-module project at the start. A module is not a sophisticated decoration. It is a constraint. If we create it before understanding dependencies, we may spend the rest of the project negotiating with a boundary that represents an early guess.

The same mistake can happen with packages or classes. A deep package tree designed before any behavior exists gives empty names the authority of a model. A class extracted merely because a function is long can scatter one coherent flow. Structure should reduce the cost of understanding and change, not satisfy an expected number of layers.

## Growing from small does not mean waiting for a mess

There is a bad interpretation of this advice: put everything in one file until it becomes unbearable, then separate it. That only makes extraction expensive.

Small-first design still requires attention. Write the current code well. Extract genuinely common behavior into functions, group cohesive functions into classes, organize growing class sets into packages, consider modules when packages become numerous, and split projects when the module set warrants it.

The difference is that we do not pretend to know the final boundary. We make the current code coherent enough to change, then strengthen a boundary when evidence appears.

A practical review can move through the sequence:

1. Can this behavior be understood as code, or does a named function clarify its purpose?
2. Do several functions and their data form one responsibility worth protecting in a class?
3. Are related classes close together, or does a package need to express their cohesion?
4. Is there a dependency or implementation detail that a module should physically isolate?
5. Have module ownership, runtime, release, or operating concerns diverged enough to justify another project?

A level may be skipped. A functional style may not need the same class progression. A small program may remain a few functions for its whole life. The sequence is a way to ask whether the strength of the boundary matches the problem, not a demand for object-oriented ceremony.

## Let the software teach the structure

I encountered modules early in my Java and Spring work because a colleague had already built systems that way. Seeing one project contain related modules and assemble an application expanded what I thought a project could be. It also led to plenty of experiments before I understood where module boundaries helped.

That experience is why I do not present multi-module design as a starting achievement. Knowledge of the tool arrives before judgment about its use. Judgment grows by implementing, changing, operating, and sometimes removing boundaries that were wrong.

Software has been compared to a cell that grows. I like the image because growth is different from assembling an empty skeleton at full size. A living system forms internal structure as it develops. The structure supports the next stage rather than predicting every stage in advance.

Write the code. Extract the behavior you can name. Group what proves cohesive. Enforce the dependency that has become worth protecting. Split the project when its parts truly need independent lives. Each step should solve a pressure the software actually has.