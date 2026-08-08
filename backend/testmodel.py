import json

from app.models.candidate import CandidateProfile


with open("app/data/candidates.json", "r") as file:
    data = json.load(file)


for candidate_data in data["candidates"]:
    candidate = CandidateProfile.model_validate(candidate_data)

    print(
        f"{candidate.member.id} | "
        f"{candidate.member.name} | "
        f"{candidate.member.job_role} | "
        f"{candidate.experience_level.value}"
    )


print("\nAll candidate models validated successfully.")