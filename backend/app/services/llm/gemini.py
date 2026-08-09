import asyncio
import os
from typing import Any, Type, TypeVar

from app.services.llm.provider import BaseLLMProvider


try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None
    types = None


T = TypeVar("T")


class GeminiLLMProvider(BaseLLMProvider):
    """
    Google Gemini implementation of the LLM provider.

    If GEMINI_API_KEY is not configured, the provider operates
    in deterministic mock mode. This allows local backend
    development and automated API testing without external
    Gemini calls.
    """

    def __init__(
        self,
        model: str = "gemini-3.5-flash",
        api_key: str | None = None,
    ) -> None:
        self.model = model
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")

        self._mock_mode = not bool(self.api_key)

        if not self._mock_mode and genai is None:
            raise RuntimeError(
                "google-genai is not installed. "
                "Install it with: pip install google-genai"
            )

        self._client = None

        if not self._mock_mode:
            self._client = genai.Client(
                api_key=self.api_key
            )

    @property
    def is_mock(self) -> bool:
        """Return True when the provider is running without Gemini."""
        return self._mock_mode

    # ============================================================
    # TEXT GENERATION
    # ============================================================

    async def generate_text(
        self,
        prompt: str,
    ) -> str:
        if not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        if self._mock_mode:
            return self._mock_text_response(prompt)

        try:
            response = await asyncio.to_thread(
                self._generate_text_sync,
                prompt,
            )

            text = getattr(response, "text", None)

            if not text:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            return text.strip()

        except Exception as exc:
            raise RuntimeError(
                f"Gemini text generation failed: {exc}"
            ) from exc

    # ============================================================
    # STRUCTURED GENERATION
    # ============================================================

    async def generate_structured(
        self,
        prompt: str,
        response_model: Type[T],
    ) -> T:
        if not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        if self._mock_mode:
            return self._mock_structured_response(
                prompt,
                response_model,
            )

        try:
            response = await asyncio.to_thread(
                self._generate_structured_sync,
                prompt,
                response_model,
            )

            text = getattr(response, "text", None)

            if not text:
                raise RuntimeError(
                    "Gemini returned an empty structured response."
                )

            return response_model.model_validate_json(text)

        except Exception as exc:
            raise RuntimeError(
                f"Gemini structured generation failed: {exc}"
            ) from exc

    # ============================================================
    # REAL GEMINI CALLS
    # ============================================================

    def _generate_text_sync(
        self,
        prompt: str,
    ) -> Any:
        """Synchronous Gemini text generation."""

        return self._client.models.generate_content(
            model=self.model,
            contents=prompt,
        )

    def _generate_structured_sync(
        self,
        prompt: str,
        response_model: Type[T],
    ) -> Any:
        """Generate structured JSON output using a Pydantic schema."""

        return self._client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_model,
            ),
        )

    # ============================================================
    # MOCK TEXT GENERATION
    # ============================================================

    @staticmethod
    def _mock_text_response(prompt: str) -> str:
        """
        Deterministic mock used for local development.

        Produces topic-aware questions and deterministic follow-up
        questions so the interview state machine can be tested
        without a real Gemini API call.
        """

        lowered = prompt.lower()

        # ---------------------------------------------------------
        # Extract topic
        # ---------------------------------------------------------

        topic = "technical systems"

        if "topic:" in lowered:
            topic_line = (
                lowered
                .split("topic:", 1)[1]
                .split("\n", 1)[0]
                .strip()
            )

            if topic_line:
                topic = topic_line.title()

        # ---------------------------------------------------------
# Detect follow-up mode
# ---------------------------------------------------------

        is_followup = (
            "followup_mode=true" in lowered
            or "followup_mode=true" in lowered.replace(" ", "")
        )
        
        if is_followup:
            return (
                f"What specific aspect of {topic} would you "
                f"investigate further, and why?"
            )

        # ---------------------------------------------------------
        # Topic-specific initial questions
        # ---------------------------------------------------------

        topic_questions = {
            "environment & tooling": (
                "How would you choose and configure the development "
                "tools for a production AI backend, and what trade-offs "
                "would you consider?"
            ),

            "data foundations": (
                "How would you design the data layer for an AI system, "
                "and what trade-offs would you consider between "
                "different storage approaches?"
            ),

            "embeddings & vector search": (
                "How do embeddings enable semantic search, and what "
                "trade-offs would you consider when designing a vector "
                "search system?"
            ),

            "model fundamentals": (
                "How would you evaluate a machine learning model for "
                "production use, and which metrics would influence "
                "your decision?"
            ),

            "model serving": (
                "How would you design a reliable model-serving system "
                "and what trade-offs would you consider between "
                "latency, throughput, and cost?"
            ),

            "retrieval augmented generation": (
                "How would you design a retrieval-augmented generation "
                "pipeline and how would you evaluate retrieval quality?"
            ),
        }

        return topic_questions.get(
            topic.lower(),
            (
                f"How would you design a scalable system for "
                f"{topic}, and what trade-offs would you consider?"
            ),
        )
        # ---------------------------------------------------------
        # Generic fallback
        # ---------------------------------------------------------

        return (
            f"How would you design a scalable system for "
            f"{topic}, and what trade-offs would you consider?"
        )
    @classmethod
    def _mock_structured_response(
        cls,
        prompt: str,
        response_model: Type[T],
    ) -> T:
        """
        Deterministic evaluation mock.

        IMPORTANT:
        Only the candidate's actual answer is inspected.
        Evaluation instructions and rubric text are ignored.
        """

        candidate_answer = cls._extract_candidate_answer(
            prompt
        )

        lowered_answer = candidate_answer.lower().strip()

        # --------------------------------------------------------
        # Weak answers
        # --------------------------------------------------------

        weak_markers = [
            "don't know",
            "dont know",
            "no idea",
            "not sure",
            "idk",
            "i have no idea",
            "i don't know",
        ]

        # --------------------------------------------------------
        # Strong technical reasoning
        # --------------------------------------------------------

        strong_markers = [
            "trade-off",
            "tradeoff",
            "scalability",
            "caching",
            "latency",
            "consistency",
            "horizontal scaling",
            "load balancing",
            "fault tolerance",
            "availability",
            "partitioning",
            "replication",
            "throughput",
        ]

        # --------------------------------------------------------
        # Determine score
        # --------------------------------------------------------

        if not lowered_answer:
            score = 40.0
            clarity = 4.0
            depth = 3.0

        elif any(
            marker in lowered_answer
            for marker in weak_markers
        ):
            score = 45.0
            clarity = 5.0
            depth = 4.0

        elif sum(
            marker in lowered_answer
            for marker in strong_markers
        ) >= 2:
            score = 90.0
            clarity = 9.0
            depth = 9.0

        elif any(
            marker in lowered_answer
            for marker in strong_markers
        ):
            score = 80.0
            clarity = 8.0
            depth = 8.0

        else:
            score = 70.0
            clarity = 7.0
            depth = 7.0

        # --------------------------------------------------------
        # Build response according to requested Pydantic model
        # --------------------------------------------------------

        values: dict[str, object] = {}

        for field_name, model_field in (
            response_model.model_fields.items()
        ):
            if field_name == "score":
                values[field_name] = score

            elif field_name == "clarity":
                values[field_name] = clarity

            elif field_name == "depth":
                values[field_name] = depth

            elif field_name == "misconceptions":
                values[field_name] = []

            elif field_name == "strengths":
                if score >= 85:
                    values[field_name] = [
                        "Strong technical reasoning",
                        "Good understanding of trade-offs",
                    ]
                elif score >= 70:
                    values[field_name] = [
                        "Reasonable technical understanding",
                    ]
                else:
                    values[field_name] = []

            elif field_name == "weaknesses":
                if score < 60:
                    values[field_name] = [
                        "Insufficient technical depth",
                        "Requires further probing",
                    ]
                elif score < 85:
                    values[field_name] = [
                        "Could provide deeper technical reasoning",
                    ]
                else:
                    values[field_name] = []

            elif field_name == "feedback":
                if score >= 85:
                    values[field_name] = (
                        "Strong technical answer with clear "
                        "reasoning and relevant trade-offs."
                    )
                elif score >= 70:
                    values[field_name] = (
                        "Reasonable answer with some technical "
                        "understanding, but further depth is possible."
                    )
                else:
                    values[field_name] = (
                        "Answer shows partial understanding "
                        "and requires further probing."
                    )

            else:
                values[field_name] = cls._mock_field_value(
                    model_field.annotation
                )

        return response_model.model_validate(values)

    # ============================================================
    # PROMPT PARSING HELPERS
    # ============================================================

    @staticmethod
    def _extract_prompt_value(
        prompt: str,
        label: str,
        default: str = "",
    ) -> str:
        """
        Extract a value from prompts supporting both:

            Topic: Environment & Tooling

        and:

            Topic:
            Environment & Tooling

        Also supports question-style labels:

            Is this an intelligent follow-up?
            True
        """

        lines = prompt.splitlines()

        normalized_label = label.strip().lower()

        for index, raw_line in enumerate(lines):
            line = raw_line.strip()

            if not line:
                continue

            normalized_line = line.lower()

            # --------------------------------------------------------
            # Case 1:
            #
            # Topic: Environment & Tooling
            # --------------------------------------------------------

            if normalized_line.startswith(
                normalized_label + ":"
            ):
                value = line.split(
                    ":",
                    1,
                )[1].strip()

                if value:
                    return value

                # Value may be on the next line.
                for next_line in lines[index + 1:]:
                    next_value = next_line.strip()

                    if next_value:
                        return next_value

            # --------------------------------------------------------
            # Case 2:
            #
            # Is this an intelligent follow-up?
            # True
            #
            # or:
            #
            # Topic
            # Environment & Tooling
            # --------------------------------------------------------

            elif normalized_line == normalized_label:
                for next_line in lines[index + 1:]:
                    next_value = next_line.strip()

                    if next_value:
                        return next_value

        return default    
    @staticmethod
    def _extract_candidate_answer(
        prompt: str,
    ) -> str:
        """
        Extract ONLY the candidate answer from an evaluator prompt.

        This prevents words inside the evaluation rubric from
        affecting the deterministic mock score.
        """

        lines = prompt.splitlines()

        start_index = None
        end_index = len(lines)

        for index, line in enumerate(lines):
            normalized = line.strip().lower()

            if normalized in {
                "candidate answer:",
                "candidate's answer:",
            }:
                start_index = index + 1
                break

        if start_index is None:
            return ""

        for index in range(
            start_index,
            len(lines),
        ):
            normalized = lines[index].strip().lower()

            if normalized in {
                "previous context:",
                "previous answer:",
            }:
                end_index = index
                break

        return "\n".join(
            lines[start_index:end_index]
        ).strip()

    # ============================================================
    # FALLBACK PYDANTIC VALUES
    # ============================================================

    @classmethod
    def _mock_field_value(
        cls,
        annotation: object,
    ) -> object:
        """Return a simple mock value for a Pydantic field."""

        origin = getattr(
            annotation,
            "__origin__",
            None,
        )

        if origin is list:
            return []

        if annotation is float:
            return 0.0

        if annotation is int:
            return 0

        if annotation is bool:
            return False

        if annotation is str:
            return ""

        return None