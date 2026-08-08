import asyncio
import json
from pathlib import Path
from typing import Any

from app.models.candidate import (
    CandidateProfile,
    ExperienceLevel,
)


class CandidateAnalyzer:
    """
    Loads candidate profiles and derives interview initialization data.

    The supplied candidates.json does not contain explicit topic mastery
    scores. Mastery is therefore estimated from mission outcomes.
    """

    def __init__(
        self,
        candidates_path: str | Path = "app/data/candidates.json",
    ) -> None:
        self.candidates_path = Path(
            candidates_path
        )

        self._candidates: dict[
            str,
            CandidateProfile,
        ] = {}

        self._raw_data: dict[str, Any] | None = None

    async def load(self) -> dict[
        str,
        CandidateProfile,
    ]:
        if self._candidates:
            return self._candidates

        if not self.candidates_path.exists():
            raise FileNotFoundError(
                f"Candidates file not found: "
                f"{self.candidates_path}"
            )

        raw_data = await asyncio.to_thread(
            self._read_json
        )

        candidates = raw_data.get(
            "candidates",
            []
        )

        if not isinstance(
            candidates,
            list,
        ):
            raise ValueError(
                "'candidates' must be a list."
            )

        for candidate_data in candidates:
            profile = CandidateProfile.model_validate(
                candidate_data
            )

            self._candidates[
                profile.member.id
            ] = profile

        self._raw_data = raw_data

        return self._candidates

    async def get_candidate(
        self,
        candidate_id: str,
    ) -> CandidateProfile:
        if not candidate_id:
            raise ValueError(
                "candidate_id cannot be empty."
            )

        candidates = await self.load()

        candidate = candidates.get(
            candidate_id
        )

        if candidate is None:
            raise KeyError(
                f"Candidate not found: {candidate_id}"
            )

        return candidate

    async def get_all_candidates(
        self,
    ) -> list[CandidateProfile]:
        candidates = await self.load()

        return list(
            candidates.values()
        )

    async def get_starting_topic_masteries(
        self,
        candidate_id: str,
    ) -> dict[str, float]:
        """
        Estimate mastery by curriculum module from the candidate's
        mission outcomes.

        The current candidate data does not explicitly map missions
        to module numbers, so mission day numbers are used to map
        against the curriculum's module day ranges when a curriculum
        path is supplied.
        """

        candidate = await self.get_candidate(
            candidate_id
        )

        return self._calculate_masteries(
            candidate
        )

    async def get_default_difficulty(
        self,
        candidate_id: str,
    ) -> str:
        candidate = await self.get_candidate(
            candidate_id
        )

        level = candidate.experience_level

        if level == ExperienceLevel.BEGINNER:
            return "easy"

        if level == ExperienceLevel.INTERMEDIATE:
            return "medium"

        return "hard"

    async def get_initial_profile(
        self,
        candidate_id: str,
    ) -> dict[str, Any]:
        candidate = await self.get_candidate(
            candidate_id
        )

        return {
            "candidate_id": candidate.member.id,
            "name": candidate.member.name,
            "job_role": candidate.member.job_role,
            "years_experience": (
                candidate.member.years_experience
            ),
            "education": candidate.member.education,
            "experience_level": (
                candidate.experience_level.value
            ),
            "topic_masteries": (
                await self.get_starting_topic_masteries(
                    candidate_id
                )
            ),
            "default_difficulty": (
                await self.get_default_difficulty(
                    candidate_id
                )
            ),
        }

    def _calculate_masteries(
        self,
        candidate: CandidateProfile,
    ) -> dict[str, float]:
        """
        Produce a mission-derived mastery map.

        For each mission:
            passed  -> 100
            failed  -> 0
            skipped -> ignored

        When multiple observations exist for the same topic/day,
        the average is used.

        Because the supplied candidate JSON does not contain an
        explicit module mapping, this method currently returns
        mission-level mastery keys. The curriculum engine can later
        aggregate these into module-level mastery.
        """

        masteries: dict[str, float] = {}

        for mission in candidate.missions:
            if mission.skipped:
                continue

            if mission.passed is True:
                score = 100.0

            elif mission.passed is False:
                score = 0.0

            else:
                continue

            key = mission.title

            if key in masteries:
                masteries[key] = (
                    masteries[key] + score
                ) / 2
            else:
                masteries[key] = score

        return masteries

    def _read_json(self) -> dict[str, Any]:
        with self.candidates_path.open(
            "r",
            encoding="utf-8",
        ) as file:
            return json.load(file)