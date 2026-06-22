---
title: "Soft Pivot"
description: "What we learned talking to 15–20 potential users, and where Fluxx is headed next."
pubDatetime: 2026-06-15T12:00:00Z
tags: ["essays"]
draft: false
---

Over the past two weeks we talked to 15–20 potential users, almost all of them software engineers at big tech companies or startups. Going in, we assumed our ICP was software engineers, we weren't sure whether they'd be at big companies or startups. Now we feel our ideal customers are founders and small teams.

## Big tech engineers aren't our users

One thing became clear fast: it's very unlikely that someone at a big tech company uses Fluxx at work. There are a few reasons:

- Unclear or restrictive guidelines about downloading tools off the internet
- Company-specific engineering workflows (Google has its own Git; every company has a different deployment platform)
- A culture of not shipping large changes without comprehensive manual review

None of the big tech engineers we spoke to even used popular tools like Conductor or Superset. So a big tech engineer who doesn't build side projects isn't a good fit for Fluxx. More than that, I suspect this group won't be early adopters of any agent orchestration platform. The constraints are structural, not about our product specifically. We probably won't keep actively pursuing them.

## Startup engineers are closer

Engineers at startups are more promising. Many already know the existing orchestrators and want a way to manage multiple agents at once. The dominant workflow looks like Linear + Agent + Orchestrator (sometimes): engineers pick up tasks in Linear and feed ticket descriptions into their agents.

Fluxx adds a few things on top:

- A planning agent that breaks large features into sets of subtasks
- One platform for all three parts of the workflow — collaborative project management, agents, and orchestration

It became clear these advantages aren't enough to make a startup team switch. With an orchestrator like Conductor or Superset, plus Linear's MCP and Claude Code, you can already get most of what Fluxx offers. To attract and keep users, we need a step-change, not an increment.

## Validation and Loops

We're exploring two capabilities that we think could be that step-change. We don't know yet whether they'll deliver the 10x improvement we're after. But we think they can, and we are building it out to see if they do.

**Validation** — how can work done by agents be verified quickly and confidently?

**Loops** — continuously running schedules that agents execute.

Together these point at the experience we actually want: a user can ideate, dispatch an agent to build something, verify it, and then let agents maintain what they created. Validation is the hard, mostly unsolved piece. Loops are already used by some to keep agents working around the clock, but most people are not using this capability yet. If we get these features right, it becomes the reason to choose Fluxx.

## The UX

Another thing we realized while demoing Fluxx is that the UX is shit. Too much setup, too many settings, too much configuration before a user gets any value.

So part of this redesign is to "apple-ify" Fluxx: no setup to get started, an intuitive interface, and controlled defaults. Simplifying the UX creates another opportunity for us. It makes Fluxx approachable for non-technical users, not just engineers. This matters because at a small team the person doing this work is often a founder or operator rather than a dedicated engineer. We heard from one user that for personal projects they always use Cursor because its "easy and nice to look at" even though they Claude Code at work. I think UX is very important for what people decide to use for side projects and business experiments.

## Next

Almost everyone we talked to in this round was an engineer, so we're aware we're partly reasoning about a group, founders and operators, that we haven't spoken to enough yet. That's the plan for the coming weeks: talk to founders and operators, learn what bottlenecks they actually face, and find out whether our vision for Fluxx can make them more productive.
