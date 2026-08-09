import os
import logging
from typing import Any
from supabase import create_client, Client

logger = logging.getLogger(__name__)

supabase_url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL", "")
supabase_key = os.getenv("SUPABASE_ANON_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY", "")

_supabase_client: Client | None = None

if supabase_url and supabase_key:
    try:
        _supabase_client = create_client(supabase_url, supabase_key)
    except Exception as exc:
        logger.warning(f"Failed to initialize Supabase client: {exc}")


def get_supabase_client() -> Client | None:
    return _supabase_client


def save_interview_session(
    session_id: str,
    user_id: str | None,
    candidate_id: str,
    agent_id: str = "JARVIS",
    current_topic: str = "",
    difficulty: str = "medium",
    confidence_score: float = 0.0,
    current_question_index: int = 1,
    status: str = "IN_PROGRESS",
) -> None:
    client = get_supabase_client()
    if not client:
        return

    data = {
        "id": session_id,
        "candidate_id": candidate_id,
        "agent_id": agent_id,
        "current_topic": current_topic,
        "difficulty": difficulty,
        "confidence_score": confidence_score,
        "current_question_index": current_question_index,
        "status": status,
    }

    if user_id:
        data["user_id"] = user_id

    try:
        client.table("interview_sessions").upsert(data).execute()
    except Exception as exc:
        logger.warning(f"Failed to persist interview_session to Supabase: {exc}")


def save_interview_turn(
    session_id: str,
    turn_number: int,
    question: str,
    answer: str | None,
    topic: str,
    difficulty: str,
    score: float | None = None,
    correctness: float | None = None,
    depth: float | None = None,
    clarity: float | None = None,
    evaluation: dict[str, Any] | None = None,
) -> None:
    client = get_supabase_client()
    if not client:
        return

    data = {
        "session_id": session_id,
        "turn_number": turn_number,
        "question": question,
        "answer": answer or "",
        "topic": topic,
        "difficulty": difficulty,
        "score": score,
        "correctness": correctness,
        "depth": depth,
        "clarity": clarity,
        "evaluation": evaluation or {},
    }

    try:
        client.table("interview_turns").insert(data).execute()
    except Exception as exc:
        logger.warning(f"Failed to persist interview_turn to Supabase: {exc}")


def save_interview_report(
    session_id: str,
    overall_score: float,
    strengths: list[str],
    weaknesses: list[str],
    report: dict[str, Any],
) -> None:
    client = get_supabase_client()
    if not client:
        return

    data = {
        "session_id": session_id,
        "overall_score": overall_score,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "report": report,
    }

    try:
        client.table("interview_reports").insert(data).execute()
    except Exception as exc:
        logger.warning(f"Failed to persist interview_report to Supabase: {exc}")
