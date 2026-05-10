---
title: "Building Tashawwur: An AI Assistant for Deconstructing Modern Financial Transactions"
date: "2026-04-11"
excerpt: "How I built a production-ready Telegram bot using LangGraph, FastAPI, and Celery to bridge the gap between complex modern finance and Islamic jurisprudence."
tags: ["AI", "Backend", "Python", "LangChain", "Blockchain"]
img: "/images/blog/tashawwur-hero.png"
readingTime: "6 min read"
--- 

## Introduction

*A collaborative project with Mumtaz Humam Alfian Zulva, CEO of Shariacrypto.*

In today's digital era, financial innovations like Crypto, Tokenomics, Stocks, Paylater, and Dropshipping are evolving at a breakneck pace. However, these innovations often bring confusion, especially for Muslims who want to ensure their transactions comply with Islamic law (halal or haram).

The main problem isn't a lack of scholars, but the **difficulty laypeople face in explaining complex financial schemes to muftis or ustadzs**. There is a massive knowledge gap between the classical language of Islamic jurisprudence (*turats*) and the reality of modern applications. Without an accurate and complete understanding of the facts—a concept known in Fiqh as **Tashawwur**—issuing a precise fatwa is impossible. As the legal maxim states: *"The ruling on a thing is a branch of its conceptualization (tashawwur)."*

Driven by this issue, I designed and built the **Tashawwur Fikih Muamalat Telegram Bot**. This project is not a "Fatwa-Issuing Bot." Rather, it is an **AI Assistant and Transaction Anatomy Expert** designed to bridge modern financial terminology with the language of Fiqh, preparing the facts so they can be easily consulted with religious scholars.

![Illustration of an AI assistant analyzing modern financial transactions and Islamic finance contracts](/images/blog/tashawwur-hero.png)

## Core Capabilities

The bot is designed to deconstruct a business scheme from start to finish with the following key features:

1. **Terminology Translator:** Converts complex marketing/financial terms into their Sharia contract equivalents (e.g., explaining crypto *staking* through the lens of Islamic contracts).
2. **Transaction Flow Deconstruction:** Breaks down the involved parties, the flow of money, and the object of the transaction using simple language and diagrams.
3. **Critical Point Detection:** Automatically highlights parts of the transaction that potentially contain *Gharar* (uncertainty), *Maysir* (gambling), or *Riba* (usury).
4. **Case Simulation & Risk Analysis:** Provides concrete examples of real-world applications, including simulating who bears the loss if the business fails.
5. **Copy-Ready Consultation Summary:** Generates a neatly structured report that users can easily copy-paste (or export to PDF) to send to their consulting ustadz.
6. **Interactive Glossary:** If a user is confused by a Fiqh term mentioned by the bot, they can immediately ask for a conceptual explanation.
7. **Scheme Risk Score:** Provides a metric assessing how complex or risky the scheme is from a *muamalah* perspective.

## System Architecture & Tech Stack

To ensure this bot can serve many users quickly, handle heavy AI processing without freezing, and remain stable for public use, I designed a production-ready system architecture.

Here is the technology stack driving the system:

```

mermaid
graph TD
  User[Telegram User] -->|Webhook| FastAPI[FastAPI Gateway]
  FastAPI <-->|Rate Limit & Cache| Redis[(Redis)]
  FastAPI -->|Enqueue Task| Celery[Celery Async Worker]
  Celery <-->|Chat History| DB[(PostgreSQL)]
  
  subgraph LangGraph Agentic Workflow
    Router[Router Agent] -->|Needs Context| Search[Research Agent]
    Router -->|Direct| Analysis[Muamalah Analysis Agent]
    Search --> Analysis
    Analysis --> Formatter[Formatter Agent]
  end
  
  Celery -->|Triggers Workflow| Router
  Search <-->|Web/Whitepapers| Internet((Internet))
  Analysis <-->|LLM Processing| Gemini[Google Gemini]
  Formatter -->|Final Report| Celery
  Celery -->|Async Reply| User

```

### 1. User Interaction & Gateway (Telegram & FastAPI)

* **Python & python-telegram-bot:** The core language and bridge to Telegram. The bot uses Webhooks, meaning Telegram instantly pings our server whenever a message arrives, ensuring immediate responsiveness.
* **FastAPI:** Acts as the main "Receptionist." When a message arrives, FastAPI quickly acknowledges it, sending an instant reply like *"Analyzing..."* so the user knows their request is being processed.

### 2. Traffic Control & High-Speed Memory (Redis)

* **Redis:** Serves as lightning-fast short-term memory handling two main tasks:
  * **Rate Limiting:** Protects the server by temporarily blocking users who spam messages.
  * **Caching:** If multiple users ask the exact same question (e.g., "What is Paylater?"), the bot retrieves the previously saved answer instantly without re-processing the AI logic.

### 3. Background Workers & Storage (Celery & PostgreSQL)

* **Celery:** AI processing takes time (often 30-40 seconds). If the FastAPI "Receptionist" handled this, the queue would stall. Celery acts as the background "Factory Worker." FastAPI simply hands the task to Celery and returns to serving other users.
* **PostgreSQL:** The robust main filing cabinet. It stores chat history (so the bot remembers context) and tracks the status of every asynchronous task.

### 4. The AI Brain (Gemini & LangGraph)

* **Google Gemini:** Chosen as the core Large Language Model (LLM) for its massive context window (perfect for reading lengthy crypto whitepapers) and exceptional ability to process Arabic text for scriptural references.
* **LangGraph:** The AI conductor. Because deconstructing transactions is complex, LangGraph splits the AI's thought process into specialized Agents:
  1. **Router:** Reads the user's message and classifies the intent (e.g., Stocks, Crypto, or general greeting).
  2. **Research (Web Search):** Automatically browses the internet for the latest whitepapers or platform rules to ensure factual accuracy and prevent hallucinations.
  3. **Muamalah Analysis:** Compares the internet research findings against Fiqh Muamalah principles.
  4. **Formatter:** Compiles all analytical findings into a clean, easy-to-read report.

### 5. Reliability & Security (Docker & Sentry)

* **Docker Compose:** Containerizes the entire stack (FastAPI, Redis, Celery, PostgreSQL) for consistent deployment across any server environment.
* **Sentry:** The alarm system. If an error or bug occurs in production, Sentry automatically logs the stack trace and alerts me to the exact line of failing code.

## Service Level Objectives (SLOs)

This system was built with strict technical performance targets:

| Metric | Target |
|---|---|
| **Initial Response (Ack)** | p95 &lt;= 2 seconds |
| **Success Rate** | &gt;= 95% of queries processed without errors |
| **Error Rate** | &lt; 1% under concurrent load |
| **Total Turnaround Time** | &lt; 45 seconds (Research -&gt; Analysis -&gt; Formatting) |

## Development Roadmap

The project is being built using an agile approach to ensure quality at every step:

* **Phase 1 - Foundation & Reliability:** Building FastAPI, Redis, Celery, and the queue system for absolute stability (Current Phase).
* **Phase 2 - PDF Export:** Allowing users to download clean PDF versions of their consultation summaries.
* **Phase 3 - Arabic Text Grounding:** Connecting the research agent directly to online classical libraries (`shamela.ws`) so every analytical point is backed by valid original text references. (Target: 90% grounding).
* **Phase 4 - Risk Calibration:** Rigorous testing of the risk scoring algorithm to ensure consistent evaluations for similar business schemes.
* **Phase 5 - Interactive Glossary Mode:** Releasing a fully integrated educational dictionary for laypeople.

## Conclusion

The **Tashawwur Fikih Muamalat** bot is a prime example of how modern Generative AI—when orchestrated with mature software architecture like asynchronous processing, caching, and agentic workflows—can solve highly specific and essential literacy problems in society.

More than just a standard chatbot, it is a smart assistant that respects the authority of human scholars by positioning itself purely as a factual deconstruction tool, ensuring the community can navigate the disruptions of modern finance with clarity and peace of mind.
