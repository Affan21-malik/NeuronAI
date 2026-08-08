import asyncio

from app.services.interview.question_generator import QuestionGenerator
from app.services.llm.gemini import GeminiLLMProvider


async def main():
    llm_provider = GeminiLLMProvider()

    print("LLM mock mode:", llm_provider.is_mock)

    generator = QuestionGenerator(
        llm_provider=llm_provider
    )

    question = await generator.generate(
        topic="Environment & Tooling",
        difficulty="medium",
        context=(
            "Assess the candidate's understanding of "
            "development environment and tooling."
        ),
        subtopic=None,
        followup=False,
        previous_question=None,
        previous_answer=None,
    )

    print("Generated question:", question)

    assert isinstance(question, str)
    assert question.strip() != ""

    print("QuestionGenerator test PASSED")


if __name__ == "__main__":
    asyncio.run(main())