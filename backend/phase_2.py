import asyncio

from app.services.candidate.analyzer import CandidateAnalyzer
from app.services.curriculum.loader import CurriculumLoader
from app.services.llm.gemini import GeminiLLMProvider


async def main():
    curriculum = CurriculumLoader()

    print("TOPICS:")
    print(await curriculum.get_topics())

    print("\nDAY 16:")
    print(await curriculum.get_day(16))

    candidates = CandidateAnalyzer()

    candidate = await candidates.get_candidate(
        "CAND-001"
    )

    print("\nCANDIDATE:")
    print(candidate.member.name)

    print("\nMASTERY:")
    print(
        await candidates.get_starting_topic_masteries(
            "CAND-001"
        )
    )

    print("\nDIFFICULTY:")
    print(
        await candidates.get_default_difficulty(
            "CAND-001"
        )
    )

    llm = GeminiLLMProvider()

    print("\nLLM MOCK MODE:")
    print(llm.is_mock)

    print(
        await llm.generate_text(
            "Generate an interview question."
        )
    )


if __name__ == "__main__":
    asyncio.run(main())