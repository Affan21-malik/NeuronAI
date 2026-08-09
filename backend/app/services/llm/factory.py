import os

from app.services.llm.gemini import GeminiLLMProvider
from app.services.llm.groq import GroqLLMProvider
from app.services.llm.huggingface import HuggingFaceLLMProvider
from app.services.llm.provider import BaseLLMProvider


def get_llm_provider(
    provider_name: str | None = None,
) -> BaseLLMProvider:
    """
    Central factory function for instantiating the LLM provider.
    """

    name = (
        provider_name
        or os.getenv("LLM_PROVIDER", "groq")
    ).lower().strip()

    if name == "groq":
        return GroqLLMProvider()

    elif name == "gemini":
        return GeminiLLMProvider()

    elif name == "huggingface":
        return HuggingFaceLLMProvider()

    else:
        raise ValueError(
            f"Unsupported LLM provider: '{name}'"
        )