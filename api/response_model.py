from enum import Enum
from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel


class ResponseStatusEnum(str, Enum):
    success = 'SUCCESS'
    error = 'ERROR'


E = TypeVar("E", bound=str)
D = TypeVar("D", bound=Any)


class ErrorModel(BaseModel, Generic[E]):
    code: E
    message: str


class ResponseModel(BaseModel, Generic[D, E]):
    status: ResponseStatusEnum
    error: Optional[ErrorModel[E]] = None
    data: Optional[D] = None

    @staticmethod
    def success(data: D):
        return ResponseModel(status=ResponseStatusEnum.success, error=None, data=data)

    @staticmethod
    def fail(error: ErrorModel[E]):
        return ResponseModel(status=ResponseStatusEnum.success, error=error, data=None)
