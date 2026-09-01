from __future__ import annotations

import re

from app.config import get_active_persona
from app.services.interview.prompt_loader import PromptLoader
from app.services.llm.provider import BaseLLMProvider


class QuestionGenerator:
    """
    Interviewer Agent.

    Combines:
        persona
        interviewer rules
        planner strategy
        evaluator recommendation
        conversation history
        current interview state
    """

    def __init__(
        self,
        llm_provider: BaseLLMProvider,
        prompt_loader: PromptLoader | None = None,
        persona: str | None = None,
    ) -> None:

        self.llm_provider = llm_provider

        self.prompt_loader = (
            prompt_loader
            or PromptLoader()
        )

        self.persona = (
            persona
            or get_active_persona()
        )

    async def generate(
        self,
        topic: str,
        difficulty: str,
        context: str = "",
        followup: bool = False,
        previous_question: str | None = None,
        previous_answer: str | None = None,
        subtopic: str | None = None,
        planner_output: str = "",
        evaluator_output: str = "",
        conversation_history: str = "",
        interview_state: str = "",
        persona: str | None = None,
    ) -> str:

        if not topic.strip():
            raise ValueError(
                "topic cannot be empty."
            )

        if difficulty not in {
            "easy",
            "medium",
            "hard",
        }:
            raise ValueError(
                f"Invalid difficulty: {difficulty}"
            )

        prompt = self.build_prompt(
            topic=topic,
            difficulty=difficulty,
            context=context,
            followup=followup,
            previous_question=previous_question,
            previous_answer=previous_answer,
            subtopic=subtopic,
            planner_output=planner_output,
            evaluator_output=evaluator_output,
            conversation_history=conversation_history,
            interview_state=interview_state,
            persona=persona,
        )

        question = await self.llm_provider.generate_text(
            prompt
        )

        question = self._validate_question(
            question
        )

        return question

    def build_prompt(
        self,
        topic: str,
        difficulty: str,
        context: str = "",
        followup: bool = False,
        previous_question: str | None = None,
        previous_answer: str | None = None,
        subtopic: str | None = None,
        planner_output: str = "",
        evaluator_output: str = "",
        conversation_history: str = "",
        interview_state: str = "",
        persona: str | None = None,
    ) -> str:

        active_persona = persona or self.persona

        prompt = self.prompt_loader.get_interviewer_prompt(
            persona=active_persona,
            topic=topic,
            difficulty=difficulty,
            context=context,
            followup=str(followup),
            previous_question=(
                previous_question or ""
            ),
            previous_answer=(
                previous_answer or ""
            ),
            subtopic=(
                subtopic or ""
            ),
            planner_output=planner_output,
            evaluator_output=evaluator_output,
            conversation_history=conversation_history,
            interview_state=interview_state,
        )
        
        # Explicit machine-readable mode marker.
        # This is useful for deterministic local mocks and
        # does not affect the actual LLM behavior.
        prompt += (
            "\n\n"
            "=== INTERVIEW_GENERATION_MODE ===\n"
            f"FOLLOWUP_MODE={str(followup).upper()}\n"
            "=== END INTERVIEW_GENERATION_MODE ===\n"
        )
        
        return prompt

    # ---------------------------------------------------------
    # Single-question integrity
    # ---------------------------------------------------------

    @staticmethod
    def _validate_question(
        question: str,
    ) -> str:

        question = question.strip()

        if not question:
            raise RuntimeError(
                "LLM generated an empty interview question."
            )

        # Remove accidental markdown fencing.
        question = re.sub(
            r"^```(?:text)?\s*|\s*```$",
            "",
            question,
            flags=re.IGNORECASE,
        ).strip()

        # Reject obvious multi-question responses.
        question_marks = question.count("?")

        if question_marks != 1:
            raise RuntimeError(
                "Interviewer Agent violated "
                "Single-Question Integrity: "
                f"expected exactly 1 question, "
                f"found {question_marks}."
            )

        # A question must actually be information-seeking.
        information_starters = (
            "what ",
            "why ",
            "how ",
            "when ",
            "where ",
            "which ",
            "who ",
            "can ",
            "could ",
            "would ",
            "should ",
            "explain ",
            "describe ",
            "walk me through ",
        )

        normalized = question.lower()

        if not normalized.endswith("?"):
            raise RuntimeError(
                "Interviewer Agent output must end with '?'."
            )

        if not normalized.startswith(
            information_starters
        ):
            raise RuntimeError(
                "Generated text does not appear to be "
                "an information-seeking interview question."
            )

        return question