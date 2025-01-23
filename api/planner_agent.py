# Import relevant functionality
import asyncio
from typing import Any, List, Tuple, cast
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import BaseTool
from langchain.callbacks.base import BaseCallbackHandler
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from langchain_community.agent_toolkits import PlayWrightBrowserToolkit
from langchain_community.tools.playwright.utils import create_async_playwright_browser
import traceback

from FetchJobInfoException import FetchJobInfoException
from prompts.gather_agent_prompt import GATHER_AGENT_PROMPT
from prompts.planner_agent_prompt import PLANNER_AGENT_PROMPT
from response_model import ErrorModel, ResponseModel, ResponseStatusEnum
from job_info_model import JobInfoModel, JobInfoErrorCodes
from plan_model import PlanModel, PlanErrorCodes
from lakera_chainguard import LakeraChainGuard

chain_guard = LakeraChainGuard()

DEBUG = False
ENABLE_GUARD = True

browser = create_async_playwright_browser()
browser_toolkit = PlayWrightBrowserToolkit.from_browser(async_browser=browser)
browser_tools = [tool for tool in browser_toolkit.get_tools()] # if isinstance(tool, NavigateTool) or isinstance(tool, ExtractTextTool)]

search = TavilySearchResults(max_results=10)
gather_tools: List[BaseTool] = [*browser_tools, search]
planner_tools: List[BaseTool] = [search]


class LakeraGuardHandler(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):

        if ENABLE_GUARD is True:
            for prompt in prompts:
                if isinstance(prompt, HumanMessage) or isinstance(prompt, ToolMessage):
                    chain_guard.detect([prompt])


lakera_guard_handler = LakeraGuardHandler()

# Create the agent
gather_memory = MemorySaver()
gather_model = ChatOpenAI(model="gpt-4o-mini", callbacks=[lakera_guard_handler])
planner_memory = MemorySaver()
planner_model = ChatOpenAI(model="gpt-4o-mini", callbacks=[lakera_guard_handler])


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

