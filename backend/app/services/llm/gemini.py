import asyncio
import os
from typing import Any, Type, TypeVar

from pydantic import BaseModel

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

    If GEMINI_API_KEY is not configured, the provider operates in mock mode.
    This allows local backend development and API testing without requiring
    an external LLM connection.
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

    async def generate_structured(
        self,
        prompt: str,
        response_model: Type[T],
    ) -> T:
        if not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        if not issubclass(response_model, BaseModel):
            raise TypeError(
                "response_model must be a Pydantic BaseModel subclass."
            )

        if self._mock_mode:
            return self._mock_structured_response(
                response_model
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

    def _generate_text_sync(
        self,
        prompt: str,
    ) -> Any:
        return self._client.models.generate_content(
            model=self.model,
            contents=prompt,
        )

    def _generate_structured_sync(
        self,
        prompt: str,
        response_model: Type[T],
    ) -> Any:
        return self._client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_model,
            ),
        )

    @staticmethod
    def _mock_text_response(
        prompt: str,
    ) -> str:
        """
        Deterministic fallback used during local development.

        This deliberately does not attempt to emulate intelligent
        interviewing. Its purpose is to keep the backend pipeline
        executable without an API key.
        """

        lowered = prompt.lower()

        if "follow-up" in lowered or "followup" in lowered:
            return (
                "Can you explain why you would choose that approach "
                "and what trade-offs it introduces?"
            )

        if "evaluate" in lowered or "evaluation" in lowered:
            return (
                "The candidate demonstrates partial understanding. "
                "Further probing is recommended."
            )

        if "question" in lowered:
            return (
                "Explain how you would design a scalable AI system "
                "for this problem and discuss the main trade-offs."
            )

        return "Mock Gemini response."

    @classmethod
    def _mock_structured_response(
        cls,
        response_model: Type[T],
    ) -> T:
        """
        Create a valid Pydantic object for local testing.

        Values are intentionally conservative and deterministic.
        """

        values = {}

        for field_name, field in response_model.model_fields.items():
            values[field_name] = cls._mock_field_value(
                field.annotation
            )

        return response_model.model_validate(values)

    @staticmethod
    def _mock_field_value(
        annotation: Any,
    ) -> Any:
        """
        Produce a basic mock value for common Python/Pydantic types.
        """

        origin = getattr(annotation, "__origin__", None)

        if annotation is str:
            return "Mock response"

        if annotation is int:
            return 0

        if annotation is float:
            return 0.0

        if annotation is bool:
            return False

        if origin is list:
            return []

        if origin is dict:
            return {}

        if origin is tuple:
            return ()

        # Handle Optional[T] / Union[T, None]
        args = getattr(annotation, "__args__", ())

        if args:
            non_none = [
                arg
                for arg in args
                if arg is not type(None)
            ]

            if non_none:
                return GeminiLLMProvider._mock_field_value(
                    non_none[0]
                )

        return None