from typing import List, Literal, Optional
from pydantic import BaseModel


class Company(BaseModel):
    name: str
    mission: Optional[str] = None
    industry: Optional[str] = None
    investmentStage: Optional[str] = None
    size: Optional[str] = None
    description: Optional[str] = None
    principles: List[str]
    hiringPhilosophy: Optional[str] = None


class Role(BaseModel):
    title: str
    requirements: List[str]
    niceToHaves: List[str]
    responsibilities: List[str]
    benefits: List[str]
    salary: Optional[str] = None


class JobInfoModel(BaseModel):
    company: Company
    role: Role


JobInfoErrorCodes = Literal[
    'INVALID_JOB_URL',
    'CONNECTION_ERROR', 'UNKNOWN_ERROR'
]

