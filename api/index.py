from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from environment import get_env
import asyncio
from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import JSONResponse
import requests

from pydantic import BaseModel
import uvicorn
import validators

from FetchJobInfoException import FetchJobInfoException
from response_model import ErrorModel
from plan_response import PlanResponse
from planner_agent import run_agents
from lakera_chainguard import LakeraGuardError


app = FastAPI()


class PlanRequest(BaseModel):
    jobUrl: str


AUTH0_DOMAIN = get_env("AUTH0_DOMAIN")
AUTH0_API_AUDIENCE = get_env("AUTH0_API_AUDIENCE")
AUTH0_ALGORITHMS = get_env("AUTH0_ALGORITHMS")

security = HTTPBearer()


# Function to get the JWKS (JSON Web Key Set)
def get_public_key(token: str):
    # Fetch Auth0 JWKS (JSON Web Key Set)
    jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    jwks_client = jwt.PyJWKClient(jwks_url)
    
    return jwks_client.get_signing_key_from_jwt(token)


# Function to verify and decode the token
def verify_jwt(token: str):
    try:
        public_key = get_public_key(token)

        # Decode and verify the token
        payload = jwt.decode(
            token,
            key=public_key,
            algorithms=AUTH0_ALGORITHMS,
            audience=AUTH0_API_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/",
        )

        return payload
        
    except Exception as e:
        print(e)
        raise HTTPException(status_code=401, detail="Error decoding token") from e


# Dependency to enforce token validation
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    jwt = verify_jwt(token)

    def get_user_info():
        userinfo_url = jwt['aud'][1]
        return requests.get(userinfo_url, {'access_token': token}).json()

    return jwt, get_user_info


# user_id = current_user[0]['sub']

@app.post("/plan", response_model=PlanResponse)
async def plan(request: PlanRequest, current_user: dict = Depends(get_current_user)):

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


@app.get("/session/token")
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


if __name__ == "__main__":

    loop = asyncio.get_event_loop()
    config = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=5328,
        loop=loop,
        timeout_keep_alive=120,
        # ssl_certfile='cert/cert.pem',
        # ssl_keyfile='cert/key.pem',
    )
    server = uvicorn.Server(config)
    loop.run_until_complete(server.serve())
