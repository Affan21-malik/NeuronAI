🧠 NeuronAI

AI-Powered Adaptive Technical Interview Platform

An intelligent technical interview platform that simulates real-world interviews using specialized AI interview agents, adaptive questioning, answer evaluation, performance analytics, knowledge mapping, and personalized skill-gap insights.

📌 Table of Contents

About the Project

Why NeuronAI

Features

AI Interview Agents

Interview Experience

Adaptive Interview Engine

Answer Evaluation

Performance Analytics

Knowledge Map

Skill Gap Analysis

Interview Reports

Authentication

System Architecture

Tech Stack

Project Structure

Testing

Quick Start

Deployment

Security

Future Roadmap

🧠 About the Project

NeuronAI is an AI-powered technical interview platform designed to make interview preparation more realistic, adaptive, and data-driven.

Traditional interview preparation usually follows:

Question
   ↓
Answer
   ↓
Next Question

NeuronAI transforms this into an intelligent loop:

Question
   ↓
Candidate Answer
   ↓
AI Evaluation
   ↓
Performance Analysis
   ↓
Difficulty / Topic Decision
   ↓
Adaptive Follow-up
   ↓
Next Question

The platform combines:

🤖 AI-powered interviewing

🧠 Multi-agent interviewer personas

🎯 Adaptive question generation

📊 Answer evaluation

📈 Real-time performance tracking

🗺️ Knowledge mapping

📉 Skill-gap analysis

📄 Interview reports

🔐 Secure authentication

🔄 Persistent multi-turn interview sessions

💡 Why NeuronAI?

NeuronAI focuses on more than simply checking whether an answer was submitted.

The system is designed to understand:

Technical correctness

Conceptual understanding

Candidate reasoning

Completeness

Weak concepts

Interview progression

Appropriate next-question difficulty

The goal is to simulate a real technical interviewer rather than a static question bank.

✨ Features

🤖 AI Technical Interviews

AI-generated technical questions

Multi-turn interview sessions

Context-aware questioning

Candidate answer submission

AI answer evaluation

Dynamic follow-up questions

Topic transitions

Difficulty adaptation

Session persistence

📊 Performance Tracking

Question-wise scores

Interview progress

Score graph

Technical performance indicators

Final performance summary

🗺️ Knowledge Intelligence

Knowledge Map

Technical-area performance

Skill Gap Analysis

Strength identification

Weak-area identification

Personalized improvement insights

📄 Interview Reports

Reports can include:

Overall score

Question-wise performance

Technical strengths

Weak areas

Knowledge map

Skill gaps

Evaluation summaries

Improvement recommendations

🤖 AI Interview Agents

NeuronAI is designed around specialized interviewer personas.

Agent

Role

Status

⚡ JARVIS

Precision & Technical Correctness

🟢 Available

🔵 FRIDAY

Adaptive & Conversational

🟡 Coming Soon

🔴 ULTRON

Analytical & Technical Challenge

🟡 Coming Soon

⚡ JARVIS — Precision-Focused

Personality: Calm, composed, intelligent, precise, systematic, reliable.

Communication: Professional, concise, information-focused.

Focus:

Technical correctness

Architecture

Engineering decisions

Reasoning

Best practices

Technical depth

🔵 FRIDAY — Adaptive & Conversational

Personality: Responsive, adaptive, observant, context-aware, supportive.

Communication: Natural, conversational, clear.

Focus:

Candidate reasoning

Contextual follow-ups

Natural conversation

Communication quality

🔴 ULTRON — Analytical & Challenging

Personality: Highly analytical, autonomous, persistent, confident, skeptical.

Communication: Direct, assertive, analytical.

Focus:

Edge cases

Trade-offs

Limitations

Failure scenarios

Deep technical understanding

Only useful analytical and challenging traits are adapted; destructive fictional goals are excluded.

🎤 Interview Experience

The interview flow is designed as:

Start Interview
      ↓
Choose AI Interviewer
      ↓
Start Session
      ↓
Generate Question
      ↓
Candidate Answers
      ↓
AI Evaluation
      ↓
Score / Feedback
      ↓
Adaptive Decision
      ↓
Next Question
      ↓
Repeat
      ↓
Final Report

When the user leaves the interview and later returns to the Interview section, the agent-selection step is intended to appear again so a new interview can start with a deliberate agent choice.

🔄 Adaptive Interview Engine

The interview engine is designed to adapt according to the candidate's response.

Strong Answer

Strong Answer
      ↓
High Evaluation
      ↓
Increase Difficulty
      ↓
Advanced Question

Weak Answer

Weak Answer
      ↓
Low Evaluation
      ↓
Follow-up / Clarification
      ↓
Concept Reinforcement

Partial Answer

Partial Understanding
      ↓
Identify Missing Concept
      ↓
Targeted Follow-up
      ↓
Re-evaluation

This makes the interview dynamic instead of a fixed sequence of questions.

🧩 Multi-Turn Sessions

NeuronAI maintains interview context across multiple turns.

Session
  │
  ├── Question 1 → Answer 1 → Evaluation
  │
  ├── Question 2 → Answer 2 → Evaluation
  │
  ├── Question 3 → Answer 3 → Evaluation
  │
  └── Question N → Answer N → Evaluation

The backend interview engine is designed to preserve session context so each response can influence subsequent interview behavior.

📊 Answer Evaluation

The answer-evaluation pipeline is responsible for analyzing candidate responses.

Evaluation dimensions can include:

Technical correctness

Conceptual understanding

Reasoning

Completeness

Communication

Overall score

The evaluated score is intended to update the interview progress and determine the next interview action.

📈 Performance Analytics

NeuronAI provides question-wise performance tracking.

Example:

Question 1 → 72
Question 2 → 81
Question 3 → 65
Question 4 → 88
Question 5 → 91

The score progression can be visualized as a graph so the candidate can understand how performance changes throughout the interview.

🗺️ Knowledge Map

The Knowledge Map represents technical knowledge across multiple areas.

Possible areas include:

RAG Architecture

Vector Search

Prompt Engineering

LLM Concepts

MCP

Agentic Systems

AI Architecture

System Design

Backend Engineering

APIs

Databases

Distributed Systems

Instead of relying only on one overall score, NeuronAI can represent performance across technical dimensions.

📉 Skill Gap Analysis

The Skill Gap system identifies areas requiring improvement.

Example:

Prompt Engineering    █████████░  Strong
RAG Architecture      ████████░░  Good
Vector Databases      ██████░░░░  Moderate
MCP                   ████░░░░░░  Needs Work
Agentic Systems       ███░░░░░░  Critical Gap

This converts interview feedback into a focused preparation roadmap.

📄 Interview Reports

A final report can contain:

Overall performance score

Question-wise scores

Technical strengths

Weak areas

Knowledge map

Skill gaps

Evaluation summaries

Interview progression

Improvement recommendations

Example:

Overall Score        82%
Technical Accuracy   87%
Reasoning            80%
Depth                78%
Communication        84%

Strong Areas:
✓ APIs
✓ System Design
✓ RAG

Needs Improvement:
⚠ MCP
⚠ Agentic Loops
⚠ Vector Search

🔐 Authentication

NeuronAI uses Supabase Authentication.

Email / Password

Sign Up
   ↓
Account Created
   ↓
Sign In

Google OAuth

Continue with Google
       ↓
Google Account Chooser
       ↓
Select Account
       ↓
Authentication
       ↓
NeuronAI

The Google OAuth implementation is designed to support the native Google account chooser when the browser has active Google sessions.

🏗️ System Architecture

User
  │
  ▼
React + Vite Frontend
  │
  │ REST API
  ▼
FastAPI Backend
  │
  ├── Interview Engine
  ├── Evaluation Engine
  ├── Session Manager
  ├── Knowledge Mapper
  ├── Skill Gap Analyzer
  └── Report Generator
  │
  ▼
AI / LLM Layer
  │
  ├── Question Generation
  ├── Answer Evaluation
  └── Adaptive Decision Making
  │
  ▼
Analytics & Reports

🛠️ Tech Stack

Frontend

Technology

Purpose

React

Interactive UI

Vite

Development and build tooling

JavaScript / JSX

Application logic

CSS / Tailwind CSS

Styling

React Router

Client-side navigation

Backend

Technology

Purpose

Python

Backend language

FastAPI

REST API

Pydantic

Request/data validation

Pytest

Backend testing

AI / LLM Layer

Interview intelligence

Authentication

Technology

Purpose

Supabase

Authentication and backend services

Google OAuth

Google account authentication

📁 Project Structure

NeuronAI/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── interview/
│   │   │   ├── dashboard/
│   │   │   ├── analytics/
│   │   │   └── common/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── prompts/
│   │   │   └── personas/
│   │   ├── models/
│   │   ├── config.py
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── ...
│
├── README.md
└── .gitignore

⚙️ Backend Services

Interview Engine

Responsible for:

Session initialization

Question generation

Interview progression

Topic transitions

Evaluation Engine

Responsible for:

Answer analysis

Scoring

Technical feedback

Performance signals

Session Manager

Responsible for:

Session identity

Conversation state

Multi-turn persistence

Interview continuity

Knowledge Mapper

Responsible for:

Technical-area analysis

Knowledge mapping

Concept-level performance

Skill Gap Analyzer

Responsible for:

Weak-area detection

Technical gap identification

Improvement recommendations

Report Generator

Responsible for:

Final interview summary

Performance aggregation

Skill-gap reporting

📡 API Architecture

The frontend communicates with the FastAPI backend through REST APIs.

React Frontend
      │
      │ HTTP Request
      ▼
   FastAPI
      │
      ├── Interview
      ├── Evaluation
      ├── Analytics
      └── Reports
      │
      ▼
AI Interview Engine

Core interview communication is handled through the backend interview API. The request carries session/candidate information and the candidate's response, while the backend determines evaluation and subsequent interview state.

🧪 Testing

Backend interview workflows include tests for:

✓ Initial interview request
✓ Low-score follow-up generation
✓ High-score topic transition
✓ Multi-turn session persistence

Current verified test result:

4 / 4 tests passing

Run:

python -m pytest -v

Test Coverage Focus

Initial Interview RequestVerifies that a new interview session can begin.

Low Score Follow-upVerifies that a weaker response can trigger a follow-up.

High Score Topic TransitionVerifies that strong performance can move the interview toward another topic.

Multi-Turn Session PersistenceVerifies that context survives across multiple turns.

🔑 Environment Variables

Frontend

Create:

frontend/.env

Example:

VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Backend

Example:

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
LLM_API_KEY=your_llm_api_key

⚠️ Never commit .env files, private keys, service-role keys, or OAuth secrets to GitHub.

🚀 Quick Start

Prerequisites

Install:

Node.js

npm

Python 3.10+

pip

Git

Frontend

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173

Backend

Open another terminal:

cd backend
python -m venv venv

Windows:

venv\Scriptsctivate

Install dependencies:

pip install -r requirements.txt

Start FastAPI:

uvicorn app.main:app --reload

Backend:

http://localhost:8000

▶️ Running the Application

Terminal 1 — Frontend

cd frontend
npm run dev

Terminal 2 — Backend

cd backend
uvicorn app.main:app --reload

Then open:

http://localhost:5173

🌐 Frontend → Backend Flow

Browser
   │
   ▼
NeuronAI Frontend
   │
   │ HTTPS / REST
   ▼
FastAPI Backend
   │
   ▼
AI Interview Engine
   │
   ├── Evaluation
   ├── Adaptation
   └── Next Question

The frontend should use an environment-based API URL instead of hardcoded production URLs.

🚀 Deployment

NeuronAI can be deployed as separate frontend and backend services.

Frontend

Suitable options include:

Vercel

Netlify

Other modern frontend hosting platforms

Backend

Suitable options include:

Render

Railway

Google Cloud

Other Python/FastAPI-compatible hosting

Production architecture:

Internet
   │
   ▼
Frontend
   │
   │ HTTPS
   ▼
FastAPI Backend
   │
   ├── AI
   ├── Supabase
   └── Analytics

🔒 Security

NeuronAI follows security-conscious development practices.

Never expose in frontend code:

LLM API keys

Supabase Service Role Keys

OAuth Client Secrets

Private credentials

Use environment variables for secrets.

Protected backend operations should validate the authenticated user/session.

Production CORS should allow only trusted frontend origins.

🐛 Troubleshooting

vite is not recognized

cd frontend
npm install
npm run dev

Frontend shows a blank page

Check:

Browser console

Vite terminal

Missing environment variables

Import errors

Backend availability

Backend does not start

python --version
venv\Scriptsctivate
pip install -r requirements.txt
uvicorn app.main:app --reload

Interview answer is not evaluated

Check:

Frontend
   ↓
Answer Submit
   ↓
API Request
   ↓
FastAPI
   ↓
Interview Engine
   ↓
Evaluation Engine
   ↓
Next Question
   ↓
Frontend

Inspect the browser Network tab, backend logs, session ID, API response, evaluation response, and frontend state updates.

🔮 Future Roadmap

AI

JARVIS interviewer

FRIDAY interviewer

ULTRON interviewer

More specialized interviewer personas

Advanced adaptive questioning

Better contextual follow-ups

Improved answer evaluation

Multi-LLM support

Interview Experience

Voice-based interviews

Speech-to-text

Real-time interview mode

Difficulty selection

Role-specific interviews

Company-specific interview simulations

Resume-based interviews

Coding Interviews

Integrated coding editor

Live code execution

Test case execution

Code quality analysis

DSA interview mode

System design interview mode

Analytics

Interview scoring

Performance tracking

Knowledge Map concept

Skill Gap Analysis concept

Long-term performance history

Progress comparison

Personalized learning roadmap

Interview benchmarking

Platform

Production deployment

Mobile optimization

Interview history

Exportable reports

Candidate profiles

Recruiter dashboard

Interview sharing

🧠 The NeuronAI Difference

Traditional interview practice:

Question
   ↓
Answer
   ↓
Next Question

NeuronAI:

Question
   ↓
Understand Response
   ↓
Evaluate
   ↓
Analyze Knowledge
   ↓
Identify Weakness
   ↓
Adapt Difficulty
   ↓
Generate Follow-up
   ↓
Track Performance
   ↓
Build Candidate Profile

That is the core idea behind NeuronAI.

🤝 Contributing

Create a feature branch:

git checkout -b feature/your-feature

Make changes:

git add .
git commit -m "Add your feature"
git push origin feature/your-feature

Then open a Pull Request.

🧑‍💻 Development Principles

Keep frontend and backend responsibilities separated

Avoid hardcoded API URLs

Keep AI prompts modular

Preserve interview session context

Validate API requests

Add tests for interview-engine changes

Never commit secrets

Keep agent personas isolated

Prefer reusable components

Maintain predictable interview state transitions

📌 Project Status

Area

Status

Frontend

🟢 Active

Backend

🟢 Active

JARVIS

🟢 Available

FRIDAY

🟡 Coming Soon

ULTRON

🟡 Coming Soon

Authentication

🟢 Active

Google OAuth

🟢 Configured

Interview Engine

🟢 Active

Multi-turn Sessions

🟢 Tested

Answer Evaluation

🟢 Active

Performance Analytics

🟢 Active

Knowledge Map

🟢 Active

Skill Gap Analysis

🟢 Active

Reports

🟢 Active

🏆 Project Goal

NeuronAI aims to make technical interview preparation:

More Intelligent — AI adapts to the candidate.

More Realistic — Questions evolve like a real interview.

More Measurable — Performance is tracked across questions.

More Personalized — Skill gaps are identified automatically.

More Actionable — Candidates receive insights they can use.

🧠 NeuronAI

Think. Reason. Perform. Improve.

Not just an AI that asks questions — an AI that understands how you think.

<div align="center">

🧠 Built with AI. Designed for Technical Interviews.

NeuronAI

Intelligent Interviews. Adaptive Questions. Better Engineers.

⭐ Star the repository if you find the project interesting.

</div>
