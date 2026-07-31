---
title: "Fluxx"
description: "Why we're building Fluxx: a human interface on top of an agentic software factory."
pubDatetime: 2026-06-15T03:10:35.000Z
author: "Suhaas"
tags: ["essays"]
substackUrl: "https://suhaaspk.substack.com/p/fluxx"
substackComments: 0
draft: false
---

We are building Fluxx because the way software is made is starting to change, and the tools for this new workflow don’t quite exist yet.

Sahil and I started working on Fluxx to have a tool that is attuned to our own development process. Before Fluxx, we were using multiple agents to parallelize tasks and relying on ChatGPT or Claude to help break features into subtasks. The planning itself was useful, but getting those plans into separate agent sessions was largely manual. And as we scaled up the number of agents, keeping their work aligned without collisions or duplicated effort became increasingly difficult.

Fluxx is our attempt to give the multi-agent workflow a real home. The UI is a collaborative kanban board where each task is assigned to an agent, so we can see at a glance what every agent, ours and our teammates’, is doing. A planning assistant sits beside the board so we can talk through new features, and once we’re done, it generates the tasks and wires up the dependencies for us. Then we just kick everything off and watch the feature get built. When the work completes, we open the feature branch and spin up a dev server to verify everything end-to-end. The first time we watched a whole feature materialize from tasks we’d just planned, we knew that the way software gets made from here on out is gonna look very different than the last 30 years.

Fluxx is still early, but the vision is simple: a human interface on top of an agentic software factory.
