from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field, ConfigDict

from app.services.interview.prompt_loader import PromptLoader
from app.services.llm.provider import BaseLLMProvider


class RecommendedAction(str, Enum):
    FOLLOW_UP = "FOLLOW_UP"
    DEEPER = "DEEPER"
    SIMPLIFY = "SIMPLIFY"
    MOVE_NEXT = "MOVE_NEXT"


class EvaluationResult(BaseModel):
    """
    Structured output produced by the Evaluator Agent.

    The primary schema follows Evaluator.md while compatibility
    properties preserve the Phase 5 InterviewEngine contract.
    """

    model_config = ConfigDict(
        extra="ignore"
    )

    technical_accuracy: str
    concept_depth: str
    practical_understanding: str
    engineering_reasoning: str
    communication: str
    confidence: str
    topic_coverage: str

    strengths: list[str] = Field(
        default_factory=list
    )

    improvements: list[str] = Field(
        default_factory=list
    )

    recommended_action: RecommendedAction

    reason: str

    # Optional extension requested by the Phase 6 agent contract.
    internal_evaluation_score: float | None = Field(
        default=None,
        ge=0.0,
        le=100.0,
    )

    suggested_probe_area: str | None = None

    # ---------------------------------------------------------
    # Phase 5 compatibility
    # ---------------------------------------------------------

    @property
    def score(self) -> float:
        if self.internal_evaluation_score is not None:
            return self.internal_evaluation_score

        return self._estimate_score()

    @property
    def clarity(self) -> float:
        mapping = {
            "HIGH": 9.0,
            "MEDIUM": 7.0,
            "LOW": 4.0,
        }

        return mapping.get(
            self.communication.upper(),
            5.0,
        )

    @property
    def depth(self) -> float:
        mapping = {
            "HIGH": 9.0,
            "MEDIUM": 7.0,
            "LOW": 4.0,
        }

        return mapping.get(
            self.concept_depth.upper(),
            5.0,
        )

    @property
    def misconceptions(self) -> list[str]:
        """
        Preserve the old engine's misconception interface.

        Evaluator.md calls these improvements rather than
        misconceptions, so we expose improvements here.
        """

        return self.improvements

    def _estimate_score(self) -> float:
        """
        Backward-compatible score estimation when the supplied
        evaluator prompt does not return an explicit numeric score.
        """

        dimensions = [
            self.technical_accuracy,
            self.concept_depth,
            self.practical_understanding,
            self.engineering_reasoning,
            self.communication,
            self.confidence,
            self.topic_coverage,
        ]

        high = sum(
            value.upper() == "HIGH"
            for value in dimensions
        )

        low = sum(
            value.upper() == "LOW"
            for value in dimensions
        )

        if high >= 6:
            return 90.0

        if high >= 4 and low == 0:
            return 80.0

        if low >= 4:
            return 45.0

        if low >= 2:
            return 60.0

        return 70.0


class AnswerEvaluator:
    """
    Evaluator Agent integration.

    Responsibilities:
    - build the evaluator prompt
    - invoke structured LLM generation
    - validate the Pydantic result

    It does NOT control interview flow.
    """

    def __init__(
        self,
        llm_provider: BaseLLMProvider,
        prompt_loader: PromptLoader | None = None,
    ) -> None:

        self.llm_provider = llm_provider

        self.prompt_loader = (
            prompt_loader
            or PromptLoader()
        )

    async def evaluate(
        self,
        user_response: str,
        question: str,
        topic: str,
        difficulty: str,
        context: str = "",
    ) -> EvaluationResult:

        if not user_response.strip():
            raise ValueError(
                "user_response cannot be empty."
            )

        if not question.strip():
            raise ValueError(
                "question cannot be empty."
            )

        prompt = self.build_prompt(
            user_response=user_response,
            question=question,
            topic=topic,
            difficulty=difficulty,
            context=context,
        )

        result = await self.llm_provider.generate_structured(
            prompt,
            EvaluationResult,
        )

        # Explicit Pydantic re-validation.
        return EvaluationResult.model_validate(
            result.model_dump()
        )

    def build_prompt(
        self,
        user_response: str,
        question: str,
        topic: str,
        difficulty: str,
        context: str = "",
    ) -> str:

        return self.prompt_loader.get_evaluator_prompt(
            user_response=user_response,
            question=question,
            topic=topic,
            difficulty=difficulty,
            context=context,
        )