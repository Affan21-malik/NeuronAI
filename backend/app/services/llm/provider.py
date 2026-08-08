from abc import ABC, abstractmethod
from typing import Type, TypeVar

T = TypeVar("T")


class BaseLLMProvider(ABC):
    """
    Abstract interface for all LLM providers.

    The rest of the application should depend on this interface rather
    than directly depending on Gemini, OpenAI, Ollama, etc.
    """

    @abstractmethod
    async def generate_text(self, prompt: str) -> str:
        """
        Generate a plain-text response from the LLM.
        """
        raise NotImplementedError

    @abstractmethod
    async def generate_structured(
        self,
        prompt: str,
        response_model: Type[T],
    ) -> T:
        """
        Generate a response conforming to the supplied Pydantic model.
        """
        raise NotImplementedError