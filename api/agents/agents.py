import asyncio
from typing import Tuple, cast
import traceback

from agents.FetchJobInfoException import FetchJobInfoException
from agents.gather_agent import run_gather_agent
from agents.planner_agent import run_planner_agent
from routers.response_model import ErrorModel, ResponseStatusEnum
from agents.JobInfoModel import JobInfoModel, JobInfoErrorCodes
from model.plan_model import PlanModel

DEBUG = False


async def run_agents(job_url: str) -> Tuple[JobInfoModel, PlanModel]:
    try:
        job_info_response = await run_gather_agent(job_url, debug=DEBUG)

        if job_info_response.status == ResponseStatusEnum.error:
            raise FetchJobInfoException(
                cast(ErrorModel[JobInfoErrorCodes], job_info_response.error)
            )
        
        job = cast(JobInfoModel, job_info_response.data)
        plan_response = run_planner_agent(job, debug=DEBUG)

        if plan_response.status == ResponseStatusEnum.error:
            raise Exception(plan_response.error)
        
        plan = cast(PlanModel, plan_response.data)

        return job, plan

    except Exception as e:
        print(f'An error occurred while running the planner agent {e}')
        print(traceback.format_exc())
        raise e


if __name__ == '__main__':
    event_loop = asyncio.get_event_loop()
    plan = event_loop.run_until_complete(run_agents(
        'https://www.linkedin.com/jobs/view/4126005813',
    ))
    print(plan)

