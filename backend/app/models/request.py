from pydantic import BaseModel, Field


class InterviewRequest(BaseModel):
    session_id: str | None = Field(
        default=None,
        description="Existing interview session ID"
    )

    candidate_id: str = Field(
        ...,
        min_length=1,
        description="Candidate ID from candidates.json"
    )

    user_response: str | None = Field(
        default=None,
        description="Candidate's answer to the previous question"
    )