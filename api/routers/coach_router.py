from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import requests
import validators

from agents.FetchJobInfoException import FetchJobInfoException
from auth import get_current_user
from environment import get_env
from routers.response_model import ErrorModel
from routers.plan_response import PlanResponse
from agents.planner_agent import run_agents
from lakera_chainguard import LakeraGuardError
from fastapi.responses import JSONResponse

router = APIRouter()


class PlanRequest(BaseModel):
    jobUrl: str


@router.post("/plan", response_model=PlanResponse)
async def plan(request: PlanRequest):

    jobUrl = request.jobUrl
    
    try:
        if not validators.url(jobUrl):
            error = ErrorModel(code="INVALID_ARGUMENT", message="Invalid URL")
            raise HTTPException(status_code=400, detail=error.model_dump())
        try:
            job, plan = await run_agents(jobUrl)
            return PlanResponse(job=job, plan=plan)
        except FetchJobInfoException as e:
            raise HTTPException(status_code=400, detail=e.error.model_dump())

    except LakeraGuardError as e:
        print('Detected prompt injection. Prompt:', jobUrl, 'Error:', e.lakera_guard_response)
        error = ErrorModel(code="SECURITY_ERROR", message="Prompt is not valid")
        raise HTTPException(status_code=403, detail=error.model_dump())


@router.get("/session/token")
async def openai_session(current_user: dict = Depends(get_current_user)):
    try:
        response = requests.post(
            "https://api.openai.com/v1/realtime/sessions",
            headers={
                "Authorization": f"Bearer {get_env('OPENAI_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o-realtime-preview-2024-12-17",
                "voice": "verse"
            }
        )
        
        return JSONResponse(content=response.json())
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

