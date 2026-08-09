import os
import jwt
from fastapi import Header, HTTPException


def get_current_user_id(
    authorization: str | None = Header(default=None),
) -> str | None:
    """
    Extract and decode the authenticated Supabase user ID from Authorization Bearer JWT.
    Returns user_id string (UUID) if valid, or None if unauthenticated.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None

    token = authorization.split("Bearer ", 1)[1].strip()
    if not token:
        return None

    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        user_id = payload.get("sub")
        return user_id
    except Exception as exc:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authorization token: {exc}",
        ) from exc
