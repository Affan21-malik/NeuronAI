import asyncio

from app.models.session import InterviewSession
from app.services.curriculum.loader import CurriculumLoader
from app.services.interview.evaluator import EvaluationResult
from app.services.knowledge.mapper import KnowledgeMapper
from app.services.knowledge.skill_gap import SkillGapAnalyzer
from app.services.reports.generator import ReportGenerator


async def main():
    print("=" * 60)
    print("NEURONAI PHASE 4 TEST")
    print("=" * 60)

    # ---------------------------------------------------------
    # 1. Knowledge Mapper
    # ---------------------------------------------------------
    mapper = KnowledgeMapper(alpha=0.35)

    knowledge_map = {}

    evaluation_1 = EvaluationResult(
        score=80,
        clarity=8,
        depth=8,
        misconceptions=[],
    )

    mapper.update(
        knowledge_map,
        "Embeddings & Vector Search",
        evaluation_1,
    )

    print("\n[1] KNOWLEDGE MAPPER")
    print(
        "After score 80:",
        knowledge_map,
    )

    evaluation_2 = EvaluationResult(
        score=40,
        clarity=5,
        depth=4,
        misconceptions=[
            "Confuses embeddings with vector databases"
        ],
    )

    mapper.update(
        knowledge_map,
        "Embeddings & Vector Search",
        evaluation_2,
    )

    print(
        "After score 40:",
        knowledge_map,
    )

    # ---------------------------------------------------------
    # 2. Curriculum
    # ---------------------------------------------------------
    curriculum = CurriculumLoader()

    topics = await curriculum.get_topics()

    print("\n[2] CURRICULUM")
    print("Topics:")

    for topic in topics:
        print(f"  - {topic}")

    # ---------------------------------------------------------
    # 3. Skill Gap Analyzer
    # ---------------------------------------------------------
    skill_gap_analyzer = SkillGapAnalyzer(
        curriculum_loader=curriculum
    )

    gap_report = await skill_gap_analyzer.analyze(
        knowledge_map
    )

    print("\n[3] SKILL GAP ANALYSIS")

    print("Gaps:")

    for gap in gap_report.gaps:
        print(
            f"  - {gap.topic}: "
            f"{gap.mastery:.2f} "
            f"[{gap.severity.value}]"
        )

    print(
        "Critical gaps:",
        gap_report.critical_gaps,
    )

    # ---------------------------------------------------------
    # 4. Build fake interview session
    # ---------------------------------------------------------
    session = InterviewSession(
        session_id="test-session-001",
        candidate_id="CAND-001",
        current_topic="Embeddings & Vector Search",
        current_subtopic="Embeddings Explained",
        difficulty="medium",
        knowledge_map=knowledge_map,
        confidence_score=0.82,
        questions_asked=3,
        questions_answered=2,
    )

    print("\n[4] SESSION")
    print(
        "Session:",
        session.session_id,
    )

    print(
        "Knowledge map:",
        session.knowledge_map,
    )

    # ---------------------------------------------------------
    # 5. Report Generator
    # ---------------------------------------------------------
    report_generator = ReportGenerator(
        curriculum_loader=curriculum,
        skill_gap_analyzer=skill_gap_analyzer,
    )

    evaluations = [
        evaluation_1,
        evaluation_2,
    ]

    report = await report_generator.generate(
        session=session,
        evaluations=evaluations,
    )

    print("\n[5] REPORT")

    print(
        f"Overall score: "
        f"{report.overall_score}"
    )

    print(
        f"Summary: "
        f"{report.score_summary}"
    )

    print("\nTopic breakdown:")

    for topic in report.topic_breakdown:
        print(
            f"  - {topic.topic}: "
            f"{topic.percentage:.1f}% "
            f"({topic.status})"
        )

    print("\nStrengths:")

    for strength in report.strengths:
        print(
            f"  - {strength}"
        )

    print("\nSkill gaps:")

    for gap in report.skill_gaps:
        print(
            f"  - {gap.topic}: "
            f"{gap.severity.value}"
        )

    print("\nLearning path:")

    for recommendation in report.learning_path:
        print(
            f"  - {recommendation.topic} "
            f"[{recommendation.priority}]"
        )

    # ---------------------------------------------------------
    # 6. Frontend serialization test
    # ---------------------------------------------------------
    print("\n[6] FRONTEND JSON")

    report_json = report.model_dump_json(
        indent=2
    )

    print(report_json)

    print("\n" + "=" * 60)
    print("PHASE 4 TEST COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())