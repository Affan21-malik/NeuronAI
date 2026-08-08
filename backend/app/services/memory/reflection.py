from app.models.session import DialogueTurn
from app.services.llm.provider import BaseLLMProvider


class ConversationReflector:
    """
    Converts a full interview transcript into a compact context buffer.

    An LLM can be used for semantic summarization. When no provider is
    supplied, a deterministic truncation-based fallback is used.
    """

    def __init__(
        self,
        llm_provider: BaseLLMProvider | None = None,
        max_characters: int = 6000,
    ) -> None:
        self.llm_provider = llm_provider
        self.max_characters = max_characters

    async def summarize(
        self,
        turns: list[DialogueTurn],
    ) -> str:
        if not turns:
            return ""

        transcript = self._format_transcript(turns)

        if self.llm_provider is None:
            return self._fallback_summary(transcript)

        prompt = self._build_prompt(transcript)

        return await self.llm_provider.generate_text(
            prompt
        )

    def _format_transcript(
        self,
        turns: list[DialogueTurn],
    ) -> str:
        lines: list[str] = []

        for turn in turns:
            speaker = turn.role.upper()

            topic = (
                f" [{turn.topic}]"
                if turn.topic
                else ""
            )

            lines.append(
                f"{speaker}{topic}: {turn.content}"
            )

        return "\n".join(lines)

    def _build_prompt(
        self,
        transcript: str,
    ) -> str:
        return f"""
You are summarizing an ongoing technical interview.

Create a compact context buffer for the next interviewer turn.

Preserve:
- Topics discussed
- Questions already asked
- Candidate's key technical claims
- Demonstrated strengths
- Demonstrated weaknesses
- Important misconceptions
- Unresolved areas worth probing

Do not invent information.

Interview transcript:

{transcript}

Return a concise factual summary.
""".strip()

    def _fallback_summary(
        self,
        transcript: str,
    ) -> str:
        if len(transcript) <= self.max_characters:
            return transcript

        return (
            "[Earlier transcript truncated]\n"
            + transcript[-self.max_characters:]
        )