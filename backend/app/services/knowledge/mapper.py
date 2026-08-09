from __future__ import annotations

from typing import Dict, Iterable, Optional

from app.services.interview.evaluator import EvaluationResult


class KnowledgeMapper:
    """
    Maintains normalized candidate mastery scores.

    All mastery values are normalized to [0.0, 1.0].

    An exponential moving average is used so recent interview
    performance has more influence than older performance.
    """

    def __init__(
        self,
        alpha: float = 0.35,
    ) -> None:
        if not 0.0 < alpha <= 1.0:
            raise ValueError(
                "alpha must be greater than 0 and at most 1."
            )

        self.alpha = alpha

    def update(
        self,
        knowledge_map: Dict[str, float],
        topic: str,
        evaluation: EvaluationResult,
    ) -> Dict[str, float]:
        """
        Update mastery for one topic using the evaluation score.
        """

        if not topic.strip():
            raise ValueError(
                "topic cannot be empty."
            )

        self._validate_knowledge_map(
            knowledge_map
        )

        score = self._normalize_score(
            evaluation.score
        )

        previous = knowledge_map.get(
            topic,
            score,
        )

        if topic not in knowledge_map:
            updated = score
        else:
            updated = (
                self.alpha * score
                + (1.0 - self.alpha) * previous
            )

        knowledge_map[topic] = self._clamp(
            updated
        )

        return knowledge_map

    def update_from_score(
        self,
        knowledge_map: Dict[str, float],
        topic: str,
        score: float,
    ) -> Dict[str, float]:
        """
        Convenience method when a raw 0-100 score is available.
        """

        if not 0.0 <= score <= 100.0:
            raise ValueError(
                "score must be between 0 and 100."
            )

        normalized = score / 100.0

        previous = knowledge_map.get(
            topic,
            normalized,
        )

        updated = (
            normalized
            if topic not in knowledge_map
            else (
                self.alpha * normalized
                + (1.0 - self.alpha) * previous
            )
        )

        knowledge_map[topic] = self._clamp(
            updated
        )

        return knowledge_map

    def update_batch(
        self,
        knowledge_map: Dict[str, float],
        evaluations: Iterable[
            tuple[str, EvaluationResult]
        ],
    ) -> Dict[str, float]:
        """
        Apply evaluations sequentially.

        Ordering matters because EMA is sequential.
        """

        for topic, evaluation in evaluations:
            self.update(
                knowledge_map,
                topic,
                evaluation,
            )

        return knowledge_map

    def get_mastery(
        self,
        knowledge_map: Dict[str, float],
        topic: str,
    ) -> float:
        if topic not in knowledge_map:
            return 0.0

        value = knowledge_map[topic]

        if not 0.0 <= value <= 1.0:
            raise ValueError(
                f"Invalid mastery value for {topic}: {value}"
            )

        return value

    def is_mastered(
        self,
        knowledge_map: Dict[str, float],
        topic: str,
        threshold: float = 0.6,
    ) -> bool:
        if not 0.0 <= threshold <= 1.0:
            raise ValueError(
                "threshold must be between 0 and 1."
            )

        return (
            self.get_mastery(
                knowledge_map,
                topic,
            )
            >= threshold
        )

    @staticmethod
    def _normalize_score(
        score: float,
    ) -> float:
        if not 0.0 <= score <= 100.0:
            raise ValueError(
                "Evaluation score must be between 0 and 100."
            )

        return score / 100.0

    @staticmethod
    def _clamp(
        value: float,
    ) -> float:
        return max(
            0.0,
            min(1.0, value),
        )

    @staticmethod
    def _validate_knowledge_map(
        knowledge_map: Dict[str, float],
    ) -> None:
        for topic, score in knowledge_map.items():
            if not 0.0 <= score <= 1.0:
                raise ValueError(
                    f"Mastery for '{topic}' must be "
                    "between 0.0 and 1.0."
                )