from datetime import datetime, timezone

from pydantic import BaseModel, Field


class DialogueTurn(BaseModel):
    role: str = Field(
        ...,
        description="interviewer or candidate",
    )

    content: str = Field(..., min_length=1)

    topic: str | None = None
    subtopic: str | None = None
    difficulty: str | None = None

    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class InterviewSession(BaseModel):
    session_id: str
    candidate_id: str

    current_topic: str | None = None
    current_subtopic: str | None = None
    difficulty: str = "medium"

    turns: list[DialogueTurn] = Field(
        default_factory=list
    )

    # Dynamic knowledge estimation produced during the interview.
    knowledge_map: dict[str, float] = Field(
        default_factory=dict
    )

    confidence_score: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
    )

    questions_asked: int = Field(
        default=0,
        ge=0,
    )

    questions_answered: int = Field(
        default=0,
        ge=0,
    )

    max_questions: int = Field(
        default=10,
        ge=1,
    )

    is_complete: bool = False

    started_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )