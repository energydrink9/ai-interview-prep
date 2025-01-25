from typing import Any, List
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import BaseTool

from agents.prompts.gather_agent_prompt import GATHER_AGENT_PROMPT
from agents.guard import LakeraGuardHandler
from routers.response_model import ResponseModel
from agents.JobInfoModel import JobInfoModel, JobInfoErrorCodes
from agents.tools import search_tool, browser_tools

lakera_guard_handler = LakeraGuardHandler()

# Create the agent
gather_memory = MemorySaver()
gather_model = ChatOpenAI(model="gpt-4o-mini", callbacks=[lakera_guard_handler])
gather_tools: List[BaseTool] = [*browser_tools, search_tool]


class JobInfoStructuredResponse(ResponseModel[JobInfoModel, JobInfoErrorCodes]):
    pass


def get_gather_agent(debug: bool):
    return create_react_agent(
        gather_model,
        gather_tools,
        checkpointer=gather_memory,
        response_format=JobInfoStructuredResponse,
        debug=debug,
    )


async def run_gather_agent(job_url: str, debug=False) -> ResponseModel[JobInfoModel, JobInfoErrorCodes]:

    agent = get_gather_agent(debug)

    input_message = f'''
    The URL of the job description is: {job_url}
    '''
    config: Any = {"configurable": {"thread_id": "abc123"}}
    result = await agent.ainvoke(
        {"messages": [SystemMessage(content=GATHER_AGENT_PROMPT), HumanMessage(content=input_message)]},
        config,
    )

    return ResponseModel[JobInfoModel, JobInfoErrorCodes].model_validate_json(result['messages'][-1].content)

