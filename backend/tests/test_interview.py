from typing import Type, TypeVar
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.api.interview import engine
from app.main import app
from app.services.llm.provider import BaseLLMProvider

T = TypeVar("T")

client = TestClient(app)
INTERVIEW_ENDPOINT = "/api/interview"


class MockTestLLMProvider(BaseLLMProvider):
    """
    Deterministic mock LLM provider for fast, offline testing.
    Avoids all real Groq/Gemini external API calls during test suite execution.
    """

    def __init__(self) -> None:
        self.custom_handler = None

    async def generate_text(self, prompt: str) -> str:
        lowered = prompt.lower()
        if "followup_mode=true" in lowered:
            return "What specific aspect would you investigate further, and why?"
        return "How would you design a scalable system, and what trade-offs would you consider?"

    async def generate_structured(
        self,
        prompt: str,
        response_model: Type[T],
    ) -> T:
        if self.custom_handler is not None:
            return await self.custom_handler(prompt, response_model)

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


@pytest.fixture(autouse=True)
def setup_mock_provider():
    mock_provider = MockTestLLMProvider()
    engine.set_llm_provider(mock_provider)
    yield mock_provider


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


def test_low_score_creates_followup(setup_mock_provider: MockTestLLMProvider):
    """A low-scoring answer should stay on the current topic."""

    async def low_score_handler(prompt, response_model):
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

    setup_mock_provider.custom_handler = low_score_handler

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
    assert data["next_question"] != initial["next_question"]
    assert data["current_topic"] in data["knowledge_map"]


def test_high_score_creates_topic_transition(setup_mock_provider: MockTestLLMProvider):
    """A strong answer should move to another topic."""

    async def strong_score_handler(prompt, response_model):
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

    setup_mock_provider.custom_handler = strong_score_handler

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
                "I would use caching and horizontal scaling to improve "
                "scalability and reduce latency. The trade-off is increased "
                "complexity and consistency concerns."
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
    assert isinstance(data["knowledge_map"], dict)


def test_multi_turn_session_persistence(setup_mock_provider: MockTestLLMProvider):
    """Multiple turns must preserve the same session."""

    async def evaluation_handler(prompt, response_model):
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

    initial_response = client.post(
        INTERVIEW_ENDPOINT,
        json={
            "candidate_id": "CAND-001",
        },
    )

    assert initial_response.status_code == 200
    initial = initial_response.json()
    session_id = initial["session_id"]

    setup_mock_provider.custom_handler = evaluation_handler

    second_response = client.post(
        INTERVIEW_ENDPOINT,
        json={
            "session_id": session_id,
            "candidate_id": "CAND-001",
            "user_response": (
                "I would use caching, horizontal scaling, replication and load "
                "balancing while considering consistency and latency trade-offs."
            ),
        },
    )

    assert second_response.status_code == 200
    second = second_response.json()

    assert second["session_id"] == session_id
    assert second["evaluation"]["score"] == 90
    assert isinstance(second["knowledge_map"], dict)
    assert second["confidence_score"] == pytest.approx(0.90)
    assert second["next_question"]
    assert second["current_topic"]


def test_groq_mock_mode_end_to_end_loop():
    """Verify 3 turns using default Groq provider without API key."""
    from app.services.llm.groq import GroqLLMProvider

    groq_provider = GroqLLMProvider(api_key=None)
    engine.set_llm_provider(groq_provider)

    # Turn 1: Start interview
    res1 = client.post(INTERVIEW_ENDPOINT, json={"candidate_id": "CAND-001"})
    assert res1.status_code == 200
    data1 = res1.json()
    session_id = data1["session_id"]
    assert data1["next_question"]

    # Turn 2: Submit candidate answer 1
    res2 = client.post(
        INTERVIEW_ENDPOINT,
        json={
            "session_id": session_id,
            "candidate_id": "CAND-001",
            "user_response": "I would implement vector search with HNSW indexing and reciprocal rank fusion reranking.",
        },
    )
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["session_id"] == session_id
    assert data2["evaluation"] is not None
    assert "score" in data2["evaluation"]
    assert data2["next_question"]

    # Turn 3: Submit candidate answer 2
    res3 = client.post(
        INTERVIEW_ENDPOINT,
        json={
            "session_id": session_id,
            "candidate_id": "CAND-001",
            "user_response": "To mitigate latency, I would use sliding window context compression and async batching.",
        },
    )
    assert res3.status_code == 200
    data3 = res3.json()
    assert data3["session_id"] == session_id
    assert data3["evaluation"] is not None
    assert data3["next_question"]


def test_max_one_followup_limit(setup_mock_provider: MockTestLLMProvider):
    """Verify that a maximum of ONE follow-up is generated per main question, even if follow-up answer is weak."""
    async def low_score_handler(prompt, response_model):
        return response_model(
            technical_accuracy="LOW",
            concept_depth="LOW",
            practical_understanding="LOW",
            engineering_reasoning="LOW",
            communication="LOW",
            confidence="LOW",
            topic_coverage="LOW",
            strengths=[],
            improvements=["Need deeper knowledge"],
            recommended_action="FOLLOW_UP",
            reason="Weak answer needs probing.",
            internal_evaluation_score=40.0,
            suggested_probe_area="Core principles",
        )

    setup_mock_provider.custom_handler = low_score_handler

    # Q1 Initial
    res1 = client.post(INTERVIEW_ENDPOINT, json={"candidate_id": "CAND-001"})
    assert res1.status_code == 200
    q1 = res1.json()
    session_id = q1["session_id"]
    topic1 = q1["current_topic"]

    # Q1 Answer (Weak) -> First follow-up should be generated
    res2 = client.post(
        INTERVIEW_ENDPOINT,
        json={
            "session_id": session_id,
            "candidate_id": "CAND-001",
            "user_response": "I don't know.",
        },
    )
    assert res2.status_code == 200
    eval1 = res2.json()
    assert eval1["is_followup"] is True
    assert eval1["current_topic"] == topic1

    # Q1 Follow-up Answer (Weak again!) -> Backend MUST limit follow-up to 1 and transition to new topic!
    res3 = client.post(
        INTERVIEW_ENDPOINT,
        json={
            "session_id": session_id,
            "candidate_id": "CAND-001",
            "user_response": "I still don't know.",
        },
    )
    assert res3.status_code == 200
    eval2 = res3.json()
    assert eval2["is_followup"] is False
    assert eval2["current_topic"] != topic1


def test_all_three_personas_selectable():
    """Verify JARVIS, FRIDAY, and ULTRON personas return correct greetings."""
    # Test JARVIS
    res_jarvis = client.post(
        INTERVIEW_ENDPOINT,
        json={"candidate_id": "CAND-001", "agent_id": "jarvis"},
    )
    assert res_jarvis.status_code == 200
    data_jarvis = res_jarvis.json()
    assert "JARVIS" in data_jarvis["next_question"]

    # Test FRIDAY
    res_friday = client.post(
        INTERVIEW_ENDPOINT,
        json={"candidate_id": "CAND-001", "agent_id": "friday"},
    )
    assert res_friday.status_code == 200
    data_friday = res_friday.json()
    assert "FRIDAY" in data_friday["next_question"]

    # Test ULTRON
    res_ultron = client.post(
        INTERVIEW_ENDPOINT,
        json={"candidate_id": "CAND-001", "agent_id": "ultron"},
    )
    assert res_ultron.status_code == 200
    data_ultron = res_ultron.json()
    assert "ULTRON" in data_ultron["next_question"]


def test_ten_question_completion_flow():
    """Verify an interview session completes after 10 main questions."""
    # Start interview
    res = client.post(
        INTERVIEW_ENDPOINT,
        json={"candidate_id": "CAND-001", "agent_id": "friday"},
    )
    assert res.status_code == 200
    data = res.json()
    session_id = data["session_id"]

    # Loop 10 main turns
    for turn in range(10):
        res = client.post(
            INTERVIEW_ENDPOINT,
            json={
                "session_id": session_id,
                "candidate_id": "CAND-001",
                "user_response": f"This is candidate technical response for question {turn + 1}.",
                "agent_id": "friday",
            },
        )
        assert res.status_code == 200
        data = res.json()

    # After 10 main questions answered, interview should be complete
    assert data["is_complete"] is True



