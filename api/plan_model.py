from typing import List, Literal
from pydantic import BaseModel


class InterviewPreparationSession(BaseModel):
    objective: str
    note: str
    durationInMinutes: int


class SkillCategory(BaseModel):
    name: str
    skills: List[str]


PlanErrorCodes = Literal['UNKNOWN_ERROR']


class PlanModel(BaseModel):
    overview: str
    requiredSkillCategories: List[SkillCategory]
    sessions: List[InterviewPreparationSession]
