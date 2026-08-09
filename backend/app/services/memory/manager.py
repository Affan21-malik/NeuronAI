from datetime import datetime, timezone

from app.models.session import DialogueTurn, InterviewSession
from app.services.memory.state import SessionState


class MemoryManager:
    """
    In-memory session store.

    This is intentionally implemented behind a class interface so the
    storage mechanism can later be replaced with Redis without changing
    the rest of the application.
    """

    def __init__(self) -> None:
        self._sessions: dict[str, SessionState] = {}

    async def create_session(
        self,
        session: InterviewSession,
    ) -> InterviewSession:
        if not session.session_id:
            raise ValueError(
                "session_id cannot be empty."
            )

        if session.session_id in self._sessions:
            raise ValueError(
                f"Session already exists: {session.session_id}"
            )

        self._sessions[session.session_id] = SessionState(
            session=session
        )

        return session

    async def get_session(
        self,
        session_id: str,
    ) -> InterviewSession:
        state = self._get_state(session_id)
        state.touch()

        return state.session

    async def save_session(
        self,
        session: InterviewSession,
    ) -> InterviewSession:
        if not session.session_id:
            raise ValueError(
                "session_id cannot be empty."
            )

        state = self._sessions.get(
            session.session_id
        )

        if state is None:
            self._sessions[session.session_id] = SessionState(
                session=session
            )
        else:
            state.session = session
            state.touch()

        return session

    async def delete_session(
        self,
        session_id: str,
    ) -> None:
        if session_id not in self._sessions:
            raise KeyError(
                f"Session not found: {session_id}"
            )

        del self._sessions[session_id]

    async def append_turn(
        self,
        session_id: str,
        turn: DialogueTurn,
    ) -> InterviewSession:
        state = self._get_state(session_id)

        state.session.turns.append(turn)

        if turn.role == "interviewer":
            state.session.questions_asked += 1

        elif turn.role == "candidate":
            state.session.questions_answered += 1

        state.session.updated_at = datetime.now(
            timezone.utc
        )

        state.touch()

        return state.session

    async def update_knowledge_map(
        self,
        session_id: str,
        updates: dict[str, float],
    ) -> InterviewSession:
        state = self._get_state(session_id)

        for topic, mastery in updates.items():
            if not 0.0 <= mastery <= 1.0:
                raise ValueError(
                    f"Knowledge mastery for '{topic}' "
                    "must be between 0.0 and 1.0."
                )

            state.session.knowledge_map[topic] = mastery

        state.session.updated_at = datetime.now(
            timezone.utc
        )

        state.touch()

        return state.session

    async def set_context_buffer(
        self,
        session_id: str,
        context: str,
    ) -> None:
        state = self._get_state(session_id)

        state.context_buffer = context
        state.touch()

    async def get_context_buffer(
        self,
        session_id: str,
    ) -> str:
        state = self._get_state(session_id)
        state.touch()

        return state.context_buffer

    async def list_session_ids(self) -> list[str]:
        return list(self._sessions.keys())

    def _get_state(
        self,
        session_id: str,
    ) -> SessionState:
        if not session_id:
            raise ValueError(
                "session_id cannot be empty."
            )

        state = self._sessions.get(session_id)

        if state is None:
            raise KeyError(
                f"Session not found: {session_id}"
            )

        return state