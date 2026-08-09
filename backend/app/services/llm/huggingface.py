import asyncio
import json
import os
import re
from typing import Type, TypeVar

from huggingface_hub import InferenceClient

from app.services.llm.provider import BaseLLMProvider

T = TypeVar("T")


class HuggingFaceLLMProvider(BaseLLMProvider):
    """
    Hugging Face implementation of the common NeuronAI LLM interface.

    Uses Hugging Face Inference Providers and keeps the rest of
    the application independent of the underlying LLM provider.
    """

    def __init__(
        self,
        model: str | None = None,
        api_key: str | None = None,
    ) -> None:
        self.model = (
            model
            or os.getenv(
                "HF_MODEL",
                "openai/gpt-oss-120b",
            )
        )

        self.api_key = (
            api_key
            or os.getenv("HF_TOKEN")
        )

        if not self.api_key:
            raise RuntimeError(
                "HF_TOKEN is required when using "
                "the Hugging Face LLM provider."
            )

        self._client = InferenceClient(
            provider="auto",
            api_key=self.api_key,
        )

    async def generate_text(
        self,
        prompt: str,
    ) -> str:
        if not prompt.strip():
            raise ValueError(
                "Prompt cannot be empty."
            )

        try:
            response = await asyncio.to_thread(
                self._generate_text_sync,
                prompt,
            )

            text = response.choices[0].message.content

            if not text:
                raise RuntimeError(
                    "Hugging Face returned an empty response."
                )

            return text.strip()

        except Exception as exc:
            raise RuntimeError(
                f"Hugging Face text generation failed: {exc}"
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

    async def generate_structured(
        self,
        prompt: str,
        response_model: Type[T],
    ) -> T:
        if not prompt.strip():
            raise ValueError(
                "Prompt cannot be empty."
            )

        try:
            raw_response = await self.generate_text(
                prompt
            )

            cleaned = self._clean_json(
                raw_response
            )

            data = json.loads(cleaned)

            return response_model.model_validate(
                data
            )

        except Exception as exc:
            raise RuntimeError(
                "Hugging Face structured generation "
                f"failed: {exc}"
            ) from exc

    @staticmethod
    def _clean_json(text: str) -> str:
        text = text.strip()

        # Remove Markdown JSON fences.
        text = re.sub(
            r"^```(?:json)?\s*",
            "",
            text,
            flags=re.IGNORECASE,
        )

        text = re.sub(
            r"\s*```$",
            "",
            text,
            flags=re.IGNORECASE,
        )

        # Extract the outer JSON object if the model
        # included explanatory text around it.
        start = text.find("{")
        end = text.rfind("}")

        if start != -1 and end != -1:
            text = text[start:end + 1]

        return text.strip()

