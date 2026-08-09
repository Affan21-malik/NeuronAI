from __future__ import annotations

from pydantic import BaseModel, Field

from app.services.interview.prompt_loader import PromptLoader
from app.services.llm.provider import BaseLLMProvider


class FeedbackReport(BaseModel):
    """
    Structured output of the Feedback Agent.
    """

    overall_summary: str

    overall_performance: str

    performance_band: str

    interview_readiness: str

    assessment_scope: str

    technical_strengths: list[str] = Field(
        default_factory=list
    )

    knowledge_gaps: list[str] = Field(
        default_factory=list
    )

    engineering_signals: list[str] = Field(
        default_factory=list
    )

    communication_feedback: str

    confidence_trend: str

    interview_progression: str

    recommended_learning_plan: list[str] = Field(
        default_factory=list
    )

    next_interview_focus: list[str] = Field(
        default_factory=list
    )

    final_message: str


class ReportGenerator:
    """
    Feedback Agent integration.

    Converts the completed interview transcript and
    evaluator/planner evidence into a structured report.
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

    async def generate(
        self,
        conversation_history: str,
        evaluator_output: str = "",
        planner_output: str = "",
        interview_state: str = "",
    ) -> FeedbackReport:

        if not conversation_history.strip():
            raise ValueError(
                "conversation_history cannot be empty."
            )

        prompt = (
            self.prompt_loader
            .get_feedback_prompt(
                conversation_history=conversation_history,
                evaluator_output=evaluator_output,
                planner_output=planner_output,
                interview_state=interview_state,
            )
        )

        result = await self.llm_provider.generate_structured(
            prompt,
            FeedbackReport,
        )

        return FeedbackReport.model_validate(
            result.model_dump()
        )

    async def generate_report(
        self,
        conversation_history: str,
        evaluator_output: str = "",
        planner_output: str = "",
        interview_state: str = "",
    ) -> FeedbackReport:

        return await self.generate(
            conversation_history=conversation_history,
            evaluator_output=evaluator_output,
            planner_output=planner_output,
            interview_state=interview_state,
        )