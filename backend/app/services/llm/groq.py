import asyncio
import json
import logging
import os
from typing import Any, Type, TypeVar

from groq import Groq

from app.services.llm.gemini import GeminiLLMProvider
from app.services.llm.provider import BaseLLMProvider

logger = logging.getLogger(__name__)

T = TypeVar("T")


class GroqLLMProvider(BaseLLMProvider):
    """
    Groq implementation of the common NeuronAI LLM interface.

    Supports:
    - Plain text generation for the Interviewer Agent
    - Structured JSON generation for the Evaluator Agent
    - Mock fallback for offline/local development without API keys
    """

    def __init__(
        self,
        model: str = "llama-3.3-70b-versatile",
        api_key: str | None = None,
    ) -> None:
        self.model = os.getenv("GROQ_MODEL", model)
        raw_key = api_key or os.getenv("GROQ_API_KEY")

        if not raw_key or raw_key.strip() in ("", "mock_groq_key"):
            self.api_key = "mock_groq_key"
            self._mock_mode = True
            self._client = None
        else:
            self.api_key = raw_key.strip()
            self._mock_mode = False
            self._client = Groq(api_key=self.api_key)

    @property
    def is_mock(self) -> bool:
        return self._mock_mode

    # =========================================================
    # TEXT GENERATION
    # =========================================================

    async def generate_text(
        self,
        prompt: str,
    ) -> str:
        if not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        if self._mock_mode or self._client is None:
            return GeminiLLMProvider._mock_text_response(prompt)

        try:
            response = await asyncio.to_thread(
                self._generate_text_sync,
                prompt,
            )

            text = response.choices[0].message.content

            if not text:
                raise RuntimeError(
                    "Groq returned an empty response."
                )

            return text.strip()

        except Exception as exc:
            logger.warning(f"Groq text generation API failed ({exc}), falling back to mock provider.")
            return GeminiLLMProvider._mock_text_response(prompt)

    def _generate_text_sync(
        self,
        prompt: str,
    ):
        return self._client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            temperature=0.3,
        )

    # =========================================================
    # STRUCTURED GENERATION
    # =========================================================

    async def generate_structured(
        self,
        prompt: str,
        response_model: Type[T],
    ) -> T:
        if not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        if self._mock_mode or self._client is None:
            return GeminiLLMProvider._mock_structured_response(
                prompt, response_model
            )

        try:
            response = await asyncio.to_thread(
                self._generate_structured_sync,
                prompt,
                response_model,
            )

            text = response.choices[0].message.content

            if not text:
                raise RuntimeError(
                    "Groq returned an empty structured response."
                )

            try:
                data = json.loads(text)
            except json.JSONDecodeError as exc:
                raise RuntimeError(
                    f"Groq returned invalid JSON: {exc}"
                ) from exc

            try:
                return response_model.model_validate(data)
            except Exception as exc:
                raise RuntimeError(
                    f"Groq response failed Pydantic validation: {exc}"
                ) from exc

        except Exception as exc:
            logger.warning(
                f"Groq structured generation API failed ({exc}), falling back to mock provider."
            )
            return GeminiLLMProvider._mock_structured_response(
                prompt, response_model
            )

    def _generate_structured_sync(
        self,
        prompt: str,
        response_model: Type[T],
    ):
        schema = response_model.model_json_schema()

        # -----------------------------------------------------
        # Groq strict JSON-schema compatibility
        # -----------------------------------------------------
        #
        # Groq requires:
        #
        # 1. additionalProperties=false on every object
        # 2. required[] containing EVERY property
        #
        # Pydantic allows optional/nullable fields, but Groq's
        # strict schema requires those fields to still be present.
        #
        # Nullable fields remain nullable through their original
        # anyOf/type definition.
        # -----------------------------------------------------

        self._make_groq_strict_schema(schema)

        return self._client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            temperature=0.1,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": self._schema_name(response_model),
                    "strict": True,
                    "schema": schema,
                },
            },
        )

    # =========================================================
    # SCHEMA HELPERS
    # =========================================================

    @staticmethod
    def _schema_name(
        response_model: Type[T],
    ) -> str:
        """
        Produce a safe JSON-schema name for Groq.
        """

        name = response_model.__name__.lower()

        # Groq schema names should remain simple.
        return "".join(
            char if char.isalnum() or char == "_"
            else "_"
            for char in name
        )

    @classmethod
    def _make_groq_strict_schema(
        cls,
        value: Any,
    ) -> None:
        """
        Recursively convert a Pydantic JSON schema into the
        stricter subset expected by Groq structured outputs.

        Every object gets:
            additionalProperties: false

        Every object's properties are all included in:
            required: [...]
        """

        if isinstance(value, dict):

            # -------------------------------------------------
            # Object schema
            # -------------------------------------------------

            if value.get("type") == "object":

                properties = value.get(
                    "properties",
                    {},
                )

                value["additionalProperties"] = False

                value["required"] = list(
                    properties.keys()
                )

            # -------------------------------------------------
            # Recursively process every nested schema.
            # -------------------------------------------------

            for child in value.values():
                cls._make_groq_strict_schema(child)

        # -----------------------------------------------------
        # Arrays / lists
        # -----------------------------------------------------

        elif isinstance(value, list):

            for child in value:
                cls._make_groq_strict_schema(child)