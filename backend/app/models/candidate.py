from enum import Enum

from pydantic import BaseModel, Field


class ExperienceLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class CandidateMember(BaseModel):
    id: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    job_role: str = Field(..., alias="jobRole")
    years_experience: float = Field(..., alias="yearsExperience", ge=0)
    education: str
    status: str


class Mission(BaseModel):
    day: int = Field(..., ge=1)
    title: str = Field(..., min_length=1)

    passed: bool | None = None
    skipped: bool | None = None

    attempts: int | None = Field(
        default=None,
        ge=1,
    )


class CandidateSignals(BaseModel):
    commit_days: int = Field(
        ...,
        alias="commitDays",
        ge=0,
    )

    missions_completed: int = Field(
        ...,
        alias="missionsCompleted",
        ge=0,
    )

    missions_first_try: int = Field(
        ...,
        alias="missionsFirstTry",
        ge=0,
    )


class CandidateProfile(BaseModel):
    member: CandidateMember
    missions: list[Mission] = Field(default_factory=list)
    signals: CandidateSignals

    model_config = {
        "populate_by_name": True,
    }

    @property
    def experience_level(self) -> ExperienceLevel:
        """
        Derive experience level from years of professional experience.

        This is derived application logic because the supplied candidate
        JSON does not contain an explicit experienceLevel field.
        """
        years = self.member.years_experience

        if years < 2:
            return ExperienceLevel.BEGINNER

        if years < 7:
            return ExperienceLevel.INTERMEDIATE

        return ExperienceLevel.ADVANCED