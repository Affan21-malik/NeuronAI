import asyncio
import json
from pathlib import Path
from typing import Any


class CurriculumLoader:
    """
    Loads and provides access to the NeuronAI interview curriculum.

    The current supplied curriculum is organized around modules and
    31 learning days.
    """

    def __init__(
        self,
        curriculum_path: str | Path = "app/data/curriculum.json",
    ) -> None:
        self.curriculum_path = Path(
            curriculum_path
        )

        self._data: dict[str, Any] | None = None

    async def load(self) -> dict[str, Any]:
        """
        Load curriculum JSON asynchronously.
        """

        if self._data is not None:
            return self._data

        if not self.curriculum_path.exists():
            raise FileNotFoundError(
                f"Curriculum file not found: "
                f"{self.curriculum_path}"
            )

        self._data = await asyncio.to_thread(
            self._read_json
        )

        self._validate_structure()

        return self._data

    async def get_topics(self) -> list[str]:
        """
        Return module titles as the available interview topics.
        """

        data = await self.load()

        return [
            module["title"]
            for module in data.get("modules", [])
            if "title" in module
        ]

    async def get_prerequisites(
        self,
        topic: str,
    ) -> list[str]:
        """
        Return prerequisites for a topic.

        The current supplied curriculum does not define explicit
        prerequisites, so this returns [] unless the field is added.
        """

        data = await self.load()

        module = self._find_module(
            data,
            topic,
        )

        prerequisites = module.get(
            "prerequisites",
            []
        )

        if not isinstance(prerequisites, list):
            raise ValueError(
                f"Invalid prerequisites for topic: {topic}"
            )

        return [
            str(item)
            for item in prerequisites
        ]

    async def get_subtopics(
        self,
        topic: str,
    ) -> list[str]:
        """
        Return the daily lesson titles belonging to a module.
        """

        data = await self.load()

        module = self._find_module(
            data,
            topic,
        )

        module_days = module.get(
            "days",
            []
        )

        day_lookup = {
            day["day"]: day
            for day in data.get("days", [])
            if "day" in day
        }

        subtopics: list[str] = []

        if (
            isinstance(module_days, list)
            and len(module_days) == 2
            and all(
                isinstance(value, int)
                for value in module_days
            )
        ):
            start, end = module_days

            for day_number in range(
                start,
                end + 1,
            ):
                day = day_lookup.get(
                    day_number
                )

                if day and "title" in day:
                    subtopics.append(
                        day["title"]
                    )

        else:
            for item in module_days:
                if isinstance(item, dict):
                    title = item.get("title")

                    if title:
                        subtopics.append(title)

        return subtopics

    async def get_day(
        self,
        day_number: int,
    ) -> dict[str, Any]:
        data = await self.load()

        for day in data.get("days", []):
            if day.get("day") == day_number:
                return day

        raise KeyError(
            f"Curriculum day not found: {day_number}"
        )

    async def get_module(
        self,
        topic: str,
    ) -> dict[str, Any]:
        data = await self.load()

        return self._find_module(
            data,
            topic,
        )

    async def get_cohort(self) -> str:
        data = await self.load()

        return str(
            data.get(
                "cohort",
                "",
            )
        )

    @staticmethod
    def _find_module(
        data: dict[str, Any],
        topic: str,
    ) -> dict[str, Any]:
        for module in data.get(
            "modules",
            [],
        ):
            if module.get("title") == topic:
                return module

        raise KeyError(
            f"Curriculum topic not found: {topic}"
        )

    def _read_json(self) -> dict[str, Any]:
        with self.curriculum_path.open(
            "r",
            encoding="utf-8",
        ) as file:
            return json.load(file)

    def _validate_structure(self) -> None:
        if not isinstance(
            self._data,
            dict,
        ):
            raise ValueError(
                "Curriculum root must be a JSON object."
            )

        if "modules" not in self._data:
            raise ValueError(
                "Curriculum is missing 'modules'."
            )

        if "days" not in self._data:
            raise ValueError(
                "Curriculum is missing 'days'."
            )