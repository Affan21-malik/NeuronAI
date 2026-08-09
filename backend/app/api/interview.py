from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user_id
from app.models.request import InterviewRequest
from app.models.response import InterviewResponse
from app.services.interview.engine import InterviewEngine


router = APIRouter(
    prefix="/interview",
    tags=["Interview"],
)

engine = InterviewEngine()


@router.post(
    "",
    response_model=InterviewResponse,
)
async def process_interview(
    request: InterviewRequest,
    user_id: str | None = Depends(get_current_user_id),
) -> InterviewResponse:
    """
    Start or continue a technical interview.
    """

    try:
        return await engine.process_turn(request, user_id=user_id)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc