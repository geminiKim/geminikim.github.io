---
title: "Git History Is a Team Asset, Not a Work Diary"
description: "Split work before polishing commits, shape pull requests for reviewers, and leave a history that helps the next engineer understand changes and recover a release."
lang: en
translationKey: practical-git-commit-branch-rules
publishedAt: 2023-12-09
tags:
  - git
  - collaboration
  - software-engineering
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

There are two common ways to make commits. Some developers decide the commit units first and save each completed step. Others finish a feature, then reorganize the work into commits before opening a pull request. I use both. The important skill is not loyalty to either method. It is learning to make the work itself small enough that another person can understand it.

If the task is "build the review system," the commit problem has already become difficult. Review creation, lookup, editing, and deletion are different changes. A single branch that covers all of them may touch fifty files, contain a dozen commits, and mix design, implementation, and cleanup. Neatly named commits cannot make that pull request easy to review.

Split the task before arguing about commit style. Separate the branches and pull requests when the pieces can be delivered independently. Small work makes sensible commits much easier.

## Wear one hat at a time

A common mistake is to add a feature and refactor nearby code in the same change. Sometimes the refactoring is genuinely required. Often we simply notice untidy code while working and decide to fix it at the same time.

The reviewer then has to answer two different questions at once. Did behavior change because of the feature, or because of the refactoring? Was the refactoring needed to deliver the feature? If something breaks, which part should be reverted?

I try to wear one hat at a time. Refactor first in a change that preserves behavior, then add the feature. Or deliver the feature and schedule unrelated cleanup separately. This is not a law that forbids touching existing code. It is a way to keep the purpose of a change visible.

A small pull request also gives the reviewer enough context to discuss design. If a person from the order team is asked to review a huge review-system change, they may know too little to comment on policy and end up checking formatting. A narrow change, with the requirement and decision explained, gives that same reviewer a chance to ask useful questions.

The reviewer is a user of the pull request. I shape the work for that user, not only for the convenience of the author.

## Working commits and review commits serve different people

While I am developing, I commit whenever I want a checkpoint. Those commits can be rough. They help me experiment, reset, compare approaches, and avoid losing work. I often open a draft pull request early, but the branch is still mine to work on at this stage.

Before asking for review, I reorganize the commits. I may reset and rebuild them so that each one has a clear purpose. One practical preference is to avoid changing the same class in several unrelated commits. If `User` changes in commit one, again in commit three, and once more in commit seven, a reviewer following commits has to jump backward repeatedly to understand the final reason for the change.

This does not mean every file may appear in exactly one commit under all circumstances. It is a useful pressure toward commits that can be read in sequence without reconstructing the author's entire afternoon.

During review, I usually keep the follow-up commits as they happen. Review is a conversation. Separate changes make it easy for the reviewer to see what was adjusted in response to a comment.

After the review is complete, I look at the history again. If a review correction contains a decision that will matter later, preserving it may be useful. If it only fixes a typo or folds a missing line into the intended implementation, I usually rebase or squash it into the relevant commit. This cleanup belongs on an unmerged feature branch under an agreed team policy. Rewriting changes commit IDs and must be coordinated with collaborators and dependent branches; repository protection rules still apply. The pull-request conversation may remain, but diff context and commit references can become outdated. The permanent Git history should tell the next engineer how the software reached its meaningful states, not force them through every intermediate mistake.

The audience changes during the process:

- While working, commits are for me.
- When requesting review, commits and the pull request are for my colleagues.
- After review, the history is for the company and the next person.

That shift explains why one raw sequence of commits is rarely best for every stage.

## Large changes need branches that tell a sequence

Some work cannot fit into one small pull request. In that case, I prefer a sequence of dependent branches over one enormous branch.

A base pull request can introduce the minimum structure. The next branch starts from that branch and adds one operation. Another branch can add the next operation. Review and merge them in order, rebasing the later branches as their base moves. This stacked approach takes discipline, but each review has a bounded topic.

Keeping the branch current with its target also matters. In the ordinary feature flow, I prefer rebasing onto the latest development branch rather than repeatedly merging the development branch into the feature branch. There are exceptions, but constant merge commits make the graph harder to read and make later recovery harder than it needs to be.

The goal is not a pretty graph for its own sake. The graph has an operational job.

## Design history for the bad release

A clean history becomes valuable during an incident. Imagine a release that contains work from several people. One change caused an outage, but another change in the same release altered a cache key and cannot safely be rolled back. Reverting the whole release breaks one path; leaving it deployed breaks another.

Now the team must build a hotfix release by selecting the good changes and excluding the bad one. If the history contains dozens of mixed commits named "review feedback" and the same files change again and again, everyone gathers behind one keyboard asking whether each commit belongs. I have seen this scene more than once. It is miserable, and the urgency makes every ambiguous commit dangerous.

Small, coherent commits and a readable branch history make it easier to revert or cherry-pick the intended change. They do not replace backward-compatible deployment design. Cache formats, database changes, and API contracts still need rollback plans. Git history is the second line of defense when the first plan fails.

Each team should agree on practical rules: expected pull-request size, when to split a task, how to handle review commits, whether feature branches rebase, and what the merge strategy produces. Automation can warn about unusually large changes, but a file limit is not the principle. A ten-file change can be incoherent, while a generated rename may touch many files and remain obvious.

The durable rule is simpler. Make the work reviewable now and recoverable later. Git records company assets and engineering decisions. Treating it as a private work diary saves a few minutes for the author and sends the bill to every colleague who reviews, debugs, or inherits the code.