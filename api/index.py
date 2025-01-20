import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import requests
import os
from pydantic import BaseModel
import uvicorn
import validators

from FetchJobInfoException import FetchJobInfoException
from response_model import ErrorModel
from plan_response import PlanResponse
from planner_agent import run_agents

app = FastAPI()


class PlanRequest(BaseModel):
    jobUrl: str


class SessionResponse(BaseModel):
    pass


@app.post("/plan", response_model=PlanResponse)
async def plan(request: PlanRequest):
    jobUrl = request.jobUrl
    if not validators.url(jobUrl):
        error = ErrorModel(code="INVALID_ARGUMENT", message="Invalid URL")
        raise HTTPException(status_code=400, detail=error.model_dump())
    try:
        job, plan = await run_agents(jobUrl)
        return PlanResponse(job=job, plan=plan)
    except FetchJobInfoException as e:
        raise HTTPException(status_code=400, detail=e.error.model_dump())


@app.get("/session/token")
async def session():
    try:
        response = requests.post(
            "https://api.openai.com/v1/realtime/sessions",
            headers={
                "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
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


if __name__ == "__main__":

    loop = asyncio.get_event_loop()
    config = uvicorn.Config(app, host="0.0.0.0", port=5328, loop=loop, timeout_keep_alive=120)
    server = uvicorn.Server(config)
    loop.run_until_complete(server.serve())
