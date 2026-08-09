from __future__ import annotations

from enum import Enum
from typing import Dict, List

from pydantic import BaseModel, Field

from app.services.curriculum.loader import CurriculumLoader


class SkillGapSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class SkillGap(BaseModel):
    topic: str
    mastery: float = Field(
        ...,
        ge=0.0,
        le=1.0,
    )

    severity: SkillGapSeverity

    missing_prerequisites: List[str] = Field(
        default_factory=list
    )

    recommended_subtopics: List[str] = Field(
        default_factory=list
    )

    reason: str


class SkillGapReport(BaseModel):
    gaps: List[SkillGap] = Field(
        default_factory=list
    )

    critical_gaps: List[str] = Field(
        default_factory=list
    )

    missing_prerequisites: Dict[
        str,
        List[str]
    ] = Field(
        default_factory=dict
    )


class SkillGapAnalyzer:
    """
    Compares a candidate's normalized knowledge map against the
    available curriculum.

    Mastery below 0.6 is considered a skill gap.
    """

    def __init__(
        self,
        curriculum_loader: CurriculumLoader,
        mastery_threshold: float = 0.6,
    ) -> None:
        if not 0.0 <= mastery_threshold <= 1.0:
            raise ValueError(
                "mastery_threshold must be between 0 and 1."
            )

        self.curriculum_loader = curriculum_loader
        self.mastery_threshold = mastery_threshold

    async def analyze(
        self,
        knowledge_map: Dict[str, float],
    ) -> SkillGapReport:
        self._validate_knowledge_map(
            knowledge_map
        )

        topics = (
            await self.curriculum_loader
            .get_topics()
        )

        gaps: List[SkillGap] = []
        missing_prerequisites: Dict[
            str,
            List[str]
        ] = {}

        for topic in topics:
            mastery = knowledge_map.get(
                topic,
                0.0,
            )

            prerequisites = (
                await self.curriculum_loader
                .get_prerequisites(topic)
            )

            unmet = [
                prerequisite
                for prerequisite in prerequisites
                if knowledge_map.get(
                    prerequisite,
                    0.0,
                ) < self.mastery_threshold
            ]

            if unmet:
                missing_prerequisites[
                    topic
                ] = unmet

            low_mastery = (
                mastery < self.mastery_threshold
            )

            if not low_mastery and not unmet:
                continue

            subtopics = (
                await self.curriculum_loader
                .get_subtopics(topic)
            )

            severity = self._calculate_severity(
                mastery=mastery,
                missing_prerequisites=unmet,
            )

            reason_parts: List[str] = []

            if low_mastery:
                reason_parts.append(
                    f"Mastery is {mastery:.2f}, "
                    f"below the {self.mastery_threshold:.2f} "
                    "target."
                )

            if unmet:
                reason_parts.append(
                    "Unmet prerequisites: "
                    + ", ".join(unmet)
                    + "."
                )

            gaps.append(
                SkillGap(
                    topic=topic,
                    mastery=mastery,
                    severity=severity,
                    missing_prerequisites=unmet,
                    recommended_subtopics=subtopics,
                    reason=" ".join(
                        reason_parts
                    ),
                )
            )

        gaps.sort(
            key=lambda gap: (
                -self._severity_rank(
                    gap.severity
                ),
                gap.mastery,
            )
        )

        critical = [
            gap.topic
            for gap in gaps
            if gap.severity
            == SkillGapSeverity.CRITICAL
        ]

        return SkillGapReport(
            gaps=gaps,
            critical_gaps=critical,
            missing_prerequisites=(
                missing_prerequisites
            ),
        )

    @staticmethod
    def _calculate_severity(
        mastery: float,
        missing_prerequisites: List[str],
    ) -> SkillGapSeverity:
        if mastery < 0.3:
            return SkillGapSeverity.CRITICAL

        if missing_prerequisites:
            return SkillGapSeverity.HIGH

        if mastery < 0.45:
            return SkillGapSeverity.HIGH

        if mastery < 0.6:
            return SkillGapSeverity.MEDIUM

        return SkillGapSeverity.LOW

    @staticmethod
    def _severity_rank(
        severity: SkillGapSeverity,
    ) -> int:
        return {
            SkillGapSeverity.CRITICAL: 4,
            SkillGapSeverity.HIGH: 3,
            SkillGapSeverity.MEDIUM: 2,
            SkillGapSeverity.LOW: 1,
        }[severity]

    @staticmethod
    def _validate_knowledge_map(
        knowledge_map: Dict[str, float],
    ) -> None:
        for topic, mastery in knowledge_map.items():
            if not 0.0 <= mastery <= 1.0:
                raise ValueError(
                    f"Mastery for '{topic}' must "
                    "be between 0.0 and 1.0."
                )