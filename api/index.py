from environment import get_env
from routers import coach_router, payments_router
import asyncio
from fastapi import FastAPI
import uvicorn

app = FastAPI()
app.include_router(coach_router.router)
app.include_router(payments_router.router)

port = get_env('PORT')

if __name__ == "__main__":

    loop = asyncio.get_event_loop()
    config = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=int(port) if port else 5328,
        loop=loop,
        timeout_keep_alive=120,
        # ssl_certfile='cert/cert.pem',
        # ssl_keyfile='cert/key.pem',
    )
    server = uvicorn.Server(config)
    loop.run_until_complete(server.serve())
