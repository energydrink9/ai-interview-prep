from pydantic import BaseModel
from job_info_model import JobInfoModel
from plan_model import PlanModel


class PlanResponse(BaseModel):
    job: JobInfoModel
    plan: PlanModel
