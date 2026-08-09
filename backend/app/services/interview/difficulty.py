from collections import deque
from typing import Deque

from app.models.candidate import ExperienceLevel
from app.services.interview.evaluator import EvaluationResult


class DifficultyManager:
    """
    Controls interview difficulty using recent candidate performance.

    Difficulty transitions are based on the rolling average of the
    last three evaluation scores.
    """

    def __init__(
        self,
        window_size: int = 3,
    ) -> None:
        if window_size < 1:
            raise ValueError(
                "window_size must be at least 1."
            )

        self.window_size = window_size

    def calculate_transition(
        self,
        evaluations: list[EvaluationResult],
        current_difficulty: str,
        experience_level: ExperienceLevel,
    ) -> str:
        """
        Calculate the next difficulty.

        Only the latest `window_size` evaluations are considered.
        """

        self._validate_difficulty(
            current_difficulty
        )

        baseline = self.baseline_target(
            experience_level
        )

        recent = evaluations[
            -self.window_size:
        ]

        if not recent:
            return self._clamp_to_baseline(
                current_difficulty,
                baseline,
            )

        average = sum(
            evaluation.score
            for evaluation in recent
        ) / len(recent)

        if average >= baseline + 10:
            return self.increase(
                current_difficulty
            )

        if average <= baseline - 10:
            return self.decrease(
                current_difficulty
            )

        return current_difficulty

    def baseline_target(
        self,
        experience_level: ExperienceLevel,
    ) -> float:
        """
        Minimum target performance expected for the candidate's
        experience level.
        """

        targets = {
            ExperienceLevel.BEGINNER: 60.0,
            ExperienceLevel.INTERMEDIATE: 70.0,
            ExperienceLevel.ADVANCED: 80.0,
        }

        return targets[experience_level]

    @staticmethod
    def increase(
        difficulty: str,
    ) -> str:
        transitions = {
            "easy": "medium",
            "medium": "hard",
            "hard": "hard",
        }

        return transitions[difficulty]

    @staticmethod
    def decrease(
        difficulty: str,
    ) -> str:
        transitions = {
            "easy": "easy",
            "medium": "easy",
            "hard": "medium",
        }

        return transitions[difficulty]

    @staticmethod
    def _validate_difficulty(
        difficulty: str,
    ) -> None:
        if difficulty not in {
            "easy",
            "medium",
            "hard",
        }:
            raise ValueError(
                f"Invalid difficulty: {difficulty}"
            )

    @staticmethod
    def _clamp_to_baseline(
        difficulty: str,
        baseline: float,
    ) -> str:
        """
        Preserve the requested difficulty when there is no
        performance history. Baseline is retained for future
        calibration and experience-aware decisions.
        """

        del baseline

        return difficulty