# Import relevant functionality
import asyncio
from typing import Any, List, Tuple, cast
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import BaseTool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from langchain_community.agent_toolkits import PlayWrightBrowserToolkit
from langchain_community.tools.playwright import NavigateTool, ExtractTextTool
from langchain_community.tools.playwright.utils import create_async_playwright_browser
import traceback

from FetchJobInfoException import FetchJobInfoException
from response_model import ErrorModel, ResponseModel, ResponseStatusEnum
from job_info_model import JobInfoModel, JobInfoErrorCodes
from plan_model import PlanModel, PlanErrorCodes

ALLOW_DANGEROUS_REQUEST = True
DEBUG = True

browser = create_async_playwright_browser()
browser_toolkit = PlayWrightBrowserToolkit.from_browser(async_browser=browser)
browser_tools = [tool for tool in browser_toolkit.get_tools()] # if isinstance(tool, NavigateTool) or isinstance(tool, ExtractTextTool)]

search = TavilySearchResults(max_results=10)
gather_tools: List[BaseTool] = [*browser_tools, search]
planner_tools: List[BaseTool] = [search]

# Create the agent
gather_memory = MemorySaver()
gather_model = ChatOpenAI(model="gpt-4o-mini")
planner_memory = MemorySaver()
planner_model = ChatOpenAI(model="gpt-4o-mini")


class JobInfoStructuredResponse(ResponseModel[JobInfoModel, JobInfoErrorCodes]):
    pass


class PlanStructuredResponse(ResponseModel[PlanModel, PlanErrorCodes]):
    pass


gather_agent = create_react_agent(
    gather_model,
    gather_tools,
    checkpointer=gather_memory,
    response_format=JobInfoStructuredResponse,
    debug=DEBUG,
)
planner_agent = create_react_agent(planner_model, planner_tools, checkpointer=planner_memory, response_format=PlanStructuredResponse)


# - create a cover letter for the candidates that matches the job description
# and the candidate's career history, interests and aspirations.
# You will:
# - Create a document for the candidate to use as a draft to write a cover
# letter to apply for the job

GATHER_AGENT_PROMPT = '''
You are tasked with gathering information about a job vacancy. The user will
provide you with the link to the job posting. When you receive such a
message you will:
- fetch the webpage at the link provided, looking for information about the
job. This information is expected to be on this page, not on other pages. You
may have to click a button like 'Show more' to see all the information, but
you should not need to open a completely different page.
Gather the job posting and all the information about the job: Company name,
size, investment stage, industry, mission, description, principles, job
responsibilities, job requirements, nice to haves, benefits, salary. If the
page contains multiple jobs (for example if the page is a list of open
positions with one main, selected, position), consider only the main job
posting. If some information is not present, it's not a problem: do not
include it in the response.
- If the information about the job has been retrieved successfully, search the
web for additional information about the company, like its tenets / principles
and its hiring philosophy. If the information cannot be found, do not include
it in the response.
- Reply with the information in JSON format. Example:
{
    status: 'SUCCESS',
    data: {
        company: {
            name: 'ACME',
            mission: '...'
            industry: '',
            investmentStage: '',
            size: '',
            description: '',
            principles: [],
            hiringPhilosophy: ''
        },
        role: {
            title: 'Software Engineer',
            responsibilities: ['Responsibility 1', 'Responsibility 2'],
            requirements: [
                'Bachelor degree in Computer Science',
                '3 years of experience with React'
            ],
            niceToHaves: [
                'Python knowledge',
            ],
            benefits: [
                'RSUs',
                'Health insurance'
            ],
            salary: '100k/year'
        }
    }
}

In case of error reply with a message in the format:
{
    status: 'ERROR',
    error: {
        message: 'Explain error with great detail',
        code: 'ERROR_CODE'
    }
}

Valid error codes are: INVALID_JOB_URL, CONNECTION_ERROR, UNKNOWN_ERROR.

Only reply with valid raw JSON (no Markdown). Do not reply with any other
information.
'''

PLANNER_AGENT_PROMPT = '''
You are a job interview preparation planner. Your job is to prepare a thorough
plan for candidates to get to their interviews prepared and confident.

The user will provide you with all the information related the vacancy in JSON
format. When you receive such a message you will:
- Create a breakdown of the skills that the candidate needs to know/rehearse
- Define a plan comprised of several ordered preparation sessions and their 
required time. You will attach detailed notes to each of these sessions so
that the coach responsible for the interview preparation will have all the
necessary details to carry out their job.

Only reply with valid raw JSON (no Markdown). Do not reply with any other
information. The expected response format for the plan is:

{
    status: 'SUCCESS',
    data: {
        overview: 'Plan overview',
        requiredSkillCategories: [
            {
                name: 'Skill category name',
                skills: [
                    'Skill 1',
                    'Skill 2'
                ]
            }
        ],
        sessions: [
            {
                'objective': 'Session objective',
                'note': 'Note for the interview coach',
                'durationInMinutes': 30,
            }
        ]
    }
}


In case of error reply with a message in the format:
{
    status: 'ERROR',
    error: {
        message: '...',
        code: 'UNKNOWN_ERROR'
    }
}

Valid error codes are: INVALID_ARGUMENT,
CONNECTION_ERROR, UNKNOWN_ERROR.
'''


async def run_gather_agent(job_url: str) -> ResponseModel[JobInfoModel, JobInfoErrorCodes]:
    input_message = f'''
    The URL of the job description is: {job_url}
    '''
    config: Any = {"configurable": {"thread_id": "abc123"}}
    result = await gather_agent.ainvoke(
        {"messages": [SystemMessage(content=GATHER_AGENT_PROMPT), HumanMessage(content=input_message)]},
        config,
    )

    return ResponseModel[JobInfoModel, JobInfoErrorCodes].model_validate_json(result['messages'][-1].content)


def run_planner_agent(info: JobInfoModel) -> ResponseModel[PlanModel, PlanErrorCodes]:
    input_message = f'''
    {info.model_dump_json()}
    '''
    config: Any = {"configurable": {"thread_id": "abc125"}}

    result = planner_agent.invoke(
        {"messages": [SystemMessage(content=PLANNER_AGENT_PROMPT), HumanMessage(content=input_message)]},
        config,
    )

    return ResponseModel[PlanModel, PlanErrorCodes].model_validate_json(result['messages'][-1].content)


async def run_agents(job_url: str) -> Tuple[JobInfoModel, PlanModel]:
    try:
        job_info_response = await run_gather_agent(job_url)

        if job_info_response.status == ResponseStatusEnum.error:
            raise FetchJobInfoException(
                cast(ErrorModel[JobInfoErrorCodes], job_info_response.error)
            )
        
        job = cast(JobInfoModel, job_info_response.data)
        plan_response = run_planner_agent(job)

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

