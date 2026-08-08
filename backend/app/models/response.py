from pydantic import BaseModel, Field


class EvaluationDetail(BaseModel):
    score: float = Field(
        ...,
        ge=0,
        le=100,
    )

    correctness: float = Field(
        ...,
        ge=0,
        le=100,
    )

    depth: float = Field(
        ...,
        ge=0,
        le=100,
    )

    clarity: float = Field(
        ...,
        ge=0,
        le=100,
    )

    strengths: list[str] = Field(
        default_factory=list
    )

    weaknesses: list[str] = Field(
        default_factory=list
    )

    feedback: str = ""


class InterviewResponse(BaseModel):
    session_id: str

    next_question: str

    current_topic: str

    difficulty: str

    evaluation: EvaluationDetail | None = None

    knowledge_map: dict[str, float] = Field(
        default_factory=dict
    )

    confidence_score: float = Field(
        ...,
        ge=0,
        le=1,
    )

    is_complete: bool = False