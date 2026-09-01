import os


ACTIVE_PERSONA = os.getenv(
    "ACTIVE_PERSONA",
    "jarvis",
).strip().lower()


SUPPORTED_PERSONAS = {
    "jarvis",
    "friday",
    "ultron",
}


def get_active_persona() -> str:
    persona = ACTIVE_PERSONA

    if persona not in SUPPORTED_PERSONAS:
        raise ValueError(
            f"Unsupported persona: {persona}. "
            f"Supported personas: {sorted(SUPPORTED_PERSONAS)}"
        )

    return persona