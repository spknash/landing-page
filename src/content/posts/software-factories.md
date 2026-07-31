---
title: "Software Factories"
description: "What does the automation of software creation look like, and what happens after that?"
pubDatetime: 2026-06-15T03:13:13.000Z
author: "Suhaas"
tags: ["essays"]
substackUrl: "https://suhaaspk.substack.com/p/software-factories"
substackComments: 0
draft: false
---

In the future almost everything will be done by an agent of some kind. Humans will say what they want, the agents will go off and do it, and the work will just happen. What we don’t have yet is the interface for expressing intent. For software businesses this interface can be built right now. Boris Cherney keeps saying “coding is solved”. It’s a vague statement but I agree with what he probably means. Coding agents are already very good. If you give them a clear task with the right context they will finish it correctly almost every time. The real challenges are (1) giving agents tasks they can actually handle, (2) giving them the context they need, and (3) then verifying the work they produce. With Fluxx we are working on the first two and we know we will have to solve the third.

I read a Substack article by Phin Barnes about the future of software that I thought was really interesting \[1\]. The tldr is that when the production of something gets automated, the center of value creation moves somewhere else. Once shoe factories became efficient, the real value shifted to taste and distribution. I think the same thing is about to happen in software.

But software factories won’t behave like shoe factories. With shoes you can hand over a spec and the factory handles the rest. A shoe factory is largely immutable: input design, output product. Once production starts, changes are rare and usually expensive, and they are not part of the normal workflow. Software is different in two ways. It is possible to change it on the fly, and it is also necessary to change it on the fly. There are too many small decisions, edge cases, and shifts in intent that show up while it is being built. The creator has to stay involved during the process, not just at the start and end. So a software factory can’t just take a spec and disappear. It has to be something you can step inside, adjust while it’s running, and continuously check that what’s being produced still matches what you intended.

That’s what makes software different, and why there is so much potential for the interface for its production.

\[1\]

[

![](../../assets/writings/software-factories/1.png)

The General Partnership

The Best Companies Will Stop Making Software

My first day in Taiwan working for AND 1 taught me a ton. It was 1998, and I flew from Philadelphia to Taipei, and then drove to Taichung. I met my boss for the first time and handed over a tube of blueprints I’d carried from the U.S. as if they were the Dead Sea Scrolls. He spread them out on the table, made a few edits and rolled them back into the tu…

Read more

3 months ago · 192 likes · 20 comments · Phin Barnes

](https://thegeneralpartnership.substack.com/p/the-best-companies-will-stop-making?utm_source=substack&utm_campaign=post_embed&utm_medium=web)
