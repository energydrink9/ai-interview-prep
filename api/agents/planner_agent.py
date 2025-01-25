from typing import Any, List
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import BaseTool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent

from agents.prompts.planner_agent_prompt import PLANNER_AGENT_PROMPT
from agents.guard import LakeraGuardHandler
from routers.response_model import ResponseModel
from agents.JobInfoModel import JobInfoModel
from model.plan_model import PlanModel, PlanErrorCodes
from agents.tools import search_tool

lakera_guard_handler = LakeraGuardHandler()
planner_tools: List[BaseTool] = [search_tool]

planner_memory = MemorySaver()
planner_model = ChatOpenAI(model="gpt-4o-mini", callbacks=[lakera_guard_handler])


class PlanStructuredResponse(ResponseModel[PlanModel, PlanErrorCodes]):
    pass


planner_agent = create_react_agent(planner_model, planner_tools, checkpointer=planner_memory, response_format=PlanStructuredResponse)


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

