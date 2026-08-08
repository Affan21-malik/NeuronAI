import asyncio

from app.services.candidate.analyzer import CandidateAnalyzer
from app.services.curriculum.loader import CurriculumLoader
from app.services.interview.difficulty import DifficultyManager
from app.services.interview.evaluator import EvaluationResult
from app.services.interview.followup import FollowupEngine
from app.services.interview.planner import InterviewPlanner
from app.services.interview.question_generator import QuestionGenerator
from app.services.llm.gemini import GeminiLLMProvider


async def main():
    print("=" * 60)
    print("NEURONAI INTERVIEW SERVICE TEST")
    print("=" * 60)

    # ---------------------------------------------------------
    # 1. Candidate
    # ---------------------------------------------------------
    candidate_analyzer = CandidateAnalyzer()

    candidate = await candidate_analyzer.get_candidate(
        "CAND-001"
    )

    print("\n[1] CANDIDATE")
    print(f"ID: {candidate.member.id}")
    print(f"Name: {candidate.member.name}")
    print(f"Role: {candidate.member.job_role}")
    print(f"Experience: {candidate.member.years_experience} years")
    print(
        f"Level: "
        f"{candidate.experience_level.value}"
    )

    # ---------------------------------------------------------
    # 2. Candidate mastery
    # ---------------------------------------------------------
    mastery = await candidate_analyzer.get_starting_topic_masteries(
        "CAND-001"
    )

    print("\n[2] STARTING MASTERY")
    for topic, score in mastery.items():
        print(f"  {topic}: {score:.1f}")

    # ---------------------------------------------------------
    # 3. Curriculum
    # ---------------------------------------------------------
    curriculum = CurriculumLoader()

    topics = await curriculum.get_topics()

    print("\n[3] CURRICULUM TOPICS")
    for topic in topics:
        print(f"  - {topic}")

    # ---------------------------------------------------------
    # 4. Planner
    # ---------------------------------------------------------
    planner = InterviewPlanner(
        curriculum
    )

    next_topic = await planner.select_next_topic(
        knowledge_map=mastery
    )

    print("\n[4] PLANNER")
    print(f"Selected topic: {next_topic}")

    subtopics = await curriculum.get_subtopics(
        next_topic
    )

    print("Subtopics:")
    for subtopic in subtopics:
        print(f"  - {subtopic}")

    # ---------------------------------------------------------
    # 5. Difficulty
    # ---------------------------------------------------------
    difficulty_manager = DifficultyManager()

    current_difficulty = (
        await candidate_analyzer.get_default_difficulty(
            "CAND-001"
        )
    )

    print("\n[5] DIFFICULTY")
    print(
        f"Initial difficulty: "
        f"{current_difficulty}"
    )

    evaluations = [
        EvaluationResult(
            score=85,
            clarity=8,
            depth=8,
            misconceptions=[],
        ),
        EvaluationResult(
            score=88,
            clarity=9,
            depth=8,
            misconceptions=[],
        ),
        EvaluationResult(
            score=91,
            clarity=9,
            depth=9,
            misconceptions=[],
        ),
    ]

    new_difficulty = (
        difficulty_manager.calculate_transition(
            evaluations=evaluations,
            current_difficulty=current_difficulty,
            experience_level=candidate.experience_level,
        )
    )

    print(
        f"After strong performance: "
        f"{new_difficulty}"
    )

    # ---------------------------------------------------------
    # 6. Follow-up decision
    # ---------------------------------------------------------
    followup_engine = FollowupEngine()

    weak_evaluation = EvaluationResult(
        score=55,
        clarity=5,
        depth=4,
        misconceptions=[
            "Confuses vector search with SQL search"
        ],
    )

    decision = followup_engine.decide(
        evaluation=weak_evaluation,
        followup_attempts=0,
    )

    print("\n[6] FOLLOW-UP")
    print(f"Action: {decision.action.value}")
    print(f"Reason: {decision.reason}")

    strong_evaluation = EvaluationResult(
        score=90,
        clarity=9,
        depth=9,
        misconceptions=[],
    )

    decision = followup_engine.decide(
        evaluation=strong_evaluation,
        followup_attempts=0,
    )

    print(
        f"Strong answer action: "
        f"{decision.action.value}"
    )

    # ---------------------------------------------------------
    # 7. LLM / Question Generator
    # ---------------------------------------------------------
    llm = GeminiLLMProvider()

    print("\n[7] LLM")
    print(
        f"Mock mode: {llm.is_mock}"
    )

    generator = QuestionGenerator(
        llm_provider=llm
    )

    question = await generator.generate(
        topic=next_topic,
        difficulty=new_difficulty,
        context="Candidate has demonstrated basic understanding.",
        subtopic=(
            subtopics[0]
            if subtopics
            else None
        ),
    )

    print("Generated question:")
    print(f"  {question}")

    print("\n" + "=" * 60)
    print("ALL INTERVIEW SERVICES PASSED")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())