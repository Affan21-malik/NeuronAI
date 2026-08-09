from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field, model_validator

from app.services.curriculum.loader import CurriculumLoader
from app.services.interview.prompt_loader import PromptLoader
from app.services.llm.provider import BaseLLMProvider


class CandidateSummary(BaseModel):
    name: str = "unknown"
    job_role: str = "unknown"
    experience: str = "unknown"
    overall_assessment: str = "unknown"


class RecommendedDifficulty(BaseModel):
    level: str = "INTERMEDIATE"
    reason: str = ""


class PlannedTopic(BaseModel):
    topic: str
    curriculum_day: str
    objective: str
    difficulty: str
    evidence: str
    reason_for_selection: str
    planned_question_count: int = Field(
        ge=1
    )


class Coverage(BaseModel):
    total_question_count: int = Field(
        ge=0
    )

    distinct_curriculum_days: int = Field(
        ge=0
    )

    minimum_question_requirement_met: bool = False

    minimum_curriculum_day_requirement_met: bool = False


class InterviewPlan(BaseModel):
    candidate_summary: CandidateSummary

    recommended_difficulty: RecommendedDifficulty

    technical_strengths: list[Any] = Field(
        default_factory=list
    )

    knowledge_gaps: list[Any] = Field(
        default_factory=list
    )

    selected_topics: list[PlannedTopic] = Field(
        default_factory=list
    )

    coverage: Coverage

    interview_flow: list[Any] = Field(
        default_factory=list
    )

    followup_strategy: list[Any] = Field(
        default_factory=list
    )

    excluded_gaps: list[Any] = Field(
        default_factory=list
    )

    @model_validator(mode="after")
    def validate_minimum_coverage(
        self,
    ) -> "InterviewPlan":

        if self.coverage.total_question_count < 8:
            raise ValueError(
                "Interview plan must contain at least "
                "8 planned questions."
            )

        if (
            self.coverage.distinct_curriculum_days
            < 4
        ):
            raise ValueError(
                "Interview plan must cover at least "
                "4 distinct curriculum days."
            )

        if (
            not self.coverage.minimum_question_requirement_met
        ):
            raise ValueError(
                "Planner marked minimum question requirement "
                "as unmet."
            )

        if (
            not self.coverage.minimum_curriculum_day_requirement_met
        ):
            raise ValueError(
                "Planner marked minimum curriculum-day "
                "requirement as unmet."
            )

        return self


class InterviewPlanner:
    """
    Hybrid Planner.

    LLM planning produces a validated interview roadmap.
    Deterministic curriculum selection remains available to
    preserve the existing Phase 5 engine behavior.
    """

    def __init__(
        self,
        curriculum_loader: CurriculumLoader,
        llm_provider: BaseLLMProvider | None = None,
        prompt_loader: PromptLoader | None = None,
    ) -> None:

        self.curriculum_loader = curriculum_loader

        self.llm_provider = llm_provider

        self.prompt_loader = (
            prompt_loader
            or PromptLoader()
        )

        self.plan: InterviewPlan | None = None

    # =========================================================
    # New Planner Agent
    # =========================================================

    async def build_plan(
        self,
        candidate_json: str,
    ) -> InterviewPlan:

        if self.llm_provider is None:
            raise RuntimeError(
                "LLM provider is required to build "
                "an LLM interview plan."
            )

        prompt = self.prompt_loader.get_planner_prompt(
            candidate_json=candidate_json
        )

        result = await self.llm_provider.generate_structured(
            prompt,
            InterviewPlan,
        )

        plan = InterviewPlan.model_validate(
            result.model_dump()
        )

        await self._validate_curriculum_references(
            plan
        )

        self.plan = plan

        return plan

    async def _validate_curriculum_references(
        self,
        plan: InterviewPlan,
    ) -> None:

        topics = set(
            await self.curriculum_loader.get_topics()
        )

        for planned_topic in plan.selected_topics:

            if planned_topic.topic not in topics:
                raise ValueError(
                    "Planner selected topic outside curriculum: "
                    f"{planned_topic.topic}"
                )

    # =========================================================
    # Existing Phase 5 deterministic selector
    # =========================================================

    async def select_next_topic(
        self,
        knowledge_map: dict[str, float],
        completed_topics: set[str] | None = None,
    ) -> str:

        completed = (
            completed_topics
            or set()
        )

        topics = await self.curriculum_loader.get_topics()

        if not topics:
            raise ValueError(
                "Curriculum contains no topics."
            )

        eligible: list[str] = []

        for topic in topics:

            if topic in completed:
                continue

            prerequisites = (
                await self.curriculum_loader
                .get_prerequisites(topic)
            )

            if not self._prerequisites_completed(
                prerequisites,
                knowledge_map,
            ):
                continue

            eligible.append(topic)

        if not eligible:

            eligible = [
                topic
                for topic in topics
                if topic not in completed
            ]

        if not eligible:
            raise ValueError(
                "No remaining interview topics."
            )

        return min(
            eligible,
            key=lambda topic: knowledge_map.get(
                topic,
                0.0,
            ),
        )

    async def select_next_subtopic(
        self,
        topic: str,
        knowledge_map: dict[str, float],
    ) -> str:

        subtopics = (
            await self.curriculum_loader
            .get_subtopics(topic)
        )

        if not subtopics:
            raise KeyError(
                f"No subtopics found for topic: {topic}"
            )

        return subtopics[0]

    async def get_topic_context(
        self,
        topic: str,
    ) -> dict[str, Any]:

        module = await self.curriculum_loader.get_module(
            topic
        )

        subtopics = (
            await self.curriculum_loader
            .get_subtopics(topic)
        )

        prerequisites = (
            await self.curriculum_loader
            .get_prerequisites(topic)
        )

        return {
            "topic": topic,
            "subtopics": subtopics,
            "prerequisites": prerequisites,
            "module": module,
        }

    @staticmethod
    def _prerequisites_completed(
        prerequisites: list[str],
        knowledge_map: dict[str, float],
        mastery_threshold: float = 70.0,
    ) -> bool:

        if not prerequisites:
            return True

        return all(
            knowledge_map.get(
                prerequisite,
                0.0,
            )
            >= mastery_threshold
            for prerequisite in prerequisites
        )