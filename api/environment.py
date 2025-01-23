import os
from dotenv import load_dotenv

load_dotenv('dev.env')


def get_env(key: str) -> str:
    if key not in os.environ:
        raise KeyError(f"Key {key} not found in environment")
    
    return os.environ.get(key)
