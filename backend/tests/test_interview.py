from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
INTERVIEW_ENDPOINT = "/api/interview"

client = TestClient(app)


def test_initial_interview_request():
    """A request without a session starts a new interview."""

    response = client.post(
        INTERVIEW_ENDPOINT,
        json={
            "candidate_id": "CAND-001",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["session_id"]
    assert data["next_question"]
    assert data["current_topic"]

    assert data["difficulty"] in {
        "easy",
        "medium",
        "hard",
    }

    assert data["evaluation"] is None

    assert isinstance(
        data["knowledge_map"],
        dict,
    )

    assert 0 <= data["confidence_score"] <= 1

    assert data["is_complete"] is False


def test_low_score_creates_followup():
    """A low-scoring answer should stay on the current topic."""

    with patch(
        "app.services.llm.gemini.GeminiLLMProvider.generate_structured",
        new_callable=AsyncMock,
    ) as mock_evaluation:

        async def low_score(prompt, response_model):
            return response_model(
                technical_accuracy="LOW",
                concept_depth="LOW",
                practical_understanding="LOW",
                engineering_reasoning="LOW",
                communication="LOW",
                confidence="LOW",
                topic_coverage="LOW",
                strengths=[],
                improvements=[],
                recommended_action="FOLLOW_UP",
                reason="The candidate demonstrates limited understanding.",
                internal_evaluation_score=45.0,
                suggested_probe_area="Fundamental understanding",
        )

        mock_evaluation.side_effect = low_score

        initial_response = client.post(
            INTERVIEW_ENDPOINT,
            json={
                "candidate_id": "CAND-001",
            },
        )

        assert initial_response.status_code == 200

        initial = initial_response.json()

        response = client.post(
            INTERVIEW_ENDPOINT,
            json={
                "session_id": initial["session_id"],
                "candidate_id": "CAND-001",
                "user_response": "I don't know.",
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["session_id"] == initial["session_id"]

    assert data["evaluation"] is not None
    assert data["evaluation"]["score"] == 45

    assert data["confidence_score"] == pytest.approx(0.45)

    assert data["current_topic"] == initial["current_topic"]

    assert data["next_question"]
    assert (
        data["next_question"]
        != initial["next_question"]
    )

    assert (
        data["current_topic"]
        in data["knowledge_map"]
    )


def test_high_score_creates_topic_transition():
    """A strong answer should move to another topic."""

    with patch(
        "app.services.llm.gemini.GeminiLLMProvider.generate_structured",
        new_callable=AsyncMock,
    ) as mock_evaluation:

        async def strong_score(prompt, response_model):
           return response_model(
    technical_accuracy="HIGH",
    concept_depth="HIGH",
    practical_understanding="HIGH",
    engineering_reasoning="HIGH",
    communication="HIGH",
    confidence="HIGH",
    topic_coverage="HIGH",
    strengths=["Clear technical reasoning"],
    improvements=[],
    recommended_action="MOVE_NEXT",
    reason="The candidate demonstrates strong technical understanding.",
    internal_evaluation_score=90.0,
    suggested_probe_area=None,
)

        mock_evaluation.side_effect = strong_score

        initial_response = client.post(
            INTERVIEW_ENDPOINT,
            json={
                "candidate_id": "CAND-001",
            },
        )

        assert initial_response.status_code == 200

        initial = initial_response.json()

        response = client.post(
            INTERVIEW_ENDPOINT,
            json={
                "session_id": initial["session_id"],
                "candidate_id": "CAND-001",
                "user_response": (
                    "I would use caching and horizontal "
                    "scaling to improve scalability and "
                    "reduce latency. The trade-off is "
                    "increased complexity and consistency "
                    "concerns."
                ),
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["session_id"] == initial["session_id"]

    assert data["evaluation"]["score"] == 90

    assert data["confidence_score"] == pytest.approx(0.90)

    assert data["current_topic"] != initial["current_topic"]

    assert data["next_question"]

    assert isinstance(
        data["knowledge_map"],
        dict,
    )


def test_multi_turn_session_persistence():
    """Multiple turns must preserve the same session."""

    initial_response = client.post(
        INTERVIEW_ENDPOINT,
        json={
            "candidate_id": "CAND-001",
        },
    )

    assert initial_response.status_code == 200

    initial = initial_response.json()

    session_id = initial["session_id"]

    with patch(
        "app.services.llm.gemini.GeminiLLMProvider.generate_structured",
        new_callable=AsyncMock,
    ) as mock_evaluation:

        async def evaluation(prompt, response_model):
            return response_model(
    technical_accuracy="HIGH",
    concept_depth="HIGH",
    practical_understanding="HIGH",
    engineering_reasoning="HIGH",
    communication="HIGH",
    confidence="HIGH",
    topic_coverage="HIGH",
    strengths=["Clear technical reasoning"],
    improvements=[],
    recommended_action="MOVE_NEXT",
    reason="The candidate demonstrates strong technical understanding.",
    internal_evaluation_score=90.0,
    suggested_probe_area=None,
)

        mock_evaluation.side_effect = evaluation

        second_response = client.post(
            INTERVIEW_ENDPOINT,
            json={
                "session_id": session_id,
                "candidate_id": "CAND-001",
                "user_response": (
                    "I would use caching, horizontal "
                    "scaling, replication and load "
                    "balancing while considering "
                    "consistency and latency trade-offs."
                ),
            },
        )

    assert second_response.status_code == 200

    second = second_response.json()

    assert second["session_id"] == session_id
    assert second["evaluation"]["score"] == 90

    assert isinstance(
        second["knowledge_map"],
        dict,
    )

    assert second["confidence_score"] == pytest.approx(
        0.90
    )

    assert second["next_question"]
    assert second["current_topic"]
