from dataclasses import dataclass, field
from datetime import datetime, timezone

from app.models.session import InterviewSession


@dataclass
class SessionState:
    """
    Runtime state associated with one active interview session.
    """

    session: InterviewSession

    context_buffer: str = ""

    metadata: dict[str, object] = field(
        default_factory=dict
    )

    created_at: datetime = field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    last_accessed_at: datetime = field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    def touch(self) -> None:
        self.last_accessed_at = datetime.now(timezone.utc)