import asyncio
import json
import os
from typing import Any, Type, TypeVar

from groq import Groq

from app.services.llm.provider import BaseLLMProvider

T = TypeVar("T")


class GroqLLMProvider(BaseLLMProvider):
    """
    Groq implementation of the common NeuronAI LLM interface.

    Supports:
    - Plain text generation for the Interviewer Agent
    - Structured JSON generation for the Evaluator Agent
    """

    def __init__(
        self,
        model: str = "openai/gpt-oss-120b",
        api_key: str | None = None,
    ) -> None:
        self.model = model
        self.api_key = api_key or os.getenv("GROQ_API_KEY")

        if not self.api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not configured."
            )

        self._client = Groq(api_key=self.api_key)

    @property
    def is_mock(self) -> bool:
        return False

    # =========================================================
    # TEXT GENERATION
    # =========================================================

    async def generate_text(
        self,
        prompt: str,
    ) -> str:
        if not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

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
            raise RuntimeError(
                f"Groq text generation failed: {exc}"
            ) from exc

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

        except RuntimeError:
            raise

        except Exception as exc:
            raise RuntimeError(
                f"Groq structured generation failed: {exc}"
            ) from exc

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