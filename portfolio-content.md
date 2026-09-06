# Portfolio Content Source of Truth (Sarang Rao)

Use this file as the complete source of truth for all website sections: About, Experience, Projects, Certifications, Skills, Links, and Contact.
Do not invent new experiences or metrics. Use what is written here.
Prefer concise bullets, strong action verbs, and quantified impact where available.

Also mirrored from `/home/sarang/resume/career.md` (authoritative long-form source) and `/home/sarang/resume/resume_projects.md` (project bullets).

---

## Basic Info

**Name:** Sarang Rao
**Role:** AI/ML Engineer · AI Team Lead at TenancyPassport
**Email:** raosarang2006@gmail.com
**Phone:** +91 94211 40800
**LinkedIn:** https://linkedin.com/in/sarang-rao-262bbb324
**GitHub:** https://github.com/SarangRao20
**LeetCode:** https://leetcode.com/u/SarangRao

**Education:**
- B.Tech, Electronics & Computer Engineering — PICT Pune (Expected 2028, CGPA 9.07)
- BS in Data Science and Applications — IIT Madras (Diploma in Programming completed; Data Science diploma in progress)

---

## Short Bio (Use on Homepage)

I'm an engineer who builds practical AI systems across the stack — from computer vision pipelines to multi-agent orchestration to backend APIs. I started as an intern and got promoted to lead a team within months. Currently AI Team Lead at TenancyPassport (Jan 2026–present), where I merged two fragmented codebases into one production repo and lead a team of 5 AI interns across document intelligence agents, room-inventory CV pipelines, and conversational AI. I care about systems that actually ship, not just models that score well on benchmarks.

---

## Experience

### TenancyPassport — AI Team Lead (Jan 2026 — present)
- Leads a team of 5 AI interns.
- Merged two fragmented codebases into a single production repository; owns LLM pipelines across rental agreements, KYC, and financial document processing.
- Shipped RAG document processing, LangGraph agent workflows, real-time voice pipelines, and CV room-inventory systems — all in production.

Note: The Experience timeline is work-only. Education lives in the hero TRAINING row and the Certifications section.

---

## Featured Projects (High Priority)

### Elysia-AI — Real-Time Voice AI Desktop Assistant
**Tech:** React 19, TypeScript, Express, WebSocket, Gemini Live API, FastAPI, Playwright, Tesseract OCR, Tailwind, Motion
**Highlights:**
- Real-time voice AI assistant with bidirectional audio streaming, wake word detection, screen sharing, and text fallback across a 3-process architecture (React frontend, Node.js orchestrator, Python desktop agent).
- ~110 tools across 21 modules (browser automation, file system, terminal, system control, clipboard, OCR, Google integrations) with 4 OS backends.
- Persistent memory with 7-category extraction, timer-based reminders, canvas holographic visualizer with video character states.
**Repo:** https://github.com/SarangRao20/Elysia-AI

### FinServe NBFC — Multi-Agent Loan Origination
**Tech:** LangGraph, Gemini Vision, FastAPI, MongoDB, Redis, Groq, Vercel
**Highlights:**
- Led team building multi-agent loan origination connecting KYC, fraud detection, underwriting, and sanction agents with structured state passing.
- Gemini Vision + OCR for financial document extraction with confidence checks and manual review fallback.
- FastAPI backend with MongoDB for loan data, Redis for agent state caching; deployed on Vercel with CI/CD.
**Repo:** https://github.com/SarangRao20/NBFC · **Deploy:** https://nbfc-inc.vercel.app

### Nivana — Mental Health Conversational AI
**Tech:** Flask, React 19, PostgreSQL, Redis, Celery, Ollama, Gemini
**Highlights:**
- Emotional vector engine tracking mood across sessions, triggering interventions on deterioration.
- Multi-layered pipeline: local intent classification (Ollama), conversational responses (Gemini), crisis detection with automatic escalation.
- Full stack delivered: Flask, PostgreSQL, Redis, Celery for async alerts and reports.
**Repo:** https://github.com/SarangRao20/Nivana · **Deploy:** https://nivana-azure.vercel.app

### LeetCode Wrapped — Full-Stack Data Visualization
**Tech:** FastAPI, React, GraphQL, Redis, Recharts, Vercel
**Highlights:**
- Aggregates yearly LeetCode submission statistics via GraphQL API — difficulty breakdowns, active days, acceptance trends.
- Redis caching for rate limits; interactive charts for streak tracking and yearly retrospectives.
**Repo:** https://github.com/SarangRao20/LeetCodeWrapped · **Deploy:** https://leetcode-wrapped-two.vercel.app

---

## Additional Projects

### OLA BDM Analytics
- Revenue and driver analytics on 50K+ ride records: cancellations, earnings volatility, payment methods; cohort analysis and executive dashboards.
**Repo:** https://github.com/SarangRao20/BDM_OLA · **Deploy:** https://SarangRao20.github.io/BDM_OLA/

### Hospital Management System
- Multi-role platform (Admin, Doctor, Patient): Flask REST API, Vue.js frontend, JWT auth, Celery + Redis async tasks, 10+ entity schema. Graded A in IITM MAD2.
**Repo:** https://github.com/SarangRao20/Hospital-Management-System---V2

### Temple Run (Position-Based)
- MediaPipe hand tracking + OpenCV gesture controller for a position-based Temple Run game.
**Repo:** https://github.com/SarangRao20/Temple-Run-game-Position-Based

### Reading Hall Occupancy Monitoring
- Real-time seat occupancy detection with YOLOv8 + OpenCV and grid calibration.
**Repo:** https://github.com/SarangRao20/Reading-hall-management

### EY Proto — Conversational Loan Negotiation
- 5-step compliance ladder, 3-tier decisioning (auto-approve, manual review, reject) with Gemini agents and spaCy NER document extraction.
**Repo:** https://github.com/SarangRao20/EY_proto

---

## Achievements

- **Winner ×2 — Ideathons** — Innowave 2025 (PICT ACM) & FY Healthcare Track.
- **Reliance Foundation Scholar** — Top 1% nationally, 2024 cohort.

## Certifications

- **BS in Data Science & Programming** — IIT Madras. Diploma in Programming completed, Data Science in progress.
- **Machine Learning Specialization** — DeepLearning.AI · Andrew Ng · Coursera.

---

## Skills

### Languages
Python, C++, SQL, JavaScript, TypeScript

### AI / ML
LangGraph, LangChain, Gemini API, LLM Orchestration, Prompt Engineering, RAG, Multi-Agent Design, OpenCV, YOLO, OCR, MediaPipe

### Backend
FastAPI, Flask, REST APIs, Celery, PostgreSQL, MongoDB, Redis, SQLAlchemy, Alembic, JWT, OAuth

### Frontend
React, Vue.js, TypeScript, Tailwind CSS, Motion

### Tools & Systems
Git, Linux, Docker, Google ADK, Groq, Playwright, Swagger

### Professional
Communication, leadership, project management, mentoring 10+ engineers, report writing, presenting to technical and non-technical audiences

---

## Website Structure (Agent Instructions)

Build a portfolio website that includes:
1. Home (Headline + short bio + featured projects)
2. Overview (longer bio + currently learning)
3. Experience (timeline)
4. Projects ("Project Registry"):
   - Filter chips: ALL / AI AGENTS / COMPUTER VISION / DATA VIZ / FULL STACK
   - Featured (4) = build tickets with tabs: STACK · METRICS · SHIP LOG
   - Additional (5) = compact tickets with metric chip
   - Featured: Elysia-AI (AI AGENTS), FinServe NBFC (AI AGENTS), Nivana (AI AGENTS), LeetCode Wrapped (DATA VIZ)
   - Additional: OLA BDM (DATA VIZ), Hospital (FULL STACK), Temple Run (CV), Reading Hall (CV), EY Proto (AI AGENTS)
5. Achievements (Ideathon wins, scholarships, DSA)
6. Certifications (IITM Diploma, ML Specialization)
7. Skills (grouped)
8. Contact (email, phone, LinkedIn, GitHub, LeetCode)

Design notes:
- Keep it clean and modern, easy to scan.
- Prefer action-oriented bullets and project cards with tags (AI, ML, LLM, Multi-Agent, CV, Backend).
- Include external links for GitHub + deployed projects.
- Do not add false metrics or fake employers.

---

## Optional Tagline Ideas
- Multi-agent systems, RAG pipelines, voice AI, and computer vision — shipped to production
- From intern to AI Team Lead: building AI that survives contact with production
- AI systems across the stack: agents, LLMs, vision, and clean backend infrastructure