from __future__ import annotations

import json
from uuid import uuid4

from app.models.candidate import ExperienceLevel
from app.models.request import InterviewRequest
from app.models.response import (
    EvaluationDetail,
    InterviewResponse,
)
from app.models.session import (
    DialogueTurn,
    InterviewSession,
)

from app.services.curriculum.loader import CurriculumLoader
from app.services.interview.difficulty import DifficultyManager
from app.services.interview.evaluator import (
    AnswerEvaluator,
    EvaluationResult,
)
from app.services.interview.followup import (
    FollowupAction,
    FollowupEngine,
)
from app.services.interview.planner import InterviewPlanner
from app.services.interview.prompt_loader import PromptLoader
from app.services.interview.question_generator import (
    QuestionGenerator,
)
from app.services.knowledge.mapper import KnowledgeMapper
from app.services.llm.gemini import GeminiLLMProvider
from app.services.memory.manager import MemoryManager
from app.services.reports.generator import (
    FeedbackReport,
    ReportGenerator,
)


class InterviewEngine:
    """
    Central orchestration layer for NeuronAI.

    Multi-agent flow:

        Candidate
            |
            v
        Planner
            |
            v
        Interview Plan
            |
            v
        JARVIS Interviewer
            |
            v
        Candidate Answer
            |
            v
        Evaluator
            |
            +------------------+
            |                  |
            v                  v
        Follow-up           New Topic
            |                  |
            +--------+---------+
                     |
                     v
                  JARVIS
                     |
                    ...
                     |
                     v
                Completion
                     |
                     v
                 Feedback
                     |
                     v
               Final Report

    The engine owns orchestration and state.
    Individual agents do not control each other.
    """

    def __init__(
        self,
        memory_manager: MemoryManager | None = None,
        evaluator: AnswerEvaluator | None = None,
        knowledge_mapper: KnowledgeMapper | None = None,
        difficulty_manager: DifficultyManager | None = None,
        followup_engine: FollowupEngine | None = None,
        planner: InterviewPlanner | None = None,
        question_generator: QuestionGenerator | None = None,
        report_generator: ReportGenerator | None = None,
        experience_level: ExperienceLevel = (
            ExperienceLevel.INTERMEDIATE
        ),
    ) -> None:

        # ---------------------------------------------------------
        # Shared infrastructure
        # ---------------------------------------------------------

        self.llm_provider = GeminiLLMProvider()

        self.prompt_loader = PromptLoader()

        self.curriculum_loader = CurriculumLoader()

        # ---------------------------------------------------------
        # Memory
        # ---------------------------------------------------------

        self.memory = (
            memory_manager
            or MemoryManager()
        )

        # ---------------------------------------------------------
        # Evaluator Agent
        # ---------------------------------------------------------

        self.evaluator = (
            evaluator
            or AnswerEvaluator(
                llm_provider=self.llm_provider,
                prompt_loader=self.prompt_loader,
            )
        )

        # ---------------------------------------------------------
        # Knowledge Mapper
        # ---------------------------------------------------------

        self.knowledge_mapper = (
            knowledge_mapper
            or KnowledgeMapper()
        )

        # ---------------------------------------------------------
        # Difficulty
        # ---------------------------------------------------------

        self.difficulty_manager = (
            difficulty_manager
            or DifficultyManager()
        )

        # ---------------------------------------------------------
        # Follow-up decision engine
        # ---------------------------------------------------------

        self.followup_engine = (
            followup_engine
            or FollowupEngine()
        )

        # ---------------------------------------------------------
        # Planner Agent
        # ---------------------------------------------------------

        self.planner = (
            planner
            or InterviewPlanner(
                curriculum_loader=self.curriculum_loader,
                llm_provider=self.llm_provider,
                prompt_loader=self.prompt_loader,
            )
        )

        # ---------------------------------------------------------
        # JARVIS Interviewer Agent
        # ---------------------------------------------------------

        self.question_generator = (
            question_generator
            or QuestionGenerator(
                llm_provider=self.llm_provider,
                prompt_loader=self.prompt_loader,
            )
        )

        # ---------------------------------------------------------
        # Feedback Agent
        # ---------------------------------------------------------

        self.report_generator = (
            report_generator
            or ReportGenerator(
                llm_provider=self.llm_provider,
                prompt_loader=self.prompt_loader,
            )
        )

        # ---------------------------------------------------------
        # Candidate configuration
        # ---------------------------------------------------------

        self.experience_level = experience_level

        # ---------------------------------------------------------
        # Runtime agent state
        #
        # The current architecture keeps the active plan and
        # latest evaluator output in memory at engine level.
        #
        # Persistent session state remains owned by MemoryManager.
        # ---------------------------------------------------------

        self._plans: dict[str, object] = {}

        self._latest_evaluations: dict[
            str,
            EvaluationResult,
        ] = {}

        self._latest_reports: dict[
            str,
            FeedbackReport,
        ] = {}

    # =============================================================
    # PUBLIC ENTRY POINT
    # =============================================================

    async def process_turn(
        self,
        request: InterviewRequest,
    ) -> InterviewResponse:

        if request.session_id is None:
            return await self._start_interview(
                request
            )

        return await self._continue_interview(
            request
        )

    # =============================================================
    # INITIAL INTERVIEW
    # =============================================================

    async def _start_interview(
        self,
        request: InterviewRequest,
    ) -> InterviewResponse:

        # ---------------------------------------------------------
        # 1. Create session
        # ---------------------------------------------------------

        session = InterviewSession(
            session_id=str(uuid4()),
            candidate_id=request.candidate_id,
            difficulty="medium",
            max_questions=10,
        )

        await self.memory.create_session(
            session
        )

        # ---------------------------------------------------------
        # 2. Build Planner context
        #
        # CandidateAnalyzer remains the source of candidate data
        # in the broader architecture. The engine deliberately
        # does not duplicate candidate parsing logic.
        # ---------------------------------------------------------

        candidate_json = json.dumps(
            {
                "candidate_id": request.candidate_id,
                "experience_level": (
                    self.experience_level.value
                    if hasattr(
                        self.experience_level,
                        "value",
                    )
                    else str(
                        self.experience_level
                    )
                ),
            }
        )

        # ---------------------------------------------------------
        # 3. Run Planner Agent
        #
        # Planner failure must not destroy the deterministic
        # Phase 5 curriculum fallback.
        # ---------------------------------------------------------

        plan = None

        try:
            plan = await self.planner.build_plan(
                candidate_json
            )

            self._plans[
                session.session_id
            ] = plan

        except Exception:
            # Deterministic curriculum selection remains the
            # safety fallback for local/mock operation.
            plan = None

        # ---------------------------------------------------------
        # 4. Select first topic
        # ---------------------------------------------------------

        topic = await self.planner.select_next_topic(
            knowledge_map=session.knowledge_map,
            completed_topics=set(),
        )

        # ---------------------------------------------------------
        # 5. If Planner generated a plan, prefer its first topic
        # ---------------------------------------------------------

        if plan is not None:

            selected_topics = getattr(
                plan,
                "selected_topics",
                [],
            )

            if selected_topics:

                first = selected_topics[0]

                planned_topic = getattr(
                    first,
                    "topic",
                    None,
                )

                if planned_topic:
                    curriculum_topics = set(
                        await self.curriculum_loader
                        .get_topics()
                    )

                    if planned_topic in curriculum_topics:
                        topic = planned_topic

        # ---------------------------------------------------------
        # 6. Select subtopic
        # ---------------------------------------------------------

        subtopic = (
            await self.planner
            .select_next_subtopic(
                topic=topic,
                knowledge_map=session.knowledge_map,
            )
        )

        # ---------------------------------------------------------
        # 7. Recover curriculum context
        # ---------------------------------------------------------

        context = (
            await self.planner
            .get_topic_context(topic)
        )

        # ---------------------------------------------------------
        # 8. Generate JARVIS question
        # ---------------------------------------------------------

        planner_output = self._serialize_agent_output(
            plan
        )

        interview_state = (
            self._serialize_session_state(
                session
            )
        )

        question = (
            await self.question_generator.generate(
                topic=topic,
                difficulty=session.difficulty,
                context=str(context),
                followup=False,
                previous_question=None,
                previous_answer=None,
                subtopic=subtopic,
                planner_output=planner_output,
                evaluator_output="",
                conversation_history="",
                interview_state=interview_state,
            )
        )

        # ---------------------------------------------------------
        # 9. Update session
        # ---------------------------------------------------------

        session.current_topic = topic
        session.current_subtopic = subtopic

        await self.memory.append_turn(
            session.session_id,
            DialogueTurn(
                role="interviewer",
                content=question,
                topic=topic,
                subtopic=subtopic,
                difficulty=session.difficulty,
            ),
        )

        session = await self.memory.get_session(
            session.session_id
        )

        # ---------------------------------------------------------
        # 10. Return API response
        # ---------------------------------------------------------

        return InterviewResponse(
            session_id=session.session_id,
            next_question=question,
            current_topic=topic,
            difficulty=session.difficulty,
            evaluation=None,
            knowledge_map=session.knowledge_map,
            confidence_score=session.confidence_score,
            is_complete=session.is_complete,
        )

    # =============================================================
    # CONTINUE INTERVIEW
    # =============================================================

    async def _continue_interview(
        self,
        request: InterviewRequest,
    ) -> InterviewResponse:

        # ---------------------------------------------------------
        # 1. Recover session
        # ---------------------------------------------------------

        try:
            session = await self.memory.get_session(
                request.session_id
            )

        except (KeyError, ValueError) as exc:

            raise ValueError(
                f"Invalid interview session: "
                f"{request.session_id}"
            ) from exc

        # ---------------------------------------------------------
        # 2. Validate candidate
        # ---------------------------------------------------------

        if (
            session.candidate_id
            != request.candidate_id
        ):
            raise ValueError(
                "candidate_id does not match the session."
            )

        # ---------------------------------------------------------
        # 3. Already complete
        # ---------------------------------------------------------

        if session.is_complete:

            return InterviewResponse(
                session_id=session.session_id,
                next_question="Interview complete.",
                current_topic=(
                    session.current_topic
                    or ""
                ),
                difficulty=session.difficulty,
                evaluation=None,
                knowledge_map=session.knowledge_map,
                confidence_score=(
                    session.confidence_score
                ),
                is_complete=True,
            )

        # ---------------------------------------------------------
        # 4. Validate candidate response
        # ---------------------------------------------------------

        if request.user_response is None:

            raise ValueError(
                "user_response is required "
                "for an existing session."
            )

        if not request.user_response.strip():

            raise ValueError(
                "user_response cannot be empty."
            )

        # ---------------------------------------------------------
        # 5. Recover previous question
        # ---------------------------------------------------------

        previous_question = (
            self._get_previous_question(
                session
            )
        )

        current_topic = session.current_topic

        if not current_topic:

            raise ValueError(
                "Session has no current topic."
            )

        current_subtopic = (
            session.current_subtopic
        )

        # ---------------------------------------------------------
        # 6. Store candidate answer
        # ---------------------------------------------------------

        await self.memory.append_turn(
            session.session_id,
            DialogueTurn(
                role="candidate",
                content=request.user_response,
                topic=current_topic,
                subtopic=current_subtopic,
                difficulty=session.difficulty,
            ),
        )

        # ---------------------------------------------------------
        # 7. Build conversation history
        # ---------------------------------------------------------

        conversation_history = (
            self._build_conversation_history(
                session
            )
        )

        # ---------------------------------------------------------
        # 8. Recover Planner state
        # ---------------------------------------------------------

        plan = self._plans.get(
            session.session_id
        )

        planner_output = (
            self._serialize_agent_output(
                plan
            )
        )

        # ---------------------------------------------------------
        # 9. Evaluator Agent
        # ---------------------------------------------------------

        evaluation = (
            await self.evaluator.evaluate(
                question=previous_question,
                user_response=request.user_response,
                topic=current_topic,
                difficulty=session.difficulty,
                context=conversation_history,
            )
        )

        self._latest_evaluations[
            session.session_id
        ] = evaluation

        # ---------------------------------------------------------
        # 10. Knowledge update
        # ---------------------------------------------------------

        session = await self.memory.get_session(
            session.session_id
        )

        self.knowledge_mapper.update(
            session.knowledge_map,
            current_topic,
            evaluation,
        )

        # ---------------------------------------------------------
        # 11. Confidence update
        # ---------------------------------------------------------

        session.confidence_score = (
            self._calculate_confidence(
                evaluation
            )
        )

        # ---------------------------------------------------------
        # 12. Difficulty update
        # ---------------------------------------------------------

        evaluations = (
            self._get_evaluations_from_history(
                session,
                evaluation,
            )
        )

        session.difficulty = (
            self.difficulty_manager
            .calculate_transition(
                evaluations=evaluations,
                current_difficulty=(
                    session.difficulty
                ),
                experience_level=(
                    self.experience_level
                ),
            )
        )

        # ---------------------------------------------------------
        # 13. Completion check
        # ---------------------------------------------------------

        if (
            session.questions_answered
            >= session.max_questions
        ):

            return await self._complete_interview(
                session=session,
                evaluation=evaluation,
                planner_output=planner_output,
            )

        # ---------------------------------------------------------
        # 14. Determine follow-up
        # ---------------------------------------------------------

        followup_attempts = (
            self._current_topic_question_count(
                session,
                current_topic,
            )
        )

        decision = (
            self.followup_engine.decide(
                evaluation=evaluation,
                followup_attempts=(
                    followup_attempts
                ),
            )
        )

        is_followup = (
            decision.action
            == FollowupAction.INTELLIGENT_FOLLOWUP
        )

        # ---------------------------------------------------------
        # 15. Select next topic
        # ---------------------------------------------------------

        if is_followup:

            next_topic = current_topic
            next_subtopic = current_subtopic

        else:

            completed_topics = (
                self._get_completed_topics(
                    session,
                    current_topic,
                )
            )

            next_topic = (
                await self.planner
                .select_next_topic(
                    knowledge_map=(
                        session.knowledge_map
                    ),
                    completed_topics=(
                        completed_topics
                    ),
                )
            )

            next_subtopic = (
                await self.planner
                .select_next_subtopic(
                    topic=next_topic,
                    knowledge_map=(
                        session.knowledge_map
                    ),
                )
            )

        # ---------------------------------------------------------
        # 16. Get topic context
        # ---------------------------------------------------------

        context = (
            await self.planner
            .get_topic_context(
                next_topic
            )
        )

        # ---------------------------------------------------------
        # 17. JARVIS gets evaluator evidence
        # ---------------------------------------------------------

        evaluator_output = (
            self._serialize_agent_output(
                evaluation
            )
        )

        interview_state = (
            self._serialize_session_state(
                session
            )
        )

        # ---------------------------------------------------------
        # 18. Generate next JARVIS question
        # ---------------------------------------------------------

        next_question = (
            await self.question_generator.generate(
                topic=next_topic,
                difficulty=session.difficulty,
                context=str(context),
                followup=is_followup,
                previous_question=(
                    previous_question
                ),
                previous_answer=(
                    request.user_response
                ),
                subtopic=next_subtopic,
                planner_output=(
                    planner_output
                ),
                evaluator_output=(
                    evaluator_output
                ),
                conversation_history=(
                    conversation_history
                ),
                interview_state=(
                    interview_state
                ),
            )
        )

        # ---------------------------------------------------------
        # 19. Update session
        # ---------------------------------------------------------

        session.current_topic = next_topic
        session.current_subtopic = (
            next_subtopic
        )

        await self.memory.append_turn(
            session.session_id,
            DialogueTurn(
                role="interviewer",
                content=next_question,
                topic=next_topic,
                subtopic=next_subtopic,
                difficulty=session.difficulty,
            ),
        )

        session = await self.memory.get_session(
            session.session_id
        )

        await self.memory.save_session(
            session
        )

        # ---------------------------------------------------------
        # 20. Return response
        # ---------------------------------------------------------

        return InterviewResponse(
            session_id=session.session_id,
            next_question=next_question,
            current_topic=next_topic,
            difficulty=session.difficulty,
            evaluation=(
                self._to_response_evaluation(
                    evaluation
                )
            ),
            knowledge_map=session.knowledge_map,
            confidence_score=(
                session.confidence_score
            ),
            is_complete=session.is_complete,
        )

    # =============================================================
    # COMPLETION
    # =============================================================

    async def _complete_interview(
        self,
        session: InterviewSession,
        evaluation: EvaluationResult,
        planner_output: str,
    ) -> InterviewResponse:

        session.is_complete = True

        await self.memory.save_session(
            session
        )

        conversation_history = (
            self._build_conversation_history(
                session
            )
        )

        evaluator_output = (
            self._serialize_agent_output(
                evaluation
            )
        )

        interview_state = (
            self._serialize_session_state(
                session
            )
        )

        # ---------------------------------------------------------
        # Feedback Agent
        # ---------------------------------------------------------

        try:

            report = (
                await self.report_generator
                .generate(
                    conversation_history=(
                        conversation_history
                    ),
                    evaluator_output=(
                        evaluator_output
                    ),
                    planner_output=(
                        planner_output
                    ),
                    interview_state=(
                        interview_state
                    ),
                )
            )

            self._latest_reports[
                session.session_id
            ] = report

        except Exception:
            # The interview itself must remain successfully
            # completed even if final reporting fails.
            report = None

        # ---------------------------------------------------------
        # Final response
        # ---------------------------------------------------------

        return InterviewResponse(
            session_id=session.session_id,
            next_question="Interview complete.",
            current_topic=(
                session.current_topic
                or ""
            ),
            difficulty=session.difficulty,
            evaluation=(
                self._to_response_evaluation(
                    evaluation
                )
            ),
            knowledge_map=session.knowledge_map,
            confidence_score=(
                session.confidence_score
            ),
            is_complete=True,
        )

    # =============================================================
    # HELPERS
    # =============================================================

    @staticmethod
    def _get_previous_question(
        session: InterviewSession,
    ) -> str:

        for turn in reversed(
            session.turns
        ):

            if turn.role == "interviewer":
                return turn.content

        raise ValueError(
            "No previous interviewer question found."
        )

    @staticmethod
    def _calculate_confidence(
        evaluation: EvaluationResult,
    ) -> float:

        return max(
            0.0,
            min(
                1.0,
                evaluation.score / 100.0,
            ),
        )

    @staticmethod
    def _to_response_evaluation(
        evaluation: EvaluationResult,
    ) -> EvaluationDetail:

        return EvaluationDetail(
            score=evaluation.score,
            correctness=evaluation.score,
            depth=min(
                100.0,
                evaluation.depth * 10.0,
            ),
            clarity=min(
                100.0,
                evaluation.clarity * 10.0,
            ),
            strengths=(
                evaluation.strengths
            ),
            weaknesses=(
                evaluation.misconceptions
            ),
            feedback=(
                evaluation.reason
            ),
        )

    @staticmethod
    def _get_evaluations_from_history(
        session: InterviewSession,
        current: EvaluationResult,
    ) -> list[EvaluationResult]:

        # Evaluation history is currently reconstructed
        # from the engine's latest evaluation state.
        #
        # Persistent evaluation history can later be added
        # directly to InterviewSession.

        return [current]

    @staticmethod
    def _current_topic_question_count(
        session: InterviewSession,
        topic: str,
    ) -> int:

        count = 0

        for turn in reversed(
            session.turns
        ):

            if turn.role != "interviewer":
                continue

            if turn.topic != topic:
                break

            count += 1

        return max(
            0,
            count - 1,
        )

    @staticmethod
    def _get_completed_topics(
        session: InterviewSession,
        current_topic: str,
    ) -> set[str]:

        topics: set[str] = set()

        for turn in session.turns:

            if (
                turn.role == "interviewer"
                and turn.topic
                and turn.topic != current_topic
            ):
                topics.add(turn.topic)

        return topics

    @staticmethod
    def _build_conversation_history(
        session: InterviewSession,
    ) -> str:

        if not session.turns:
            return ""

        lines: list[str] = []

        for turn in session.turns:

            role = (
                "Interviewer"
                if turn.role == "interviewer"
                else "Candidate"
            )

            lines.append(
                f"{role}: {turn.content}"
            )

        return "\n".join(lines)

    @staticmethod
    def _serialize_agent_output(
        value: object | None,
    ) -> str:

        if value is None:
            return ""

        if hasattr(
            value,
            "model_dump",
        ):

            try:

                return json.dumps(
                    value.model_dump(),
                    default=str,
                )

            except Exception:
                pass

        if isinstance(
            value,
            dict,
        ):

            return json.dumps(
                value,
                default=str,
            )

        return str(value)

    @staticmethod
    def _serialize_session_state(
        session: InterviewSession,
    ) -> str:

        state = {
            "session_id": session.session_id,
            "candidate_id": session.candidate_id,
            "current_topic": (
                session.current_topic
            ),
            "current_subtopic": (
                session.current_subtopic
            ),
            "difficulty": session.difficulty,
            "knowledge_map": (
                session.knowledge_map
            ),
            "confidence_score": (
                session.confidence_score
            ),
            "is_complete": (
                session.is_complete
            ),
            "max_questions": (
                session.max_questions
            ),
        }

        return json.dumps(
            state,
            default=str,
        )