
<div align="center">

🧠 NeuronAI

Autonomous AI Technical Interview Platform

An AI-powered technical interview platform designed to simulate realistic interviews, evaluate candidate responses, adapt questioning, and provide actionable performance insights.

<br/>



<br/>



</div>

📌 Table of Contents

About the Project

Why NeuronAI

Core Features

AI Interview Agents

Interview Flow

Evaluation System

Dashboard & Analytics

Knowledge Map

Skill Gap Analysis

Tech Stack

Project Architecture

Project Structure

Authentication

Quick Start

Environment Variables

Backend API

Testing

Development Status

Future Roadmap

Contributing

License

🧠 About the Project

NeuronAI is an autonomous AI technical interview platform that turns interview preparation into an interactive engineering evaluation.

Instead of presenting a fixed list of questions, the platform is designed around an AI-driven interview loop:

Select interviewer → Start interview → Answer → Evaluate → Adapt → Ask next question → Analyze performance

The system combines a modern React frontend with a FastAPI backend and AI-oriented services for interview planning, evaluation, memory, knowledge mapping, skill-gap analysis, and reporting.

NeuronAI is built around three principles:

🎯 Technical correctness — evaluate whether the candidate actually understands the concept.

🧠 Adaptive questioning — use previous answers and interview context to determine what should be asked next.

📊 Actionable feedback — convert interview performance into understandable scores, strengths, weaknesses, and improvement areas.

💡 Why NeuronAI?

Traditional interview-practice platforms often provide static questions and generic solutions.

NeuronAI aims to make the experience closer to an actual technical interview.

Traditional Practice

Question
   ↓
Candidate Answer
   ↓
Static Result

NeuronAI

Candidate
   ↓
AI Interviewer
   ↓
Question
   ↓
Candidate Answer
   ↓
AI Evaluation
   ↓
Score + Feedback
   ↓
Context Analysis
   ↓
Adaptive Follow-up / Next Question
   ↓
Knowledge + Skill Analysis
   ↓
Final Interview Report

✨ Core Features

🎤 AI Technical Interviews

Interactive technical interview interface

AI-generated interview questions

Multi-turn interview sessions

Candidate answer submission

AI-based answer evaluation

Follow-up questions based on previous responses

Technical correctness analysis

Confidence and performance indicators

Question progression throughout the interview

🤖 AI Interviewer Personas

NeuronAI separates interviewer behaviour into distinct personas so the same technical interview can have different questioning styles.

Agent

Personality

Interview Focus

Status

🟣 JARVIS

Calm, precise, systematic

Technical correctness, architecture & engineering decisions

✅ Active

🔵 FRIDAY

Adaptive, conversational, context-aware

Reasoning, conversation & contextual follow-ups

🚧 Coming Soon

🔴 ULTRON

Analytical, skeptical, challenging

Edge cases, trade-offs, limitations & depth

🚧 Coming Soon

Design principle: The fictional identities are used only as interface/personality concepts. NeuronAI uses their useful analytical and conversational traits without adopting destructive fictional goals.

🎯 AI Interview Agents

🟣 JARVIS — Precision & Technical Correctness

JARVIS is the primary active interviewer.

Behaviour

Precise

Calm

Structured

Analytical

Engineering-focused

Interview focus

Technical accuracy

Architecture decisions

Engineering trade-offs

Correctness of explanations

Practical implementation knowledge

🔵 FRIDAY — Adaptive & Conversational

FRIDAY is designed as a more natural and context-aware interviewer.

Behaviour

Responsive

Adaptive

Observant

Context-aware

Supportive

Interview focus

Candidate reasoning

Natural conversation

Contextual follow-ups

Explanation quality

Status: Coming Soon

🔴 ULTRON — Analytical & Technical Challenge

ULTRON is designed as a technical stress-test interviewer.

Behaviour

Analytical

Direct

Persistent

Skeptical

Interview focus

Edge cases

Limitations

Trade-offs

Hidden assumptions

Deeper technical understanding

Status: Coming Soon

🔄 Interview Flow

NeuronAI follows a session-based interview workflow.

┌──────────────────────┐
│   Authentication      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Interview Dashboard  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Select AI Interviewer│
│      JARVIS          │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Interview Initialize │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ AI Question          │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Candidate Answer     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ AI Evaluation        │
└──────────┬───────────┘
           ↓
     ┌─────┴─────┐
     ↓           ↓
 Follow-up    New Topic
     │           │
     └─────┬─────┘
           ↓
┌──────────────────────┐
│ Score + Progress     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Knowledge / Skills   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Final Interview      │
│ Report               │
└──────────────────────┘

Session Behaviour

Each interview is treated as a session rather than a collection of independent questions.

The session can maintain:

session_id

candidate_id

selected interviewer

current question

previous questions

candidate responses

evaluation results

scores

interview progress

contextual interview memory

📊 Evaluation System

After a candidate submits an answer, the backend evaluation pipeline is intended to analyze the response before moving to the next interview state.

Example evaluation dimensions:

Metric

Purpose

Correctness

Does the answer technically solve the problem?

Technical Depth

Does the candidate understand the underlying concept?

Reasoning

Can the candidate explain why the approach works?

Clarity

Is the explanation understandable and structured?

Confidence

How confidently and consistently is the concept explained?

Overall Score

Combined interview performance indicator

The evaluation result can then drive the next question instead of blindly following a fixed sequence.

📈 Dashboard & Analytics

The dashboard is designed to provide a quick overview of interview performance.

Interview Progress

The progress graph should reflect the actual question number and evaluation result.

For example:

Question 1 → Answer → Evaluation → Score
Question 2 → Answer → Evaluation → Score
Question 3 → Answer → Evaluation → Score
...
Question 10 → Answer → Evaluation → Score

This makes the graph meaningful rather than displaying static/random values.

Dashboard Areas

Interview progress

Question-wise scores

Overall score

Strength indicators

Weak areas

Knowledge map

Skill-gap analysis

Interview history

Final report

🗺️ Knowledge Map

The Live Knowledge Map visualizes technical competency across important engineering areas.

Example dimensions include:

RAG Architecture

Vector Search

Prompt Engineering

MCP Protocols

Agentic Loops

LLM Operations

The visualization is intended to change according to interview performance rather than remaining a purely decorative chart.

🧩 Skill Gap Analysis

NeuronAI can use interview evaluation data to identify areas that need improvement.

Example

Strong
██████████████████░░  90%

Good
██████████████░░░░░░  70%

Needs Improvement
█████████░░░░░░░░░░░  45%

The final analysis can help a candidate understand:

What they know well

What they partially understand

What they repeatedly struggle with

Which technical areas deserve more preparation

📄 Final Interview Report

At the end of an interview, NeuronAI is designed to generate a consolidated report containing:

Overall performance

Question-wise scores

Technical strengths

Technical weaknesses

Knowledge areas

Skill gaps

Interviewer observations

Improvement recommendations

Interview summary

The goal is to turn one interview session into a personalized preparation roadmap.

🛠️ Tech Stack

Frontend

Technology

Purpose

React

Component-based user interface

Vite

Frontend development and build tooling

Tailwind CSS

Styling and responsive UI

React Context

Authentication and application state

React Router

Page and interview navigation

JavaScript / JSX

Frontend implementation

Backend

Technology

Purpose

Python

Backend and AI service implementation

FastAPI

REST API framework

Pydantic

Request/response validation

Pytest

Backend testing

Supabase

Authentication and data persistence

LLM Services

Interview generation and evaluation

AI / Interview Engine

Component

Responsibility

Interviewer

Controls interview interaction

Planner

Helps determine interview progression

Evaluator

Evaluates candidate responses

Feedback Engine

Generates useful candidate feedback

Memory Manager

Maintains interview context

Knowledge Mapper

Maps technical competency

Skill Gap Analyzer

Identifies weak areas

Report Generator

Produces final interview insights

Persona Prompts

Defines interviewer-specific behaviour

🏗️ Project Architecture

                         ┌─────────────────────┐
                         │      NeuronAI       │
                         │     Frontend UI     │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP / API
                                    ↓
                         ┌─────────────────────┐
                         │      FastAPI        │
                         │     Backend API     │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             ↓                      ↓                      ↓
      ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
      │ Interview   │       │ Auth / Data │       │ AI Services │
      │ API         │       │ Supabase    │       │             │
      └──────┬──────┘       └─────────────┘       └──────┬──────┘
             │                                             │
             │                              ┌──────────────┼──────────────┐
             │                              ↓              ↓              ↓
             │                         Interviewer     Evaluator      Planner
             │                              │              │              │
             └──────────────────────────────┼──────────────┼──────────────┘
                                            ↓
                                  ┌──────────────────┐
                                  │ Memory / Context │
                                  └────────┬─────────┘
                                           ↓
                              ┌────────────────────────┐
                              │ Knowledge / Skill Gap │
                              └───────────┬────────────┘
                                          ↓
                                  ┌───────────────┐
                                  │ Final Report  │
                                  └───────────────┘

📁 Project Structure

The project is organized into separate frontend and backend applications.

NeuronAI/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── interview/
│   │   │   ├── dashboard/
│   │   │   ├── knowledge-map/
│   │   │   ├── skill-gap/
│   │   │   └── reports/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── data/
│   │   ├── models/
│   │   ├── prompts/
│   │   │   └── personas/
│   │   │       └── Jarvis.md
│   │   ├── services/
│   │   ├── auth.py
│   │   ├── config.py
│   │   └── main.py
│   ├── tests/
│   ├── interview_test.py
│   ├── knowledge_report.py
│   └── phase_2.py
│
└── README.md

🔐 Authentication

NeuronAI uses Supabase Authentication for user authentication and session management.

Supported Authentication Flow

Email/password authentication

Google OAuth

Google account chooser

Authenticated session handling

Protected application pages

User profile completion

Google OAuth

Google OAuth uses Supabase as the authentication layer.

The expected flow is:

Continue with Google
        ↓
Google Account Chooser
        ↓
Select Google Account
        ↓
Google Authentication
        ↓
Supabase Session
        ↓
NeuronAI Dashboard

Google OAuth requires the Google provider to be enabled and configured in the Supabase project.

🚀 Quick Start

Prerequisites

Make sure the following are installed:

Node.js

npm

Python 3.x

Git

Supabase project

Required AI/LLM API credentials

1. Clone the Repository

git clone https://github.com/YOUR_GITHUB_USERNAME/NeuronAI.git
cd NeuronAI

2. Install Frontend Dependencies

cd frontend
npm install

3. Configure Frontend Environment

Create:

frontend/.env

Example:

VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key

Never commit private secrets to GitHub.

4. Start Frontend

cd frontend
npm run dev

Frontend:

http://localhost:5173

5. Start Backend

Open another terminal:

cd backend

Create and activate a Python virtual environment if required:

python -m venv venv

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Start FastAPI:

uvicorn app.main:app --reload

Backend:

http://localhost:8000

API documentation:

http://localhost:8000/docs

🔑 Environment Variables

Frontend

VITE_API_BASE_URL=http://localhost:8000

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key

Backend

Backend variables depend on the configured AI provider and Supabase setup.

Typical configuration includes:

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_server_key

LLM_API_KEY=your_llm_api_key

Use the variable names defined by the project's actual backend configuration. Do not commit secrets, service keys, or private API credentials.

📡 Backend API

The backend exposes the interview engine through FastAPI.

Health

GET /health

Used to verify that the backend is running.

Interview

POST /api/interview

The interview endpoint is responsible for processing an interview turn.

A session can contain information such as:

{
  "session_id": "session-id",
  "candidate_id": "candidate-id",
  "user_response": "candidate answer"
}

The interview integration can be extended with the selected interviewer/persona so the backend knows which interviewing style should control the session.

API Responsibilities

Frontend
   ↓
POST /api/interview
   ↓
FastAPI
   ↓
Interview Engine
   ├── Planner
   ├── Interviewer
   ├── Evaluator
   ├── Feedback
   └── Memory
   ↓
Evaluation Result
   ↓
Next Question
   ↓
Frontend

🧪 Testing

NeuronAI includes backend tests for core interview workflows.

Run:

python -m pytest -v

The project has tests covering scenarios such as:

Initial interview request

Low-score follow-up generation

High-score topic transition

Multi-turn interview session persistence

A successful backend test run confirms that the core interview-engine workflows are functioning at the service level.

🔄 Development Status

Currently Active

✅ React + Vite frontend

✅ FastAPI backend

✅ Supabase authentication integration

✅ Google OAuth account chooser flow

✅ JARVIS interviewer persona

✅ Interview session architecture

✅ Backend interview endpoint

✅ AI-oriented interview services

✅ Dashboard UI

✅ Interview progress UI

✅ Knowledge Map UI

✅ Skill Gap UI

✅ Reports UI

✅ Backend pytest coverage

In Progress / Integration

🔄 End-to-end frontend ↔ backend interview communication

🔄 Real-time question/evaluation progression

🔄 Question-wise score synchronization

🔄 Live knowledge-map updates

🔄 Final report synchronization

Coming Soon

🚧 FRIDAY interviewer persona

🚧 ULTRON interviewer persona

🚧 Advanced adaptive interview modes

🚧 Deeper analytics

🚧 Expanded interview domains

🗺️ Roadmap

Phase 1 — Platform Foundation

React frontend

FastAPI backend

Authentication

Core dashboard

Interview interface

Phase 2 — AI Interview Engine

Interview session model

Interviewer persona architecture

Evaluation pipeline

Multi-turn session handling

Follow-up question logic

Phase 3 — Intelligence Layer

Knowledge mapping architecture

Skill-gap analysis architecture

Memory management

Report generation architecture

Full live frontend integration

Phase 4 — Multi-Agent Interviews

JARVIS

FRIDAY

ULTRON

Persona-specific adaptive strategies

Persona comparison analytics

Phase 5 — Production

Production deployment

Robust API monitoring

Expanded test coverage

Performance optimization

Production security review

🔒 Security Notes

Never commit .env files.

Never expose private LLM API keys in frontend code.

Never expose Supabase service-role keys to the browser.

Use publishable/anonymous client credentials only where appropriate.

Validate API requests on the backend.

Keep authentication and authorization checks server-side.

Use HTTPS in production.

Configure CORS for trusted production origins only.

🎨 Design Philosophy

NeuronAI follows a futuristic AI-console inspired visual language.

Design Goals

🌌 Dark futuristic interface

🧠 AI/technical visual identity

🟣 Purple-indigo accent system

📊 Data-driven dashboards

✨ Subtle motion and micro-interactions

🎯 Clear technical information hierarchy

🖱️ Custom interactive cursor experience

📱 Responsive layouts

The UI is designed to make the candidate feel like they are interacting with an AI interview operating system, rather than a traditional form-based interview website.

🧩 Key Product Modules

Module

Purpose

🔐 Authentication

Account creation and login

🧑‍💻 Interview

Main AI technical interview experience

🤖 AI Persona

Controls interviewer behaviour

🧠 Evaluation

Analyzes candidate answers

📈 Progress

Tracks question-wise performance

🗺️ Knowledge Map

Visualizes technical knowledge

📉 Skill Gap

Identifies improvement areas

📄 Reports

Generates consolidated interview insights

👤 Profile

Stores candidate information

📚 History

Supports previous interview sessions

🏆 What Makes NeuronAI Different?

1. Persona-Driven Interviews

The interviewer isn't just a generic chatbot.

Different personas are designed around different technical interview philosophies.

2. Context-Aware Questioning

The goal is to use previous answers to decide what should be asked next.

3. Evaluation Before Progression

A candidate's answer should be evaluated before the interview advances.

4. Engineering-Focused Evaluation

NeuronAI emphasizes:

Correctness

Architecture

Reasoning

Trade-offs

Edge cases

Technical depth

5. Interview → Analytics Pipeline

The interview is connected to a larger feedback loop:

Interview
   ↓
Evaluation
   ↓
Scores
   ↓
Knowledge Map
   ↓
Skill Gap
   ↓
Final Report
   ↓
Preparation Strategy

🤝 Contributing

Contributions, suggestions, and improvements are welcome.

A typical contribution flow:

git checkout -b feature/your-feature
git add .
git commit -m "Add: your feature"
git push origin feature/your-feature

Then open a Pull Request.

Before submitting a PR:

Test the frontend.

Test the backend.

Check API integration.

Avoid committing secrets.

Keep UI changes consistent with the existing design system.

Update documentation when adding major features.

📄 License

This project is currently under active development.

Add the project's final license here once the repository license is decided.

<div align="center">

🧠 NeuronAI

Autonomous AI Technical Interview Platform

Interview smarter. Understand deeper. Improve faster.

<br/>

⭐ If NeuronAI helps you, consider starring the repository.

</div>
