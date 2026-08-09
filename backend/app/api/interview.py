from fastapi import APIRouter, HTTPException

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
) -> InterviewResponse:
    """
    Start or continue a technical interview.
    """

    try:
        return await engine.process_turn(request)

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