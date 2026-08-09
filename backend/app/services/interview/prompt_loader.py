from __future__ import annotations

from pathlib import Path


class PromptLoader:
    """
    Centralized loader for NeuronAI agent prompts.

    Prompt files are stored under:

        app/prompts/
            Planner.md
            Evaluator.md
            Interviewer.md
            Feedback.md
            personas/
                Jarvis.md

    The service layer should not contain hardcoded agent prompts.
    """

    def __init__(
        self,
        prompts_dir: Path | None = None,
    ) -> None:
        if prompts_dir is None:
            self.prompts_dir = (
                Path(__file__).resolve().parents[2]
                / "prompts"
            )
        else:
            self.prompts_dir = Path(prompts_dir)

    # =========================================================
    # Internal file loader
    # =========================================================

    def _load(self, relative_path: str) -> str:
        """
        Load a prompt file relative to app/prompts.
        """

        path = self.prompts_dir / relative_path

        if not path.exists():
            raise FileNotFoundError(
                f"Prompt file not found: {path}"
            )

        if not path.is_file():
            raise ValueError(
                f"Prompt path is not a file: {path}"
            )

        content = path.read_text(
            encoding="utf-8"
        ).strip()

        if not content:
            raise ValueError(
                f"Prompt file is empty: {path}"
            )

        return content

    # =========================================================
    # Safe template formatter
    # =========================================================

    @staticmethod
    def _format(
        template: str,
        variables: dict[str, object],
    ) -> str:
        """
        Safely inject runtime variables into a prompt.

        Only explicitly supplied {variable} placeholders are replaced.

        This intentionally does NOT use str.format(), because agent
        prompts commonly contain JSON examples such as:
    z
            {
                "technical_accuracy": 0.85,
                "recommended_action": "follow_up"
            }

        Those braces must remain untouched.
        """

        formatted = template

        for key, value in variables.items():
            placeholder = "{" + key + "}"

            formatted = formatted.replace(
                placeholder,
                str(value),
            )

        return formatted
        # =========================================================
        # Planner
        # =========================================================

    def get_planner_prompt(
        self,
        **variables: object,
    ) -> str:
        """
        Load and format the Planner Agent prompt.
        """

        template = self._load(
            "Planner.md"
        )

        return self._format(
            template,
            variables,
        )

    # =========================================================
    # Evaluator
    # =========================================================

    def get_evaluator_prompt(
        self,
        **variables: object,
    ) -> str:
        """
        Load and format the Evaluator Agent prompt.
        """

        template = self._load(
            "Evaluator.md"
        )

        return self._format(
            template,
            variables,
        )

    # =========================================================
    # Interviewer / Persona
    # =========================================================

    def get_interviewer_prompt(
        self,
        persona: str = "jarvis",
        **variables: object,
    ) -> str:
        """
        Load the Interviewer Agent prompt and combine it
        with the selected persona.

        Current active persona:

            jarvis

        Future personas can be added simply by creating:

            app/prompts/personas/Friday.md
            app/prompts/personas/Ultron.md

        and registering them in PERSONA_FILES.
        """

        persona_files = {
            "jarvis": "Jarvis.md",
            
        }

        persona_key = persona.strip().lower()

        if persona_key not in persona_files:
            raise ValueError(
                f"Unsupported persona: {persona}. "
                f"Available personas: "
                f"{', '.join(persona_files)}"
            )

        interviewer_prompt = self._load(
            "Interviewer.md"
        )

        persona_prompt = self._load(
            f"personas/{persona_files[persona_key]}"
        )

        combined_prompt = (
            f"{persona_prompt}\n\n"
            f"{interviewer_prompt}"
        )

        return self._format(
            combined_prompt,
            variables,
        )

    # =========================================================
    # Feedback
    # =========================================================

    def get_feedback_prompt(
        self,
        **variables: object,
    ) -> str:
        """
        Load and format the Feedback Agent prompt.
        """

        template = self._load(
            "Feedback.md"
        )

        return self._format(
            template,
            variables,
        )