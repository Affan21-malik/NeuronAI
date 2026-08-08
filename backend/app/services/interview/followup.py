from enum import Enum

from app.services.interview.evaluator import EvaluationResult


class FollowupAction(str, Enum):
    INTELLIGENT_FOLLOWUP = "intelligent_followup"
    NEW_TOPIC = "new_topic"


class FollowupDecision:
    """
    Result of deterministic follow-up decision logic.
    """

    def __init__(
        self,
        action: FollowupAction,
        reason: str,
    ) -> None:
        self.action = action
        self.reason = reason


class FollowupEngine:
    """
    Determines whether the interview should probe the current topic
    further or transition to a new topic.

    No LLM is involved in this decision.
    """

    def __init__(
        self,
        max_followups_per_topic: int = 2,
        clarity_threshold: float = 7.0,
        depth_threshold: float = 7.0,
    ) -> None:
        if max_followups_per_topic < 1:
            raise ValueError(
                "max_followups_per_topic must be at least 1."
            )

        self.max_followups_per_topic = (
            max_followups_per_topic
        )

        self.clarity_threshold = clarity_threshold
        self.depth_threshold = depth_threshold

    def decide(
        self,
        evaluation: EvaluationResult,
        followup_attempts: int,
    ) -> FollowupDecision:
        if followup_attempts < 0:
            raise ValueError(
                "followup_attempts cannot be negative."
            )

        if followup_attempts >= self.max_followups_per_topic:
            return FollowupDecision(
                FollowupAction.NEW_TOPIC,
                "Maximum follow-up attempts reached.",
            )

        if evaluation.score < 70:
            return FollowupDecision(
                FollowupAction.INTELLIGENT_FOLLOWUP,
                "Answer score is below 70.",
            )

        if evaluation.clarity < self.clarity_threshold:
            return FollowupDecision(
                FollowupAction.INTELLIGENT_FOLLOWUP,
                "Answer clarity is below threshold.",
            )

        if evaluation.depth < self.depth_threshold:
            return FollowupDecision(
                FollowupAction.INTELLIGENT_FOLLOWUP,
                "Answer depth is below threshold.",
            )

        if evaluation.misconceptions:
            return FollowupDecision(
                FollowupAction.INTELLIGENT_FOLLOWUP,
                "Technical misconceptions were detected.",
            )

        return FollowupDecision(
            FollowupAction.NEW_TOPIC,
            "Candidate demonstrated sufficient understanding.",
        )

    def should_follow_up(
        self,
        evaluation: EvaluationResult,
        followup_attempts: int,
    ) -> bool:
        return (
            self.decide(
                evaluation,
                followup_attempts,
            ).action
            == FollowupAction.INTELLIGENT_FOLLOWUP
        )