---
title: "Understanding how things work"
description: "An interesting conversation I had this week"
pubDatetime: 2026-06-27T22:53:30.000Z
author: "Suhaas"
tags: ["essays"]
substackUrl: "https://suhaaspk.substack.com/p/understanding-how-things-work"
substackComments: 0
draft: false
---

![](../../assets/writings/understanding-how-things-work/1.webp)

---

This week we spoke with a college student who is building an app to help people become better public speakers.

_Side note: I think this is a genuinely good idea. Granola has opened the door to undetectable meeting software. A Granola-like product that gave feedback on how I speak is something I might pay for. When I meet with people about Fluxx, I look back at the transcript and cringe at all the times I say “like” and “um.” I also notice all the missed opportunities to express an idea or ask an important question._

I asked this person how he was approaching building the app. His answer was interesting, and similar to what we have heard from several other people.

He did not want to vibe-code certain parts of the app at all. In particular, he wanted to hand-code the backend because it involved technologies he was not familiar with, including speech-to-text and visual-cue detection. He was completely fine vibe-coding the frontend, however, because he already knew some React and did not find it very interesting. He wasn’t rejecting the use of AI coding assistance but he was trying to avoid becoming dependent on it and losing control of the product.

For the most part, I agree with this approach. I got the sense that his main priority was to learn. But even if the top priority is to build a great product as quickly as possible, emphasizing understanding makes sense in the long term.

Builders inevitably need to change their product based on what they learn from users. If their understanding of how the product works degrades over time, it becomes harder and harder to make quick, effective changes. Ultimately, a loss of understanding is a loss of agency.

## A tool for understanding

That made me think about what kind of tool this type of builder would want to use. I imagine a build environment that:

1. maintains a living blueprint of the project, including documents explaining the architecture and a record of design decisions made along the way
2. explains relevant implementation options and their tradeoffs, then pushes the user to resolve unclear or incomplete decisions
3. gives the user hand-coding challenges that they can complete or opt out of

It would feel like a “[build-your-own-x](https://github.com/codecrafters-io/build-your-own-x)” project, except x is whatever the user wants to build.

These are just some early ideas for features that could help builders stay in control of their product. We are currently not planning to b

uild a product specifically around increasing understanding. Claude Code is already getting very good at the first two. We are also talking to people, and there may be sharper problems to solve.

That being said, this conversation has left me with a new question: how can a dev tool make its builder _more capable_ over time?
