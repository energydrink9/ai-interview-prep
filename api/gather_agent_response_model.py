from typing import List, Optional
from pydantic import BaseModel


class WorkExperience(BaseModel):
    name: str
    startDate: Optional[str]
    endDate: Optional[str]
    role: str
    description: Optional[str]


class Course(BaseModel):
    name: Optional[str]
    institution: Optional[str]
    startDate: Optional[str]
    endDate: Optional[str]
    type: Optional[str]


class Applicant(BaseModel):
    name: str
    gender: Optional[str]
    nationality: Optional[str]
    bio: Optional[str]
    workExperiences: List[WorkExperience]
    courses: List[Course]
    interests: List[str]


class Company(BaseModel):
    name: str
    mission: Optional[str]
    industry: Optional[str]
    investmentStage: Optional[str]
    size: Optional[str]
    description: Optional[str]
    principles: Optional[str]
    hiringPhilosophy: Optional[str]


class Role(BaseModel):
    title: str
    requirements: List[str]
    niceToHaves: List[str]
    benefits: List[str]
    salary: Optional[str]


class Job(BaseModel):
    company: Company
    role: Role


class GatherResponseModel(BaseModel):
    applicant: Applicant
    job: Job