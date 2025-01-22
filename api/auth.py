
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
import requests

from environment import get_env


AUTH0_DOMAIN = get_env("AUTH0_DOMAIN")
AUTH0_API_AUDIENCE = get_env("AUTH0_API_AUDIENCE")
AUTH0_ALGORITHMS = get_env("AUTH0_ALGORITHMS")

security = HTTPBearer()


def get_user_id(user_info) -> str:
    return user_info['sub']


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
