from pydantic import BaseModel
from agents.JobInfoModel import JobInfoModel
from model.plan_model import PlanModel


class PlanResponse(BaseModel):
    job: JobInfoModel
    plan: PlanModel
